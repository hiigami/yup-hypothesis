/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  randomChoiceMock,
  randomIntInclusiveMock,
  randomMock,
} from "../../jest.setup";

import * as yup from "yup";

import * as mockUtils from "../utils";
import { EmailStrategy } from "../../src/strategies";
import { SchemaType } from "../../src/data/enumerations";

test("should be an email", () => {
  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(2).mockReturnValueOnce(12);
  randomChoiceMock.mockReturnValue("a");

  const val = new EmailStrategy({
    specs: mockUtils.createSpecs({ type: SchemaType.Email }),
    schema: yup.string().email().required(),
  }).draw();

  expect(mockUtils.emailCheck(val!)).toBeTruthy();
});
