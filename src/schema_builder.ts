import { AnySchema } from "yup";

import { schemas } from "./data";
import { SchemaType } from "./data/enumerations";
import { Specs } from "./data/specs";
import { Maybe } from "./data/types";
import { title } from "./common";
import * as specs from "./specs";
import { TestSearch } from "./test_search";

const mapper = new Map<SchemaType, specs.SpecConstructor>([
  [SchemaType.Array, specs.ArraySpec],
  [SchemaType.Boolean, specs.BooleanSpec],
  [SchemaType.Conditional, specs.ConditionalSpec],
  [SchemaType.Date, specs.DateSpec],
  [SchemaType.Number, specs.NumberSpec],
  [SchemaType.Object, specs.ObjectSpec],
  [SchemaType.String, specs.StringSpec],
]);

export class SchemaBuilder implements schemas.ISchemaBuilder {
  private schema: AnySchema;

  constructor(schema: AnySchema) {
    this.schema = schema;
  }

  private _isConditional() {
    const conditions = this.schema["conditions"];
    return conditions !== undefined && conditions.length > 0;
  }

  private _getInitialType(): SchemaType {
    if (this._isConditional()) {
      return SchemaType.Conditional;
    }
    const keyName = title(this.schema.type);
    return SchemaType[keyName as keyof typeof SchemaType];
  }

  specs(): Maybe<Specs> {
    const type = this._getInitialType();
    const spec = mapper.get(type);
    if (spec === undefined) {
      return undefined;
    }
    const testSearch = new TestSearch(this.schema.tests);
    return new spec(this.schema, testSearch).get();
  }
}
