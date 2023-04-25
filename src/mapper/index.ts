import { SchemaType } from "../data/enumerations";
import { StrategyConstructor } from "../data/strategies";
import * as specs from "../specs";
import * as strategies from "../strategies";

export {
  limitOptionsMapper,
  signMapper,
  stringTypeToTestMapper,
} from "./specs";

export const schemaToSpecMapper = new Map<SchemaType, specs.SpecConstructor>([
  [SchemaType.Array, specs.ArraySpec],
  [SchemaType.Boolean, specs.BooleanSpec],
  [SchemaType.Conditional, specs.ConditionalSpec],
  [SchemaType.Date, specs.DateSpec],
  [SchemaType.Mixed, specs.MixedSpec],
  [SchemaType.Number, specs.NumberSpec],
  [SchemaType.Object, specs.ObjectSpec],
  [SchemaType.String, specs.StringSpec],
  [SchemaType.Tuple, specs.TupleSpec],
]);

export const schemaToStrategyMapper = new Map<SchemaType, StrategyConstructor>([
  [SchemaType.Boolean, strategies.BooleanStrategy],
  [SchemaType.Date, strategies.DateStrategy],
  [SchemaType.Email, strategies.EmailStrategy],
  [SchemaType.Float, strategies.FloatStrategy],
  [SchemaType.Mixed, strategies.MixedStrategy],
  [SchemaType.Number, strategies.NumberStrategy],
  [SchemaType.String, strategies.StringStrategy],
  [SchemaType.URL, strategies.URLStrategy],
  [SchemaType.UUID, strategies.UUIDStrategy],
]);
