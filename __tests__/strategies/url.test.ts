/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  randomChoiceMock,
  randomIntInclusiveMock,
  randomMock,
} from "../../jest.setup";

import * as yup from "yup";

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

  randomMock.mockReturnValue(Math.random());
  for (let i = 0; i < constant.URL_SCHEMAS.length; i++) {
    randomChoiceMock
      .mockReturnValue("a")
      .mockReturnValueOnce(constant.URL_SCHEMAS[i]);
    randomIntInclusiveMock.mockReturnValue(i + 1).mockReturnValueOnce(12 + i);

    const val = new URLStrategy(specs, yup.string().url().required()).draw();

    expect(mockUtils.urlCheck(val!)).toBeTruthy();

    randomIntInclusiveMock.mockReset();
    randomChoiceMock.mockReset();
  }
});
