/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { randomIntInclusiveMock, randomMock } from "../../jest.setup";
import { addDecimals } from "../utils";

import { enumerations, specs as dSpecs } from "../../src/data";
import { FloatStrategy } from "../../src/strategies";
import * as constant from "../../src/strategies/constant";

test("should be float", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.Float,
    nullable: false,
    presence: enumerations.PresenceType.Required,
  };

  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new FloatStrategy(specs).draw();
  expect(!Number.isInteger(val)).toBeTruthy();
});

test("should be negative", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.Float,
    nullable: false,
    presence: enumerations.PresenceType.Required,
    sign: enumerations.Sign.Negative,
  };

  randomIntInclusiveMock.mockReturnValue(1);

  const val = new FloatStrategy(specs).draw();
  expect(val).toBeLessThan(0);
});

test("should be positive", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.Float,
    nullable: false,
    presence: enumerations.PresenceType.Required,
    sign: enumerations.Sign.Positive,
  };

  randomIntInclusiveMock.mockReturnValue(1);

  const val = new FloatStrategy(specs).draw();
  expect(val).toBeGreaterThanOrEqual(0);
});

test("should be negative with indifferent sign", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.Float,
    nullable: false,
    presence: enumerations.PresenceType.Required,
    sign: enumerations.Sign.Indifferent,
  };

  randomMock.mockReturnValue(constant.SIGN_CHANGE + 0.05);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new FloatStrategy(specs).draw();
  expect(val).toBeLessThan(0);
});

test("should be positive with indifferent sign", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.Float,
    nullable: false,
    presence: enumerations.PresenceType.Required,
    sign: enumerations.Sign.Indifferent,
  };

  randomMock.mockReturnValue(constant.SIGN_CHANGE - 0.05);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new FloatStrategy(specs).draw();
  expect(val).toBeGreaterThanOrEqual(0);
});

test("should respect max and min", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.Float,
    nullable: false,
    presence: enumerations.PresenceType.Required,
    sign: enumerations.Sign.Positive,
    max: 0.5,
    min: 0.0001,
  };

  const expected = 2;
  randomIntInclusiveMock.mockReturnValue(expected);

  const val = new FloatStrategy(specs).draw();

  const precision = constant.FLOAT_DEFAULTS.precision;
  expect(val).toEqual(addDecimals(expected, precision));
  const byNum = Math.pow(10, precision);
  expect(randomIntInclusiveMock.mock.calls).toEqual([
    [specs.max! * byNum, specs.min! * byNum],
  ]);
});

test("should respect precision", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.Float,
    nullable: false,
    presence: enumerations.PresenceType.Required,
    sign: enumerations.Sign.Positive,
    precision: 7,
    max: 0.0000002,
    min: 0.0000001,
  };

  const expected = 2;
  randomIntInclusiveMock.mockReturnValue(expected);

  const val = new FloatStrategy(specs).draw();
  expect(val).toEqual(specs.max);
});
