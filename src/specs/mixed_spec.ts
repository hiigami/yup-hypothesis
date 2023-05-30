import { SchemaType } from "../data/enumerations";
import { Specs } from "../data/specs";
import { Fields } from "../data/strategies";
import { Spec } from "./spec";

export class MixedSpec extends Spec {
  protected _getType(): SchemaType {
    return SchemaType.Mixed;
  }
  get(_fields?: Fields): Specs {
    return this._get();
  }
}
