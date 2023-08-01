import { ArrayStrategy, BooleanStrategy, DateStrategy, EmailStrategy } from ".";
import { SchemaType } from "../data/enumerations";
import { Specs } from "../data/specs";
import {
  IStrategy,
  StrategyArgs,
  StrategyConstructor,
} from "../data/strategies";
import { Maybe } from "../data/types";
import { randomChoice } from "../random";
import { FloatStrategy, NumberStrategy } from "./number_strategies";
import { ObjectStrategy } from "./object_strategy";
import { Strategy } from "./strategy";
import { StringStrategy } from "./string_strategy";
import { URLStrategy } from "./url_strategy";
import { UUIDStrategy } from "./uuid_strategy";

type StrategiesStack = [StrategyConstructor, Specs][];

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
  private getRandomStrategyStack(): StrategiesStack {
    const schemaTypes = [...mapper.keys()];
    let exit = false;
    const stack: StrategiesStack = [];
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
  private getFinalStrategy(stack: StrategiesStack): Maybe<IStrategy> {
    let element;
    while (stack.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const [strategy, specs] = stack.pop()!;
      const strategyArgs: StrategyArgs<typeof specs> = {
        specs: specs,
        schema: this.schema,
      };
      if (element) {
        strategyArgs.specs.max = 20;
        strategyArgs.element = element;
      }
      element = new strategy(strategyArgs, this.drawableMapper);
    }
    return element;
  }
  protected _draw(): unknown {
    const stack = this.getRandomStrategyStack();
    const strategy = this.getFinalStrategy(stack);
    return strategy?.draw();
  }
}
