import { enumerations, specs as dSpecs } from "../data";
import { Spec } from "./types";

export class BooleanSpec extends Spec {
  protected _getType(): enumerations.SchemaType {
    return enumerations.SchemaType.Boolean;
  }
  get(): dSpecs.Specs {
    return this._get();
  }
}
