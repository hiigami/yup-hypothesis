jest.unmock("../src/random");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as rnd from "../src/random";

import * as yup from "yup";
import yh from "../src/main";

test("should render all types correctly", async () => {
  const TestSchema = yup.object({
    bool: yup.boolean().required(),
    date: yup.date().required(),
    date_min_max: yup.date().min(new Date(5)).max(new Date(10)).required(),
    email: yup.string().email().required(),
    float: yup.number().required(),
    float_positive: yup.number().positive().required(),
    float_min_max: yup.number().min(34).max(120).optional(),
    int: yup.number().integer().required(),
    int_min_max: yup.number().integer().min(6).max(30).optional(),
    int_negative: yup.number().integer().negative().required(),
    str: yup.string().required(),
    str_default: yup.string().default("abc"),
    str_ensure: yup.string().ensure(),
    str_min_upper: yup.string().min(4).uppercase().required(),
    str_max_lower: yup.string().max(145).lowercase().required(),
    str_not_req: yup.string().notRequired(),
    str_one_of: yup.string().oneOf(["a", "b", "c"]).required(),
    str_trim: yup.string().trim().optional(),
    url: yup.string().url().required(),
    uuid: yup.string().uuid().required(),
  });

  const example = yh.example(TestSchema) as yup.InferType<typeof TestSchema>;
  await expect(TestSchema.isValid(example)).resolves.toBeTruthy();
});

test("should have valid email and url", async () => {
  for (let index = 0; index < 250; index++) {
    const TestSchema = yup.object({
      email: yup.string().email().required(),
      url: yup.string().url().required(),
    });

    const example = yh.example(TestSchema) as yup.InferType<typeof TestSchema>;
    await expect(TestSchema.validate(example)).resolves.toEqual(example);
  }
});
