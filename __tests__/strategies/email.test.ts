/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  randomChoiceMock,
  randomIntInclusiveMock,
  randomMock,
} from "../../jest.setup";

import * as yup from "yup";

import * as mockUtils from "../utils";
import { enumerations, specs as dSpecs } from "../../src/data";
import { EmailStrategy } from "../../src/strategies";

test("should be an email", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.Email,
    nullable: false,
    presence: enumerations.PresenceType.Required,
  };

  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(2).mockReturnValueOnce(6);
  randomChoiceMock.mockReturnValue("a");

  const val = new EmailStrategy(specs, yup.string().email().required()).draw();
  expect(mockUtils.emailCheck(val!)).toBeTruthy();
});
