import {
  Specs,
  StringSpecs,
  Constrain,
  NumberSpecs,
  FloatSpecs,
  FloatConstrain,
  BooleanSpecs,
} from "../data";
import { Sign } from "../data/enumerations";
import { randomIntInclusive, random } from "./random";

abstract class Strategy<T> {
  readonly specs: Specs;

  constructor(specs: Specs) {
    this.specs = specs;
  }

  protected abstract _draw(): T;

  protected _random(max: number, min: number = 0) {
    return randomIntInclusive(max, min);
  }

  private _shouldBeDefault(): boolean {
    if (this.specs.default) {
      return random() > 0.75;
    }
    return false;
  }

  private _shouldBeNull(): boolean {
    if (this.specs.nullable) {
      return random() > 0.75;
    }
    return false;
  }

  private _oneOf(choices: Array<T | null>): T | null {
    const index = this._random(choices.length - 1);
    return Array.from(choices)[index];
  }

  draw(): T | null {
    if (this._shouldBeDefault()) {
      return this.specs.default;
    }
    if (this._shouldBeNull()) {
      return null;
    }
    if (this.specs.choices && this.specs.choices.length > 0) {
      return this._oneOf(this.specs.choices);
    }
    return this._draw();
  }
}

export class BooleanStrategy extends Strategy<boolean> {
  constructor(specs: BooleanSpecs) {
    super(specs);
  }
  protected _draw(): boolean {
    return random() < 0.5;
  }
}

export class DateStrategy extends Strategy<Date> {
  constructor(specs: BooleanSpecs) {
    super(specs);
  }
  protected _draw(): Date {
    const min = new Date(this.specs.min || 0).getTime();
    const max = this.specs.max
      ? new Date(this.specs.max).getTime()
      : new Date().getTime();
    const timestamp = this._random(max, min);
    return new Date(timestamp);
  }
}

export class StringStrategy extends Strategy<string> {
  private chars: Constrain;
  private defaults: Constrain;

  constructor(specs: StringSpecs) {
    super(specs);
    this.chars = { min: 32, max: 126 };
    this.defaults = { min: 0, max: 255 };
  }
  private _getLength(): number {
    if (this.specs.length) {
      return this.specs.length;
    }
    return this._random(
      this.specs.max || this.defaults.max,
      this.specs.min || this.defaults.min
    );
  }
  protected _draw(): string {
    const size = this._getLength();
    let s = [];
    for (var i = 0; i < size; i++) {
      const c = this._random(this.chars.max, this.chars.min);
      s.push(String.fromCharCode(c));
    }
    return s.join("");
  }
}

export class EmailStrategy extends Strategy<string> {
  private defaults: Constrain;

  constructor(specs: StringSpecs) {
    super(specs);
    this.defaults = { min: 7, max: 254 };
  }

  private _gen(size: number, toUse: string): string {
    let s = [];
    for (var i = 0; i < size; i++) {
      const c = this._random(toUse.length - 1);
      s.push(toUse[c]);
    }
    return s.join("");
  }

  private _emailGen(size: number): string {
    /**@todo create a better email generation logic*/
    const _size = size - 2;
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const UChars = chars + "_.+-";
    const entityChars = chars + "-.";
    const usernameSize = _size < 86 ? 64 : Math.floor(_size * 0.75);
    const username = this._gen(usernameSize, UChars);
    const entity = this._gen(_size - usernameSize - 3, entityChars);
    const tld = this._gen(3, chars);
    return `${username}@${entity}.${tld}`;
  }

  private _isLengthValid(num: number) {
    if (this.defaults.min <= num && num <= this.defaults.max) {
      return true;
    }
    return false;
  }

  private _getLength(): number {
    if (this.specs.length) {
      if (this._isLengthValid(this.specs.length)) {
        return this.specs.length;
      }
      return this._random(this.defaults.max, this.defaults.min);
    }
    const max =
      this.specs.max && this._isLengthValid(this.specs.max)
        ? this.specs.max
        : this.defaults.max;

    const min =
      this.specs.min && this._isLengthValid(this.specs.min)
        ? this.specs.min
        : this.defaults.min;
    if (min < max) {
      return this._random(max, min);
    }
    return this._random(min, max);
  }

  protected _draw(): string {
    const size = this._getLength();
    return this._emailGen(size);
  }
}

export class NumberStrategy extends Strategy<number> {
  private defaults: Constrain;

  constructor(specs: NumberSpecs) {
    super(specs);
    this.defaults = { min: 0, max: 99999 };
  }
  private _getSign(): number {
    if (this.specs.sign === Sign.Negative) {
      return -1;
    } else if (this.specs.sign === Sign.Positive) {
      return -1;
    }
    return random() < 0.5 ? 1 : -1;
  }
  protected _draw(): number {
    const sign = this._getSign();
    return (
      sign *
      this._random(
        this.specs.max || this.defaults.max,
        this.specs.min || this.defaults.min
      )
    );
  }
}

export class FloatStrategy extends Strategy<number> {
  private defaults: FloatConstrain;

  constructor(specs: FloatSpecs) {
    super(specs);
    this.defaults = { min: 0, max: 99999, precision: 4 };
  }
  private _getSign(): number {
    if (this.specs.sign === Sign.Negative) {
      return -1;
    } else if (this.specs.sign === Sign.Positive) {
      return 1;
    }
    return random() < 0.5 ? 1 : -1;
  }
  _draw(): number {
    const sign = this._getSign();
    const precision = this.specs.precision || this.defaults.precision;
    const byNum = Math.pow(10, precision);
    const max = (this.specs.max || this.defaults.max) * byNum;
    const min = this.specs.min ? this.specs.min * byNum : 0;
    const num = this._random(max, min);
    return sign * +(num / byNum).toFixed(precision);
  }
}
