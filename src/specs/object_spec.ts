import { ObjectSchema } from "yup";

import { SchemaType } from "../data/enumerations";
import { Specs } from "../data/specs";
import { Spec } from "./spec";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ObjectSchemaSpec = ObjectSchema<any, any, any, any>["spec"];

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
