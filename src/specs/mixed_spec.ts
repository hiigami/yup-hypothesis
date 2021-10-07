import { SchemaType } from "../data/enumerations";
import { Specs } from "../data/specs";
import { Spec } from "./spec";

export class MixedSpec extends Spec {
  protected _getType(): SchemaType {
    return SchemaType.Mixed;
  }
  get(): Specs {
    return this._get();
  }
}
