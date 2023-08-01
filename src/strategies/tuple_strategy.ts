import { ArraySpecs } from "../data/specs";
import { ConditionalOptions, Fields } from "../data/strategies";
import { Nullable, UnknownList } from "../data/types";
import { DrawableGeneric } from "../drawable";
import { getValue } from "./common/field";
import { StrategyNestedFields } from "./strategy";

export class TupleStrategy extends StrategyNestedFields<
  UnknownList,
  ArraySpecs,
  Fields
> {
  protected _draw(options?: ConditionalOptions): UnknownList {
    const items: UnknownList = [];
    if (this.fields !== undefined) {
      const keys = Object.keys(this.fields).sort((a, b) => +a - +b);
      for (const key of keys) {
        items.push(getValue(this.fields[key], options));
      }
    }
    return items;
  }
  protected _drawChoice(options?: ConditionalOptions): Nullable<UnknownList> {
    const choice = super._drawChoice(options);
    if (choice === null) {
      return choice;
    }

    for (let i = choice.length - 1; i > -1; i--) {
      if (typeof choice[i] === "undefined") {
        choice[i] = new DrawableGeneric(typeof choice[i], choice[i], true);
      } else if (this.fields !== undefined) {
        const name = this.fields.constructor.name
          .toLowerCase()
          .replace("strategy", "");
        const drawable = this.drawableMapper.get(name);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        /**@ts-ignore */
        choice[i] = new drawable(choice[i], true);
      }
    }
    return choice;
  }
}
