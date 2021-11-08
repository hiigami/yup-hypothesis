import { NUMBER_DEFAULTS } from "../config";
import { Sign } from "../data/enumerations";
import { FloatSpecs, NumberSpecs } from "../data/specs";
import { StrategyArgs } from "../data/strategies";
import { NotStrict } from "../data/types";

import { digits } from "./common";
import { applyStrictness } from "./common/general";
import { Strategy } from "./strategy";

type NumberUnStrict = NotStrict<number>;

abstract class BaseStrategy extends Strategy<NumberUnStrict> {
  protected _applyStrictness(val: number): NumberUnStrict {
    return applyStrictness(val, (val) => val.toString(), this.specs.strict);
  }
}

export class NumberStrategy extends BaseStrategy {
  constructor(args: StrategyArgs<NumberSpecs>) {
    super(args);
  }
  protected _draw(): number {
    const sign = digits.getSign(this.specs.sign as Sign);
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

export class FloatStrategy extends BaseStrategy {
  constructor(args: StrategyArgs<FloatSpecs>) {
    super(args);
  }
  protected _draw(): number {
    const sign = digits.getSign(this.specs.sign as Sign);
    const precision = this.specs.precision || NUMBER_DEFAULTS.precision;
    const byNum = Math.pow(10, precision);
    const defaultPositive = 1 / byNum;
    const _min =
      digits.getLimitBasedOnSign(
        this.specs.min || NUMBER_DEFAULTS.min,
        defaultPositive,
        -NUMBER_DEFAULTS.max,
        sign
      ) * byNum;
    const max =
      digits.getLimitBasedOnSign(
        this.specs.max || NUMBER_DEFAULTS.max,
        NUMBER_DEFAULTS.max,
        -defaultPositive,
        sign
      ) * byNum;
    const num = this._random(max, _min);
    return +(num / byNum).toFixed(precision);
  }
}
