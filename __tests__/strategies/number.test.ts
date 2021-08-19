/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { randomIntInclusiveMock, randomMock } from "../../jest.setup";

import { enumerations, specs as dSpecs } from "../../src/data";
import { NumberStrategy } from "../../src/strategies";
import * as constant from "../../src/strategies/constant";

test("should be integer", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.Number,
    nullable: false,
    presence: enumerations.PresenceType.Required,
  };

  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new NumberStrategy(specs).draw();
  expect(Number.isInteger(val)).toBeTruthy();
});

test("should be negative", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.Number,
    nullable: false,
    presence: enumerations.PresenceType.Required,
    sign: enumerations.Sign.Negative,
  };

  randomIntInclusiveMock.mockReturnValue(1);

  const val = new NumberStrategy(specs).draw();
  expect(val).toBeLessThan(0);
});

test("should be positive", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.Number,
    nullable: false,
    presence: enumerations.PresenceType.Required,
    sign: enumerations.Sign.Positive,
  };

  randomIntInclusiveMock.mockReturnValue(1);

  const val = new NumberStrategy(specs).draw();
  expect(val).toBeGreaterThanOrEqual(0);
});

test("should be negative with indifferent sign", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.Number,
    nullable: false,
    presence: enumerations.PresenceType.Required,
    sign: enumerations.Sign.Indifferent,
  };

  randomMock.mockReturnValue(constant.SIGN_CHANGE + 0.05);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new NumberStrategy(specs).draw();
  expect(val).toBeLessThan(0);
});

test("should be positive with indifferent sign", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.Number,
    nullable: false,
    presence: enumerations.PresenceType.Required,
    sign: enumerations.Sign.Indifferent,
  };

  randomMock.mockReturnValue(constant.SIGN_CHANGE - 0.05);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new NumberStrategy(specs).draw();
  expect(val).toBeGreaterThanOrEqual(0);
});

test("should respect max and min", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.Number,
    nullable: false,
    presence: enumerations.PresenceType.Required,
    sign: enumerations.Sign.Positive,
    max: 5,
    min: 3,
  };

  const expected = 2;
  randomIntInclusiveMock.mockReturnValue(expected);

  const val = new NumberStrategy(specs).draw();
  expect(val).toBe(expected);
  expect(randomIntInclusiveMock.mock.calls).toEqual([[specs.max, specs.min]]);
});
