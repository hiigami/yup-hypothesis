import { ArraySpecs } from "../data/specs";
import { ConditionalOptions, Fields } from "../data/strategies";
import { UnknownList } from "../data/types";
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
      const keys = Object.keys(this.fields).sort();
      for (const key of keys) {
        items.push(getValue(this.fields[key], options));
      }
    }
    return items;
  }
}
