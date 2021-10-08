/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  randomChoiceMock,
  randomIntInclusiveMock,
  randomMock,
} from "../../jest.setup";

import * as yup from "yup";

import * as mockUtils from "../utils";

import * as constant from "../../src/config";
import { enumerations } from "../../src/data";
import { URLStrategy } from "../../src/strategies";

test("should be a URL", () => {
  const specs = mockUtils.createSpecs({ type: enumerations.SchemaType.URL });

  randomMock.mockReturnValue(Math.random());
  for (let i = 0; i < constant.URL_SCHEMAS.length; i++) {
    randomChoiceMock
      .mockReturnValue("a")
      .mockReturnValueOnce(constant.URL_SCHEMAS[i]);
    randomIntInclusiveMock.mockReturnValue(i + 1).mockReturnValueOnce(12 + i);

    const val = new URLStrategy({
      specs,
      schema: yup.string().url().required(),
    }).draw();

    expect(mockUtils.urlCheck(val!)).toBeTruthy();

    randomIntInclusiveMock.mockReset();
    randomChoiceMock.mockReset();
  }
});
