import { IStrategy } from "../data/strategies";
import { ConditionalOptions } from "../data/strategies";

enum TokenType {
  Attribute,
  Index,
  Dot_Attribute,
  Array_Attribute,
}

class Token {
  public type;
  public start;
  public length;
  constructor(type: TokenType, start: number, length = 1) {
    this.type = type;
    this.start = start;
    this.length = length;
  }
  getValue(txt: string) {
    return txt.slice(this.start, this.start + this.length);
  }
}

function getLexerRules() {
  return new Map([
    [TokenType.Attribute, /^(\w(:?[-]|\w)*)/i],
    [TokenType.Dot_Attribute, /^\.(\w(:?[-]|\w)*)/i],
    [TokenType.Array_Attribute, /^\["(\w(:?[-]|\w)*)"\]/i],
    [TokenType.Index, /^\[(\d+)\]/i],
  ]);
}

function lookaheadRegExp(
  tokenType: TokenType,
  currentPosition: number,
  input: string,
  re: RegExp
): [Token, number] | undefined {
  const m = input.slice(currentPosition).match(re);
  if (m) {
    const pos =
      tokenType === TokenType.Attribute ? currentPosition : currentPosition + 1;
    return [new Token(tokenType, pos, m[1].length), m[0].length];
  }
  return undefined;
}

function resolve(input: string, item: never) {
  let current = item;
  let currentPosition = 0;
  let lastCurrentPosition = 0;
  const rules = getLexerRules();
  while (currentPosition <= input.length - 1) {
    for (const [k, v] of rules) {
      const result = lookaheadRegExp(k, currentPosition, input, v);
      if (result !== undefined) {
        const key = result[0].getValue(input);
        if (key in current) {
          current = current[key];
          currentPosition += result[1];
          break;
        }
      }
    }
    if (lastCurrentPosition === currentPosition) {
      console.warn(
        `Unknown path for: ${input} in object ${JSON.stringify(item)}`
      );
      return undefined;
    }
    lastCurrentPosition = currentPosition;
  }
  return current;
}

export class ReferenceStrategy implements IStrategy {
  private path;
  readonly isContext;
  constructor(args: { path: string; isContext: boolean }) {
    this.path = args.path;
    this.isContext = args.isContext;
  }
  isDefined(): boolean {
    return true;
  }
  private _draw(options?: ConditionalOptions) {
    if (options?.parent !== undefined) {
      return resolve(this.path, options.parent as never);
    }
    return undefined;
  }
  public draw(options?: ConditionalOptions): unknown {
    if (this.isContext && options?.context !== undefined) {
      return resolve(this.path, options.context as never);
    }
    return this._draw(options);
  }
}
