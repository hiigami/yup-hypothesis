import { randomIntInclusiveMock, randomMock } from "../../jest.setup";

import * as yup from "yup";

import { enumerations } from "../../src/data";
import {
  BooleanStrategy,
  NumberStrategy,
  TupleStrategy,
} from "../../src/strategies";
import * as mockUtils from "../utils";

function numberSchemaHelper(): [yup.NumberSchema, NumberStrategy] {
  const numberSchema = yup.number().integer();
  const numberStrategy = new NumberStrategy({
    specs: mockUtils.createSpecs({ type: enumerations.SchemaType.Number }),
    schema: numberSchema,
  });

  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(2);
  return [numberSchema, numberStrategy];
}

function booleanSchemaHelper(): [yup.BooleanSchema, BooleanStrategy] {
  const booleanSchema = yup.boolean();
  const booleanStrategy = new BooleanStrategy({
    specs: mockUtils.createSpecs({
      type: enumerations.SchemaType.Boolean,
      strict: false,
      presence: enumerations.PresenceType.Required,
    }),
    schema: booleanSchema,
  });
  return [booleanSchema, booleanStrategy];
}

test("should be a tuple of size 2", () => {
  const [numberSchema, numberStrategy] = numberSchemaHelper();
  const [booleanSchema, booleanStrategy] = booleanSchemaHelper();

  const val = new TupleStrategy({
    specs: mockUtils.createSpecs({
      type: enumerations.SchemaType.Tuple,
    }),
    schema: yup.tuple([numberSchema, booleanSchema]),
    fields: { "0": numberStrategy, "1": booleanStrategy },
  }).draw();

  expect(Array.isArray(val)).toBeTruthy();
  const value = val as [number, boolean];
  expect(value.length).toEqual(2);
  expect(value[0]).toEqual(2);
  expect(value[1]).toEqual(true);
});
