/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { randomIntInclusiveMock, randomMock } from "../../jest.setup";

import { Specs } from "../../src/data";
import { PresenceType, SchemaType } from "../../src/data/enumerations";
import { StringStrategy } from "../../src/strategies";
import * as constant from "../../src/strategies/constant";

test("should be a string", () => {
  const specs: Specs = {
    type: SchemaType.String,
    nullable: false,
    presence: PresenceType.Required,
  };

  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new StringStrategy(specs).draw();
  expect(typeof val).toEqual("string");
});

test("should be nullable", () => {
  const specs: Specs = {
    type: SchemaType.String,
    nullable: true,
    presence: PresenceType.Required,
  };

  randomMock.mockReturnValue(constant.IS_NULLABLE + 0.05);

  const val = new StringStrategy(specs).draw();
  expect(val).toBeNull();
});

test("should be default", () => {
  const specs: Specs = {
    type: SchemaType.String,
    nullable: true,
    presence: PresenceType.Required,
    default: false,
  };

  randomMock.mockReturnValue(constant.IS_DEFAULT + 0.05);

  const val = new StringStrategy(specs).draw();
  expect(val).toBe(specs.default);
});

test("should be one of", () => {
  const specs: Specs = {
    type: SchemaType.String,
    nullable: false,
    presence: PresenceType.Required,
    choices: ["tesr@example.com", "jopk@jnoi.org", "nubiuhg@text.com"],
  };

  const index = 0;
  randomIntInclusiveMock.mockReturnValue(index);

  const val = new StringStrategy(specs).draw();
  expect(val).toBe(specs.choices![index]);
});

test("should be trim", () => {
  const specs: Specs = {
    type: SchemaType.String,
    nullable: false,
    presence: PresenceType.Required,
    trim: true,
    length: 11,
  };

  const index = 32; // space
  randomIntInclusiveMock.mockReturnValue(index);

  const val = new StringStrategy(specs).draw();
  expect(val).toEqual("");
});

test("should not be trim", () => {
  const specs: Specs = {
    type: SchemaType.String,
    nullable: false,
    presence: PresenceType.Required,
    trim: false,
    length: 10,
  };

  const index = 32; // space
  randomIntInclusiveMock.mockReturnValue(index);

  const val = new StringStrategy(specs).draw();
  expect(val).not.toEqual("");
});

test("should respect default max and min limits", () => {
  const defaults = constant.STRING_DEFAULTS;
  const specs: Specs = {
    type: SchemaType.String,
    nullable: false,
    presence: PresenceType.Required,
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
  const specs: Specs = {
    type: SchemaType.String,
    nullable: false,
    presence: PresenceType.Required,
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
  const specs: Specs = {
    type: SchemaType.String,
    nullable: false,
    presence: PresenceType.Required,
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
