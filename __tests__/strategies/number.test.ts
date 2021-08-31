import { randomIntInclusiveMock } from "../../jest.setup";

import { enumerations, specs as dSpecs } from "../../src/data";
import { NumberStrategy } from "../../src/strategies";

test("should respect max and min for number", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.Number,
    nullable: false,
    presence: enumerations.PresenceType.Required,
    sign: enumerations.Sign.Negative,
    max: -5,
    min: -3,
  };

  const expected = 2;
  randomIntInclusiveMock.mockReturnValue(expected);

  const val = new NumberStrategy(specs).draw();
  if (val !== null && val < 0) {
    expect(val).toBe(-expected);
  } else {
    expect(val).toBe(expected);
  }
  expect(randomIntInclusiveMock.mock.calls).toEqual([[specs.max, specs.min]]);
});

test.todo("indifferent with max and min for number");
