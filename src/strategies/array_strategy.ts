import { AnySchema } from "yup";

import { ArraySpecs } from "../data/specs";
import { Field } from "../data/strategies";

import { Strategy } from "./base_strategies";
import { arrays } from "./common";
import { ARRAY_DEFAULTS } from "./constant";

type List = unknown[];

export class ArrayStrategy extends Strategy<List> {
  private element;
  constructor(specs: ArraySpecs, schema: AnySchema, element: Field) {
    super(specs, schema);
    this.element = element;
  }
  protected _draw(): List {
    const items: List = [];
    if (this.element !== undefined) {
      const size = arrays.getLength(this.specs, ARRAY_DEFAULTS);
      for (let i = 0; i < size; i++) {
        items.push(this.element.draw());
      }
    }
    return items;
  }
}
