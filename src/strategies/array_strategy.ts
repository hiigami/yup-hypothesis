import { ARRAY_DEFAULTS } from "../config";
import { ArraySpecs } from "../data/specs";
import { ConditionalOptions, Field, StrategyArgs } from "../data/strategies";

import { arrays } from "./common";
import { Strategy } from "./strategy";

type List = unknown[];

export class ArrayStrategy extends Strategy<List> {
  private element;
  constructor(args: StrategyArgs & { specs: ArraySpecs; element?: Field }) {
    super(args);
    this.element = args.element;
  }
  protected _draw(options?: ConditionalOptions): List {
    const items: List = [];
    if (this.element !== undefined) {
      const size = arrays.getLength(this.specs, ARRAY_DEFAULTS);
      for (let i = 0; i < size; i++) {
        const item = this.element.draw(options);
        items.push(item);
      }
    }
    return items;
  }
}
