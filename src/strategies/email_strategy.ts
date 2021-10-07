import { EMAIL_DEFAULTS } from "../config";
import { ArraySpecs } from "../data/specs";
import { StrategyArgs } from "../data/strategies";

import { arrays, internet } from "./common";
import { Strategy } from "./strategy";

export class EmailStrategy extends Strategy<string> {
  constructor(args: StrategyArgs & { specs: ArraySpecs }) {
    super(args);
  }
  protected _draw(): string {
    const size = arrays.getLength(this.specs, EMAIL_DEFAULTS, true);
    return internet.genEmail(size, EMAIL_DEFAULTS);
  }
}
