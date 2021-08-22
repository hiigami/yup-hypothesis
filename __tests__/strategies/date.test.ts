import { randomIntInclusiveMock, randomMock } from "../../jest.setup";

import { enumerations, specs as dSpecs } from "../../src/data";
import { DateStrategy } from "../../src/strategies";

test("should be date", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.Date,
    nullable: false,
    presence: enumerations.PresenceType.Required,
  };

  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new DateStrategy(specs).draw();
  expect(val).toBeInstanceOf(Date);
});

test("should respect max and min", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.Date,
    nullable: false,
    presence: enumerations.PresenceType.Required,
    min: new Date(4).getTime(),
    max: new Date(10).getTime(),
  };

  const expected = new Date(7);
  randomIntInclusiveMock.mockReturnValue(expected.getTime());

  const val = new DateStrategy(specs).draw();
  expect(val?.toISOString()).toBe(expected.toISOString());
  expect(randomIntInclusiveMock.mock.calls).toEqual([[specs.max, specs.min]]);
});
