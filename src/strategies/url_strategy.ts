import { URL_DEFAULTS } from "../config";
import { DrawableMapper } from "../data/drawable";
import { ArraySpecs } from "../data/specs";
import { StrategyArgs } from "../data/strategies";
import { random } from "../random";
import { arrays, internet } from "./common";
import { Strategy } from "./strategy";

function getOptionValue(off: boolean): boolean {
  return off ? false : random() > 0.5;
}

export class URLStrategy extends Strategy<string> {
  constructor(args: StrategyArgs<ArraySpecs>, drawableMapper: DrawableMapper) {
    super(args, drawableMapper);
  }
  private _gen(size: number): string {
    const isMinSize = size === URL_DEFAULTS.min;
    return internet.genUrl(size, URL_DEFAULTS, {
      includeUserInfo: size < 12 ? false : getOptionValue(isMinSize),
      includePath: getOptionValue(isMinSize),
      includeQuery: getOptionValue(isMinSize),
      includeFragment: getOptionValue(isMinSize),
    });
  }
  protected _draw(): string {
    const size = arrays.getLength(this.specs, URL_DEFAULTS, true);
    return this._gen(size);
  }
}
