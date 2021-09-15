import { AnySchema } from "yup";
import { constrains, handlers, specs as dSpecs } from "../data";

import { Strategy } from "./base_strategies";
import { arrays } from "./common";
import { ARRAY_DEFAULTS } from "./constant";

type List = unknown[];

export class ArrayStrategy extends Strategy<List> {
  private element;
  private defaults: constrains.Constrain;
  constructor(
    specs: dSpecs.ArraySpecs,
    schema: AnySchema,
    element: handlers.Field
  ) {
    super(specs, schema);
    this.element = element;
    this.defaults = ARRAY_DEFAULTS;
  }
  protected _draw(): List {
    const items: List = [];
    if (this.element !== undefined) {
      const size = arrays.getLength(this.specs, this.defaults);
      for (let i = 0; i < size; i++) {
        items.push(this.element.draw());
      }
    }
    return items;
  }
}
