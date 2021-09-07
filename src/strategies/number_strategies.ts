import { AnySchema } from "yup";

import { constrains, specs as dSpecs } from "../data";

import { Strategy } from "./base_strategies";
import * as constant from "./constant";
import * as common from "./common";

export class NumberStrategy extends Strategy<number> {
  private defaults: constrains.Constrain;

  constructor(specs: dSpecs.NumberSpecs, schema: AnySchema) {
    super(specs, schema);
    this.defaults = constant.NUMBER_DEFAULTS;
  }

  protected _draw(): number {
    const sign = common.getSign(this.specs.sign);
    const min = common.getMinBasedOnSign(
      this.specs.min || this.defaults.min,
      sign
    );
    return sign * this._random(this.specs.max || this.defaults.max, min);
  }
}

export class FloatStrategy extends Strategy<number> {
  private defaults: constrains.FloatConstrain;

  constructor(specs: dSpecs.FloatSpecs, schema: AnySchema) {
    super(specs, schema);
    this.defaults = constant.FLOAT_DEFAULTS;
  }

  protected _draw(): number {
    const sign = common.getSign(this.specs.sign);
    const precision = this.specs.precision || this.defaults.precision;
    const byNum = Math.pow(10, precision);
    const _min = common.getMinBasedOnSign(
      this.specs.min || this.defaults.min,
      sign
    );
    const min = _min * byNum;
    const max = (this.specs.max || this.defaults.max) * byNum;
    const num = this._random(max, min);
    return sign * +(num / byNum).toFixed(precision);
  }
}
