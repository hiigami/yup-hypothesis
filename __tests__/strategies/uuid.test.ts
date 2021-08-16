/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { randomIntInclusiveMock, randomMock } from "../../jest.setup";
import { uuidCheck } from "../utils";

import { Specs } from "../../src/data";
import { PresenceType, SchemaType } from "../../src/data/enumerations";
import { UUIDStrategy } from "../../src/strategies";
import * as constant from "../../src/strategies/constant";

test("should be uuid", () => {
  const specs: Specs = {
    type: SchemaType.UUID,
    nullable: false,
    presence: PresenceType.Required,
  };

  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new UUIDStrategy(specs).draw();
  expect(uuidCheck(val!)).toBeTruthy();
});

test("should be nullable", () => {
  const specs: Specs = {
    type: SchemaType.UUID,
    nullable: true,
    presence: PresenceType.Required,
  };

  randomMock.mockReturnValue(constant.IS_NULLABLE + 0.05);

  const val = new UUIDStrategy(specs).draw();
  expect(val).toBeNull();
});

test("should be default", () => {
  const specs: Specs = {
    type: SchemaType.UUID,
    nullable: true,
    presence: PresenceType.Required,
    default: false,
  };

  randomMock.mockReturnValue(constant.IS_DEFAULT + 0.05);

  const val = new UUIDStrategy(specs).draw();
  expect(val).toBe(specs.default);
});

test("should be one of", () => {
  const specs: Specs = {
    type: SchemaType.UUID,
    nullable: false,
    presence: PresenceType.Required,
    choices: [
      "caf68ea4-bf67-4cb3-a53c-5fe5c3265678",
      "3faff19d-806a-438d-a8a9-ff611dc17aff",
      "13cf3787-fc1d-4cc6-9319-e9cf0bf481ad",
    ],
  };

  const index = 0;
  randomIntInclusiveMock.mockReturnValue(index);

  const val = new UUIDStrategy(specs).draw();
  expect(val).toBe(specs.choices![index]);
});
