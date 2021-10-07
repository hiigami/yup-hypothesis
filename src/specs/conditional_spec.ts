import { SchemaType } from "../data/enumerations";
import { MixedSpec } from "./mixed_spec";

export class ConditionalSpec extends MixedSpec {
  protected _getType(): SchemaType {
    return SchemaType.Conditional;
  }
}
