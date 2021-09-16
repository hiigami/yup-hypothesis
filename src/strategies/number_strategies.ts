import { AnySchema } from "yup";

import { constrains, specs as dSpecs } from "../data";

import { Strategy } from "./base_strategies";
import { digits } from "./common";
import * as constant from "./constant";

export class NumberStrategy extends Strategy<number> {
  private defaults: constrains.Constrain;

  constructor(specs: dSpecs.NumberSpecs, schema: AnySchema) {
    super(specs, schema);
    this.defaults = constant.NUMBER_DEFAULTS;
  }

  protected _draw(): number {
    const sign = digits.getSign(this.specs.sign);
    const min = digits.getLimitBasedOnSign(
      this.specs.min || this.defaults.min,
      1,
      -this.defaults.max,
      sign
    );
    const max = digits.getLimitBasedOnSign(
      this.specs.max || this.defaults.max,
      this.defaults.max,
      -1,
      sign
    );
    return this._random(max, min);
  }
}

export class FloatStrategy extends Strategy<number> {
  private defaults: constrains.FloatConstrain;

  constructor(specs: dSpecs.FloatSpecs, schema: AnySchema) {
    super(specs, schema);
    this.defaults = constant.FLOAT_DEFAULTS;
  }

  protected _draw(): number {
    const sign = digits.getSign(this.specs.sign);
    const precision = this.specs.precision || this.defaults.precision;
    const byNum = Math.pow(10, precision);
    const defaultPositive = 1 / byNum;
    const _min =
      digits.getLimitBasedOnSign(
        this.specs.min || this.defaults.min,
        defaultPositive,
        -this.defaults.max,
        sign
      ) * byNum;
    const max =
      digits.getLimitBasedOnSign(
        this.specs.max || this.defaults.max,
        this.defaults.max,
        -defaultPositive,
        sign
      ) * byNum;
    const num = this._random(max, _min);
    return +(num / byNum).toFixed(precision);
  }
}
