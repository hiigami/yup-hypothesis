import { AnySchema } from "yup";

import { ObjectSpecs } from "../data/specs";
import { Fields } from "../data/strategies";
import { Dict, GenericFn } from "../data/types";
import { random, randomChoice, randomIntInclusive } from "../random";

import { Strategy } from "./base_strategies";
import { genText } from "./common/characters";
import { LETTERS_CHAR_CODES, STRING_DEFAULTS } from "./constant";

type UnknownDict = Dict<unknown>;

const mapper = new Map<string, GenericFn<unknown>>([
  ["boolean", () => random() > 0.5],
  ["date", () => new Date()],
  ["nullable", () => null],
  ["number", () => randomIntInclusive(255, -255)],
  [
    "string",
    () => {
      const size = randomIntInclusive(255, 0);
      return genText(size, STRING_DEFAULTS.chars);
    },
  ],
]);

export class ObjectStrategy extends Strategy<UnknownDict> {
  private fields;
  constructor(specs: ObjectSpecs, schema: AnySchema, fields?: Fields) {
    super(specs, schema);
    this.fields = fields;
  }
  isDefined(): boolean {
    if (this.specs.choices !== undefined) {
      return true;
    }
    return super.isDefined();
  }
  private _drawFields(): UnknownDict {
    const result = {} as UnknownDict;
    for (const x in this.fields) {
      const field = this.fields[x];
      if (field?.isDefined()) {
        result[x] = field?.draw();
      }
    }
    return result;
  }
  private _drawUnknown(result: UnknownDict): void {
    const numOfUnknown = this._random(5, 1);
    const keys = [...mapper.keys()];
    for (let i = numOfUnknown; i > -1; i--) {
      const key = genText(this._random(10, 1), LETTERS_CHAR_CODES);
      const fnKey = randomChoice(keys);
      result[key] = mapper.get(fnKey)?.();
    }
  }
  protected _draw(): UnknownDict {
    const result = this._drawFields();
    if (this.specs.noUnknown === false) {
      this._drawUnknown(result);
    }
    return result;
  }
}
