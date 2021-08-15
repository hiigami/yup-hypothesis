import { random, randomIntInclusive } from "./src/random";

jest.mock("./src/random");

const randomMock = random as jest.MockedFunction<typeof random>;
const randomIntInclusiveMock = randomIntInclusive as jest.MockedFunction<
  typeof randomIntInclusive
>;

beforeEach(() => {
  randomMock.mockReset();
  randomIntInclusiveMock.mockReset();
});

export { randomMock, randomIntInclusiveMock };
