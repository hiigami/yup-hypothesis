import { randomChoiceMock, randomMock } from "../../jest.setup";

import * as yup from "yup";

import { createTestItem } from "../utils";

import { enumerations } from "../../src/data";
import { BooleanStrategy } from "../../src/strategies";
import { STRATEGY_DEFAULTS } from "../../src/config";

const booleanTestItem = (args?: {
  strict?: boolean;
  randomMockValue?: number;
  randomMockValueStrictness?: number;
  possibleValues?: unknown[];
  name?: string;
}) =>
  createTestItem({
    name: args?.name ?? "falsy",
    specs: { type: enumerations.SchemaType.Boolean, strict: args?.strict },
    randomMockValue: args?.randomMockValue ?? STRATEGY_DEFAULTS.bool + 0.01,
    randomMockValueStrictness:
      args?.randomMockValueStrictness ?? STRATEGY_DEFAULTS.bool - 0.01,
    possibleValues: args?.possibleValues ?? [false, 0, "false", "0"],
  });
const truthyBooleanTestItem = (args?: {
  strict?: boolean;
  randomMockValueStrictness?: number;
  possibleValues?: unknown[];
}) =>
  booleanTestItem({
    ...args,
    name: "truthy",
    randomMockValue: STRATEGY_DEFAULTS.bool - 0.01,
    randomMockValueStrictness: args?.randomMockValueStrictness,
    possibleValues: args?.possibleValues ?? [true, 1, "true", "1"],
  });
test.each([
  booleanTestItem({ randomMockValueStrictness: STRATEGY_DEFAULTS.bool + 0.01 }),
  booleanTestItem({
    strict: false,
    randomMockValueStrictness: STRATEGY_DEFAULTS.bool + 0.01,
  }),
  booleanTestItem({
    strict: false,
    possibleValues: [false],
  }),
  booleanTestItem({ strict: true, possibleValues: [false] }),
  truthyBooleanTestItem({
    randomMockValueStrictness: STRATEGY_DEFAULTS.bool + 0.01,
  }),
  truthyBooleanTestItem({
    strict: false,
    randomMockValueStrictness: STRATEGY_DEFAULTS.bool + 0.01,
  }),
  truthyBooleanTestItem({
    strict: false,
    possibleValues: [true],
  }),
  truthyBooleanTestItem({ strict: true, possibleValues: [true] }),
])(
  "should be a $name boolean with strict: $specs.strict and random in strictness: $randomMockValueStrictness",
  ({ specs, randomMockValue, possibleValues, randomMockValueStrictness }) => {
    const _possibleValues = possibleValues as unknown[];
    for (const x of _possibleValues) {
      randomMock
        .mockReturnValue(randomMockValueStrictness as number)
        .mockReturnValueOnce(randomMockValue as number);
      randomChoiceMock.mockReturnValue(x);
      const val = new BooleanStrategy({
        specs,
        schema: yup.boolean().required(),
      }).draw();
      expect(val).toEqual(x);
      randomMock.mockClear();
      randomChoiceMock.mockClear();
    }
  }
);
