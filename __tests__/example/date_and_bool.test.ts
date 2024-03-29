jest.unmock("../../src/random");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as rnd from "../../src/random";

import * as yup from "yup";

import { testXTimes } from "../utils";


test("should render date", async () => {
  const TestSchema = yup.object({
    date: yup.date(),
    date_def: yup.date().defined(),
    date_def_null: yup.date().nullable().defined(),
    date_default: yup.date().default(new Date(0)),
    date_min_max: yup.date().min(new Date(5)).max(new Date(10)).required(),
    date_not_one_of: yup
      .date()
      .min(new Date(5))
      .max(new Date(10))
      .notOneOf([new Date(5), new Date(7), new Date(9)]),
    date_not_req: yup.date().notRequired(),
    date_one_of_strict: yup
      .date()
      .oneOf([new Date(1), new Date(2), new Date(3)])
      .strict(),
    date_opt: yup.date().optional(),
    date_req: yup.date().required(),
    date_req_not_null: yup.date().nonNullable().required(),
    date_strict: yup.date().strict(),
    date_strict_false: yup.date().strict(false),
  });
  await testXTimes(TestSchema);
});

test.failing("should render date from oneOf with strict false", async () => {
  const t = yup.date().oneOf([new Date(1), new Date(2), new Date(3)]);
  console.log = jest.fn();
  await testXTimes(t);
});

test("should render bool", async () => {
  const TestSchema = yup.object({
    bool: yup.boolean(),
    bool_def: yup.boolean().defined(),
    bool_def_null: yup.boolean().nullable().defined(),
    bool_default: yup.boolean().default(false),
    bool_is_false: yup.boolean().isFalse(),
    bool_is_true: yup.boolean().isTrue(),
    bool_not_one_of: yup.boolean().notOneOf([false]),
    bool_not_req: yup.boolean().notRequired(),
    bool_one_of: yup.boolean().oneOf([true]),
    bool_opt: yup.boolean().optional(),
    bool_req: yup.boolean().required(),
    bool_req_not_null: yup.boolean().nonNullable().required(),
    bool_strict: yup.boolean().strict(),
    bool_strict_false: yup.boolean().strict(false),
  });
  await testXTimes(TestSchema);
});
