import { AnySchema } from "yup";

import { DateSpecs } from "../data/specs";
import { Strategy } from "./strategy";

export class DateStrategy extends Strategy<Date> {
  constructor(specs: DateSpecs, schema: AnySchema) {
    super(specs, schema);
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
