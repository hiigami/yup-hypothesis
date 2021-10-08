import { enumerations } from "../data";
import { stringTypeToTestMapper } from "../mapper";
import { ArraySpec } from "./array_spec";

export class StringSpec extends ArraySpec {
  protected _getType(): enumerations.SchemaType {
    for (const [testName, schemaType] of stringTypeToTestMapper) {
      if (this.testSearch.has(testName)) {
        return schemaType;
      }
    }
    return enumerations.SchemaType.String;
  }
}
