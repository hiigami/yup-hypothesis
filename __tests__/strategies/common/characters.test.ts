import { randomIntInclusiveMock } from "../../../jest.setup";

import { createTestItem } from "../../utils";
import { constrains } from "../../../src/data";
import { characters } from "../../../src/strategies/common";

test.each([
  createTestItem({
    constrain: { min: 3, max: 9 },
    strict: true,
    expected: 3,
    specs: { length: 3 },
  }),
  createTestItem({
    constrain: { min: 3, max: 9 },
    strict: true,
    expected: 3,
    specs: { length: 2 },
  }),
  createTestItem({
    constrain: { min: 3, max: 9 },
    strict: true,
    expected: 9,
    specs: { length: 10 },
  }),
  createTestItem({
    constrain: { min: 3, max: 9 },
    strict: false,
    expected: 2,
    specs: { length: 2 },
  }),
])(
  "should return valid length $expected with (strict: $strict, length: $specs.length)",
  ({ specs, constrain, strict, expected }) => {
    const length = characters.getLength(
      specs,
      constrain as constrains.Constrain,
      strict
    );
    expect(length).toEqual(expected);
  }
);

test.each([
  createTestItem({
    constrain: { min: 3, max: 9 },
    strict: false,
    expected: 9,
    randIntVal: 9,
    toBeCalledWith: [3, 9],
  }),
  createTestItem({
    constrain: { min: 6, max: 9 },
    specs: { min: 2 },
    strict: false,
    expected: 9,
    randIntVal: 9,
    toBeCalledWith: [6, 9],
  }),
  createTestItem({
    constrain: { min: 6, max: 9 },
    specs: { min: 2 },
    strict: false,
    expected: 9,
    randIntVal: 9,
    toBeCalledWith: [6, 9],
  }),
  createTestItem({
    constrain: { min: 6, max: 13 },
    specs: { max: 22 },
    strict: false,
    expected: 7,
    randIntVal: 7,
    toBeCalledWith: [6, 13],
  }),
  createTestItem({
    constrain: { min: 5, max: 19 },
    specs: { min: 10 },
    strict: false,
    expected: 10,
    randIntVal: 10,
    toBeCalledWith: [10, 19],
  }),
  createTestItem({
    constrain: { min: 2, max: 20 },
    specs: { max: 12 },
    strict: false,
    expected: 8,
    randIntVal: 8,
    toBeCalledWith: [2, 12],
  }),
  createTestItem({
    constrain: { min: 2, max: 30 },
    specs: { min: 1, max: 50 },
    strict: false,
    expected: 16,
    randIntVal: 16,
    toBeCalledWith: [2, 30],
  }),
  createTestItem({
    constrain: { min: 4, max: 32 },
    specs: { min: 5, max: 50 },
    strict: false,
    expected: 31,
    randIntVal: 31,
    toBeCalledWith: [5, 32],
  }),
  createTestItem({
    constrain: { min: 2, max: 44 },
    specs: { min: 1, max: 43 },
    strict: false,
    expected: 33,
    randIntVal: 33,
    toBeCalledWith: [2, 43],
  }),
  createTestItem({
    constrain: { min: 10, max: 100 },
    specs: { min: 0, max: 90 },
    strict: false,
    expected: 48,
    randIntVal: 48,
    toBeCalledWith: [10, 90],
  }),
])(
  "should return valid length $expected with (min: $specs.min, max: $specs.max)",
  ({ specs, constrain, randIntVal, toBeCalledWith, expected }) => {
    randomIntInclusiveMock.mockReturnValue(randIntVal as number);

    const length = characters.getLength(
      specs,
      constrain as constrains.Constrain
    );

    expect(length).toEqual(expected);
    expect(randomIntInclusiveMock.mock.calls).toEqual([toBeCalledWith]);
  }
);
