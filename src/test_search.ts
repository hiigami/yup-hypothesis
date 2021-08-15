import { Test } from "yup/lib/util/createValidation";

export class TestSearch {
  private tests: Test[];

  constructor(tests: Test[]) {
    this.tests = tests;
  }

  private _find(name: string): Test | undefined {
    return this.tests.find((x) => x.OPTIONS.name === name);
  }

  has(name: string): boolean {
    return this._find(name) !== undefined;
  }

  getParameter(name: string, testName?: string): any {
    const test = this._find(testName ?? name);
    if (test === undefined) {
      return undefined;
    }
    return test.OPTIONS.params ? test.OPTIONS.params[name] : undefined;
  }
}
