import * as yup from "yup";
import * as yupObject from "yup/lib/object";
import * as yupTypes from "yup/lib/types";
import { Test } from "yup/lib/util/createValidation";

import { Specs } from "./data";
import { Sign } from "./data/enumerations";
import { Handler } from "./handler";

function getTestValue<T>(tests: Test[], name: string): T | undefined {
  const test = tests.find((x) => x.OPTIONS.name === name);
  if (test?.OPTIONS.params) {
    // console.log(test.OPTIONS);
    // console.log(test);
    const val = test.OPTIONS.params[name];
    if (test.OPTIONS.exclusive) {
      if (name === "min") {
        return (Number(val as number) + 1) as unknown as T;
      } else if (name === "max") {
        return (Number(val as Number) - 1) as unknown as T;
      }
    }
    return val as T;
  }
  return undefined;
}

function getSpecs(schema: yup.AnySchema): Specs {
  const tests = schema.tests;
  const lengthTest = tests.find((x) => x.name === "length");
  const validateTests = tests.filter((x) => x.name === "validate");
  const minVal = getTestValue<number>(validateTests, "min");
  const maxVal = getTestValue<number>(validateTests, "max");
  // tests.map((x) => console.log(schema));
  return {
    type: schema.type, // ??? number or float (default is float), email, url, uuid
    length:
      lengthTest !== undefined
        ? (lengthTest.OPTIONS.params?.length as number)
        : undefined,
    min: minVal, // ???
    max: maxVal, // ???
    // email: tests.find((x) => x.name === "email"), // ???
    sign: Sign.Positive, // ???
    choices: schema.describe().oneOf,
    nullable: schema.spec.nullable,
    presence: schema.spec.presence,
  };
}

function example<
  TShape extends yupObject.ObjectShape,
  TContext,
  TIn extends yupTypes.Maybe<yupObject.TypeOfShape<TShape>>,
  TOut extends yupTypes.Maybe<yupObject.AssertsShape<TShape>>
>(
  schema: yup.ObjectSchema<TShape, TContext, TIn, TOut>
): yup.InferType<typeof schema> {
  type objType = yup.InferType<typeof schema>;
  const item = {} as objType;
  const handler = new Handler();
  for (const x in schema.fields) {
    const field = schema.fields[x] as yup.AnySchema;
    const specs = getSpecs(field);
    if (handler.shouldAddField(specs.presence)) {
      // @ts-ignore
      item[x] = handler.draw(specs);
    }
  }
  return item;
}

export default { example };
