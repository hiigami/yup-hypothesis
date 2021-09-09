import {
  randomMock,
  randomChoiceMock,
  randomIntInclusiveMock,
} from "../../jest.setup";

import * as yup from "yup";

import { enumerations, specs as dSpecs } from "../../src/data";
import { Strategy } from "../../src/strategies/base_strategies";
import * as constant from "../../src/strategies/constant";

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
  randomMock.mockReturnValue(constant.IS_NULLABLE + 0.05);

  const val = new DummyStrategy(
    { ...specs, nullable: true },
    schema.required().nullable()
  ).draw();

  expect(val).toBeNull();
});

test("should be default", () => {
  randomMock.mockReturnValue(constant.IS_DEFAULT + 0.05);

  const defaultValue = "----";
  const val = new DummyStrategy(
    { ...specs, nullable: true, default: defaultValue },
    schema.required().nullable().default(defaultValue)
  ).draw();

  expect(val).toBe(defaultValue);
});

test("should handle default as function", () => {
  randomMock.mockReturnValue(constant.IS_DEFAULT + 0.05);

  const defaultValue = () => "----";
  const val = new DummyStrategy(
    { ...specs, nullable: true, default: defaultValue },
    schema.required().nullable().default(defaultValue)
  ).draw();

  expect(val).toBe((defaultValue as dSpecs.DefaultFn)());
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
    randValue: constant.IS_DEFINED + 0.01,
    schema: schema,
    expected: true,
  },
  {
    specs: {
      ...specs,
      presence: enumerations.PresenceType.Optional,
    },
    randValue: constant.IS_DEFINED - 0.01,
    schema: schema,
    expected: false,
  },
  {
    specs: specs,
    randValue: constant.IS_DEFINED - 0.0001,
    schema: schema.required(),
    expected: true,
  },
  {
    specs: {
      ...specs,
      presence: enumerations.PresenceType.Defined,
    },
    randValue: constant.IS_DEFINED - 0.001,
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
])(
  "should apply $name mutation",
  ({ specs, schema, returnValue, expected }) => {
    const dummy = new DummyStrategy(specs, schema);
    dummy.returnValue = returnValue;

    expect(dummy.draw()).toEqual(expected);
  }
);
