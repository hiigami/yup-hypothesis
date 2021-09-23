import { ObjectSchemaSpec } from "yup/lib/object";

import { SchemaType } from "../data/enumerations";
import { Specs } from "../data/specs";
import { Spec } from "./spec";

export class ObjectSpec extends Spec {
  protected _getType(): SchemaType {
    return SchemaType.Object;
  }
  get(): Specs {
    const specs = this._get();
    specs.noUnknown = (this.schema.spec as ObjectSchemaSpec).noUnknown;
    return specs;
  }
}
