import { AnySchema } from "yup";

import { title } from "./common";
import { schemas } from "./data";
import { SchemaType } from "./data/enumerations";
import { Specs } from "./data/specs";
import { Maybe } from "./data/types";
import { schemaToSpecMapper } from "./mapper";
import { TestSearch } from "./test_search";

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
    const spec = schemaToSpecMapper.get(type);
    if (spec === undefined) {
      return undefined;
    }
    const testSearch = new TestSearch(this.schema.tests);
    return new spec(this.schema, testSearch).get();
  }
}
