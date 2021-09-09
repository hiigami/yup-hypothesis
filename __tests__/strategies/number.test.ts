import { randomIntInclusiveMock, randomMock } from "../../jest.setup";

import * as yup from "yup";

import { enumerations, specs as dSpecs, specs } from "../../src/data";
import { FloatStrategy, NumberStrategy } from "../../src/strategies";
import * as constant from "../../src/strategies/constant";

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
  {
    name: "negative",
    specs: {
      ...specsInt,
      sign: enumerations.Sign.Negative,
    },
    strategy: NumberStrategy,
    schema: schemaInt.negative(),
    check: (x: number) => expect(x).toBeLessThan(0),
  },
  {
    name: "positive",
    specs: {
      ...specsInt,
      sign: enumerations.Sign.Positive,
    },
    strategy: NumberStrategy,
    schema: schemaInt.positive(),
    check: (x: number) => expect(x).toBeGreaterThan(0),
  },
  {
    name: "negative",
    specs: {
      ...specsFloat,
      sign: enumerations.Sign.Negative,
    },
    strategy: FloatStrategy,
    schema: schemaFloat.negative(),
    check: (x: number) => expect(x).toBeLessThan(0),
  },
  {
    name: "positive",
    specs: {
      ...specsFloat,
      sign: enumerations.Sign.Positive,
    },
    strategy: FloatStrategy,
    schema: schemaFloat.positive(),
    check: (x: number) => expect(x).toBeGreaterThan(0),
  },
])(
  "should $specs.type have sign $name",
  ({ specs, strategy, schema, check }) => {
    randomIntInclusiveMock.mockReturnValue(1);
    const val = new strategy(specs, schema).draw();
    check(val as number);
  }
);

test.each([
  {
    specs: {
      ...specsInt,
      sign: enumerations.Sign.Indifferent,
    },
    name: "negative",
    strategy: NumberStrategy,
    schema: schemaInt,
    randVal: constant.SIGN_CHANGE + 0.05,
    randIntVal: 1,
    check: (x: number) => expect(x).toBeLessThan(0),
  },
  {
    specs: {
      ...specsInt,
      sign: enumerations.Sign.Indifferent,
    },
    name: "positive",
    strategy: NumberStrategy,
    schema: schemaInt,
    randVal: constant.SIGN_CHANGE - 0.05,
    randIntVal: 1,
    check: (x: number) => expect(x).toBeGreaterThan(0),
  },
  {
    specs: {
      ...specsFloat,
      sign: enumerations.Sign.Indifferent,
    },
    name: "negative",
    strategy: FloatStrategy,
    schema: schemaFloat,
    randVal: constant.SIGN_CHANGE + 0.05,
    randIntVal: 1,
    check: (x: number) => expect(x).toBeLessThan(0),
  },
  {
    specs: {
      ...specsFloat,
      sign: enumerations.Sign.Indifferent,
    },
    name: "positive",
    strategy: FloatStrategy,
    schema: schemaFloat,
    randVal: constant.SIGN_CHANGE - 0.05,
    randIntVal: 1,
    check: (x: number) => expect(x).toBeGreaterThan(0),
  },
])(
  "should $specs.type be $name with indifferent sign",
  ({ specs, strategy, schema, randVal, randIntVal, check }) => {
    randomMock.mockReturnValue(randVal);
    randomIntInclusiveMock.mockReturnValue(randIntVal);

    const val = new strategy(specs, schema).draw();
    check(val as number);
  }
);
