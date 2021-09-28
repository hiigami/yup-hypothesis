/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { randomIntInclusiveMock, randomMock } from "../../jest.setup";
import { createTestItem } from "../utils";

import * as yup from "yup";

import { enumerations, specs as dSpecs } from "../../src/data";
import { FloatStrategy, NumberStrategy } from "../../src/strategies";
import {
  FLOAT_DEFAULTS,
  NUMBER_DEFAULTS,
  STRATEGY_DEFAULTS,
} from "../../src/strategies/constant";
import { StrategyConstructor } from "../../src/data/strategies";

type VoidFn = (x: number) => void;

const specsInt: dSpecs.Specs = {
  type: enumerations.SchemaType.Number,
  nullable: false,
  presence: enumerations.PresenceType.Required,
};
const specsFloat: dSpecs.Specs = {
  type: enumerations.SchemaType.Float,
  nullable: false,
  presence: enumerations.PresenceType.Required,
};
const schemaInt = yup.number().integer().required();
const schemaFloat = yup.number().required();

const precisionOffset = Math.pow(10, FLOAT_DEFAULTS.precision);

test.each([
  {
    specs: specsInt,
    strategy: NumberStrategy,
    schema: schemaInt,
    check: (x: number) => Number.isInteger(x),
  },
  {
    specs: specsFloat,
    strategy: FloatStrategy,
    schema: schemaFloat,
    check: (x: number) => !Number.isInteger(x),
  },
])("should be $specs.type", ({ specs, strategy, schema, check }) => {
  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new strategy(specs, schema).draw();
  expect(typeof val === "number").toBeTruthy();
  expect(check(val as number)).toBeTruthy();
});

test.each([
  createTestItem({
    name: "negative",
    specs: { ...specsInt, sign: enumerations.Sign.Negative },
    randIntVal: -3,
    toBeCalledWith: [[-1, -NUMBER_DEFAULTS.max]],
    strategy: NumberStrategy,
    schema: schemaInt.negative(),
    expected: -3,
    check: (x: number) => expect(x).toBeLessThan(0),
  }),
  createTestItem({
    name: "positive",
    specs: { ...specsInt, sign: enumerations.Sign.Positive },
    randIntVal: 7,
    toBeCalledWith: [[NUMBER_DEFAULTS.max, 1]],
    strategy: NumberStrategy,
    schema: schemaInt.positive(),
    expected: 7,
    check: (x: number) => expect(x).toBeGreaterThan(0),
  }),
  createTestItem({
    name: "negative",
    specs: { ...specsFloat, sign: enumerations.Sign.Negative },
    randIntVal: -53,
    toBeCalledWith: [[-1, -FLOAT_DEFAULTS.max * precisionOffset]],
    strategy: FloatStrategy,
    schema: schemaFloat.negative(),
    expected: -53 / precisionOffset,
    check: (x: number) => expect(x).toBeLessThan(0),
  }),
  createTestItem({
    name: "positive",
    specs: { ...specsFloat, sign: enumerations.Sign.Positive },
    randIntVal: 92,
    toBeCalledWith: [[FLOAT_DEFAULTS.max * precisionOffset, 1]],
    strategy: FloatStrategy,
    schema: schemaFloat.positive(),
    expected: 92 / precisionOffset,
    check: (x: number) => expect(x).toBeGreaterThan(0),
  }),
])(
  "should return $expected for $specs.type with $name sign",
  ({
    specs,
    strategy,
    schema,
    randIntVal,
    expected,
    check,
    toBeCalledWith,
  }) => {
    randomIntInclusiveMock.mockReturnValue(randIntVal as number);

    const val = new (strategy as StrategyConstructor)(
      specs,
      schema as yup.AnySchema
    ).draw();

    (check as VoidFn)(val as number);
    expect(val).toBe(expected);
    expect(randomIntInclusiveMock.mock.calls).toEqual(toBeCalledWith);
  }
);

test.each([
  createTestItem({
    name: "negative",
    specs: { ...specsInt, sign: enumerations.Sign.Indifferent },
    randIntVal: -3,
    randVal: STRATEGY_DEFAULTS.sign + 0.05,
    toBeCalledWith: [[-1, -NUMBER_DEFAULTS.max]],
    strategy: NumberStrategy,
    schema: schemaInt,
    expected: -3,
    check: (x: number) => expect(x).toBeLessThan(0),
  }),
  createTestItem({
    name: "positive",
    specs: { ...specsInt, sign: enumerations.Sign.Indifferent },
    randIntVal: 7,
    randVal: STRATEGY_DEFAULTS.sign - 0.05,
    toBeCalledWith: [[NUMBER_DEFAULTS.max, 1]],
    strategy: NumberStrategy,
    schema: schemaInt.positive(),
    expected: 7,
    check: (x: number) => expect(x).toBeGreaterThan(0),
  }),
  createTestItem({
    name: "negative",
    specs: { ...specsFloat, sign: enumerations.Sign.Indifferent },
    randIntVal: -53,
    randVal: STRATEGY_DEFAULTS.sign + 0.05,
    toBeCalledWith: [[-1, -FLOAT_DEFAULTS.max * precisionOffset]],
    strategy: FloatStrategy,
    schema: schemaFloat.negative(),
    expected: -53 / precisionOffset,
    check: (x: number) => expect(x).toBeLessThan(0),
  }),
  createTestItem({
    name: "positive",
    specs: { ...specsFloat, sign: enumerations.Sign.Indifferent },
    randIntVal: 92,
    randVal: STRATEGY_DEFAULTS.sign - 0.05,
    toBeCalledWith: [[FLOAT_DEFAULTS.max * precisionOffset, 1]],
    strategy: FloatStrategy,
    schema: schemaFloat.positive(),
    expected: 92 / precisionOffset,
    check: (x: number) => expect(x).toBeGreaterThan(0),
  }),
])(
  "should return $expected for $specs.type with with indifferent sign",
  ({
    specs,
    strategy,
    schema,
    randIntVal,
    randVal,
    expected,
    check,
    toBeCalledWith,
  }) => {
    randomMock.mockReturnValue(randVal as number);
    randomIntInclusiveMock.mockReturnValue(randIntVal as number);

    const val = new (strategy as StrategyConstructor)(
      specs,
      schema as yup.AnySchema
    ).draw();

    (check as VoidFn)(val as number);
    expect(val).toBe(expected);
    expect(randomIntInclusiveMock.mock.calls).toEqual(toBeCalledWith);
  }
);
