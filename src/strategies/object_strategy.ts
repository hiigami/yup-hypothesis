import { AnySchema } from "yup";

import { LETTERS_CHAR_CODES } from "../config";
import { ObjectSpecs } from "../data/specs";
import { ConditionalOptions, Fields, StrategyArgs } from "../data/strategies";
import { UnknownDict } from "../data/types";

import { MixedStrategy } from "./mixed_strategy";
import { characters, objects } from "./common";
import { randomBoolean } from "./common/general";
import { Strategy } from "./strategy";
import { PresenceType, SchemaType } from "../data/enumerations";

function randomValue() {
  return new MixedStrategy({
    specs: {
      type: SchemaType.Mixed,
      nullable: randomBoolean(),
      presence: PresenceType.Required,
    },
    schema: {} as AnySchema,
  }).draw();
}

export class ObjectStrategy extends Strategy<UnknownDict> {
  private fields;
  constructor(args: StrategyArgs<ObjectSpecs> & { fields?: Fields }) {
    super(args);
    this.fields = args.fields;
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
    for (let i = 0; i < numOfUnknown; i++) {
      const key = characters.genText(this._random(10, 1), LETTERS_CHAR_CODES);
      result[key as string] = randomValue();
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
