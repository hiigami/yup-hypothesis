/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { randomIntInclusiveMock } from "../../jest.setup";

import * as yup from "yup";

import { addDecimals } from "../utils";

import * as constant from "../../src/config";
import { enumerations, specs as dSpecs } from "../../src/data";
import { FloatStrategy } from "../../src/strategies";

const specs: dSpecs.Specs = {
  type: enumerations.SchemaType.Float,
  nullable: false,
  presence: enumerations.PresenceType.Required,
  sign: enumerations.Sign.Positive,
};
const schema = yup.number().required();

test("should respect max and min for float", () => {
  const _specs = {
    ...specs,
    max: 0.5,
    min: 0.0001,
  };

  const expected = 2;
  randomIntInclusiveMock.mockReturnValue(expected);

  const val = new FloatStrategy({
    specs: _specs,
    schema: schema.min(_specs.min).max(_specs.max),
  }).draw();

  const precision = constant.FLOAT_DEFAULTS.precision;
  expect(val).toEqual(addDecimals(expected, precision));
  const byNum = Math.pow(10, precision);
  expect(randomIntInclusiveMock.mock.calls).toEqual([
    [_specs.max! * byNum, _specs.min! * byNum],
  ]);
});

test("should respect precision", () => {
  const _specs = {
    ...specs,
    precision: 7,
    max: 0.0000002,
    min: 0.0000001,
  };

  const expected = 2;
  randomIntInclusiveMock.mockReturnValue(expected);

  const val = new FloatStrategy({
    specs: _specs,
    schema: schema.min(_specs.min).max(_specs.max),
  }).draw();
  expect(val).toEqual(_specs.max);
});
