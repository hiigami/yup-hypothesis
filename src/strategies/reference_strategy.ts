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
      throw new Error(
        `Unknown path for: ${input[currentPosition]} in object ${JSON.stringify(
          item
        )}`
      );
    }
    lastCurrentPosition = currentPosition;
  }
  return current;
}

export class ReferenceStrategy implements IStrategy {
  private key;
  constructor(args: { key: string }) {
    this.key = args.key;
  }
  isDefined(): boolean {
    return true;
  }
  public draw(options?: ConditionalOptions): unknown {
    if (this.key.startsWith("$", 0) && options?.context !== undefined) {
      return resolve(this.key.slice(1), options.context as never);
    }
    if (options?.parent !== undefined) {
      return resolve(this.key, options.parent as never);
    }
    return undefined;
  }
}
