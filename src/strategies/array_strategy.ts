import { ARRAY_DEFAULTS } from "../config";
import { ArraySpecs } from "../data/specs";
import { ConditionalOptions, Field } from "../data/strategies";
import { Nullable, UnknownList } from "../data/types";
import { DrawableGeneric } from "../drawable";
import { arrays } from "./common";
import { getValue } from "./common/field";
import { StrategyNestedFields } from "./strategy";

export class ArrayStrategy extends StrategyNestedFields<
  UnknownList,
  ArraySpecs,
  Field
> {
  protected _draw(options?: ConditionalOptions): UnknownList {
    const items: UnknownList = [];
    if (this.fields !== undefined) {
      const size = arrays.getLength(this.specs, ARRAY_DEFAULTS);
      for (let i = 0; i < size; i++) {
        const item = getValue(this.fields, options);
        items.push(item);
      }
    }
    return items;
  }
  protected _drawChoice(options?: ConditionalOptions): Nullable<UnknownList> {
    const choice = super._drawChoice(options);
    if (choice === null) {
      return choice;
    }
    let drawable;
    if (this.fields !== undefined) {
      const name = this.fields.constructor.name
        .toLowerCase()
        .replace("strategy", "");
      drawable = this.drawableMapper.get(name);
    }
    for (let i = choice.length - 1; i > -1; i--) {
      if (typeof choice[i] === "undefined") {
        choice[i] = new DrawableGeneric(typeof choice[i], choice[i], true);
      } else if (drawable !== undefined) {
        choice[i] = new drawable(choice[i], true);
      }
    }
    return choice;
  }
}
