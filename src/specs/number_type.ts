import { enumerations, specs as dSpecs } from "../data";
import { Spec } from "./types";
import * as common from "./common";

function signHelper(
  use: string,
  max?: number,
  min?: number
): number | undefined {
  if (use === "min") {
    return min;
  }
  return max;
}
interface SignMapper {
  readonly with: string;
  readonly test: enumerations.TestName;
  readonly param: enumerations.TestParameter;
  readonly sign: enumerations.Sign;
  fn: (num?: number) => boolean;
}

const signMapper: SignMapper[] = [
  {
    with: "min",
    test: enumerations.TestName.Min,
    param: enumerations.TestParameter.More,
    sign: enumerations.Sign.Positive,
    fn: common.isPositiveByMin,
  },
  {
    with: "max",
    test: enumerations.TestName.Max,
    param: enumerations.TestParameter.Less,
    sign: enumerations.Sign.Negative,
    fn: common.isNegativeByMax,
  },
];

export class NumberSpec extends Spec {
  protected _getType(): enumerations.SchemaType {
    const isInteger = this.testSearch.has(enumerations.TestName.Integer);
    if (isInteger) {
      return enumerations.SchemaType.Number;
    }
    return enumerations.SchemaType.Float;
  }
  private _checkSign(
    valueFlag: boolean,
    param: enumerations.TestParameter,
    test: enumerations.TestName
  ): boolean {
    const exists = this.testSearch.getParameter(param, test);
    if (exists !== undefined || valueFlag) {
      return true;
    }
    return false;
  }
  protected _getSign(max?: number, min?: number): enumerations.Sign {
    for (const item of signMapper) {
      const val = signHelper(item.with, max, min);
      const flag = item.fn(val);
      if (this._checkSign(flag, item.param, item.test)) {
        return item.sign;
      }
    }
    return enumerations.Sign.Indifferent;
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
