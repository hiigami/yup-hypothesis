/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { randomIntInclusiveMock, randomMock } from "../../jest.setup";

import * as yup from "yup";

import { CheckFn, createTestItem, createSpecs } from "../utils";

import { NUMBER_DEFAULTS, STRATEGY_DEFAULTS } from "../../src/config";
import { enumerations } from "../../src/data";
import { StrategyConstructor } from "../../src/data/strategies";
import { FloatStrategy, NumberStrategy } from "../../src/strategies";
import { Specs } from "../../src/data/specs";

type VoidFn = (x: number) => void;

const specsInt = createSpecs({
  type: enumerations.SchemaType.Number,
  strict: true,
});
const specsFloat = createSpecs({
  type: enumerations.SchemaType.Float,
  strict: true,
});
const schemaInt = yup.number().integer().required();
const schemaFloat = yup.number().required();

const precisionOffset = Math.pow(10, NUMBER_DEFAULTS.precision);

const isIntegerCheck = (x: number) => expect(Number.isInteger(x)).toBeTruthy();
const isNotIntegerCheck = (x: number) =>
  expect(!Number.isInteger(x)).toBeTruthy();
const numberTestItem = (args: {
  specs: Specs;
  randomMockValue?: number;
  schema?: yup.AnySchema;
  asType?: string;
  check?: CheckFn<number>;
  strategy?: StrategyConstructor;
  name?: string;
}) =>
  createTestItem({
    specs: args.specs,
    schema: args.schema ?? schemaInt,
    randomMockValue: args.randomMockValue ?? STRATEGY_DEFAULTS.bool - 0.01,
    asType: args.asType ?? "number",
    check: args.check ?? isIntegerCheck,
    strategy: args.strategy ?? NumberStrategy,
  });

test.each([
  numberTestItem({ specs: specsInt }),
  numberTestItem({
    specs: { ...specsInt, strict: undefined },
    asType: "string",
    randomMockValue: STRATEGY_DEFAULTS.bool + 0.01,
  }),
  numberTestItem({
    specs: { ...specsInt, strict: false },
    asType: "string",
    randomMockValue: STRATEGY_DEFAULTS.bool + 0.01,
  }),
  numberTestItem({
    specs: { ...specsInt, strict: undefined },
  }),
  numberTestItem({
    specs: specsFloat,
    strategy: FloatStrategy,
    schema: schemaFloat,
    check: isNotIntegerCheck,
  }),
  numberTestItem({
    specs: { ...specsFloat, strict: undefined },
    strategy: FloatStrategy,
    schema: schemaFloat,
    check: isNotIntegerCheck,
    asType: "string",
    randomMockValue: STRATEGY_DEFAULTS.bool + 0.01,
  }),
  numberTestItem({
    specs: { ...specsFloat, strict: false },
    strategy: FloatStrategy,
    schema: schemaFloat,
    check: isNotIntegerCheck,
    asType: "string",
    randomMockValue: STRATEGY_DEFAULTS.bool + 0.01,
  }),
  numberTestItem({
    specs: { ...specsFloat, strict: undefined },
    strategy: FloatStrategy,
    schema: schemaFloat,
    check: isNotIntegerCheck,
  }),
])(
  "should be $specs.type as $asType with strict: $specs.strict",
  ({ asType, specs, strategy, randomMockValue, schema, check }) => {
    randomMock
      .mockReturnValue(0)
      .mockReturnValueOnce(randomMockValue as number);
    randomIntInclusiveMock.mockReturnValue(1);

    const val = new (strategy as StrategyConstructor)({
      specs,
      schema: schema as yup.AnySchema,
    }).draw();
    expect(typeof val === asType).toBeTruthy();
    let _val = val;
    if (asType === "string") {
      _val =
        specs.type === enumerations.SchemaType.Number
          ? Number.parseInt(val as string)
          : Number.parseFloat(val as string);
    }
    (check as CheckFn<number>)(_val as number);
  }
);

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
    toBeCalledWith: [[-1, -NUMBER_DEFAULTS.max * precisionOffset]],
    strategy: FloatStrategy,
    schema: schemaFloat.negative(),
    expected: -53 / precisionOffset,
    check: (x: number) => expect(x).toBeLessThan(0),
  }),
  createTestItem({
    name: "positive",
    specs: { ...specsFloat, sign: enumerations.Sign.Positive },
    randIntVal: 92,
    toBeCalledWith: [[NUMBER_DEFAULTS.max * precisionOffset, 1]],
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

    const val = new (strategy as StrategyConstructor)({
      specs,
      schema: schema as yup.AnySchema,
    }).draw();

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
    toBeCalledWith: [[-1, -NUMBER_DEFAULTS.max * precisionOffset]],
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
    toBeCalledWith: [[NUMBER_DEFAULTS.max * precisionOffset, 1]],
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

    const val = new (strategy as StrategyConstructor)({
      specs,
      schema: schema as yup.AnySchema,
    }).draw();

    (check as VoidFn)(val as number);
    expect(val).toBe(expected);
    expect(randomIntInclusiveMock.mock.calls).toEqual(toBeCalledWith);
  }
);
