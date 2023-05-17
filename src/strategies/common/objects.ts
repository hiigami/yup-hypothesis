import { NOT_DEFINED } from "../../config";
import {
  ConditionalOptions,
  Field,
  Fields,
  IStrategy,
} from "../../data/strategies";
import { UnknownDict } from "../../data/types";
import { ConditionalStrategy } from "../conditional_strategy";
import { ReferenceStrategy } from "../reference_strategy";

type ConditionalMap = Map<string, ConditionalStrategy>;
type ReferenceMap = Map<string, ReferenceStrategy>;

function isConditional(
  name: string,
  field: Field,
  conditionals: ConditionalMap
): boolean {
  if (field instanceof ConditionalStrategy) {
    conditionals.set(name, field);
    return true;
  }
  return false;
}

function isReference(
  name: string,
  field: Field,
  references: ReferenceMap
): boolean {
  if (field instanceof ReferenceStrategy) {
    references.set(name, field);
    return true;
  }
  return false;
}

export function drawFields(
  result: UnknownDict,
  fields: Fields,
  options?: ConditionalOptions
) {
  const conditionals = new Map();
  const references = new Map();
  for (const x in fields) {
    const field = fields[x];
    const conditional = isConditional(x, field, conditionals);
    const reference = isReference(x, field, references);
    if (!conditional && !reference && field?.isDefined()) {
      result[x] = field?.draw(options);
    }
  }
  return { conditionals, references };
}

function setResultFromStrategy(
  key: string,
  result: UnknownDict,
  strategy?: IStrategy,
  options?: ConditionalOptions
): void {
  const value = strategy?.draw({
    parent: result,
    context: options?.context,
  });
  if (value !== NOT_DEFINED) {
    result[key] = value;
  }
}

export function drawConditionals(
  result: UnknownDict,
  conditionals: ConditionalMap,
  options?: ConditionalOptions
): void {
  const resultKeys = Object.keys(result);
  const keys = [...conditionals.keys()];
  while (keys.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const key = keys.shift()!;
    const current = conditionals.get(key);
    const hasDependencies = current
      ?.dependsOn()
      .every((x) => keys.lastIndexOf(x) > -1);
    if (!hasDependencies) {
      setResultFromStrategy(key, result, current, options);
      resultKeys.push(key);
      conditionals.delete(key);
    } else {
      keys.push(key);
    }
  }
}

export function drawReferences(
  result: UnknownDict,
  references: ReferenceMap,
  options?: ConditionalOptions
): void {
  const keys = [...references.entries()]
    .sort((a, b) => {
      if (a[1].isContext) {
        return -1;
      } else if (b[1].isContext) {
        return 1;
      }
      return 0;
    })
    .map((x) => x[0]);
  while (keys.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const key = keys.shift()!;
    const current = references.get(key);
    setResultFromStrategy(key, result, current, options);
    references.delete(key);
  }
}
