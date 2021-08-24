import { constrains, enumerations, specs as dSpecs } from "../data";

import { random } from "../random";

import { Strategy } from "./base_strategies";
import * as constant from "./constant";
import * as common from "./common";

export class UUIDStrategy extends Strategy<string> {
  protected _draw(): string {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (x) => {
      const n = parseInt(x, 10);
      return (n ^ (this._random(255, 0) & (15 >> (n / 4)))).toString(16);
    });
  }
}

export class StringStrategy extends Strategy<string> {
  private defaults: constrains.StringConstrain;

  constructor(specs: dSpecs.StringSpecs) {
    super(specs);
    this.defaults = constant.STRING_DEFAULTS;
  }
  protected _draw(): string {
    const size = common.getLengthForStrings(this.specs, this.defaults);
    const chars = this.defaults.chars;
    const s = [];
    for (let i = 0; i < size; i++) {
      const c = this._random(chars.max, chars.min);
      s.push(String.fromCharCode(c));
    }
    const text = s.join("");
    return this.specs.trim ? text.trim() : text;
  }
}

export class EmailStrategy extends Strategy<string> {
  private defaults: constrains.EmailConstrain;

  constructor(specs: dSpecs.StringSpecs) {
    super(specs);
    this.defaults = constant.EMAIL_DEFAULTS;
  }

  private _getSectionLength(
    size: number,
    offset: number,
    constrain: constrains.Constrain
  ): number {
    const proposedLimit = size - offset;
    const max = common.getValidValueOrBest(constrain, proposedLimit);
    return this._random(max, constrain.min);
  }

  private _getTLDLength(size: number): number {
    if (size < 3) {
      return 2;
    }
    return this._random(size, 2);
  }

  private _genText(size: number, chars: string): string {
    let txt = common.textGenerator(size, chars);
    txt = txt.replace(/[-+.]{2}/g, "");
    if ([".", "-", "+"].lastIndexOf(txt[0]) > -1) {
      txt = txt.slice(1);
    }
    if ([".", "-", "+"].lastIndexOf(txt[txt.length - 1]) > -1) {
      txt = txt.slice(0, txt.length - 1);
    }
    if (txt.length === 0) {
      return this._genText(size, constant.LETTERS);
    }
    return txt;
  }

  private _gen(size: number): string {
    /**@todo create a better email generation logic*/
    const UChars = constant.LETTERS + ".+-";
    const entityChars = constant.LETTERS + "-.";

    // offset = dot (x1)  @ (x1)
    let _size = size - 2;
    // offset = entity (x1) TLD (x3)
    const uSize = this._getSectionLength(_size, 4, this.defaults.username);
    const username = this._genText(uSize, UChars);
    _size = _size - username.length;
    // offset = TLD (x3)
    const eSize = this._getSectionLength(_size, 3, this.defaults.entity);
    const entity = this._genText(eSize, entityChars);
    _size = _size - entity.length;
    const tld = this._genText(this._getTLDLength(_size), constant.LETTERS);
    return `${username}@${entity}.${tld}`;
  }

  protected _draw(): string {
    const size = common.getLengthForStrings(this.specs, this.defaults, true);
    return this._gen(size);
  }
}

export class URLStrategy extends Strategy<string> {
  private defaults: constrains.Constrain;

  constructor(specs: dSpecs.StringSpecs) {
    super(specs);
    this.defaults = constant.URL_DEFAULTS;
  }

  private _withAuthority(): boolean {
    if (random() > 0.85) {
      return true;
    }
    return false;
  }

  private _validateHost(host: string): string {
    if ([".", "-", "+"].lastIndexOf(host[0]) > -1) {
      host = host.slice(1);
    }
    if ([".", "-", "+"].lastIndexOf(host[host.length - 1]) > -1) {
      host = host.slice(0, host.length - 1);
    }
    if (host.indexOf(".") === -1) {
      return host.length < 3
        ? `${host}.${host}`
        : `${host.slice(0, 1)}.${host.slice(1, host.length - 1)}`;
    }
    return host;
  }

  private _getValueFromEmail(size: number): string {
    const emailStrategy = new EmailStrategy({
      type: enumerations.SchemaType.Email,
      presence: enumerations.PresenceType.Required,
      nullable: false,
      max: size,
    });
    let email = emailStrategy.draw() as string;
    if (!this._withAuthority()) {
      email = email.replace(/^.*?@/, "");
    }
    return this._validateHost(email.slice(email.length - size));
  }

  private _genHost(size: number): string {
    return this._getValueFromEmail(size);
  }

  private _getSchema(): string {
    const index = this._random(constant.URL_SCHEMAS.length - 1);
    return constant.URL_SCHEMAS[index];
  }

  private _genPath(size: number): string {
    if (size <= 0) {
      return "";
    }
    return common.textGenerator(size, constant.LETTERS);
  }

  private _gen(size: number): string {
    /**@todo complete and create a better url generation logic*/
    const schema = this._getSchema();
    let _size = size - (schema.length + 3);
    const host = this._genHost(_size);
    _size = _size - host.length;
    const pathSymbol = host.length > 2 && _size > 1 ? "/" : "";
    const path = this._genPath(_size - pathSymbol.length);
    return `${schema}://${host}${pathSymbol}${path}`;
  }

  protected _draw(): string {
    const size = common.getLengthForStrings(this.specs, this.defaults, true);
    return this._gen(size);
  }
}
