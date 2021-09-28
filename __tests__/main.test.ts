import Processor from "../src/processor";
const _processor = Processor.getInstance();
type ProcessorType = typeof _processor;

jest.mock("../src/processor");

import { AnySchema } from "yup";

import yh from "../src/main";
import { NOT_DEFINED } from "../src/strategies/constant";

const getInstance = Processor.getInstance as jest.MockedFunction<
  typeof Processor.getInstance
>;

function getMockProcessor(returnValue: unknown) {
  return { run: jest.fn((_schema) => returnValue) } as unknown as ProcessorType;
}

const dummySchema = { type: "1234" } as AnySchema;

beforeAll(() => {
  getInstance.mockReset();
});

test("should return undefined for unhandled schemas", () => {
  const mockProcessor = getMockProcessor(undefined);
  getInstance.mockReturnValue(mockProcessor);
  const val = yh.example(dummySchema);
  expect(val).toEqual(undefined);
});

test("should return undefined when NOT_DEFINED symbol is drawn", () => {
  const mockProcessor = getMockProcessor({
    draw: jest.fn((_options) => NOT_DEFINED),
  });
  getInstance.mockReturnValue(mockProcessor);
  const val = yh.example(dummySchema);
  expect(val).toEqual(undefined);
});
