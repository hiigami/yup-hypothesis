import { DateSpecs } from "../data/specs";
import { StrategyArgs } from "../data/strategies";
import { Strategy } from "./strategy";

export class DateStrategy extends Strategy<Date> {
  constructor(args: StrategyArgs<DateSpecs>) {
    super(args);
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
