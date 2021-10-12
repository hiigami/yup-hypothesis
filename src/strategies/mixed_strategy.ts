import { SchemaType } from "../data/enumerations";
import { Specs } from "../data/specs";
import { IStrategy, StrategyConstructor } from "../data/strategies";
import { Maybe } from "../data/types";
import { randomChoice } from "../random";

import { Strategy } from "./strategy";
import { ArrayStrategy, BooleanStrategy, DateStrategy, EmailStrategy } from ".";
import { FloatStrategy, NumberStrategy } from "./number_strategies";
import { StringStrategy } from "./string_strategy";
import { ObjectStrategy } from "./object_strategy";
import { URLStrategy } from "./url_strategy";
import { UUIDStrategy } from "./uuid_strategy";

type dd = [StrategyConstructor, Specs][];
const mapper = new Map<SchemaType, StrategyConstructor>([
  [SchemaType.Array, ArrayStrategy],
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
  private getRandomStrategyStack(): dd {
    const schemaTypes = [...mapper.keys()];
    let exit = false;
    const stack: dd = [];
    while (!exit) {
      const schemaType = randomChoice(schemaTypes);
      const strategy = mapper.get(schemaType) as StrategyConstructor;
      const _specs = { ...this.specs, type: schemaType };
      if (schemaType === SchemaType.Object) {
        _specs.noUnknown = false;
      }
      stack.push([strategy, _specs]);
      if (schemaType !== SchemaType.Array) {
        exit = true;
      }
    }
    return stack;
  }
  private getFinalStrategy(stack: dd): Maybe<IStrategy> {
    let element;
    while (stack.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const [s, sc] = stack.pop()!;
      if (element) {
        element = new s({
          specs: { ...sc, max: 20 },
          schema: this.schema,
          element: element,
        });
      } else {
        element = new s({ specs: sc, schema: this.schema });
      }
    }
    return element;
  }
  protected _draw(): unknown {
    const stack = this.getRandomStrategyStack();
    const strategy = this.getFinalStrategy(stack);
    return strategy?.draw();
  }
}
