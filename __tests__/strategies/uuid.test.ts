/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { randomIntInclusiveMock, randomMock } from "../../jest.setup";

import * as yup from "yup";

import { uuidCheck } from "../utils";

import { enumerations, specs as dSpecs } from "../../src/data";
import { UUIDStrategy } from "../../src/strategies";

test("should be uuid", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.UUID,
    nullable: false,
    presence: enumerations.PresenceType.Required,
  };

  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new UUIDStrategy({
    specs,
    schema: yup.string().uuid().required(),
  }).draw();
  expect(uuidCheck(val!)).toBeTruthy();
});
