import * as yup from "yup";

import { NOT_DEFINED } from "../../../src/config";
import { PresenceType } from "../../../src/data/enumerations";
import { UnknownDict } from "../../../src/data/types";
import { ConditionalStrategy } from "../../../src/strategies";
import { ReferenceStrategy } from "../../../src/strategies";
import { objects } from "../../../src/strategies/common";
import { createSpecs } from "../../utils";

type ConditionOptions = Parameters<yup.AnySchema["when"]>[1];

const createConditionalStrategy = (
  keys: string | string[],
  options: ConditionOptions
) =>
  new ConditionalStrategy({
    specs: createSpecs(),
    schema: yup.string().when(keys, options),
  });

const options = { context: { t: true } };
const conditionalStrategy = createConditionalStrategy("k2.k2_2", {
  is: true,
  then: (_schema) => yup.string().required(),
  otherwise: (_schema) => yup.string().nullable(),
});

const referenceStrategies = [
  new ReferenceStrategy({ path: "foo.bar", isContext: false }),
  new ReferenceStrategy({ path: "x[1].z", isContext: false }),
];

const createDummyField = (drawValue: unknown, isDefined = true) => ({
  getPresence: () => PresenceType.Defined,
  isDefined: jest.fn(() => isDefined),
  draw: jest.fn((_args?: UnknownDict) => drawValue),
});

test("should draw fields", () => {
  const result = {};
  const fields = {
    tmp1: createDummyField(1),
    tmp2: createDummyField(2, false),
    tmp3: conditionalStrategy,
    tmp4: referenceStrategies[0],
    tmp5: referenceStrategies[1],
  };
  const { conditionals, references } = objects.drawFields(
    result,
    fields,
    options
  );

  expect(fields.tmp1.isDefined).toHaveBeenCalled();
  expect(fields.tmp1.draw).toHaveBeenCalled();
  expect(fields.tmp2.isDefined).toHaveBeenCalled();
  expect(fields.tmp2.draw).not.toHaveBeenCalled();
  expect(result).toEqual({ tmp1: 1 });
  expect(conditionals.size).toEqual(1);
  expect(conditionals.get("tmp3")).toEqual(conditionalStrategy);
  expect(references.size).toEqual(2);
  expect(references.get("tmp4")).toEqual(referenceStrategies[0]);
  expect(references.get("tmp5")).toEqual(referenceStrategies[1]);
});

test("should draw conditional fields", () => {
  const conditionalStrategy2 = createConditionalStrategy("k2.k2_1", {
    is: false,
    then: (_schema) => yup.string().lowercase(),
    otherwise: (_schema) => yup.string().uppercase(),
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

test("should draw reference fields", () => {
  const ref = new ReferenceStrategy({ path: "t", isContext: true });
  const ref2 = new ReferenceStrategy({ path: "t", isContext: true });
  ref2.draw = jest.fn((_args?: UnknownDict) => "mock");
  const result = {
    foo: { bar: true },
    x: [{ z: 0 }, { z: 2 }],
  };

  objects.drawReferences(
    result,
    new Map([
      ["r3", referenceStrategies[0]],
      ["r4", referenceStrategies[1]],
      ["r5", ref],
      ["r6", ref2],
    ]),
    options
  );

  const expected = { ...result, r5: true, r6: "mock", r3: true, r4: 2 };
  expect(result).toEqual(expected);
  const optionsWithParent = { ...options, parent: result };
  expect(ref2.draw).toHaveBeenCalledWith(optionsWithParent);
});
