import { randomIntInclusiveMock, randomMock } from "../../jest.setup";

import * as yup from "yup";

import { enumerations, specs as dSpecs } from "../../src/data";
import { DateStrategy } from "../../src/strategies";

const specs: dSpecs.Specs = {
  type: enumerations.SchemaType.Date,
  nullable: false,
  presence: enumerations.PresenceType.Required,
};
const schema = yup.date().required();

test("should be date", () => {
  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new DateStrategy(specs, schema).draw();

  expect(val).toBeInstanceOf(Date);
});

test("should respect max and min", () => {
  const expected = new Date(7);
  randomIntInclusiveMock.mockReturnValue(expected.getTime());

  const minDate = new Date(4).getTime();
  const maxDate = new Date(10).getTime();

  const val = new DateStrategy(
    { ...specs, min: minDate, max: maxDate },
    schema.required().min(minDate).max(maxDate)
  ).draw();

  expect(val?.toISOString()).toBe(expected.toISOString());
  expect(randomIntInclusiveMock.mock.calls).toEqual([[maxDate, minDate]]);
});
