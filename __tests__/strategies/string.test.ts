/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { randomIntInclusiveMock, randomMock } from "../../jest.setup";

import { enumerations, specs as dSpecs } from "../../src/data";
import { mapper } from "../../src/mutation";
import { StringStrategy } from "../../src/strategies";
import * as constant from "../../src/strategies/constant";

test("should be a string", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.String,
    nullable: false,
    presence: enumerations.PresenceType.Required,
  };

  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new StringStrategy(specs).draw();
  expect(typeof val).toEqual("string");
});

test("should be trim", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.String,
    nullable: false,
    presence: enumerations.PresenceType.Required,
    length: 11,
    mutations: [
      mapper.get(enumerations.TestMutation.Trim) as dSpecs.SpecMutation,
    ],
  };

  const index = 32; // space
  randomIntInclusiveMock.mockReturnValue(index);

  const val = new StringStrategy(specs).draw();
  expect(val).toEqual("");
});

test("should not be trim", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.String,
    nullable: false,
    presence: enumerations.PresenceType.Required,
    length: 10,
  };

  const index = 32; // space
  randomIntInclusiveMock.mockReturnValue(index);

  const val = new StringStrategy(specs).draw();
  expect(val).not.toEqual("");
});

test("should respect default max and min limits", () => {
  const defaults = constant.STRING_DEFAULTS;
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.String,
    nullable: false,
    presence: enumerations.PresenceType.Required,
    max: defaults.max + 1,
    min: defaults.min - 1,
  };

  randomIntInclusiveMock.mockImplementation((max: number, min?: number) => {
    if (max === defaults.chars.max && min === defaults.chars.min) {
      return 1;
    }
    return max;
  });

  const val = new StringStrategy(specs).draw();
  expect(val?.length).toBe(defaults.max);
});

test("should respect max and min within limits", () => {
  const defaults = constant.STRING_DEFAULTS;
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.String,
    nullable: false,
    presence: enumerations.PresenceType.Required,
    max: defaults.max - 1,
    min: defaults.min + 1,
  };

  randomIntInclusiveMock.mockImplementation((max: number, min?: number) => {
    if (max === defaults.chars.max && min === defaults.chars.min) {
      return 1;
    }
    return max;
  });

  const val = new StringStrategy(specs).draw();
  expect(val?.length).toBe(specs.max);
  expect(randomIntInclusiveMock.mock.calls[0]).toEqual([specs.max, specs.min]);
});

test("should respect default length", () => {
  const defaults = constant.STRING_DEFAULTS;
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.String,
    nullable: false,
    presence: enumerations.PresenceType.Required,
    length: defaults.max + 1,
  };

  randomIntInclusiveMock.mockImplementation((max: number, min?: number) => {
    if (max === defaults.chars.max && min === defaults.chars.min) {
      return 1;
    }
    return max;
  });

  const val = new StringStrategy(specs).draw();
  expect(val?.length).toBe(specs.length);
});
