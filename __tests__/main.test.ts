jest.unmock("../src/random");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as rnd from "../src/random";

import * as yup from "yup";
import yh from "../src/main";

test("should render all types correctly", async () => {
  const TestSchema = yup.object({
    bool: yup.boolean().required(),
    date: yup.date().required(),
    email: yup.string().email().required(),
    float: yup.number().required(),
    int: yup.number().integer().required(),
    str: yup.string().required(),
    str_upper: yup.string().uppercase().required(),
    str_lower: yup.string().uppercase().required(),
    str_trim: yup.string().trim().required(),
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
