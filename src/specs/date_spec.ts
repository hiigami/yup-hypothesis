import { SchemaType, TestParameter } from "../data/enumerations";
import { Specs } from "../data/specs";
import { Fields } from "../data/strategies";
import { Maybe } from "../data/types";
import { Spec } from "./spec";

export class DateSpec extends Spec {
  protected _getType(): SchemaType {
    return SchemaType.Date;
  }
  private _limitFromStringOrDefault(val?: string | number): Maybe<number> {
    if (typeof val === "string") {
      return new Date(val).getTime();
    }
    return val;
  }
  private _getLimit(param: TestParameter): Maybe<number> {
    const val = this.testSearch.getParameter<number | Date>(param);
    if (val instanceof Date) {
      return val.getTime();
    }
    return this._limitFromStringOrDefault(val);
  }
  get(_fields?: Fields): Specs {
    const specs = this._get();
    specs.min = this._getLimit(TestParameter.Min);
    specs.max = this._getLimit(TestParameter.Max);
    return specs;
  }
}
