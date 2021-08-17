import {
  Specs,
  Constrain,
  NumberSpecs,
  FloatSpecs,
  FloatConstrain,
  BooleanSpecs,
  DateSpecs,
} from "../data";
import { randomIntInclusive, random } from "../random";

import * as constant from "./constant";
import * as common from "./common";

interface IStrategy {
  draw(): unknown;
}

export interface StrategyConstructor {
  new (specs: Specs): IStrategy;
}

export abstract class Strategy<T> {
  readonly specs: Specs;

  constructor(specs: Specs) {
    this.specs = specs;
  }

  protected abstract _draw(): T;

  protected _random(max: number, min = 0): number {
    return randomIntInclusive(max, min);
  }

  private _shouldBeDefault(): boolean {
    if (this.specs.default !== undefined) {
      return random() > constant.IS_DEFAULT;
    }
    return false;
  }

  private _shouldBeNull(): boolean {
    if (this.specs.nullable) {
      return random() > constant.IS_NULLABLE;
    }
    return false;
  }

  private _oneOf(choices: Array<T | null>): T | null {
    const index = this._random(choices.length - 1);
    return Array.from(choices)[index];
  }

  draw(): T | null {
    if (this._shouldBeDefault()) {
      return this.specs.default as T | null;
    }
    if (this._shouldBeNull()) {
      return null;
    }
    if (this.specs.choices && this.specs.choices.length > 0) {
      return this._oneOf(this.specs.choices as (T | null)[]);
    }
    return this._draw();
  }
}

export class BooleanStrategy extends Strategy<boolean> {
  constructor(specs: BooleanSpecs) {
    super(specs);
  }
  protected _draw(): boolean {
    return random() < constant.BOOL_CHANGE;
  }
}

export class DateStrategy extends Strategy<Date> {
  constructor(specs: DateSpecs) {
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

export class NumberStrategy extends Strategy<number> {
  private defaults: Constrain;

  constructor(specs: NumberSpecs) {
    super(specs);
    this.defaults = constant.NUMBER_DEFAULTS;
  }

  protected _draw(): number {
    const sign = common.getSign(this.specs.sign);
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
    this.defaults = constant.FLOAT_DEFAULTS;
  }

  protected _draw(): number {
    const sign = common.getSign(this.specs.sign);
    const precision = this.specs.precision || this.defaults.precision;
    const byNum = Math.pow(10, precision);
    const max = (this.specs.max || this.defaults.max) * byNum;
    const min = this.specs.min ? this.specs.min * byNum : 0;
    const num = this._random(max, min);
    return sign * +(num / byNum).toFixed(precision);
  }
}
