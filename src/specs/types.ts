import * as yup from "yup";

import { DefaultSpecs, Specs } from "../data";
import {
  PresenceType,
  SchemaType,
  Sign,
  TestName,
  TestParameter,
} from "../data/enumerations";
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

  private _getPresence(): PresenceType {
    const keyName = `${this.schema.spec.presence
      .charAt(0)
      .toUpperCase()}${this.schema.spec.presence.slice(1)}`;
    return PresenceType[keyName as keyof typeof PresenceType];
  }

  protected abstract _getType(): SchemaType;
  protected _getChoices(): unknown[] {
    return this.schema.describe().oneOf;
  }
  protected _get(): DefaultSpecs {
    return {
      default: this.schema.spec.default,
      choices: this.schema.describe().oneOf,
      nullable: this.schema.spec.nullable,
      presence: this._getPresence(),
    };
  }

  abstract get(): Specs;
}

export class NumberSpec extends Spec {
  protected _getType(): SchemaType {
    const isInteger = this.testSearch.has(TestName.Integer);
    if (isInteger) {
      return SchemaType.Number;
    }
    return SchemaType.Float;
  }
  private _isPositive(min?: number): boolean {
    const minCheck = common.isPositiveByMin(min);
    const more = this.testSearch.getParameter(TestParameter.More, TestName.Min);
    if (more !== undefined || minCheck) {
      return true;
    }
    return false;
  }
  private _isNegative(max?: number): boolean {
    const maxCheck = common.isNegativeByMax(max);
    const less = this.testSearch.getParameter(TestParameter.Less, TestName.Max);
    if (less !== undefined || maxCheck) {
      return true;
    }
    return false;
  }
  private _positiveOrIndifferent(min?: number) {
    if (this._isPositive(min)) {
      return Sign.Positive;
    }
    return Sign.Indifferent;
  }
  protected _getSign(max?: number, min?: number): Sign {
    if (this._isNegative(max)) {
      return Sign.Negative;
    }
    return this._positiveOrIndifferent(min);
  }
  get(): Specs {
    const specs = Object.assign(
      { type: this._getType() },
      this._get()
    ) as Specs;
    specs.min = this.testSearch.getParameter<number>(TestParameter.Min);
    specs.max = this.testSearch.getParameter<number>(TestParameter.Max);
    specs.sign = this._getSign(specs.max, specs.min);
    return specs;
  }
}

export class StringSpec extends Spec {
  private _emailOrString(): SchemaType {
    if (this.testSearch.has(TestName.Email)) {
      return SchemaType.Email;
    }
    return SchemaType.String;
  }
  private _urlOrEmailOrString(): SchemaType {
    if (this.testSearch.has(TestName.URL)) {
      return SchemaType.URL;
    }
    return this._emailOrString();
  }
  protected _getType(): SchemaType {
    if (this.testSearch.has(TestName.UUID)) {
      return SchemaType.UUID;
    }
    return this._urlOrEmailOrString();
  }
  get(): Specs {
    const specs = Object.assign(
      { type: this._getType() },
      this._get()
    ) as Specs;
    specs.min = this.testSearch.getParameter<number>(TestParameter.Min);
    specs.max = this.testSearch.getParameter<number>(TestParameter.Max);
    specs.trim = false; /**@todo */
    return specs;
  }
}

export class BooleanSpec extends Spec {
  protected _getType(): SchemaType {
    return SchemaType.Boolean;
  }
  get(): Specs {
    const specs = Object.assign(
      { type: this._getType() },
      this._get()
    ) as Specs;
    return specs;
  }
}

export class DateSpec extends Spec {
  protected _getType(): SchemaType {
    return SchemaType.Date;
  }
  private _limitFromStringOrDefault(
    val?: string | number | undefined
  ): number | undefined {
    if (typeof val === "string") {
      return new Date(val).getTime();
    }
    return val;
  }
  private _getLimit(param: TestParameter): number | undefined {
    const val = this.testSearch.getParameter<number | Date>(param);
    if (val instanceof Date) {
      return val.getTime();
    }
    return this._limitFromStringOrDefault(val);
  }
  get(): Specs {
    const specs = Object.assign(
      { type: this._getType() },
      this._get()
    ) as Specs;
    specs.min = this._getLimit(TestParameter.Min);
    specs.max = this._getLimit(TestParameter.Max);
    return specs;
  }
}
