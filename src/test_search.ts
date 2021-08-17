import { Test } from "yup/lib/util/createValidation";
import { TestName, TestParameter } from "./data/enumerations";

type ExtraParams = Record<string, unknown>;
type Mapper = Map<string, Map<string, unknown>>;

export interface ITestSearch {
  has(name: string): boolean;
  getParameter<T>(name: TestParameter, testName?: TestName): T | undefined;
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

  private _mapValues(tests: Test[]): Mapper {
    const mapper = new Map();
    for (const test of tests) {
      const option = test.OPTIONS;
      if (!mapper.has(option.name)) {
        mapper.set(option.name, new Map());
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this._setParams(mapper.get(option.name)!, option.params);
    }
    return mapper;
  }

  has(name: string): boolean {
    return this.mapper.has(name);
  }

  getParameter<T>(name: TestParameter, testName?: TestName): T | undefined {
    const params = this.mapper.get(testName ?? name);
    if (params === undefined) {
      return undefined;
    }
    return params.has(name) ? (params.get(name) as T) : undefined;
  }
}
