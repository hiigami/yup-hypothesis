import { DateSpecs } from "../data/specs";
import { StrategyArgs } from "../data/strategies";
import { NotStrict } from "../data/types";

import { applyStrictness } from "./common/general";
import { Strategy } from "./strategy";

type NotStrictDate = NotStrict<Date>;

export class DateStrategy extends Strategy<NotStrictDate> {
  constructor(args: StrategyArgs<DateSpecs>) {
    super(args);
  }
  protected _applyStrictness(val: Date): NotStrictDate {
    return applyStrictness(
      val,
      (x: Date) => x.toISOString(),
      this.specs.strict
    );
  }
  protected _draw(): NotStrictDate {
    const min = new Date(this.specs.min || 0).getTime();
    const max = this.specs.max
      ? new Date(this.specs.max).getTime()
      : new Date().getTime();
    const timestamp = this._random(max, min);
    return new Date(timestamp);
  }
}
