import { AnySchema } from "yup";

import { PresenceType, SchemaType } from "../data/enumerations";
import { SpecMutation, Specs } from "../data/specs";
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
    if (!this.schema.spec.nullable) {
      return PresenceType.Required;
    }
    return PresenceType.Defined;
  }
  protected abstract _getType(): SchemaType;
  protected _getChoices(exclude: Set<unknown>): unknown[] {
    const choices = this.schema.describe().oneOf;
    const output = [];
    for (const item of choices) {
      if (!exclude.has(item)) {
        output.push(item);
      }
    }
    return output;
  }
  private _getMutations(): SpecMutation<AnySchema>[] {
    const mutations = [];
    for (const x in this.schema.transforms.slice(1)) {
      mutations.push(this.schema.transforms[+x + 1]);
    }
    return mutations;
  }
  protected _get(): Specs {
    const exclude = new Set(this.schema.describe().notOneOf);
    return {
      choices: this._getChoices(exclude),
      default: this.schema.spec.default,
      exclude: exclude,
      mutations: this._getMutations(),
      nullable: this.schema.spec.nullable,
      presence: this._getPresence(),
      strict: this.schema.spec.strict ?? false,
      type: this._getType(),
    };
  }
  abstract get(): Specs;
}
