import { Test } from "yup/lib/util/createValidation";

import { TestParameter, TestName } from "./data/enumerations";
import { ITestSearch } from "./data/test_search";
import { Maybe } from "./data/types";

type ExtraParams = Record<string, unknown>;
type Mapper = Map<string, Map<string, unknown>>;

export class TestSearch implements ITestSearch {
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
      const options = test.OPTIONS;
      if (!mapper.has(options.name)) {
        mapper.set(options.name, new Map());
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const item = mapper.get(options.name)!;
      this._setParams(item, options.params);
    }
    return mapper;
  }
  has(name: string): boolean {
    return this.mapper.has(name);
  }
  getParameter<T>(name: TestParameter, testName?: TestName): Maybe<T> {
    const params = this.mapper.get(testName ?? name);
    if (params === undefined) {
      return undefined;
    }
    return params.has(name) ? (params.get(name) as T) : undefined;
  }
}
