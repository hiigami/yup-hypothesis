import { AnySchema } from "yup";

import { constrains, specs as dSpecs } from "../data";

import { Strategy } from "./base_strategies";
import { characters, internet } from "./common";
import * as constant from "./constant";

export class EmailStrategy extends Strategy<string> {
  private defaults: constrains.EmailConstrain;

  constructor(specs: dSpecs.StringSpecs, schema: AnySchema) {
    super(specs, schema);
    this.defaults = constant.EMAIL_DEFAULTS;
  }

  protected _draw(): string {
    const size = characters.getLength(this.specs, this.defaults, true);
    return internet.genEmail(size, this.defaults);
  }
}
