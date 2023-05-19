import { ConditionalOptions, Field } from "../../data/strategies";

export function getValue(field: Field, options?: ConditionalOptions) {
  if (field?.isDefined()) {
    return field?.draw(options);
  }
  return undefined;
}
