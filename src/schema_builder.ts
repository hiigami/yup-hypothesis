import * as yup from "yup";

import { Specs } from "./data";
import {
  PresenceType,
  SchemaType,
  Sign,
  TestName,
  TestParameters,
} from "./data/enumerations";
import { TestSearch } from "./test_search";

export class SchemaBuilder {
  private schema: yup.AnySchema;

  constructor(schema: yup.AnySchema) {
    this.schema = schema;
  }

  private _getPresence(): PresenceType {
    const keyName = `${this.schema.spec.presence
      .charAt(0)
      .toUpperCase()}${this.schema.spec.presence.slice(1)}`;
    return PresenceType[keyName as keyof typeof PresenceType];
  }

  private _getInitialType(): SchemaType {
    const keyName = `${this.schema.type
      .charAt(0)
      .toUpperCase()}${this.schema.type.slice(1)}`;
    return SchemaType[keyName as keyof typeof SchemaType];
  }

  private _getType(testSearch: TestSearch): SchemaType {
    let _type = this._getInitialType();
    if (_type === SchemaType.String) {
      if (testSearch.has(TestName.Email)) {
        _type = SchemaType.Email;
      } else if (testSearch.has(TestName.URL)) {
        _type = SchemaType.URL;
      } else if (testSearch.has(TestName.UUID)) {
        _type = SchemaType.UUID;
      }
    } else if (_type === SchemaType.Number) {
      if (!testSearch.has(TestName.Integer)) {
        _type = SchemaType.Float;
      }
    }
    return _type;
  }

  private _getSign(testSearch: TestSearch, max?: number, min?: number) {
    const positive = testSearch.getParameter(TestParameters.More, TestName.Min);
    if (positive || (min && min >= 0)) {
      return Sign.Positive;
    }
    const negative = testSearch.getParameter(TestParameters.Less, TestName.Max);
    if (negative || (max && max <= 0)) {
      return Sign.Negative;
    }
    return Sign.Indifferent;
  }

  // private _getTransform(testSearch: TestSearch) {}

  specs(): Specs {
    const testSearch = new TestSearch(this.schema.tests);
    const max = testSearch.getParameter(TestParameters.Max);
    const min = testSearch.getParameter(TestParameters.Min);
    return {
      type: this._getType(testSearch),
      length: testSearch.getParameter(TestParameters.Length),
      min: min,
      max: max,
      sign: this._getSign(testSearch, max, min),
      choices: this.schema.describe().oneOf,
      nullable: this.schema.spec.nullable,
      presence: this._getPresence(),
      /**@todo add transform */
    };
  }
}
