import { AnySchema, InferType } from "yup";

import yh from "../../src/main";
import { enumerations, types, specs } from "../../src/data";
import { createConstrain } from "../../src/common";
import { Constrain } from "../../src/data/constrains";
import { UnknownDict } from "../../src/data/types";
import { SpecMutation } from "../../src/data/specs";

export type CheckFn<T> = (value: T) => void;

export async function testXTimes(
  schema: AnySchema,
  nTimes = 50,
  context?: types.UnknownDict
): Promise<void> {
  for (let index = 0; index < nTimes; index++) {
    const example = yh.example(schema, context) as InferType<typeof schema>;
    const a = await schema.isValid(example, { context });
    if (!a) {
      console.log(`context: ${JSON.stringify(context)}`);
      console.log(`example: ${JSON.stringify(example)}`);
      const r = await schema.validate(example);
      console.log(r);
    }
    await expect(schema.isValid(example, { context })).resolves.toBeTruthy();
  }
}

export function addDecimals(n: number, precision: number): number {
  let zeros: number[] = [];
  zeros.length = precision - 1;
  zeros = zeros.fill(0);
  return Number(`0.${zeros.join("")}${n}`);
}

export function uuidCheck(val: string): boolean {
  return /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/g.test(
    val
  );
}

export function emailCheck(val: string): boolean {
  // eslint-disable-next-line no-control-regex
  return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g.test(
    val
  );
}

export function urlCheck(val: string): boolean {
  // eslint-disable-next-line no-control-regex,no-useless-escape
  return /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/.test(
    val
  );
}

export function randIntIncMinEq0Is1OrMax(max: number, min?: number): number {
  if (min === 0) {
    return 1;
  }
  return max;
}

export function randIntIncMaxEqDefaultAndMinEq0Is1OrMax(maxDefault: number) {
  return (max: number, min?: number): number => {
    if (max === maxDefault) {
      if (min === 0) {
        return 1;
      }
    }
    return max;
  };
}

export const createSpecs = (args?: {
  type?: enumerations.SchemaType;
  presence?: enumerations.PresenceType;
  sign?: enumerations.Sign;
  strict?: boolean;
  nullable?: boolean;
  min?: number;
  max?: number;
  length?: number;
  default?: unknown;
  exclude?: Set<unknown>;
  choices?: Array<unknown>,
  mutations?: SpecMutation<AnySchema>[]
}): specs.Specs => ({
  type: args?.type || enumerations.SchemaType.String,
  nullable: args?.nullable || false,
  presence: args?.presence || enumerations.PresenceType.Required,
  sign: args?.sign,
  min: args?.min,
  max: args?.max,
  length: args?.length,
  strict: args?.strict,
  exclude: args?.exclude || new Set(),
  choices: args?.choices || [],
  mutations: args?.mutations || [],
  default: args?.default
});

interface TestItemArgs extends UnknownDict {
  constrain?: Constrain;
  specs?: Partial<specs.Specs>;
}

interface TestItem extends TestItemArgs {
  specs: specs.Specs;
}

export const createTestItem = (args: TestItemArgs): TestItem => ({
  ...args,
  specs: createSpecs(args.specs),
  constrain:
    args.constrain === undefined
      ? undefined
      : createConstrain(args.constrain?.min, args.constrain?.max),
});
