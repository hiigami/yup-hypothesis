import * as yup from "yup";

import { enumerations, specs as dSpecs } from "../data";
import { ITestSearch } from "../test_search";

export interface SpecConstructor {
  new (schema: yup.AnySchema, testSearch: ITestSearch): Spec;
}

export abstract class Spec {
  protected schema: yup.AnySchema;
  protected testSearch: ITestSearch;

  constructor(schema: yup.AnySchema, testSearch: ITestSearch) {
    this.schema = schema;
    this.testSearch = testSearch;
  }
  private _getPresence(): enumerations.PresenceType {
    const keyName = `${this.schema.spec.presence
      .charAt(0)
      .toUpperCase()}${this.schema.spec.presence.slice(1)}`;
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
  protected _get(): dSpecs.Specs {
    const exclude = new Set(this.schema.describe().notOneOf);
    return {
      type: this._getType(),
      default: this.schema.spec.default,
      choices: this._getChoices(exclude),
      exclude: exclude,
      nullable: this.schema.spec.nullable,
      presence: this._getPresence(),
    };
  }
  abstract get(): dSpecs.Specs;
}

export class BooleanSpec extends Spec {
  protected _getType(): enumerations.SchemaType {
    return enumerations.SchemaType.Boolean;
  }
  get(): dSpecs.Specs {
    return this._get();
  }
}

export class DateSpec extends Spec {
  protected _getType(): enumerations.SchemaType {
    return enumerations.SchemaType.Date;
  }
  private _limitFromStringOrDefault(
    val?: string | number | undefined
  ): number | undefined {
    if (typeof val === "string") {
      return new Date(val).getTime();
    }
    return val;
  }
  private _getLimit(param: enumerations.TestParameter): number | undefined {
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
