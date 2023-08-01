import {
  Dict,
  NotStrict,
  Nullable,
  UnknownDict,
  UnknownList,
} from "./data/types";
import { randomBoolean, randomChoice } from "./random";

function getType(a: unknown) {
  if (a === null) {
    return "null";
  }
  if (a instanceof Date) {
    return "date";
  }
  if (Array.isArray(a)) {
    return "array";
  }
  if (typeof a === "object" && a.constructor === Object) {
    return "object";
  }
  return typeof a;
}

export abstract class Drawable<A, B> {
  readonly type: string;
  readonly value: Nullable<A>;
  protected strict: boolean;
  constructor(type: string, value: Nullable<A>, strict: boolean) {
    this.type = type;
    this.value = value;
    this.strict = strict;
  }
  compare(a: unknown) {
    const t = getType(a);
    if (t === "null" && this.value === null) {
      return true;
    }
    return this.type === t && this.value === a;
  }
  protected abstract _applyStrictness(value: A): B;
  draw() {
    if (
      this.strict ||
      typeof this.value === "undefined" ||
      this.value === null
    ) {
      return this.value;
    }
    return randomBoolean()
      ? this.value
      : this._applyStrictness(this.value as A);
  }
}

export class DrawableGeneric<A> extends Drawable<A, A> {
  protected _applyStrictness(value: A): A {
    return value;
  }
}

type NotStrictBoolean = NotStrict<boolean | number>;
export class DrawableBoolean extends Drawable<boolean, NotStrictBoolean> {
  constructor(value: Nullable<boolean>, strict: boolean) {
    super("boolean", value, strict);
  }
  protected _applyStrictness(value: boolean): NotStrictBoolean {
    if (value) {
      return randomChoice([true, 1, "true", "1"]);
    }
    return randomChoice([false, 0, "false", "0"]);
  }
}

type NotStrictDate = NotStrict<Date>;

export class DrawableDate extends Drawable<Date, NotStrictDate> {
  constructor(value: Nullable<Date>, strict: boolean) {
    super("date", value, strict);
  }
  protected _applyStrictness(value: Date): NotStrictDate {
    return value.toISOString();
  }
}

type NotStrictString = NotStrict<number | boolean | Date>;
export class DrawableString extends Drawable<string, NotStrictString> {
  constructor(value: Nullable<string>, strict: boolean) {
    super("string", value, strict);
  }
  protected _applyStrictness(value: string): NotStrictString {
    if (value !== " " && !isNaN(+value)) {
      return +value;
    } else if (["true", "false"].indexOf(value.toLowerCase()) > -1) {
      return value === "true";
    } else if (!isNaN(Date.parse(value))) {
      return new Date(value);
    }
    return value;
  }
}

type NotStrictNumber = NotStrict<number>;
export class DrawableNumber extends Drawable<number, NotStrictNumber> {
  constructor(value: Nullable<number>, strict: boolean) {
    super("number", value, strict);
  }
  protected _applyStrictness(value: number): NotStrictNumber {
    return value.toString();
  }
}

type WW = Dict<Drawable<any, any>>;
export class DrawableObject extends Drawable<WW, UnknownDict> {
  constructor(value: Nullable<WW>, strict: boolean) {
    super("object", value, strict);
  }
  protected _applyStrictness(value: WW): UnknownDict {
    return value;
  }
  compare(a: unknown) {
    if (this.type === getType(a)) {
      const keys = Object.keys(a as UnknownDict);
      if (keys.length === Object.keys(this.value as UnknownDict).length) {
        for (const key of keys) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          /**@ts-ignore */
          if (!this.value[key].compare((a as UnknownDict)[key])) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  }
  draw() {
    const data: Dict<unknown> = {};
    for (const attr in this.value) {
      try {
        data[attr] = this.value[attr].draw();
      } catch (e) {
        console.error(this.value[attr]);
        console.error(attr);
        throw e;
      }
    }
    return data;
  }
}
type RR = Drawable<any, any>[];
export class DrawableArray extends Drawable<RR, UnknownList> {
  constructor(value: Nullable<RR>, strict: boolean) {
    super("array", value, strict);
  }
  protected _applyStrictness(value: RR): UnknownList {
    return value;
  }
  compare(a: unknown) {
    if (this.type === getType(a)) {
      const size = (a as UnknownList).length;
      if (size === (this.value as UnknownList).length) {
        for (let i = size - 1; i > -1; i--) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          /**@ts-ignore */
          if (!this.value[i].compare((a as UnknownList)[i])) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  }
  draw() {
    const data: UnknownList = [];
    if (!Array.isArray(this.value)) {
      return this.value;
    }
    for (const x of this.value) {
      if (x instanceof Drawable) {
        data.push(x.draw());
      } else {
        data.push(x);
      }
    }
    return data;
  }
}
