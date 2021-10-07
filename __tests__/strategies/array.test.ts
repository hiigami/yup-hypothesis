import { randomIntInclusiveMock, randomMock } from "../../jest.setup";

import * as yup from "yup";

import * as mockUtils from "../utils";
import { enumerations } from "../../src/data";
import { ArrayStrategy, NumberStrategy } from "../../src/strategies";

test("should be an array", () => {
  const numberSchema = yup.number().integer();
  const numberStrategy = new NumberStrategy({
    specs: mockUtils.createSpecs({ type: enumerations.SchemaType.Number }),
    schema: numberSchema,
  });

  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(2);

  const val = new ArrayStrategy({
    specs: mockUtils.createSpecs({
      type: enumerations.SchemaType.Array,
      length: 1,
    }),
    schema: yup.array().of(numberSchema).length(1),
    element: numberStrategy,
  }).draw();

  expect(Array.isArray(val)).toBeTruthy();
  const value = val as Array<number>;
  expect(value.length).toEqual(1);
  expect(Number.isInteger(value[0])).toBeTruthy();
});
