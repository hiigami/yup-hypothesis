import { DateSpecs } from "../data/specs";
import { StrategyArgs } from "../data/strategies";
import { NotStrict } from "../data/types";

import { randomBoolean } from "./common/general";
import { Strategy } from "./strategy";

type DateUnStrict = NotStrict<Date>;

export class DateStrategy extends Strategy<DateUnStrict> {
  constructor(args: StrategyArgs<DateSpecs>) {
    super(args);
  }
  protected _applyStrictness(val: Date): DateUnStrict {
    if (this.specs.strict || randomBoolean()) {
      return val;
    }
    return val.toISOString();
  }
  protected _draw(): DateUnStrict {
    const min = new Date(this.specs.min || 0).getTime();
    const max = this.specs.max
      ? new Date(this.specs.max).getTime()
      : new Date().getTime();
    const timestamp = this._random(max, min);
    return new Date(timestamp);
  }
}
