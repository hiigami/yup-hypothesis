import { random, randomChoice, randomIntInclusive } from "./src/random";

jest.mock("./src/random");

const randomMock = random as jest.MockedFunction<typeof random>;
const randomChoiceMock = randomChoice as jest.MockedFunction<
  typeof randomChoice
>;
const randomIntInclusiveMock = randomIntInclusive as jest.MockedFunction<
  typeof randomIntInclusive
>;

beforeEach(() => {
  randomMock.mockReset();
  randomChoiceMock.mockReset();
  randomIntInclusiveMock.mockReset();
});

export { randomMock, randomChoiceMock, randomIntInclusiveMock };
