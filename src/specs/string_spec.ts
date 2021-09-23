import { enumerations } from "../data";
import { ArraySpec } from "./array_spec";

interface TypeMapper {
  readonly test: enumerations.TestName;
  readonly type: enumerations.SchemaType;
}

const typeMapper: TypeMapper[] = [
  {
    test: enumerations.TestName.Email,
    type: enumerations.SchemaType.Email,
  },
  {
    test: enumerations.TestName.URL,
    type: enumerations.SchemaType.URL,
  },
  {
    test: enumerations.TestName.UUID,
    type: enumerations.SchemaType.UUID,
  },
];

export class StringSpec extends ArraySpec {
  protected _getType(): enumerations.SchemaType {
    for (const item of typeMapper) {
      if (this.testSearch.has(item.test)) {
        return item.type;
      }
    }
    return enumerations.SchemaType.String;
  }
}
