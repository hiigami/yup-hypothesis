import { Specs } from "../data";
import * as strategies from "../strategies";
import { random } from "../strategies/random";

export class Handler {
  shouldAddField(presence: string): boolean {
    const isOptional = presence === "optional";
    if (isOptional) {
      return random() > 0.3;
    }
    return true;
  }
  draw(specs: Specs): any {
    let strategy;
    switch (specs.type) {
      case "boolean": {
        strategy = new strategies.BooleanStrategy(specs);
        break;
      }
      case "number": {
        strategy = new strategies.NumberStrategy(specs);
        break;
      }
      case "float": {
        strategy = new strategies.FloatStrategy(specs);
        break;
      }
      case "date": {
        strategy = new strategies.DateStrategy(specs);
        break;
      }
      case "email": {
        strategy = new strategies.DateStrategy(specs);
        break;
      }
      default: {
        strategy = new strategies.StringStrategy(specs);
        break;
      }
    }
    return strategy.draw();
  }
}
