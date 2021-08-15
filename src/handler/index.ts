import { Specs } from "../data";
import { PresenceType, SchemaType } from "../data/enumerations";
import { random } from "../random";
import * as strategies from "../strategies";

export interface Handler {
  canHandle(t: any): boolean;
  handle(specs: Specs): any;
}

const mapper = new Map<SchemaType, strategies.StrategyConstructor>([
  [SchemaType.Boolean, strategies.BooleanStrategy],
  [SchemaType.Date, strategies.DateStrategy],
  [SchemaType.Email, strategies.EmailStrategy],
  [SchemaType.Float, strategies.FloatStrategy],
  [SchemaType.Number, strategies.NumberStrategy],
  [SchemaType.String, strategies.StringStrategy],
  [SchemaType.URL, strategies.URLStrategy],
  [SchemaType.UUID, strategies.UUIDStrategy],
]);

export class FieldHandler {
  canHandle(presence: PresenceType): boolean {
    const isOptional = presence === PresenceType.Optional;
    if (isOptional) {
      return random() > 0.3;
    }
    return true;
  }
  handle(specs: Specs): any {
    if (mapper.has(specs.type)) {
      const strategy = mapper.get(specs.type)!;
      return new strategy(specs).draw();
    }
    return undefined;
  }
}
