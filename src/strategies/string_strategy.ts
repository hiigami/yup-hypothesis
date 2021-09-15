import { AnySchema } from "yup";

import { constrains, specs as dSpecs } from "../data";

import { Strategy } from "./base_strategies";
import { arrays } from "./common";
import * as constant from "./constant";

export class StringStrategy extends Strategy<string> {
  private defaults: constrains.StringConstrain;

  constructor(specs: dSpecs.StringSpecs, schema: AnySchema) {
    super(specs, schema);
    this.defaults = constant.STRING_DEFAULTS;
  }
  protected _draw(): string {
    const size = arrays.getLength(this.specs, this.defaults);
    const chars = this.defaults.chars;
    const s = [];
    for (let i = 0; i < size; i++) {
      const c = this._random(chars.max, chars.min);
      s.push(String.fromCharCode(c));
    }
    return s.join("");
  }
}
