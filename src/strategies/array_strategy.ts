import { AnySchema } from "yup";

import { ArraySpecs } from "../data/specs";
import { ConditionalOptions, Field } from "../data/strategies";

import { arrays } from "./common";
import { ARRAY_DEFAULTS } from "./constant";
import { Strategy } from "./strategy";

type List = unknown[];

export class ArrayStrategy extends Strategy<List> {
  private element;
  constructor(specs: ArraySpecs, schema: AnySchema, element: Field) {
    super(specs, schema);
    this.element = element;
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
