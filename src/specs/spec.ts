import { AnySchema } from "yup";

import { PresenceType, SchemaType, TestName } from "../data/enumerations";
import { Specs, SpecMutation } from "../data/specs";
import { ITestSearch } from "../data/test_search";
import { title } from "../common";

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
    const keyName = title(this.schema.spec.presence);
    if (this.testSearch.has(TestName.Defined)) {
      return PresenceType.Defined;
    }
    return PresenceType[keyName as keyof typeof PresenceType];
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
    for (const x in this.schema.transforms) {
      if (this.schema.transforms[x].name !== "coerce") {
        mutations.push(this.schema.transforms[x]);
      }
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
      type: this._getType(),
    };
  }
  abstract get(): Specs;
}
