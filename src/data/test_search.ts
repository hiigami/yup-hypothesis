import { TestParameter, TestName } from "./enumerations";
import { Maybe } from "./types";

export interface ITestSearch {
  has(name: string): boolean;
  getParameter<T>(name: TestParameter, testName?: TestName): Maybe<T>;
}
