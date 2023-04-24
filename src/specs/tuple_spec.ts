import { SchemaType } from "../data/enumerations";
import { Specs } from "../data/specs";
import { Spec } from "./spec";

export class TupleSpec extends Spec {
  protected _getType(): SchemaType {
    return SchemaType.Tuple;
  }
  get(): Specs {
    const specs = this._get();
    return specs;
  }
}
