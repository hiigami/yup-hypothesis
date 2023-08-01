import { AnySchema } from "yup";

import { LETTERS_CHAR_CODES } from "../config";
import { DrawableMapper } from "../data/drawable";
import { PresenceType, SchemaType } from "../data/enumerations";
import { ObjectSpecs } from "../data/specs";
import { ConditionalOptions, Fields } from "../data/strategies";
import { Nullable, UnknownDict } from "../data/types";
import { DrawableGeneric } from "../drawable";
import { characters, objects } from "./common";
import { randomBoolean } from "./common/general";
import { MixedStrategy } from "./mixed_strategy";
import { StrategyNestedFields } from "./strategy";

function randomValue(mapper: DrawableMapper) {
  return new MixedStrategy(
    {
      specs: {
        choices: [],
        exclude: new Set(),
        type: SchemaType.Mixed,
        nullable: randomBoolean(),
        presence: PresenceType.Required,
      },
      schema: {} as AnySchema,
    },
    mapper
  ).draw();
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
      result[key as string] = randomValue(this.drawableMapper);
    }
  }
  protected _draw(options?: ConditionalOptions): UnknownDict {
    const result = this._drawFields(options);
    if (this.specs.noUnknown === false) {
      this._drawUnknown(result);
    }
    return result;
  }
  protected _drawChoice(options?: ConditionalOptions): Nullable<UnknownDict> {
    const choice = super._drawChoice(options);
    if (choice === null) {
      return choice;
    }
    for (const attr in choice) {
      if (typeof this.fields !== "undefined") {
        if (typeof this.fields[attr] === "undefined") {
          choice[attr] = new DrawableGeneric(
            typeof choice[attr],
            choice[attr],
            true
          );
        }
        const name = this.fields[attr]?.constructor.name
          .toLowerCase()
          .replace("strategy", "");
        if (typeof name !== "undefined") {
          const drawable = this.drawableMapper.get(name);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          /**@ts-ignore */
          choice[attr] = new drawable(choice[attr], true);
        }
      }
    }
    return choice;
  }
}
