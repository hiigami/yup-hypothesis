import { randomIntInclusiveMock, randomMock } from "../../jest.setup";

import * as yup from "yup";

import { createSpecs, createTestItem } from "../utils";

import { STRATEGY_DEFAULTS } from "../../src/config";
import { StringStrategy } from "../../src/strategies";

const schema = yup.string().required();

const stringTestItem = (args?: {
  strict?: boolean;
  randomMockValue?: number;
  randomIntMockValue?: number | number[];
  asType?: string;
}) =>
  createTestItem({
    asType: args?.asType ?? "string",
    specs: createSpecs({ strict: args?.strict }),
    randomMockValue: args?.randomMockValue ?? STRATEGY_DEFAULTS.bool - 0.01,
    randomIntMockValue: args?.randomIntMockValue ?? 49,
  });

test.each([
  stringTestItem(),
  stringTestItem({ strict: true }),
  stringTestItem({ strict: false }),
  stringTestItem({
    strict: false,
    asType: "number",
    randomMockValue: STRATEGY_DEFAULTS.bool + 0.01,
  }),
  stringTestItem({
    asType: "boolean",
    randomMockValue: STRATEGY_DEFAULTS.bool + 0.01,
    randomIntMockValue: [4, 116, 114, 117, 101],
  }),
  stringTestItem({
    asType: "date",
    randomMockValue: STRATEGY_DEFAULTS.bool + 0.01,
    randomIntMockValue: [10, 50, 48, 50, 49, 45, 48, 49, 45, 48, 49],
  }),
])(
  "should be a string as $asType with strict: $specs.strict",
  ({ specs, randomMockValue, randomIntMockValue, asType }) => {
    randomMock.mockReturnValue(randomMockValue as number);
    if (Array.isArray(randomIntMockValue)) {
      for (const x of randomIntMockValue as number[]) {
        randomIntInclusiveMock.mockReturnValueOnce(x);
      }
    } else {
      randomIntInclusiveMock.mockReturnValue(randomIntMockValue as number);
    }

    const val = new StringStrategy({ specs, schema }).draw();
    if (asType === "date") {
      expect(val).toBeInstanceOf(Date);
    } else {
      expect(typeof val).toEqual(asType);
    }
  }
);
