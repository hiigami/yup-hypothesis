import { AnySchema } from "yup";

import { LETTERS_CHAR_CODES } from "../config";
import { PresenceType, SchemaType } from "../data/enumerations";
import { ObjectSpecs } from "../data/specs";
import { ConditionalOptions, Fields } from "../data/strategies";
import { UnknownDict } from "../data/types";
import { characters, objects } from "./common";
import { randomBoolean } from "./common/general";
import { MixedStrategy } from "./mixed_strategy";
import { StrategyNestedFields } from "./strategy";

function randomValue() {
  return new MixedStrategy({
    specs: {
      choices: [],
      exclude: new Set(),
      type: SchemaType.Mixed,
      nullable: randomBoolean(),
      presence: PresenceType.Required,
    },
    schema: {} as AnySchema,
  }).draw();
}

export class ObjectStrategy extends StrategyNestedFields<
  UnknownDict,
  ObjectSpecs,
  Fields
> {
  private _drawFields(options?: ConditionalOptions): UnknownDict {
    const result = {} as UnknownDict;
    if (this.fields !== undefined) {
      const { conditionals, references } = objects.drawFields(
        result,
        this.fields,
        options
      );
      objects.drawConditionals(result, conditionals, options);
      objects.drawReferences(result, references, options);
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
