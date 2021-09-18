import { AnySchema } from "yup";

import { EmailConstrain } from "../data/constrains";
import { StringSpecs } from "../data/specs";

import { Strategy } from "./base_strategies";
import { arrays, internet } from "./common";
import * as constant from "./constant";

export class EmailStrategy extends Strategy<string> {
  private defaults: EmailConstrain;

  constructor(specs: StringSpecs, schema: AnySchema) {
    super(specs, schema);
    this.defaults = constant.EMAIL_DEFAULTS;
  }

  protected _draw(): string {
    const size = arrays.getLength(this.specs, this.defaults, true);
    return internet.genEmail(size, this.defaults);
  }
}
