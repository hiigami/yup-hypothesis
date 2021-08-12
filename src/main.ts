import * as yup from "yup";
import * as yupObject from "yup/lib/object";
import * as yupTypes from "yup/lib/types";
import { Test } from "yup/lib/util/createValidation";
import * as faker from "faker";

interface Restrictions {
  type: string;
  email: any;
  length: number | undefined;
  min: number | undefined;
  max: number | undefined;
  choices: Array<any>;
  nullable: boolean;
  presence: string;
}

function oneOf<T>(choices: Array<T>): T {
  const index = randomInt(choices.length - 1);
  return Array.from(choices)[index];
}

function randomInt(high: number, low = 0) {
  return Math.floor(Math.random() * (high - low + 1) + low);
}

function shouldAddField(specs: Restrictions): boolean {
  const isOptional = specs.presence === "optional";
  if (isOptional) {
    return Math.random() > 0.3;
  }
  return true;
}

function shouldReturnNull(isNullable: boolean): boolean {
  if (isNullable) {
    return Math.random() > 0.75;
  }
  return false;
}

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

function getRestrictions(schema: yup.AnySchema): Restrictions {
  const tests = schema.tests;
  const lengthTest = tests.find((x) => x.name === "length");
  const validateTests = tests.filter((x) => x.name === "validate");
  const minVal = getTestValue<number>(validateTests, "min");
  const maxVal = getTestValue<number>(validateTests, "max");
  // console.log(schema.tests);
  return {
    type: schema.type,
    length:
      lengthTest !== undefined
        ? (lengthTest.OPTIONS.params?.length as number)
        : undefined,
    min: minVal,
    max: maxVal,
    email: tests.find((x) => x.name === "email"),
    choices: schema.describe().oneOf,
    nullable: schema.spec.nullable,
    presence: schema.spec.presence,
  };
}

function getRandomValue(specs: Restrictions): any {
  if (specs.choices && specs.choices.length > 0) {
    return oneOf(specs.choices);
  }
  if (shouldReturnNull(specs.nullable)) {
    return null;
  }
  if (specs.type === "string") {
    if (specs.email !== undefined) {
      return faker.internet.email();
    }
    let length = specs.length;
    if (specs.max || specs.min) {
      length = randomInt(specs.max || 255, specs.min || 0);
    }
    return faker.datatype.string(length);
  } else if (specs.type === "boolean") {
    return faker.datatype.boolean();
  } else if (specs.type === "number") {
    return faker.datatype.number({ max: specs.max, min: specs.min });
  } else if (specs.type === "date") {
    return faker.date.past();
  }
  return null;
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
  for (const x in schema.fields) {
    const field = schema.fields[x] as yup.AnySchema;
    const specs = getRestrictions(field);
    if (shouldAddField(specs)) {
      // @ts-ignore
      item[x] = getRandomValue(specs);
    }
  }
  return item;
}

export default { example };
