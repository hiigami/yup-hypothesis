import { ARRAY_DEFAULTS } from "../config";
import { ArraySpecs } from "../data/specs";
import { ConditionalOptions, Field } from "../data/strategies";
import { UnknownList } from "../data/types";
import { arrays } from "./common";
import { getValue } from "./common/field";
import { StrategyWithFields } from "./strategy";

export class ArrayStrategy extends StrategyWithFields<
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
}
