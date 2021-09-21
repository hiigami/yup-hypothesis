import { AnySchema } from "yup";

import { ArraySpecs } from "../data/specs";

import { Strategy } from "./base_strategies";
import { arrays, characters } from "./common";
import { STRING_DEFAULTS } from "./constant";

export class StringStrategy extends Strategy<string> {
  constructor(specs: ArraySpecs, schema: AnySchema) {
    super(specs, schema);
  }
  protected _draw(): string {
    const size = arrays.getLength(this.specs, STRING_DEFAULTS);
    return characters.genText(size, STRING_DEFAULTS.chars);
  }
}
