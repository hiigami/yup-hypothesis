jest.unmock("../src/random");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as rnd from "../src/random";

import * as yup from "yup";
import yh from "../src/main";

async function testXTimes(schema: yup.AnySchema, nTimes = 50): Promise<void> {
  for (let index = 0; index < nTimes; index++) {
    const example = yh.example(schema) as yup.InferType<typeof schema>;
    // const a = await schema.isValid(example);
    // if (!a) {
    //   console.log(example);
    //   const r = await schema.validate(example);
    //   console.log(r);
    // }
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

test("should render nested objects", async () => {
  const TestSchema = yup.object({
    str: yup.string(),
    nested: yup
      .object({
        int: yup.number().integer().positive(),
        uuid: yup.string().uuid(),
        nested: yup
          .object({
            float: yup.number(),
            date: yup.date(),
            nested: yup
              .object({
                bool: yup.boolean(),
              })
              .required(),
          })
          .optional(),
      })
      .defined(),
    obj_camel_case: yup
      .object({
        str_sub_1: yup.string(),
        strSub2: yup.string(),
      })
      .camelCase(),
    obj_default: yup.object({ str: yup.string() }).default({ str: "a" }),
    obj_not_req: yup.object({ str: yup.string() }).notRequired(),
    obj_null: yup.object({ str: yup.string() }).nullable(),
    obj_one_of: yup
      .object({ str: yup.string() })
      .oneOf([{ str: "b" }, { str: "c" }]),
    obj_req_not_null: yup
      .object({ str: yup.string() })
      .nullable(false)
      .required(),
    obj_snake_case: yup
      .object({
        str_sub_3: yup.string(),
        strSub4: yup.string(),
      })
      .snakeCase(),
  });
  await testXTimes(TestSchema, 200);
});

test("should render an array", async () => {
  const SubSchema = yup.array(yup.number().required()).min(2).max(5);
  const TestSchema = yup.object({
    email: yup.string().required(),
    sub: SubSchema,
  });
  await testXTimes(TestSchema);
  await testXTimes(SubSchema);
});
