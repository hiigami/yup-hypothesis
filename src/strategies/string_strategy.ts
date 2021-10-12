import { STRING_DEFAULTS } from "../config";
import { ArraySpecs } from "../data/specs";
import { StrategyArgs } from "../data/strategies";

import { arrays, characters } from "./common";
import { Strategy } from "./strategy";

export class StringStrategy extends Strategy<string> {
  constructor(args: StrategyArgs<ArraySpecs>) {
    super(args);
  }
  protected _draw(): string {
    const size = arrays.getLength(this.specs, STRING_DEFAULTS);
    return characters.genText(size, STRING_DEFAULTS.chars);
  }
}
