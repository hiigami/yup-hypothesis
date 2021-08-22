import { enumerations, specs as dSpecs } from "../data";
import { random } from "../random";
import * as strategies from "../strategies";

export interface Handler {
  canHandle(t: unknown): boolean;
  handle(specs: dSpecs.Specs): unknown;
}

const mapper = new Map<enumerations.SchemaType, strategies.StrategyConstructor>(
  [
    [enumerations.SchemaType.Boolean, strategies.BooleanStrategy],
    [enumerations.SchemaType.Date, strategies.DateStrategy],
    [enumerations.SchemaType.Email, strategies.EmailStrategy],
    [enumerations.SchemaType.Float, strategies.FloatStrategy],
    [enumerations.SchemaType.Number, strategies.NumberStrategy],
    [enumerations.SchemaType.String, strategies.StringStrategy],
    [enumerations.SchemaType.URL, strategies.URLStrategy],
    [enumerations.SchemaType.UUID, strategies.UUIDStrategy],
  ]
);

export class FieldHandler {
  canHandle(presence: enumerations.PresenceType): boolean {
    const isOptional = presence === enumerations.PresenceType.Optional;
    if (isOptional) {
      return random() > 0.3;
    }
    return true;
  }
  handle(specs: dSpecs.Specs): unknown {
    if (mapper.has(specs.type)) {
      const strategy = mapper.get(specs.type) as strategies.StrategyConstructor;
      return new strategy(specs).draw();
    }
    return undefined;
  }
}
