import { AnySchema } from "yup";

import { StringConstrain } from "../data/constrains";
import { StringSpecs } from "../data/specs";

import { Strategy } from "./base_strategies";
import { arrays } from "./common";
import * as constant from "./constant";

export class StringStrategy extends Strategy<string> {
  private defaults: StringConstrain;

  constructor(specs: StringSpecs, schema: AnySchema) {
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
