import { AnySchema } from "yup";

import { constrains, specs as dSpecs } from "../data";
import { random } from "../random";

import { Strategy } from "./base_strategies";
import { arrays, internet } from "./common";
import * as constant from "./constant";

function getOptionValue(off: boolean): boolean {
  return off ? false : random() > 0.5;
}

export class URLStrategy extends Strategy<string> {
  private defaults: constrains.URLConstrain;

  constructor(specs: dSpecs.StringSpecs, schema: AnySchema) {
    super(specs, schema);
    this.defaults = constant.URL_DEFAULTS;
  }

  private _gen(size: number): string {
    const isMinSize = size === this.defaults.min;
    return internet.genUrl(size, this.defaults, {
      includeUserInfo: getOptionValue(isMinSize),
      includePath: getOptionValue(isMinSize),
      includeQuery: getOptionValue(isMinSize),
      includeFragment: getOptionValue(isMinSize),
    });
  }

  protected _draw(): string {
    const size = arrays.getLength(this.specs, this.defaults, true);
    return this._gen(size);
  }
}
