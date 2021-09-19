import { AnySchema } from "yup";

import { ArraySpecs } from "../data/specs";

import { Strategy } from "./base_strategies";
import { arrays } from "./common";
import { STRING_DEFAULTS } from "./constant";

export class StringStrategy extends Strategy<string> {
  constructor(specs: ArraySpecs, schema: AnySchema) {
    super(specs, schema);
  }
  protected _draw(): string {
    const size = arrays.getLength(this.specs, STRING_DEFAULTS);
    const chars = STRING_DEFAULTS.chars;
    const s = [];
    for (let i = 0; i < size; i++) {
      const c = this._random(chars.max, chars.min);
      s.push(String.fromCharCode(c));
    }
    return s.join("");
  }
}
