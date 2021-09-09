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

  private _getRandomSchema(isMinSize: boolean): string {
    if (isMinSize) {
      return "ftp";
    }
    const index = this._random(constant.URL_SCHEMAS.length - 1);
    return constant.URL_SCHEMAS[index];
  }

  private _gen(size: number): string {
    const isMinSize = size === this.defaults.min;
    const schema = this._getRandomSchema(isMinSize);
    const authority = internet.genUrl(
      size - (schema.length + 3),
      this.defaults,
      {
        includeUserInfo: isMinSize ? false : random() > 0.5,
        includePath: isMinSize ? false : random() > 0.5,
        includeQuery: false,
        includeFragment: false,
      }
    );
    return `${schema}://${authority}`;
  }

  protected _draw(): string {
    const size = characters.getLength(this.specs, this.defaults, true);
    return this._gen(size);
  }
}
