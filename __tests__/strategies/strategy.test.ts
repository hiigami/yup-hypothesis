import {
  randomMock,
  randomChoiceMock,
  randomIntInclusiveMock,
} from "../../jest.setup";

import * as yup from "yup";

import { enumerations, specs as dSpecs, types } from "../../src/data";
import { Strategy } from "../../src/strategies/strategy";
import { STRATEGY_DEFAULTS } from "../../src/strategies/constant";

class DummyStrategy extends Strategy<string> {
  public returnValue = "_draw";
  protected _draw() {
    return this.returnValue;
  }
}

const specs: dSpecs.Specs = {
  type: enumerations.SchemaType.String,
  nullable: false,
  presence: enumerations.PresenceType.Required,
};
const schema = yup.string();

test("should return from _draw", () => {
  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new DummyStrategy(specs, schema.required()).draw();
  expect(val).toEqual("_draw");
});

test("should be nullable", () => {
  randomMock.mockReturnValue(STRATEGY_DEFAULTS.nullable + 0.05);

  const val = new DummyStrategy(
    { ...specs, nullable: true },
    schema.required().nullable()
  ).draw();

  expect(val).toBeNull();
});

test("should be default", () => {
  randomMock.mockReturnValue(STRATEGY_DEFAULTS.default + 0.05);

  const defaultValue = "----";
  const val = new DummyStrategy(
    { ...specs, nullable: true, default: defaultValue },
    schema.required().nullable().default(defaultValue)
  ).draw();

  expect(val).toBe(defaultValue);
});

test("should handle default as function", () => {
  randomMock.mockReturnValue(STRATEGY_DEFAULTS.default + 0.05);

  const defaultValue = () => "----";
  const val = new DummyStrategy(
    { ...specs, nullable: true, default: defaultValue },
    schema.required().nullable().default(defaultValue)
  ).draw();

  expect(val).toBe((defaultValue as types.GenericFn<unknown>)());
});

test("should be one of", () => {
  const index = 2;
  const choices = ["a", "b", "c"];
  randomChoiceMock.mockReturnValue(choices[index]);

  const val = new DummyStrategy(
    { ...specs, choices: choices },
    schema.required().oneOf(choices)
  ).draw();

  expect(val).toBe(choices[index]);
});

test.each([
  {
    specs: {
      ...specs,
      presence: enumerations.PresenceType.Optional,
    },
    randValue: STRATEGY_DEFAULTS.defined + 0.01,
    schema: schema,
    expected: true,
  },
  {
    specs: {
      ...specs,
      presence: enumerations.PresenceType.Optional,
    },
    randValue: STRATEGY_DEFAULTS.defined - 0.01,
    schema: schema,
    expected: false,
  },
  {
    specs: specs,
    randValue: STRATEGY_DEFAULTS.defined - 0.0001,
    schema: schema.required(),
    expected: true,
  },
  {
    specs: {
      ...specs,
      presence: enumerations.PresenceType.Defined,
    },
    randValue: STRATEGY_DEFAULTS.defined - 0.001,
    schema: schema.defined(),
    expected: true,
  },
])(
  "should return $expected with random:$randValue, presence:$specs.presence",
  ({ specs, randValue, schema, expected }) => {
    randomMock.mockReturnValue(randValue);

    const val = new DummyStrategy(specs, schema).isDefined();
    expect(val).toBe(expected);
  }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const customMutationSchema = schema.required().transform((val, _original) => {
  return val === "aaaa" ? "1234" : val;
});

test.each([
  {
    name: "trim",
    specs: {
      ...specs,
      mutations: schema.trim().transforms,
    },
    schema: schema.trim(),
    returnValue: " ",
    expected: "",
  },
  {
    name: "upper",
    specs: {
      ...specs,
      mutations: schema.uppercase().transforms,
    },
    schema: schema.uppercase(),
    returnValue: "a",
    expected: "A",
  },
  {
    name: "custom",
    specs: {
      ...specs,
      mutations: customMutationSchema.transforms,
    },
    schema: customMutationSchema,
    returnValue: "aaaa",
    expected: "1234",
  },
])(
  "should apply $name mutation",
  ({ specs, schema, returnValue, expected }) => {
    const dummy = new DummyStrategy(specs, schema);
    dummy.returnValue = returnValue;

    expect(dummy.draw()).toEqual(expected);
  }
);
