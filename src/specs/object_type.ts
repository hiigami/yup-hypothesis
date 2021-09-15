import { enumerations } from "../data";
import { BooleanSpec } from "./boolean_type";

export class ObjectSpec extends BooleanSpec {
  protected _getType(): enumerations.SchemaType {
    return enumerations.SchemaType.Object;
  }
}
