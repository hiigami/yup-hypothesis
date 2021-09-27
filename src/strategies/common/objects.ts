import {
  ConditionalOptions,
  Field,
  Fields,
  IStrategy,
} from "../../data/strategies";
import { UnknownDict } from "../../data/types";
import { ConditionalStrategy } from "../conditional_strategy";
import { NOT_DEFINED } from "../constant";

type ConditionalMap = Map<string, ConditionalStrategy>;

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

export function drawFields(
  result: UnknownDict,
  fields: Fields,
  options?: ConditionalOptions
): ConditionalMap {
  const conditionals = new Map();
  for (const x in fields) {
    const field = fields[x];
    if (!isConditional(x, field, conditionals) && field?.isDefined()) {
      result[x] = field?.draw(options);
    }
  }
  return conditionals;
}

function setResultFromConditional(
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
      setResultFromConditional(key, result, current, options);
      resultKeys.push(key);
      conditionals.delete(key);
    } else {
      keys.push(key);
    }
  }
}
