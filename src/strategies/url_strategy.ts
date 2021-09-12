import { AnySchema } from "yup";

import { constrains, specs as dSpecs } from "../data";
import { random } from "../random";

import { Strategy } from "./base_strategies";
import { characters, internet } from "./common";
import * as constant from "./constant";

export class URLStrategy extends Strategy<string> {
  private defaults: constrains.URLConstrain;

  constructor(specs: dSpecs.StringSpecs, schema: AnySchema) {
    super(specs, schema);
    this.defaults = constant.URL_DEFAULTS;
  }

  private _gen(size: number): string {
    const isMinSize = size === this.defaults.min;
    return internet.genUrl(size, this.defaults, {
      includeUserInfo: isMinSize ? false : random() > 0.5,
      includePath: isMinSize ? false : random() > 0.5,
      includeQuery: isMinSize ? false : random() > 0.5,
      includeFragment: false,
    });
  }

  protected _draw(): string {
    const size = characters.getLength(this.specs, this.defaults, true);
    return this._gen(size);
  }
}
