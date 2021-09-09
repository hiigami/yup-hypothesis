import { Strategy } from "./base_strategies";

export class UUIDStrategy extends Strategy<string> {
  protected _draw(): string {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (x) => {
      const n = parseInt(x, 10);
      return (n ^ (this._random(255, 0) & (15 >> (n / 4)))).toString(16);
    });
  }
}
