import {
  SchemaType,
  Sign,
  TestName,
  TestParameter,
} from "../data/enumerations";
import { SignMapperItem, LimitOption } from "../data/specs";

function isPositiveByMin(min?: number): boolean {
  return min !== undefined && min >= 0;
}

function isNegativeByMax(max?: number): boolean {
  return max !== undefined && max <= 0;
}

export function createLimitOption(
  param: TestParameter,
  offset = 0,
  test?: TestName
): Readonly<LimitOption> {
  return Object.freeze({
    param,
    test,
    offset,
  });
}

function createSignMapperItem(sign: Sign): Readonly<SignMapperItem> {
  return Object.freeze({
    sign,
    fn: sign === Sign.Positive ? isPositiveByMin : isNegativeByMax,
  });
}

export const limitOptionsMapper = new Map([
  [
    "min",
    Object.freeze([
      createLimitOption(TestParameter.Min),
      createLimitOption(TestParameter.More, +1, TestName.Min),
    ]),
  ],
  [
    "max",
    Object.freeze([
      createLimitOption(TestParameter.Max),
      createLimitOption(TestParameter.Less, -1, TestName.Max),
    ]),
  ],
]);

export const signMapper = new Map([
  ["min", createSignMapperItem(Sign.Positive)],
  ["max", createSignMapperItem(Sign.Negative)],
]);

export const stringTypeToTestMapper = new Map<TestName, SchemaType>([
  [TestName.Email, SchemaType.Email],
  [TestName.URL, SchemaType.URL],
  [TestName.UUID, SchemaType.UUID],
]);
