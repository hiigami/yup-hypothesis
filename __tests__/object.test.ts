// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as yup from "yup";

import * as rnd from "../src/random";
import { testXTimes } from "./utils";

jest.unmock("../src/random");

const ObjectSchema = yup.object();
const ObjectSchemaWithStringItem = yup.object({ str: yup.string() });

test("should render object", async () => {
  await testXTimes(ObjectSchema, 5);
  await testXTimes(ObjectSchema.required(), 10);
  const TestSchema = ObjectSchema.shape({
    a: yup.string(),
    b: yup.string(),
    c: yup.string(),
    d: yup.string(),
    f: yup.string(),
  });
  await testXTimes(TestSchema.omit(["c", "b"]));
  await testXTimes(TestSchema.pick(["a", "c", "b"]));
  await testXTimes(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    TestSchema.from("a", "A", true).from("f", "fff").from("c", "d")
  );
  await testXTimes(ObjectSchemaWithStringItem.unknown());
  await testXTimes(ObjectSchemaWithStringItem.noUnknown());
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
    obj_constant_case: yup
      .object({
        str_sub_3: yup.string(),
        strSub4: yup.string(),
      })
      .constantCase(),
    obj_default: ObjectSchemaWithStringItem.default({ str: "a" }),
    obj_not_req: ObjectSchemaWithStringItem.notRequired(),
    obj_null: ObjectSchemaWithStringItem.nullable(),
    obj_one_of: ObjectSchemaWithStringItem.oneOf([{ str: "b" }, { str: "c" }]),
    obj_req_not_null: ObjectSchemaWithStringItem.nullable(false).required(),
    obj_snake_case: yup
      .object({
        str_sub_5: yup.string(),
        strSub6: yup.string(),
      })
      .snakeCase(),
    strip: yup.string().strip(),
  });
  await testXTimes(TestSchema, 200);
});

test("should render object with mutation returning new schema", async () => {
  const tt = yup
    .object()
    .shape({ key: yup.string() })
    .noUnknown()
    .withMutation((_schema) => {
      return yup.object().shape({ a: yup.number() }).noUnknown();
    });
  await testXTimes(tt, 200);
});

test("should render object with mutation returning same schema", async () => {
  const tt = yup
    .object()
    .shape({ key: yup.string() })
    .noUnknown()
    .withMutation((schema) => {
      return schema.shape({ a: yup.number() }).noUnknown();
    });
  await testXTimes(tt, 200);
});
