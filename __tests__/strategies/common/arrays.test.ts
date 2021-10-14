import { randomIntInclusiveMock } from "../../../jest.setup";

import { createSpecs, createTestItem } from "../../utils";
import { constrains } from "../../../src/data";
import { arrays } from "../../../src/strategies/common";

const lengthTestItem = (args: {
  length: number;
  expected: number;
  strict?: boolean;
  min?: number;
  max?: number;
}) =>
  createTestItem({
    constrain: { min: args.min || 3, max: args.max || 9 },
    specs: { length: args.length },
    strict: args.strict ?? true,
    expected: args.expected,
  });

test.each([
  lengthTestItem({ length: 3, expected: 3 }),
  lengthTestItem({ length: 2, expected: 3 }),
  lengthTestItem({ length: 10, expected: 9 }),
  lengthTestItem({ length: 2, expected: 2, strict: false }),
])(
  "should return valid length $expected with (strict: $strict, length: $specs.length)",
  ({ specs, constrain, strict, expected }) => {
    const length = arrays.getLength(
      specs,
      constrain as constrains.Constrain,
      strict as boolean
    );
    expect(length).toEqual(expected);
  }
);

const lengthTestItemNoLength = (args: {
  expected: number;
  toBeCalledWith: [number, number];
  specs?: Record<string, unknown>;
  min?: number;
  max?: number;
}) => {
  const item = lengthTestItem({ ...args, length: 0, strict: false });
  return {
    constrain: item.constrain,
    strict: item.strict,
    expected: item.expected,
    randIntVal: item.expected,
    toBeCalledWith: args.toBeCalledWith,
    specs: createSpecs(args.specs),
  };
};

test.each([
  lengthTestItemNoLength({ expected: 9, toBeCalledWith: [3, 9] }),
  lengthTestItemNoLength({
    expected: 9,
    toBeCalledWith: [6, 9],
    min: 6,
    specs: { min: 2 },
  }),
  lengthTestItemNoLength({
    expected: 9,
    toBeCalledWith: [6, 9],
    min: 6,
    specs: { min: 2 },
  }),
  lengthTestItemNoLength({
    expected: 7,
    toBeCalledWith: [6, 13],
    min: 6,
    max: 13,
    specs: { max: 22 },
  }),
  lengthTestItemNoLength({
    expected: 10,
    toBeCalledWith: [10, 19],
    min: 5,
    max: 19,
    specs: { min: 10 },
  }),
  lengthTestItemNoLength({
    expected: 8,
    toBeCalledWith: [2, 12],
    min: 2,
    max: 20,
    specs: { max: 12 },
  }),
  lengthTestItemNoLength({
    expected: 16,
    toBeCalledWith: [2, 30],
    min: 2,
    max: 30,
    specs: { min: 1, max: 50 },
  }),
  lengthTestItemNoLength({
    expected: 31,
    toBeCalledWith: [5, 32],
    min: 4,
    max: 32,
    specs: { min: 5, max: 50 },
  }),
  lengthTestItemNoLength({
    expected: 33,
    toBeCalledWith: [2, 43],
    min: 2,
    max: 44,
    specs: { min: 1, max: 43 },
  }),
  lengthTestItemNoLength({
    expected: 48,
    toBeCalledWith: [10, 90],
    min: 10,
    max: 100,
    specs: { min: 0, max: 90 },
  }),
])(
  "should return valid length $expected with (min: $specs.min, max: $specs.max, strict: false)",
  ({ specs, constrain, randIntVal, toBeCalledWith, expected }) => {
    randomIntInclusiveMock.mockReturnValue(randIntVal as number);

    const length = arrays.getLength(specs, constrain as constrains.Constrain);

    expect(length).toEqual(expected);
    expect(randomIntInclusiveMock.mock.calls).toEqual([toBeCalledWith]);
  }
);
