jest.unmock("../src/random");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as rnd from "../src/random";

import * as yup from "yup";

import { testXTimes } from "./utils";


test("should render string", async () => {
  const TestSchema = yup.object({
    str: yup.string(),
    str_def: yup.string().defined(),
    str_def_null: yup.string().nullable().defined(),
    str_default: yup.string().default("abc"),
    str_ensure: yup.string().ensure(),
    str_lower: yup.string().lowercase(),
    str_min_max: yup.string().min(4).max(145),
    str_not_req: yup.string().notRequired(),
    str_one_of: yup.string().oneOf(["a", "b", "c"]),
    str_opt: yup.string().optional(),
    str_req: yup.string().required(),
    str_req_not_null: yup.string().nonNullable().required(),
    str_strict: yup.string().strict(),
    str_strict_false: yup.string().strict(false),
    str_trim: yup.string().trim(),
    str_upper: yup.string().uppercase(),
  });
  await testXTimes(TestSchema);
});

test("should render string when concat", async () => {
  const TestSchema = yup
    .string()
    .oneOf(["q", "1"])
    .concat(yup.string().oneOf(["e"]));
  await testXTimes(TestSchema);
});

test("should render uuid", async () => {
  const TestSchema = yup.object({
    uuid: yup.string().uuid().required(),
  });
  await testXTimes(TestSchema);
});

test("should render an email", async () => {
  const TestSchema = yup.object({
    email: yup.string().email().required(),
  });
  await testXTimes(TestSchema, 250);
});

test("should render a url", async () => {
  const TestSchema = yup.object({
    url: yup.string().url().required(),
  });
  await testXTimes(TestSchema, 250);
});
