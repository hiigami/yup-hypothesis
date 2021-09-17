jest.unmock("../src/random");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as rnd from "../src/random";

import * as yup from "yup";
import { testXTimes } from "./utils";

test("should render float", async () => {
  const TestSchema = yup.object({
    float: yup.number(),
    float_def: yup.number().defined(),
    float_def_null: yup.number().nullable().defined(),
    float_default: yup.number().default(0.0001),
    float_min_max: yup.number().min(34.0002).max(34.01),
    float_more_less: yup.number().moreThan(1.0002).lessThan(1.2),
    float_neg: yup.number().negative(),
    float_not_req: yup.number().notRequired(),
    float_one_of: yup.number().oneOf([0.002, 23.5, 1000]),
    float_opt: yup.number().optional(),
    float_pos: yup.number().positive(),
    float_req: yup.number().required(),
    float_req_not_null: yup.number().nullable(false).required(),
    float_round: yup.number().round("floor"),
    float_truncate: yup.number().truncate(),
  });
  await testXTimes(TestSchema);
});

test("should render integer", async () => {
  const TestSchema = yup.object({
    int: yup.number().integer(),
    int_def: yup.number().integer().defined(),
    int_def_null: yup.number().integer().nullable().defined(),
    int_default: yup.number().integer().default(1),
    int_min_max: yup.number().integer().min(17).max(25),
    int_more_less: yup.number().moreThan(1).lessThan(3),
    int_neg: yup.number().integer().negative(),
    int_not_req: yup.number().integer().notRequired(),
    int_one_of: yup.number().integer().oneOf([1, 2, 3]),
    int_opt: yup.number().integer().optional(),
    int_pos: yup.number().integer().positive(),
    int_req: yup.number().integer().required(),
    int_req_not_null: yup.number().integer().nullable(false).required(),
  });
  await testXTimes(TestSchema);
});
