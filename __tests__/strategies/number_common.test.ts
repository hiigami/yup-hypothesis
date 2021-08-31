import { randomIntInclusiveMock, randomMock } from "../../jest.setup";

import { enumerations } from "../../src/data";
import { FloatStrategy, NumberStrategy } from "../../src/strategies";
import * as constant from "../../src/strategies/constant";

test.each([
  {
    specs: {
      type: enumerations.SchemaType.Number,
      nullable: false,
      presence: enumerations.PresenceType.Required,
    },
    strategy: NumberStrategy,
    check: (x: number) => Number.isInteger(x),
  },
  {
    specs: {
      type: enumerations.SchemaType.Float,
      nullable: false,
      presence: enumerations.PresenceType.Required,
    },
    strategy: FloatStrategy,
    check: (x: number) => !Number.isInteger(x),
  },
])("should be $specs.type", ({ specs, strategy, check }) => {
  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new strategy(specs).draw();
  expect(typeof val === "number").toBeTruthy();
  expect(check(val as number)).toBeTruthy();
});

test.each([
  {
    specs: {
      type: enumerations.SchemaType.Number,
      nullable: false,
      presence: enumerations.PresenceType.Required,
      sign: enumerations.Sign.Negative,
    },
    strategy: NumberStrategy,
    check: (x: number) => expect(x).toBeLessThan(0),
  },
  {
    specs: {
      type: enumerations.SchemaType.Number,
      nullable: false,
      presence: enumerations.PresenceType.Required,
      sign: enumerations.Sign.Positive,
    },
    strategy: NumberStrategy,
    check: (x: number) => expect(x).toBeGreaterThan(0),
  },
  {
    specs: {
      type: enumerations.SchemaType.Float,
      nullable: false,
      presence: enumerations.PresenceType.Required,
      sign: enumerations.Sign.Negative,
    },
    strategy: FloatStrategy,
    check: (x: number) => expect(x).toBeLessThan(0),
  },
  {
    specs: {
      type: enumerations.SchemaType.Float,
      nullable: false,
      presence: enumerations.PresenceType.Required,
      sign: enumerations.Sign.Positive,
    },
    strategy: FloatStrategy,
    check: (x: number) => expect(x).toBeGreaterThan(0),
  },
])("should $specs.type have sign $specs.sign", ({ specs, strategy, check }) => {
  randomIntInclusiveMock.mockReturnValue(1);
  const val = new strategy(specs).draw();
  check(val as number);
});

test.each([
  {
    specs: {
      type: enumerations.SchemaType.Number,
      nullable: false,
      presence: enumerations.PresenceType.Required,
      sign: enumerations.Sign.Indifferent,
    },
    name: "negative",
    strategy: NumberStrategy,
    randVal: constant.SIGN_CHANGE + 0.05,
    randIntVal: 1,
    check: (x: number) => expect(x).toBeLessThan(0),
  },
  {
    specs: {
      type: enumerations.SchemaType.Number,
      nullable: false,
      presence: enumerations.PresenceType.Required,
      sign: enumerations.Sign.Indifferent,
    },
    name: "positive",
    strategy: NumberStrategy,
    randVal: constant.SIGN_CHANGE - 0.05,
    randIntVal: 1,
    check: (x: number) => expect(x).toBeGreaterThan(0),
  },
  {
    specs: {
      type: enumerations.SchemaType.Float,
      nullable: false,
      presence: enumerations.PresenceType.Required,
      sign: enumerations.Sign.Indifferent,
    },
    name: "negative",
    strategy: FloatStrategy,
    randVal: constant.SIGN_CHANGE + 0.05,
    randIntVal: 1,
    check: (x: number) => expect(x).toBeLessThan(0),
  },
  {
    specs: {
      type: enumerations.SchemaType.Float,
      nullable: false,
      presence: enumerations.PresenceType.Required,
      sign: enumerations.Sign.Indifferent,
    },
    name: "positive",
    strategy: FloatStrategy,
    randVal: constant.SIGN_CHANGE - 0.05,
    randIntVal: 1,
    check: (x: number) => expect(x).toBeGreaterThan(0),
  },
])(
  "should $specs.type be $name with indifferent sign",
  ({ specs, randVal, randIntVal, check }) => {
    randomMock.mockReturnValue(randVal);
    randomIntInclusiveMock.mockReturnValue(randIntVal);

    const val = new NumberStrategy(specs).draw();
    check(val as number);
  }
);
