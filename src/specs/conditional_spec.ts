import { SchemaType } from "../data/enumerations";
import { BooleanSpec } from "./boolean_spec";

export class ConditionalSpec extends BooleanSpec {
  protected _getType(): SchemaType {
    return SchemaType.Conditional;
  }
}
