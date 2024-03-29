jest.unmock("../../../src/random");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as rnd from "../../../src/random";

import { EMAIL_DEFAULTS, URL_DEFAULTS } from "../../../src/config";
import { internet } from "../../../src/strategies/common";

const randEmail = () => ({
  size: rnd.randomIntInclusive(EMAIL_DEFAULTS.max - 1, EMAIL_DEFAULTS.min + 1),
});

test.each([
  { size: EMAIL_DEFAULTS.min },
  { size: EMAIL_DEFAULTS.max },
  randEmail(),
  randEmail(),
  randEmail(),
  randEmail(),
  randEmail(),
  randEmail(),
  randEmail(),
  randEmail(),
  randEmail(),
  randEmail(),
])("should return an email of size: $size", ({ size }) => {
  const val = internet.genEmail(size, EMAIL_DEFAULTS);
  expect(val.length).toEqual(size);
});

const createUrlOptions = (size: number) => {
  return {
    includeUserInfo: size < 12 ? false : Math.random() > 0.5,
    includePath: Math.random() > 0.5,
    includeQuery: Math.random() > 0.5,
    includeFragment: Math.random() > 0.5,
  };
};

const randURL = () => {
  const size = rnd.randomIntInclusive(
    URL_DEFAULTS.max - 1,
    URL_DEFAULTS.min + 1
  );
  return {
    size,
    options: createUrlOptions(size),
  };
};

test.each([
  {
    size: URL_DEFAULTS.min,
    options: {
      includeUserInfo: false,
      includePath: false,
      includeQuery: false,
      includeFragment: false,
    },
  },
  { size: URL_DEFAULTS.max, options: createUrlOptions(URL_DEFAULTS.max) },
  randURL(),
  randURL(),
  randURL(),
  randURL(),
  randURL(),
  randURL(),
  randURL(),
  randURL(),
  randURL(),
  randURL(),
  randURL(),
  randURL(),
  randURL(),
  randURL(),
  randURL(),
  randURL(),
  randURL(),
  randURL(),
  randURL(),
  randURL(),
])("should return an url of size: $size", ({ size, options }) => {
  const val = internet.genUrl(size, URL_DEFAULTS, options);
  expect(val.length).toEqual(size);
  if (options.includeUserInfo) {
    expect(val).toMatch(/.*?:.*?@.*?/);
  }
});
