import {
  SchemaType,
  Sign,
  TestParameter,
  TestName,
} from "../data/enumerations";
import { LimitOption, Specs } from "../data/specs";
import { Maybe } from "../data/types";
import { Spec } from "./spec";
import * as digits from "./utils/digits";

const limitOptionsMapper = {
  min: [
    digits.createLimitOption(TestParameter.Min),
    digits.createLimitOption(TestParameter.More, +1, TestName.Min),
  ],
  max: [
    digits.createLimitOption(TestParameter.Max),
    digits.createLimitOption(TestParameter.Less, -1, TestName.Max),
  ],
};

const signMapper = [
  digits.createSingMapper("min", Sign.Positive, digits.isPositiveByMin),
  digits.createSingMapper("max", Sign.Negative, digits.isNegativeByMax),
];

export class NumberSpec extends Spec {
  protected _getType(): SchemaType {
    const isInteger = this.testSearch.has(TestName.Integer);
    if (isInteger) {
      return SchemaType.Number;
    }
    return SchemaType.Float;
  }
  protected _getSign(max?: number, min?: number): Sign {
    for (const item of signMapper) {
      const val = digits.signHelper(item.with, max, min);
      const flag = item.fn(val);
      if (flag) {
        return item.sign;
      }
    }
    return Sign.Indifferent;
  }
  private _getLimit(options: LimitOption[], type: SchemaType): Maybe<number> {
    for (const option of options) {
      const val = this.testSearch.getParameter<number>(
        option.param,
        option.test
      );
      if (val !== undefined) {
        const _offset = digits.getCorrectOffset(option.offset, type);
        return val + _offset;
      }
    }
    return undefined;
  }
  get(): Specs {
    const specs = this._get();
    specs.min = this._getLimit(limitOptionsMapper.min, specs.type);
    specs.max = this._getLimit(limitOptionsMapper.max, specs.type);
    specs.sign = this._getSign(specs.max, specs.min);
    return specs;
  }
}
