import { specs as dSpecs } from "../data";
import { randomIntInclusive, random } from "../random";

import * as constant from "./constant";

type ReturnType<T> = T | null;

interface Result<T> {
  apply: boolean;
  value: ReturnType<T>;
}

interface IStrategy {
  draw(): unknown;
}

export interface StrategyConstructor {
  new (specs: dSpecs.Specs): IStrategy;
}

function createResult<T>(
  apply: boolean,
  value: ReturnType<T> = null
): Result<T> {
  return {
    apply: apply,
    value: value,
  };
}

export abstract class Strategy<T> {
  readonly specs: dSpecs.Specs;

  constructor(specs: dSpecs.Specs) {
    this.specs = specs;
  }

  protected abstract _draw(): T;

  protected _random(max: number, min = 0): number {
    return randomIntInclusive(max, min);
  }

  private _getDefaultValue(): ReturnType<T> {
    if (typeof this.specs.default === "function") {
      return this.specs.default() as ReturnType<T>;
    }
    return this.specs.default as ReturnType<T>;
  }

  private _shouldBeDefault(): Result<T> {
    if (this.specs.default !== undefined && random() > constant.IS_DEFAULT) {
      return createResult(true, this._getDefaultValue());
    }
    return createResult(false);
  }

  private _shouldBeNull(): Result<T> {
    if (this.specs.nullable && random() > constant.IS_NULLABLE) {
      return createResult(true);
    }
    return createResult(false);
  }

  private _oneOf(choices: Array<ReturnType<T>>): ReturnType<T> {
    const index = this._random(choices.length - 1);
    return Array.from(choices)[index];
  }

  private _defaultOrNull(): Result<T> {
    const defaultResult = this._shouldBeDefault();
    if (defaultResult.apply) {
      return defaultResult;
    }
    return this._shouldBeNull();
  }

  private _choiceOrDraw(): ReturnType<T> {
    if (this.specs.choices && this.specs.choices.length > 0) {
      return this._oneOf(this.specs.choices as ReturnType<T>[]);
    }
    return this._draw();
  }

  draw(): ReturnType<T> {
    const result = this._defaultOrNull();
    if (result.apply) {
      return result.value;
    }
    return this._choiceOrDraw();
  }
}

export class BooleanStrategy extends Strategy<boolean> {
  constructor(specs: dSpecs.BooleanSpecs) {
    super(specs);
  }
  protected _draw(): boolean {
    return random() < constant.BOOL_CHANGE;
  }
}

export class DateStrategy extends Strategy<Date> {
  constructor(specs: dSpecs.DateSpecs) {
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