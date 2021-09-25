import { AnySchema } from "yup";

import { ArraySpecs } from "../data/specs";

import { arrays, internet } from "./common";
import { EMAIL_DEFAULTS } from "./constant";
import { Strategy } from "./strategy";

export class EmailStrategy extends Strategy<string> {
  constructor(specs: ArraySpecs, schema: AnySchema) {
    super(specs, schema);
  }
  protected _draw(): string {
    const size = arrays.getLength(this.specs, EMAIL_DEFAULTS, true);
    return internet.genEmail(size, EMAIL_DEFAULTS);
  }
}
