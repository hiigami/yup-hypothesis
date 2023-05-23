jest.unmock("../src/random");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as rnd from "../src/random";

import * as yup from "yup";

import { PresenceType, SchemaType, Sign } from "../src/data/enumerations";
import { ArraySpecs, NumberSpecs } from "../src/data/specs";
import { SchemaBuilder } from "../src/schema_builder";
import * as mockUtils from "./utils";


test("should return specs for array schema", () => {
  const t = yup.array().length(5).optional().strict();

  const specs = new SchemaBuilder(t).specs();

  const expected: ArraySpecs = mockUtils.createSpecs({
    presence: PresenceType.Optional,
    type: SchemaType.Array,
    mutations: t.transforms,
    nullable: false,
    length: 5,
    strict: true
  });

  expect(specs).toEqual(expected);
});

test("should return specs for date schema", () => {
  const defaultValue = new Date(1);
  const t = yup.date().default(defaultValue).strict();

  const specs = new SchemaBuilder(t).specs();

  const expected = mockUtils.createSpecs({
    presence: PresenceType.Optional,
    type: SchemaType.Date,
    mutations: t.transforms,
    nullable: false,
    default: defaultValue,
    strict: true
  });

  delete expected["length"];
  delete expected["sign"];

  expect(specs).toEqual(expected);
});

test("should return specs for number schema", () => {
  const t = yup.number().negative().min(-23).max(-1).integer().required();

  const specs = new SchemaBuilder(t).specs();

  const expected: NumberSpecs = mockUtils.createSpecs({
    presence: PresenceType.Required,
    type: SchemaType.Number,
    mutations: t.transforms,
    nullable: false,
    min: -23,
    max: -1,
    length: undefined,
    sign: Sign.Negative,
    strict: false
  });

  expect(specs).toEqual(expected);
});

test("should return specs for string schema", () => {
  const t = yup.string().lowercase().min(3).oneOf(["abc", "xyz"]);

  const specs = new SchemaBuilder(t).specs();

  const expected: ArraySpecs = mockUtils.createSpecs({
    presence: PresenceType.Optional,
    type: SchemaType.String,
    mutations: t.transforms,
    nullable: false,
    choices: ["abc", "xyz"],
    min: 3,
    strict: false
  });

  expect(specs).toEqual(expected);
});
