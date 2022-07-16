import { Nullable } from "../data/types";
import { Graph } from "./graph";

const any = Symbol("Σ");
const lazy = Symbol("lazy");

const peek = (c: string, x: string[]) => x.length > 0 && x[0] === c;
const peekDecimalDigit = (x: string[]) =>
  x.length > 0 && Number.isInteger(+x[0]);
const remove = (c: string, x: string[]) => {
  if (!peek(c, x)) {
    throw new Error(`Unexpected symbol ${x.slice(0, 1)}`);
  }
  x.shift();
};
const isMetaChar = (x: string[]) =>
  x.length > 0 &&
  [
    "^",
    "$",
    "\\",
    ".",
    "?",
    "*",
    "+",
    ")",
    "(",
    "[",
    "]",
    "{",
    "}",
    "|",
  ].lastIndexOf(x[0]) > -1;

function patternCharacter(index: number, pattern: string[]): Nullable<Graph> {
  if (!isMetaChar(pattern)) {
    const g = new Graph(index);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const current = pattern.shift()!;
    g.concat(current);
    return g;
  }
  return null;
}

function decimalDigits(pattern: string[]): Maybe<number> {
  const digits: string[] = [];
  while (peekDecimalDigit(pattern)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const current = pattern.shift()!;
    digits.push(current);
  }
  return digits.length > 0 ? Number.parseInt(digits.join("")) : undefined;
}

function atomEscape(index: number, pattern: string[]): Nullable<Graph> {
  if (peek("\\", pattern)) {
    remove("\\", pattern);
    const g = new Graph(index);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const current = pattern.shift()!;
    g.concat(current);
    return g;
  }
  return null;
}

function atom(index: number, pattern: string[]): Graph {
  const _patternCharacter = patternCharacter(index, pattern);
  if (_patternCharacter !== null) {
    return _patternCharacter;
  }
  if (peek(".", pattern)) {
    remove(".", pattern);
    const g = new Graph(index);
    g.concat(any);
    return g;
  }
  const _atomEscape = atomEscape(index, pattern);
  if (_atomEscape !== null) {
    return _atomEscape;
  }
  if (peek("(", pattern)) {
    remove("(", pattern);
    const _disjunction = disjunction(index, pattern);
    remove(")", pattern);
    return _disjunction;
  }

  throw new Error(`Unexpected meta char ${pattern.slice(0, 1)}`);
}

function quantifierPrefix(atom: Graph, tokens: string[]): Graph {
  if (peek("*", tokens)) {
    remove("*", tokens);
    atom.star();
  } else if (peek("+", tokens)) {
    remove("+", tokens);
    atom.plus();
  } else if (peek("?", tokens)) {
    remove("?", tokens);
    atom.optional();
  } else if (peek("{", tokens)) {
    remove("{", tokens);
    const d1 = decimalDigits(tokens);
    if (d1 === undefined) {
      throw new Error(`Unexpected symbol ${tokens.slice(0, 1)}`);
    }
    remove(",", tokens);
    const d2 = decimalDigits(tokens);
    atom.range(d1, d2);
    remove("}", tokens);
  }
  return atom;
}

function quantifier(index: number, tokens: string[]): Graph {
  let _atom = atom(index, tokens);
  _atom = quantifierPrefix(_atom, tokens);
  if (peek("?", tokens)) {
    remove("?", tokens);
    _atom.concat(lazy);
  }
  return _atom;
}

function assertion(index: number, tokens: string[]): Nullable<Graph> {
  for (const item of ["^", "$"]) {
    if (peek(item, tokens)) {
      remove(item, tokens);
      return new Graph(index);
      /**@todo */
    }
  }
  return null;
}

function term(index: number, tokens: string[]): Graph {
  const _assertion = assertion(index, tokens);
  if (_assertion !== null) {
    return _assertion;
  }
  const _quantifier = quantifier(index, tokens);
  if (tokens.length > 0 && !peek(")", tokens) && !peek("|", tokens)) {
    const _term = term(_quantifier.index, tokens);
    _quantifier.join(_term);
  }
  return _quantifier;
}

function disjunction(index: number, tokens: string[]) {
  const _term = term(index, tokens);
  if (peek("|", tokens)) {
    remove("|", tokens);
    const _disjunction = disjunction(_term.index, tokens);
    _term.union(_disjunction);
  }
  return _term;
}

export function pattern(index: number, tokens: string[]) {
  if (tokens.length === 0) {
    return new Graph(index);
  }
  return disjunction(index, tokens);
}
