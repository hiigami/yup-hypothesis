import {
  randomChoiceMock,
  randomIntInclusiveMock,
  randomMock,
} from "../../jest.setup";

import * as yup from "yup";

import * as mockUtils from "../utils";

import { STRATEGY_DEFAULTS } from "../../src/config";
import { enumerations, types } from "../../src/data";
import { Strategy } from "../../src/strategies/strategy";

class DummyStrategy extends Strategy<string> {
  public returnValue: string | (() => string) = "_draw";
  protected _draw() {
    if (typeof this.returnValue === "string") {
      return this.returnValue;
    }
    return this.returnValue();
  }
}

const specs = mockUtils.createSpecs({
  type: enumerations.SchemaType.String,
  nullable: false,
  presence: enumerations.PresenceType.Required,
});
const schema = yup.string();

test("should return from _draw", () => {
  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new DummyStrategy({ specs, schema: schema.required() }).draw();
  expect(val).toEqual("_draw");
});

test("should be nullable", () => {
  randomMock.mockReturnValue(STRATEGY_DEFAULTS.nullable + 0.05);

  const val = new DummyStrategy({
    specs: { ...specs, nullable: true },
    schema: schema.required().nullable(),
  }).draw();

  expect(val).toBeNull();
});

test("should be default", () => {
  randomMock.mockReturnValue(STRATEGY_DEFAULTS.default + 0.05);

  const defaultValue = "----";
  const val = new DummyStrategy({
    specs: { ...specs, nullable: true, default: defaultValue },
    schema: schema.required().nullable().default(defaultValue),
  }).draw();

  expect(val).toBe(defaultValue);
});

test("should handle default as function", () => {
  randomMock.mockReturnValue(STRATEGY_DEFAULTS.default + 0.05);

  const defaultValue = () => "----";
  const val = new DummyStrategy({
    specs: { ...specs, nullable: true, default: defaultValue },
    schema: schema.required().nullable().default(defaultValue),
  }).draw();

  expect(val).toBe((defaultValue as types.GenericFn<unknown>)());
});

test("should be one of", () => {
  const index = 2;
  const choices = ["a", "b", "c"];
  randomChoiceMock.mockReturnValue(choices[index]);

  const val = new DummyStrategy({
    specs: { ...specs, choices: choices },
    schema: schema.required().oneOf(choices),
  }).draw();

  expect(val).toBe(choices[index]);
});

test("should be not one of having set oneOf", () => {
  const choices = ["a", "b", "c"];
  const exclude = ["b", "a"];
  randomChoiceMock
    .mockReturnValueOnce(choices[1])
    .mockReturnValueOnce(choices[0])
    .mockReturnValue(choices[2]);

  const val = new DummyStrategy({
    specs: { ...specs, choices: choices, exclude: new Set(exclude) },
    schema: schema.required().oneOf(choices).notOneOf(exclude),
  }).draw();

  expect(val).toBe("c");
});

test("should be not one of", () => {
  const exclude = ["b", "a"];
  const dummyStrategy = new DummyStrategy({
    specs: { ...specs, exclude: new Set(exclude) },
    schema: schema.required().notOneOf(exclude),
  });
  const draws = ["a", "b", "d"];
  dummyStrategy.returnValue = () => {
    return draws.shift() ?? "";
  };
  const val = dummyStrategy.draw();

  expect(val).toBe("d");
});

test.each([
  mockUtils.createTestItem({
    specs: {
      ...specs,
      presence: enumerations.PresenceType.Optional,
    },
    randValue: STRATEGY_DEFAULTS.defined + 0.01,
    schema: schema,
    expected: true,
  }),
  mockUtils.createTestItem({
    specs: {
      ...specs,
      presence: enumerations.PresenceType.Optional,
    },
    randValue: STRATEGY_DEFAULTS.defined - 0.01,
    schema: schema,
    expected: false,
  }),
  mockUtils.createTestItem({
    specs: specs,
    randValue: STRATEGY_DEFAULTS.defined - 0.0001,
    schema: schema.required(),
    expected: true,
  }),
  mockUtils.createTestItem({
    specs: {
      ...specs,
      presence: enumerations.PresenceType.Defined,
    },
    randValue: STRATEGY_DEFAULTS.defined - 0.001,
    schema: schema.defined(),
    expected: true,
  }),
])(
  "should return $expected with random:$randValue, presence:$specs.presence",
  ({ specs, randValue, schema, expected }) => {
    randomMock.mockReturnValue(randValue as number);

    const val = new DummyStrategy({
      specs,
      schema: schema as yup.AnySchema,
    }).isDefined();
    expect(val).toBe(expected);
  }
);

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
    const dummy = new DummyStrategy({ specs, schema });
    dummy.returnValue = returnValue;

    expect(dummy.draw()).toEqual(expected);
  }
);
