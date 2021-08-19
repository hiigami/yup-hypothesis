/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { randomIntInclusiveMock, randomMock } from "../../jest.setup";
import * as mockUtils from "../utils";

import { enumerations, specs as dSpecs } from "../../src/data";
import { URLStrategy } from "../../src/strategies";
import * as constant from "../../src/strategies/constant";

test("should be a URL", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.URL,
    nullable: false,
    presence: enumerations.PresenceType.Required,
  };

  randomMock.mockReturnValue(97);
  for (let i = 0; i < constant.URL_SCHEMAS.length; i++) {
    randomIntInclusiveMock.mockReturnValue(i);
    const val = new URLStrategy(specs).draw();
    expect(mockUtils.urlCheck(val!)).toBeTruthy();
    randomIntInclusiveMock.mockReset();
  }
});

test("should respect default max and min limits", () => {
  const defaults = constant.URL_DEFAULTS;
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.URL,
    nullable: false,
    presence: enumerations.PresenceType.Required,
    max: defaults.max + 1,
    min: defaults.min - 1,
  };

  randomMock.mockReturnValue(0.5);

  randomIntInclusiveMock.mockImplementation(
    mockUtils.randIntIncMaxEqDefaultAndMinEq0Is1OrMax(defaults.max)
  );

  const val = new URLStrategy(specs).draw();
  expect(val?.length).toBe(defaults.max);
});

test("should respect max and min within limits", () => {
  const defaults = constant.URL_DEFAULTS;
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.URL,
    nullable: false,
    presence: enumerations.PresenceType.Required,
    max: defaults.max - 1,
    min: defaults.min + 1,
  };

  randomIntInclusiveMock.mockImplementation(
    mockUtils.randIntIncMaxEqDefaultAndMinEq0Is1OrMax(defaults.max)
  );

  const val = new URLStrategy(specs).draw();
  expect(val?.length).toBe(specs.max);
  expect(randomIntInclusiveMock.mock.calls[0]).toEqual([specs.max, specs.min]);
});

test("should respect default length limits over specs length", () => {
  const defaults = constant.URL_DEFAULTS;
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.URL,
    nullable: false,
    presence: enumerations.PresenceType.Required,
    length: defaults.max + 1,
  };

  randomIntInclusiveMock.mockImplementation(
    mockUtils.randIntIncMaxEqDefaultAndMinEq0Is1OrMax(defaults.max)
  );

  const val = new URLStrategy(specs).draw();
  expect(val?.length).toBe(defaults.max);
  expect(randomIntInclusiveMock.mock.calls[0]).toEqual([
    defaults.max,
    defaults.min,
  ]);
});

test("should respect length within limits", () => {
  const defaults = constant.URL_DEFAULTS;
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.URL,
    nullable: false,
    presence: enumerations.PresenceType.Required,
    length: defaults.min + 1,
  };

  randomIntInclusiveMock.mockImplementation(mockUtils.randIntIncMinEq0Is1OrMax);

  const val = new URLStrategy(specs).draw();
  expect(val?.length).toBe(specs.length);
});
