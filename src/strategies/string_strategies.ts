import {
  StringSpecs,
  Constrain,
  EmailConstrain,
  StringConstrain,
} from "../data";
import { PresenceType, SchemaType } from "../data/enumerations";
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
  private defaults: StringConstrain;

  constructor(specs: StringSpecs) {
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
  private defaults: EmailConstrain;

  constructor(specs: StringSpecs) {
    super(specs);
    this.defaults = constant.EMAIL_DEFAULTS;
  }

  private _getSectionLength(
    size: number,
    offset: number,
    constrain: Constrain
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

  private _gen(size: number): string {
    /**@todo create a better email generation logic*/
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const UChars = chars + "_.+-";
    const entityChars = chars + "-.";

    // offset = dot (x1)  @ (x1)
    let _size = size - 2;
    // offset = entity (x1) TLD (x2)
    const uSize = this._getSectionLength(_size, 3, this.defaults.username);
    const username = common.textGenerator(uSize, UChars);
    _size = _size - uSize;
    // offset = TLD (x2)
    const eSize = this._getSectionLength(_size, 2, this.defaults.entity);
    const entity = common.textGenerator(eSize, entityChars);
    _size = _size - eSize;
    const tld = common.textGenerator(this._getTLDLength(_size), chars);
    return `${username}@${entity}.${tld}`;
  }

  protected _draw(): string {
    const size = common.getLengthForStrings(this.specs, this.defaults, true);
    return this._gen(size);
  }
}

export class URLStrategy extends Strategy<string> {
  private defaults: Constrain;

  constructor(specs: StringSpecs) {
    super(specs);
    this.defaults = constant.URL_DEFAULTS;
  }

  private _withAuthority(): boolean {
    if (random() > 0.85) {
      return true;
    }
    return false;
  }

  private _getValueFromEmail(size: number): string {
    const emailStrategy = new EmailStrategy({
      type: SchemaType.Email,
      presence: PresenceType.Required,
      nullable: false,
      max: size,
    });
    const email = emailStrategy.draw() as string;
    if (!this._withAuthority()) {
      return email.replace(/^.*?@/, "");
    }
    return email;
  }

  private _genHost(size: number): string {
    if (random() > 0.8) {
      return "";
    }
    return this._getValueFromEmail(size);
  }

  private _getSchema(): string {
    const schemas = ["http", "https", "ftp", "mailto", "file", "data", "irc"];
    const index = this._random(schemas.length - 1);
    return schemas[index];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _genPath(size: number): string {
    return "";
  }

  private _gen(size: number): string {
    /**@todo complete and create a better url generation logic*/
    const schema = this._getSchema();
    let _size = size - schema.length - 1 - 3;
    const host = this._genHost(_size);
    _size = _size - host.length - 1;
    const path = this._genPath(_size);
    return `${schema}://${host}${path}`;
  }

  protected _draw(): string {
    const size = common.getLengthForStrings(this.specs, this.defaults, true);
    return this._gen(size);
  }
}
