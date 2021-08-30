jest.unmock("../src/random");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as rnd from "../src/random";

import * as yup from "yup";
import * as yupObject from "yup/lib/object";
import * as yupTypes from "yup/lib/types";
import yh from "../src/main";

async function testXTimes<
  TShape extends yupObject.ObjectShape,
  TContext,
  TIn extends yupTypes.Maybe<yupObject.TypeOfShape<TShape>>,
  TOut extends yupTypes.Maybe<yupObject.AssertsShape<TShape>>
>(
  schema: yup.ObjectSchema<TShape, TContext, TIn, TOut>,
  nTimes = 50
): Promise<void> {
  for (let index = 0; index < nTimes; index++) {
    const example = yh.example(schema) as yup.InferType<typeof schema>;
    // console.log(example);
    // const r = await schema.validate(example);
    // console.log(r);
    await expect(schema.isValid(example)).resolves.toBeTruthy();
  }
}

test("should render date", async () => {
  const TestSchema = yup.object({
    date: yup.date(),
    date_def: yup.date().defined(),
    date_def_null: yup.date().nullable().defined(),
    date_default: yup.date().default(new Date(0)),
    date_min_max: yup.date().min(new Date(5)).max(new Date(10)).required(),
    date_not_req: yup.date().notRequired(),
    date_one_of: yup.date().oneOf([new Date(1), new Date(2), new Date(3)]),
    date_opt: yup.date().optional(),
    date_req: yup.date().required(),
    date_req_not_null: yup.date().nullable(false).required(),
  });
  await testXTimes(TestSchema);
});

test("should render bool", async () => {
  const TestSchema = yup.object({
    bool: yup.boolean(),
    bool_def: yup.boolean().defined(),
    bool_def_null: yup.boolean().nullable().defined(),
    bool_default: yup.boolean().default(false),
    bool_not_req: yup.boolean().notRequired(),
    bool_one_of: yup.boolean().oneOf([true]),
    bool_opt: yup.boolean().optional(),
    bool_req: yup.boolean().required(),
    bool_req_not_null: yup.boolean().nullable(false).required(),
  });
  await testXTimes(TestSchema);
});

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
    str_req_not_null: yup.string().nullable(false).required(),
    str_trim: yup.string().trim(),
    str_upper: yup.string().uppercase(),
  });
  await testXTimes(TestSchema);
});

test("should render float", async () => {
  const TestSchema = yup.object({
    float: yup.number(),
    float_def: yup.number().defined(),
    float_def_null: yup.number().nullable().defined(),
    float_default: yup.number().default(0.0001),
    float_min_max: yup.number().min(34.0002).max(34.01),
    float_neg: yup.number().negative(),
    float_not_req: yup.number().notRequired(),
    float_one_of: yup.number().oneOf([0.002, 23.5, 1000]),
    float_opt: yup.number().optional(),
    float_pos: yup.number().positive(),
    float_req: yup.number().required(),
    float_req_not_null: yup.number().nullable(false).required(),
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
