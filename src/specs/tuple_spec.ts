import { SchemaType } from "../data/enumerations";
import { Specs } from "../data/specs";
import { Fields } from "../data/strategies";
import { Spec } from "./spec";

export class TupleSpec extends Spec {
  protected _getType(): SchemaType {
    return SchemaType.Tuple;
  }
  get(_fields?: Fields): Specs {
    return this._get();
  }
}
