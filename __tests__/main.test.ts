jest.unmock("../src/random");

import * as yup from "yup";
import yh from "../src/main";

import * as mockUtils from "./utils";

test("should succeed required happy path", () => {
  const TestSchema = yup.object({
    bool: yup.boolean().required(),
    date: yup.date().required(),
    email: yup.string().email().required(),
    float: yup.number().required(),
    int: yup.number().integer().required(),
    str: yup.string().required(),
    url: yup.string().url().required(),
    uuid: yup.string().uuid().required(),
  });

  const example = yh.example(TestSchema) as yup.InferType<typeof TestSchema>;
  expect(typeof example.bool).toEqual("boolean");
  expect(example.date).toBeInstanceOf(Date);
  expect(mockUtils.emailCheck(example.email)).toBeTruthy();
  expect(!Number.isInteger(example.float)).toBeTruthy();
  expect(Number.isInteger(example.int)).toBeTruthy();
  expect(typeof example.str).toEqual("string");
  expect(mockUtils.urlCheck(example.url)).toBeTruthy();
  expect(mockUtils.uuidCheck(example.uuid)).toBeTruthy();
});
