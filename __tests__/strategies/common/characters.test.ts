import { randomIntInclusiveMock } from "../../../jest.setup";

import { enumerations } from "../../../src/data";
import { characters } from "../../../src/strategies/common";

const createSpecs = (args?: {
  min?: number;
  max?: number;
  length?: number;
}) => ({
  type: enumerations.SchemaType.String,
  nullable: false,
  presence: enumerations.PresenceType.Required,
  min: args?.min,
  max: args?.max,
  length: args?.length,
});

const createConstrain = (min: number, max: number) => ({
  min,
  max,
});

test.each([
  {
    specs: createSpecs({ length: 3 }),
    constrain: createConstrain(3, 9),
    strict: true,
    expected: 3,
  },
  {
    specs: createSpecs({ length: 2 }),
    constrain: createConstrain(3, 9),
    strict: true,
    expected: 3,
  },
  {
    specs: createSpecs({ length: 10 }),
    constrain: createConstrain(3, 9),
    strict: true,
    expected: 9,
  },
  {
    specs: createSpecs({ length: 2 }),
    constrain: createConstrain(3, 9),
    strict: false,
    expected: 2,
  },
])(
  "should return valid length $expected with (strict: $strict, length: $specs.length)",
  ({ specs, constrain, strict, expected }) => {
    const length = characters.getLength(specs, constrain, strict);
    expect(length).toEqual(expected);
  }
);

test.each([
  {
    specs: createSpecs(),
    constrain: createConstrain(3, 9),
    randVal: 9,
    toBeCalledWith: [3, 9],
    expected: 9,
  },
  {
    specs: createSpecs({ min: 2 }),
    constrain: createConstrain(6, 9),
    randVal: 9,
    toBeCalledWith: [6, 9],
    expected: 9,
  },
  {
    specs: createSpecs({ max: 22 }),
    constrain: createConstrain(6, 13),
    randVal: 7,
    toBeCalledWith: [6, 13],
    expected: 7,
  },
  {
    specs: createSpecs({ min: 10 }),
    constrain: createConstrain(5, 19),
    randVal: 10,
    toBeCalledWith: [10, 19],
    expected: 10,
  },
  {
    specs: createSpecs({ max: 12 }),
    constrain: createConstrain(2, 20),
    randVal: 8,
    toBeCalledWith: [2, 12],
    expected: 8,
  },
  {
    specs: createSpecs({ min: 1, max: 50 }),
    constrain: createConstrain(2, 30),
    randVal: 16,
    toBeCalledWith: [2, 30],
    expected: 16,
  },
  {
    specs: createSpecs({ min: 5, max: 50 }),
    constrain: createConstrain(4, 32),
    randVal: 31,
    toBeCalledWith: [5, 32],
    expected: 31,
  },
  {
    specs: createSpecs({ min: 1, max: 43 }),
    constrain: createConstrain(2, 44),
    randVal: 33,
    toBeCalledWith: [2, 43],
    expected: 33,
  },
  {
    specs: createSpecs({ min: 10, max: 90 }),
    constrain: createConstrain(0, 100),
    randVal: 48,
    toBeCalledWith: [10, 90],
    expected: 48,
  },
])(
  "should return valid length $expected with (min: $specs.min, max: $specs.max)",
  ({ specs, constrain, randVal, toBeCalledWith, expected }) => {
    randomIntInclusiveMock.mockReturnValue(randVal);

    const length = characters.getLength(specs, constrain);

    expect(length).toEqual(expected);
    expect(randomIntInclusiveMock.mock.calls).toEqual([toBeCalledWith]);
  }
);
