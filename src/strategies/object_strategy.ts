import { AnySchema } from "yup";

import { ObjectSpecs } from "../data/specs";
import { ConditionalOptions, Fields } from "../data/strategies";
import { GenericFn, UnknownDict } from "../data/types";
import { random, randomChoice, randomIntInclusive } from "../random";

import { Strategy } from "./strategy";
import { genText } from "./common/characters";
import { objects } from "./common";
import { LETTERS_CHAR_CODES, STRING_DEFAULTS } from "./constant";

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
  private _drawFields(options?: ConditionalOptions): UnknownDict {
    const result = {} as UnknownDict;
    if (this.fields !== undefined) {
      const conditionals = objects.drawFields(result, this.fields, options);
      objects.drawConditionals(result, conditionals, options);
    }
    return result;
  }
  private _drawUnknown(result: UnknownDict): void {
    const numOfUnknown = this._random(5, 1);
    const keys = [...mapper.keys()];
    for (let i = 0; i < numOfUnknown; i++) {
      const key = genText(this._random(10, 1), LETTERS_CHAR_CODES);
      const fnKey = randomChoice(keys);
      result[key] = mapper.get(fnKey)?.();
    }
  }
  protected _draw(options?: ConditionalOptions): UnknownDict {
    const result = this._drawFields(options);
    if (this.specs.noUnknown === false) {
      this._drawUnknown(result);
    }
    return result;
  }
}
