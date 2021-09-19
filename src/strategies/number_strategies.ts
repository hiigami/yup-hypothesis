import { AnySchema } from "yup";

import { FloatSpecs, NumberSpecs } from "../data/specs";

import { Strategy } from "./base_strategies";
import { digits } from "./common";
import { FLOAT_DEFAULTS, NUMBER_DEFAULTS } from "./constant";

export class NumberStrategy extends Strategy<number> {
  constructor(specs: NumberSpecs, schema: AnySchema) {
    super(specs, schema);
  }
  protected _draw(): number {
    const sign = digits.getSign(this.specs.sign);
    const min = digits.getLimitBasedOnSign(
      this.specs.min || NUMBER_DEFAULTS.min,
      1,
      -NUMBER_DEFAULTS.max,
      sign
    );
    const max = digits.getLimitBasedOnSign(
      this.specs.max || NUMBER_DEFAULTS.max,
      NUMBER_DEFAULTS.max,
      -1,
      sign
    );
    return this._random(max, min);
  }
}

export class FloatStrategy extends Strategy<number> {
  constructor(specs: FloatSpecs, schema: AnySchema) {
    super(specs, schema);
  }
  protected _draw(): number {
    const sign = digits.getSign(this.specs.sign);
    const precision = this.specs.precision || FLOAT_DEFAULTS.precision;
    const byNum = Math.pow(10, precision);
    const defaultPositive = 1 / byNum;
    const _min =
      digits.getLimitBasedOnSign(
        this.specs.min || FLOAT_DEFAULTS.min,
        defaultPositive,
        -FLOAT_DEFAULTS.max,
        sign
      ) * byNum;
    const max =
      digits.getLimitBasedOnSign(
        this.specs.max || FLOAT_DEFAULTS.max,
        FLOAT_DEFAULTS.max,
        -defaultPositive,
        sign
      ) * byNum;
    const num = this._random(max, _min);
    return +(num / byNum).toFixed(precision);
  }
}
