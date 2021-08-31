import { enumerations, specs as dSpecs } from "../data";
import { Spec } from "./types";

export class ObjectSpec extends Spec {
  protected _getType(): enumerations.SchemaType {
    return enumerations.SchemaType.Object;
  }
  get(): dSpecs.Specs {
    return this._get();
  }
}
