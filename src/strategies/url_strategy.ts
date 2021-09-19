import { AnySchema } from "yup";

import { ArraySpecs } from "../data/specs";
import { random } from "../random";

import { Strategy } from "./base_strategies";
import { arrays, internet } from "./common";
import { URL_DEFAULTS } from "./constant";

function getOptionValue(off: boolean): boolean {
  return off ? false : random() > 0.5;
}

export class URLStrategy extends Strategy<string> {
  constructor(specs: ArraySpecs, schema: AnySchema) {
    super(specs, schema);
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
