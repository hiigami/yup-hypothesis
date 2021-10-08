import { SchemaType, Sign, TestName } from "../data/enumerations";
import { LimitOption, Specs } from "../data/specs";
import { Maybe } from "../data/types";
import { limitOptionsMapper, signMapper } from "../mapper";
import { Spec } from "./spec";
import * as digits from "./common/digits";

export class NumberSpec extends Spec {
  protected _getType(): SchemaType {
    const isInteger = this.testSearch.has(TestName.Integer);
    if (isInteger) {
      return SchemaType.Number;
    }
    return SchemaType.Float;
  }
  protected _getSign(max?: number, min?: number): Sign {
    for (const [key, item] of signMapper) {
      const val = digits.signHelper(key, max, min);
      const flag = item.fn(val);
      if (flag) {
        return item.sign;
      }
    }
    return Sign.Indifferent;
  }
  private _getLimit(
    options: Readonly<LimitOption[]>,
    type: SchemaType
  ): Maybe<number> {
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    specs.min = this._getLimit(limitOptionsMapper.get("min")!, specs.type);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    specs.max = this._getLimit(limitOptionsMapper.get("max")!, specs.type);
    specs.sign = this._getSign(specs.max, specs.min);
    return specs;
  }
}
