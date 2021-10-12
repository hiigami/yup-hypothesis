import * as yup from "yup";

import { createSpecs } from "../../utils";

import { NOT_DEFINED } from "../../../src/config";
import { UnknownDict } from "../../../src/data/types";
import { ConditionalStrategy } from "../../../src/strategies";
import { objects } from "../../../src/strategies/common";
import { ConditionOptions } from "yup/lib/Condition";

const createConditionalStrategy = (
  keys: string | string[],
  options: ConditionOptions<yup.AnySchema>
) =>
  new ConditionalStrategy({
    specs: createSpecs(),
    schema: yup.string().when(keys, options),
  });

const options = { context: { t: true } };
const conditionalStrategy = createConditionalStrategy("k2.k2_2", {
  is: true,
  then: yup.string().required(),
  otherwise: yup.string().nullable(true),
});

const createDummyField = (drawValue: unknown, isDefined = true) => ({
  isDefined: jest.fn(() => isDefined),
  draw: jest.fn((_args?: UnknownDict) => drawValue),
});

test("should draw fields", () => {
  const result = {};
  const fields = {
    tmp1: createDummyField(1),
    tmp2: createDummyField(2, false),
    tmp3: conditionalStrategy,
  };
  const conditionals = objects.drawFields(result, fields, options);

  expect(fields.tmp1.isDefined).toHaveBeenCalled();
  expect(fields.tmp1.draw).toHaveBeenCalledWith(options);
  expect(fields.tmp2.isDefined).toHaveBeenCalled();
  expect(fields.tmp2.draw).not.toHaveBeenCalled();
  expect(result).toEqual({ tmp1: 1 });
  expect(conditionals.size).toEqual(1);
  expect(conditionals.get("tmp3")).toEqual(conditionalStrategy);
});

test("should draw conditional fields", () => {
  const conditionalStrategy2 = createConditionalStrategy("k2.k2_1", {
    is: false,
    then: yup.string().lowercase(),
    otherwise: yup.string().uppercase(),
  });

  conditionalStrategy2.draw = jest.fn((_args?: UnknownDict) => NOT_DEFINED);
  const result = { k1: 0, k2: { k2_1: true, k2_2: false } };
  conditionalStrategy.draw = jest.fn((_args?: UnknownDict) => "k3");

  objects.drawConditionals(
    result,
    new Map([
      ["k3", conditionalStrategy],
      ["k4", conditionalStrategy2],
    ]),
    options
  );

  const expected = { ...result, k3: "k3" };
  expect(result).toEqual(expected);
  const optionsWithParent = { ...options, parent: result };
  expect(conditionalStrategy.draw).toHaveBeenCalledWith(optionsWithParent);
  optionsWithParent.parent = expected;
  expect(conditionalStrategy2.draw).toHaveBeenCalledWith(optionsWithParent);
});
