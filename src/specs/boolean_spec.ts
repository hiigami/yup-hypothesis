import { SchemaType } from "../data/enumerations";
import { Specs } from "../data/specs";
import { Spec } from "./spec";

export class BooleanSpec extends Spec {
  protected _getType(): SchemaType {
    return SchemaType.Boolean;
  }
  get(): Specs {
    return this._get();
  }
}
