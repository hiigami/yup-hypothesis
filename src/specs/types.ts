import { AnySchema } from "yup";

import { enumerations, specs as dSpecs, types } from "../data";
import { title } from "../common";
import { ITestSearch } from "../test_search";

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
  private _getPresence(): enumerations.PresenceType {
    const keyName = title(this.schema.spec.presence);
    if (this.testSearch.has(enumerations.TestName.Defined)) {
      return enumerations.PresenceType.Defined;
    }
    return enumerations.PresenceType[
      keyName as keyof typeof enumerations.PresenceType
    ];
  }
  protected abstract _getType(): enumerations.SchemaType;
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
  private _getMutations(): dSpecs.SpecMutation<AnySchema>[] {
    const mutations = [];
    for (const x in this.schema.transforms) {
      if (this.schema.transforms[x].name !== "coerce") {
        mutations.push(this.schema.transforms[x]);
      }
    }
    return mutations;
  }
  protected _get(): dSpecs.Specs {
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
  abstract get(): dSpecs.Specs;
}

export class DateSpec extends Spec {
  protected _getType(): enumerations.SchemaType {
    return enumerations.SchemaType.Date;
  }
  private _limitFromStringOrDefault(
    val?: types.Maybe<string | number>
  ): types.Maybe<number> {
    if (typeof val === "string") {
      return new Date(val).getTime();
    }
    return val;
  }
  private _getLimit(param: enumerations.TestParameter): types.Maybe<number> {
    const val = this.testSearch.getParameter<number | Date>(param);
    if (val instanceof Date) {
      return val.getTime();
    }
    return this._limitFromStringOrDefault(val);
  }
  get(): dSpecs.Specs {
    const specs = this._get();
    specs.min = this._getLimit(enumerations.TestParameter.Min);
    specs.max = this._getLimit(enumerations.TestParameter.Max);
    return specs;
  }
}
