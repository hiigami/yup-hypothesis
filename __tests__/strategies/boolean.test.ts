import { randomChoiceMock, randomMock } from "../../jest.setup";

import * as yup from "yup";

import { createTestItem } from "../utils";

import { enumerations } from "../../src/data";
import { BooleanStrategy } from "../../src/strategies";
import { STRATEGY_DEFAULTS } from "../../src/config";

const booleanTestItem = (args?: {
  strict?: boolean;
  randomMockValue?: number;
  possibleValues?: unknown[];
  name?: string;
}) =>
  createTestItem({
    name: args?.name ?? "falsy",
    specs: { type: enumerations.SchemaType.Boolean, strict: args?.strict },
    randomMockValue: args?.randomMockValue ?? STRATEGY_DEFAULTS.bool + 0.01,
    possibleValues: args?.possibleValues ?? [false, 0, "false", "0"],
  });
const truthyBooleanTestItem = (args?: {
  strict?: boolean;
  possibleValues?: unknown[];
}) =>
  booleanTestItem({
    ...args,
    name: "truthy",
    randomMockValue: STRATEGY_DEFAULTS.bool - 0.01,
    possibleValues: args?.possibleValues ?? [true, 1, "true", "1"],
  });
test.each([
  booleanTestItem(),
  booleanTestItem({ strict: false }),
  booleanTestItem({ strict: true, possibleValues: [false] }),
  truthyBooleanTestItem(),
  truthyBooleanTestItem({ strict: false }),
  truthyBooleanTestItem({ strict: true, possibleValues: [true] }),
])(
  "should be a $name boolean with strict: $specs.strict",
  ({ specs, randomMockValue, possibleValues }) => {
    const _possibleValues = possibleValues as unknown[];
    randomMock.mockReturnValue(randomMockValue as number);
    for (const x of _possibleValues) {
      randomChoiceMock.mockReturnValue(x);
      const val = new BooleanStrategy({
        specs,
        schema: yup.boolean().required(),
      }).draw();
      expect(val).toEqual(x);
    }
  }
);
