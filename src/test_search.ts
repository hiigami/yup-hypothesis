import { Test } from "yup/lib/util/createValidation";
import { enumerations, specs as dSpecs } from "./data";
import * as mutations from "./mutation";

type ExtraParams = Record<string, unknown>;
type Mapper = Map<string, Map<string, unknown>>;
type TestOptions = {
  name?: string;
  message?: unknown;
  test: unknown;
  params?: ExtraParams;
  exclusive?: boolean;
};

export interface ITestSearch {
  has(name: string): boolean;
  getParameter<T>(
    name: enumerations.TestParameter,
    testName?: enumerations.TestName
  ): T | undefined;
  getMutation(
    name: enumerations.TestMutation,
    testName: enumerations.TestName
  ): dSpecs.SpecMutation | undefined;
}

function hasMutation(
  msg: string,
  mutation: enumerations.TestMutation
): boolean {
  if (msg.lastIndexOf(mutation) > -1) {
    return true;
  }
  return false;
}

export class TestSearch {
  private mapper: Mapper;

  constructor(tests: Test[]) {
    this.mapper = this._mapValues(tests);
  }

  private _setParams(mapper: Map<string, unknown>, params?: ExtraParams): void {
    if (params !== undefined) {
      for (const p in params) {
        mapper.set(p, params[p]);
      }
    }
  }
  private _setMutation(
    mapper: Map<string, unknown>,
    options: TestOptions
  ): void {
    if (options.name === enumerations.TestName.StringCase) {
      const msg = (options.message as string).toLowerCase();
      for (const m of [
        enumerations.TestMutation.Upper,
        enumerations.TestMutation.Lower,
      ]) {
        if (hasMutation(msg, m)) {
          mapper.set(m, mutations.mapper.get(m));
        }
      }
    } else if (options.name === enumerations.TestName.Trim) {
      mapper.set(
        enumerations.TestMutation.Trim,
        mutations.mapper.get(enumerations.TestMutation.Trim)
      );
    }
  }

  private _mapValues(tests: Test[]): Mapper {
    const mapper = new Map();
    for (const test of tests) {
      const options = test.OPTIONS;
      if (!mapper.has(options.name)) {
        mapper.set(options.name, new Map());
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const item = mapper.get(options.name)!;
      this._setParams(item, options.params);
      this._setMutation(item, options);
    }
    return mapper;
  }

  has(name: string): boolean {
    return this.mapper.has(name);
  }

  getParameter<T>(
    name: enumerations.TestParameter,
    testName?: enumerations.TestName
  ): T | undefined {
    const params = this.mapper.get(testName ?? name);
    if (params === undefined) {
      return undefined;
    }
    return params.has(name) ? (params.get(name) as T) : undefined;
  }
  getMutation(
    name: enumerations.TestMutation,
    testName: enumerations.TestName
  ): dSpecs.SpecMutation | undefined {
    const params = this.mapper.get(testName);
    if (params === undefined) {
      return undefined;
    }
    return params.get(name.toString()) as dSpecs.SpecMutation;
  }
}
