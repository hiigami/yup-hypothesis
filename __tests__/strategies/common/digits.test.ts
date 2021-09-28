import { randomMock } from "../../../jest.setup";

import { createTestItem } from "../../utils";
import { enumerations } from "../../../src/data";
import { digits } from "../../../src/strategies/common";
import { STRATEGY_DEFAULTS } from "../../../src/strategies/constant";

test.each([
  createTestItem({
    name: "Indifferent",
    sign: enumerations.Sign.Indifferent,
    randVal: STRATEGY_DEFAULTS.sign - 0.1,
    expected: 1,
  }),
  createTestItem({
    name: "Indifferent",
    sign: enumerations.Sign.Indifferent,
    randVal: STRATEGY_DEFAULTS.sign + 0.1,
    expected: -1,
  }),
  createTestItem({
    name: "Positive",
    sign: enumerations.Sign.Positive,
    randVal: 0,
    expected: 1,
  }),
  createTestItem({
    name: "Negative",
    sign: enumerations.Sign.Negative,
    randVal: 0,
    expected: -1,
  }),
])("should return $expected with $name sign", ({ sign, randVal, expected }) => {
  randomMock.mockReturnValue(randVal as number);
  const val = digits.getSign(sign as enumerations.Sign);
  expect(val).toEqual(expected);
});

test.each([
  createTestItem({
    name: "Positive",
    value: 0,
    defaultPositive: 1,
    defaultNegative: -1,
    sign: enumerations.Sign.Positive,
    expected: 1,
  }),
  createTestItem({
    name: "Positive",
    value: -1,
    defaultPositive: 1,
    defaultNegative: -1,
    sign: enumerations.Sign.Positive,
    expected: 1,
  }),
  createTestItem({
    name: "Positive",
    value: 5,
    defaultPositive: 1,
    defaultNegative: -1,
    sign: enumerations.Sign.Positive,
    expected: 5,
  }),
  createTestItem({
    name: "Negative",
    value: 0,
    defaultPositive: 1,
    defaultNegative: -1,
    sign: enumerations.Sign.Negative,
    expected: -1,
  }),
  createTestItem({
    name: "Negative",
    value: 3,
    defaultPositive: 1,
    defaultNegative: -1,
    sign: enumerations.Sign.Negative,
    expected: -1,
  }),
  createTestItem({
    name: "Negative",
    value: -4,
    defaultPositive: 1,
    defaultNegative: -1,
    sign: enumerations.Sign.Negative,
    expected: -4,
  }),
  createTestItem({
    name: "Indifferent",
    value: 0,
    defaultPositive: 1,
    defaultNegative: -1,
    sign: enumerations.Sign.Indifferent,
    expected: 0,
  }),
  createTestItem({
    name: "Indifferent",
    value: -13,
    defaultPositive: 1,
    defaultNegative: -1,
    sign: enumerations.Sign.Indifferent,
    expected: -13,
  }),
  createTestItem({
    name: "Indifferent",
    value: 45,
    defaultPositive: 1,
    defaultNegative: -1,
    sign: enumerations.Sign.Indifferent,
    expected: 45,
  }),
])(
  "should return $expected limit based with (value: $value, sign: $name)",
  ({ value, defaultPositive, defaultNegative, sign, expected }) => {
    const val = digits.getLimitBasedOnSign(
      value as number,
      defaultPositive as number,
      defaultNegative as number,
      sign as enumerations.Sign
    );
    expect(val).toEqual(expected);
  }
);
