import { AnySchema } from "yup";

import { PresenceType, SchemaType } from "../data/enumerations";
import { Specs } from "../data/specs";
import { ITestSearch } from "../data/test_search";

export interface SpecConstructor {
  new (schema: AnySchema, testSearch: ITestSearch): Spec;
}

export abstract class Spec {
  protected schema: AnySchema;
  protected testSearch: ITestSearch;

  constructor(schema: AnySchema, testSearch: ITestSearch) {
    this.schema = schema;
    this.testSearch = testSearch;
  }
  private _getPresence(): PresenceType {
    if (this.schema.spec.optional) {
      return PresenceType.Optional;
    }
    return !this.schema.spec.nullable
      ? PresenceType.Required
      : PresenceType.Defined;
  }
  protected abstract _getType(): SchemaType;
  protected _get(): Specs {
    return {
      choices: this.schema.describe().oneOf,
      default: this.schema.spec.default,
      exclude: new Set(this.schema.describe().notOneOf),
      mutations: this.schema.transforms,
      nullable: this.schema.spec.nullable,
      presence: this._getPresence(),
      strict: this.schema.spec.strict ?? false,
      type: this._getType(),
    };
  }
  abstract get(): Specs;
}
