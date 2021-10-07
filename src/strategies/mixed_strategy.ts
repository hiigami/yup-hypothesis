import { SchemaType } from "../data/enumerations";
import { StrategyConstructor } from "../data/strategies";
import { randomChoice } from "../random";

import { Strategy } from "./strategy";
import { BooleanStrategy, DateStrategy, EmailStrategy } from ".";
import { FloatStrategy, NumberStrategy } from "./number_strategies";
import { StringStrategy } from "./string_strategy";
import { ObjectStrategy } from "./object_strategy";
import { URLStrategy } from "./url_strategy";
import { UUIDStrategy } from "./uuid_strategy";

const mapper = new Map<SchemaType, StrategyConstructor>([
  /**@todo array strategy */
  [SchemaType.Boolean, BooleanStrategy],
  [SchemaType.Date, DateStrategy],
  [SchemaType.Email, EmailStrategy],
  [SchemaType.Float, FloatStrategy],
  [SchemaType.Number, NumberStrategy],
  [SchemaType.Object, ObjectStrategy],
  [SchemaType.String, StringStrategy],
  [SchemaType.URL, URLStrategy],
  [SchemaType.UUID, UUIDStrategy],
]);

export class MixedStrategy extends Strategy<unknown> {
  protected _draw(): unknown {
    const schemaTypes = [...mapper.keys()];
    const schemaType = randomChoice(schemaTypes);
    const strategy = mapper.get(schemaType) as StrategyConstructor;
    const _specs = { ...this.specs, type: schemaType };
    if (schemaType === SchemaType.Object) {
      _specs.noUnknown = false;
    }
    return new strategy({
      specs: _specs,
      schema: this.schema,
    }).draw();
  }
}
