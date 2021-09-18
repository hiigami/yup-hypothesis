import { AnySchema } from "yup";

import { ObjectSpecs } from "../data/specs";
import { Fields } from "../data/strategies";

import { Strategy } from "./base_strategies";

type Dict = Record<string, unknown>;

export class ObjectStrategy extends Strategy<Dict> {
  private fields;
  constructor(specs: ObjectSpecs, schema: AnySchema, fields?: Fields) {
    super(specs, schema);
    this.fields = fields;
  }
  isDefined(): boolean {
    if (this.specs.choices !== undefined) {
      return true;
    }
    return super.isDefined();
  }
  private _drawFields(): Dict {
    const result = {} as Dict;
    for (const x in this.fields) {
      const field = this.fields[x];
      if (field?.isDefined()) {
        result[x] = field?.draw();
      }
    }
    return result;
  }
  protected _draw(): Dict {
    const result = this._drawFields();
    if (this.specs.noUnknown === false) {
      /**@todo add random keys */
    }
    return result;
  }
}
