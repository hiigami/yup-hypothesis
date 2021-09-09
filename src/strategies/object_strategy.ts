import { AnySchema } from "yup";
import { specs as dSpecs, strategy as dStrategy } from "../data";

import { Strategy } from "./base_strategies";

type Dict = Record<string, unknown>;

export class ObjectStrategy extends Strategy<Dict> {
  private fields;
  constructor(
    specs: dSpecs.BaseSpecs,
    schema: AnySchema,
    fields: dStrategy.Fields
  ) {
    super(specs, schema);
    this.fields = fields;
  }
  protected _draw(): Dict {
    const result = {} as Dict;
    for (const x in this.fields) {
      const field = this.fields[x];
      if (field?.isDefined() || this.specs.choices !== undefined) {
        result[x] = field?.draw();
      }
    }
    return result;
  }
}
