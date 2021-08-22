import * as yup from "yup";

import { enumerations, specs as dSpecs } from "../data";
import { ITestSearch } from "../test_search";
import * as common from "./common";

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
    return enumerations.PresenceType[
      keyName as keyof typeof enumerations.PresenceType
    ];
  }

  protected abstract _getType(): enumerations.SchemaType;
  protected _getChoices(): unknown[] {
    return this.schema.describe().oneOf;
  }
  protected _get(): dSpecs.Specs {
    return {
      type: this._getType(),
      default: this.schema.spec.default,
      choices: this.schema.describe().oneOf,
      nullable: this.schema.spec.nullable,
      presence: this._getPresence(),
    };
  }

  abstract get(): dSpecs.Specs;
}

export class NumberSpec extends Spec {
  protected _getType(): enumerations.SchemaType {
    const isInteger = this.testSearch.has(enumerations.TestName.Integer);
    if (isInteger) {
      return enumerations.SchemaType.Number;
    }
    return enumerations.SchemaType.Float;
  }
  private _isPositive(min?: number): boolean {
    const minCheck = common.isPositiveByMin(min);
    const more = this.testSearch.getParameter(
      enumerations.TestParameter.More,
      enumerations.TestName.Min
    );
    if (more !== undefined || minCheck) {
      return true;
    }
    return false;
  }
  private _isNegative(max?: number): boolean {
    const maxCheck = common.isNegativeByMax(max);
    const less = this.testSearch.getParameter(
      enumerations.TestParameter.Less,
      enumerations.TestName.Max
    );
    if (less !== undefined || maxCheck) {
      return true;
    }
    return false;
  }
  private _positiveOrIndifferent(min?: number) {
    if (this._isPositive(min)) {
      return enumerations.Sign.Positive;
    }
    return enumerations.Sign.Indifferent;
  }
  protected _getSign(max?: number, min?: number): enumerations.Sign {
    if (this._isNegative(max)) {
      return enumerations.Sign.Negative;
    }
    return this._positiveOrIndifferent(min);
  }
  get(): dSpecs.Specs {
    const specs = this._get();
    specs.min = this.testSearch.getParameter<number>(
      enumerations.TestParameter.Min
    );
    specs.max = this.testSearch.getParameter<number>(
      enumerations.TestParameter.Max
    );
    specs.sign = this._getSign(specs.max, specs.min);
    return specs;
  }
}

export class StringSpec extends Spec {
  private _emailOrString(): enumerations.SchemaType {
    if (this.testSearch.has(enumerations.TestName.Email)) {
      return enumerations.SchemaType.Email;
    }
    return enumerations.SchemaType.String;
  }
  private _urlOrEmailOrString(): enumerations.SchemaType {
    if (this.testSearch.has(enumerations.TestName.URL)) {
      return enumerations.SchemaType.URL;
    }
    return this._emailOrString();
  }
  protected _getType(): enumerations.SchemaType {
    if (this.testSearch.has(enumerations.TestName.UUID)) {
      return enumerations.SchemaType.UUID;
    }
    return this._urlOrEmailOrString();
  }

  private _getMutations(): dSpecs.SpecMutation[] {
    /**@todo create better logic */
    const mutations = [];
    const upper = this.testSearch.getMutation(
      enumerations.TestMutation.Upper,
      enumerations.TestName.StringCase
    );
    if (upper !== undefined) {
      mutations.push(upper);
    }
    const lower = this.testSearch.getMutation(
      enumerations.TestMutation.Upper,
      enumerations.TestName.StringCase
    );
    if (lower !== undefined) {
      mutations.push(lower);
    }
    return mutations;
  }
  get(): dSpecs.Specs {
    const specs = this._get();
    specs.min = this.testSearch.getParameter<number>(
      enumerations.TestParameter.Min
    );
    specs.max = this.testSearch.getParameter<number>(
      enumerations.TestParameter.Max
    );
    specs.trim = this.testSearch.has(enumerations.TestName.Trim);
    specs.mutations = this._getMutations();
    return specs;
  }
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
