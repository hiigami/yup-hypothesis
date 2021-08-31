import * as yup from "yup";

import { enumerations, specs as dSpecs } from "./data";
import * as specs from "./specs";
import { TestSearch } from "./test_search";

const mapper = new Map<enumerations.SchemaType, specs.SpecConstructor>([
  [enumerations.SchemaType.Boolean, specs.BooleanSpec],
  [enumerations.SchemaType.Date, specs.DateSpec],
  [enumerations.SchemaType.Number, specs.NumberSpec],
  [enumerations.SchemaType.Object, specs.ObjectSpec],
  [enumerations.SchemaType.String, specs.StringSpec],
]);

export class SchemaBuilder {
  private schema: yup.AnySchema;

  constructor(schema: yup.AnySchema) {
    this.schema = schema;
  }

  private _getInitialType(): enumerations.SchemaType {
    const keyName = `${this.schema.type
      .charAt(0)
      .toUpperCase()}${this.schema.type.slice(1)}`;
    return enumerations.SchemaType[
      keyName as keyof typeof enumerations.SchemaType
    ];
  }

  specs(): dSpecs.Specs | undefined {
    const type = this._getInitialType();
    const spec = mapper.get(type);
    if (spec === undefined) {
      return undefined;
    }
    const testSearch = new TestSearch(this.schema.tests);
    return new spec(this.schema, testSearch).get();
  }
}
