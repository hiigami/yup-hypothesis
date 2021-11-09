import { STRING_DEFAULTS } from "../config";
import { ArraySpecs } from "../data/specs";
import { StrategyArgs } from "../data/strategies";
import { NotStrict } from "../data/types";

import { arrays, characters } from "./common";
import { applyStrictness } from "./common/general";
import { Strategy } from "./strategy";

type NotStrictString = NotStrict<number | boolean | Date>;

function asNotStrict(val: string): NotStrictString {
  if (!isNaN(+val)) {
    return +val;
  } else if (["true", "false"].indexOf(val.toLocaleLowerCase()) > -1) {
    return val === "true";
  } else if (!isNaN(Date.parse(val))) {
    return new Date(val);
  }
  return val;
}

export class StringStrategy extends Strategy<NotStrictString> {
  constructor(args: StrategyArgs<ArraySpecs>) {
    super(args);
  }
  protected _applyStrictness(val: string): NotStrictString {
    return applyStrictness(val, asNotStrict, this.specs.strict);
  }
  protected _draw(): string {
    const size = arrays.getLength(this.specs, STRING_DEFAULTS);
    return characters.genText(size, STRING_DEFAULTS.chars);
  }
}
