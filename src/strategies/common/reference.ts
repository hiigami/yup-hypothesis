import { ConditionalOptions } from "../../data/strategies";
import { Maybe, UnknownDict } from "../../data/types";

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
): Maybe<[Token, number]> {
  const m = input.slice(currentPosition).match(re);
  if (m) {
    const pos =
      tokenType === TokenType.Attribute ? currentPosition : currentPosition + 1;
    return [new Token(tokenType, pos, m[1].length), m[0].length];
  }
  return undefined;
}

export function resolvePath(input: string, item: never) {
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

export function resolve(key: string, options?: ConditionalOptions): unknown {
  if (key.startsWith("$") && options?.context !== undefined) {
    return resolvePath(key.slice(1), options.context as never);
  }
  if (options?.parent !== undefined) {
    return resolvePath(key, options.parent as never);
  }
  return undefined;
}

function isDictionary(item: unknown) {
  if (item instanceof Object && item.constructor === Object) {
    return true;
  }
  return false;
}

function referenceItemValidation(item: UnknownDict) {
  if (
    "type" in item &&
    "key" in item &&
    item["type"] === "ref" &&
    typeof item["key"] === "string"
  ) {
    return true;
  }
  return false;
}

export function isRefObject(
  item: unknown
): item is { type: string; key: string } {
  if (isDictionary(item) && referenceItemValidation(item as UnknownDict)) {
    return true;
  }
  return false;
}
