import * as yup from "yup";

import { Specs } from "./data";
import { SchemaType } from "./data/enumerations";
import {
  BooleanSpec,
  DateSpec,
  NumberSpec,
  SpecConstructor,
  StringSpec,
} from "./specs";
import { TestSearch } from "./test_search";

const mapper = new Map<SchemaType, SpecConstructor>([
  [SchemaType.String, StringSpec],
  [SchemaType.Number, NumberSpec],
  [SchemaType.Date, DateSpec],
  [SchemaType.Boolean, BooleanSpec],
]);

export class SchemaBuilder {
  private schema: yup.AnySchema;

  constructor(schema: yup.AnySchema) {
    this.schema = schema;
  }

  private _getInitialType(): SchemaType {
    const keyName = `${this.schema.type
      .charAt(0)
      .toUpperCase()}${this.schema.type.slice(1)}`;
    return SchemaType[keyName as keyof typeof SchemaType];
  }

  specs(): Specs | undefined {
    const type = this._getInitialType();
    const spec = mapper.get(type);
    if (spec === undefined) {
      return undefined;
    }
    const testSearch = new TestSearch(this.schema.tests);
    return new spec(this.schema, testSearch).get();
  }
}
