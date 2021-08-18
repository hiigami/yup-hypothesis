/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { randomIntInclusiveMock, randomMock } from "../../jest.setup";
import * as mockUtils from "../utils";

import { Specs } from "../../src/data";
import { PresenceType, SchemaType } from "../../src/data/enumerations";
import { URLStrategy } from "../../src/strategies";
import * as constant from "../../src/strategies/constant";

test("should be a URL", () => {
  const specs: Specs = {
    type: SchemaType.URL,
    nullable: false,
    presence: PresenceType.Required,
  };

  randomMock.mockReturnValue(97);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new URLStrategy(specs).draw();
  expect(mockUtils.urlCheck(val!)).toBeTruthy();
});

test("should be nullable", () => {
  const specs: Specs = {
    type: SchemaType.URL,
    nullable: true,
    presence: PresenceType.Required,
  };

  randomMock.mockReturnValue(constant.IS_NULLABLE + 0.05);

  const val = new URLStrategy(specs).draw();
  expect(val).toBeNull();
});

test("should be default", () => {
  const specs: Specs = {
    type: SchemaType.URL,
    nullable: true,
    presence: PresenceType.Required,
    default: "http://example.com",
  };

  randomMock.mockReturnValue(constant.IS_DEFAULT + 0.05);

  const val = new URLStrategy(specs).draw();
  expect(val).toBe(specs.default);
});

test("should be one of", () => {
  const specs: Specs = {
    type: SchemaType.URL,
    nullable: false,
    presence: PresenceType.Required,
    choices: [
      "http://www.example.com",
      "https://jnoi.org",
      "ftp://user:password@text.com/test.txt",
    ],
  };

  const index = 0;
  randomIntInclusiveMock.mockReturnValue(index);

  const val = new URLStrategy(specs).draw();
  expect(val).toBe(specs.choices![index]);
});

test("should respect default max and min limits", () => {
  const defaults = constant.URL_DEFAULTS;
  const specs: Specs = {
    type: SchemaType.URL,
    nullable: false,
    presence: PresenceType.Required,
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
  const specs: Specs = {
    type: SchemaType.URL,
    nullable: false,
    presence: PresenceType.Required,
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
  const specs: Specs = {
    type: SchemaType.URL,
    nullable: false,
    presence: PresenceType.Required,
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
  const specs: Specs = {
    type: SchemaType.URL,
    nullable: false,
    presence: PresenceType.Required,
    length: defaults.min + 1,
  };

  randomIntInclusiveMock.mockImplementation(mockUtils.randIntIncMinEq0Is1OrMax);

  const val = new URLStrategy(specs).draw();
  expect(val?.length).toBe(specs.length);
});
