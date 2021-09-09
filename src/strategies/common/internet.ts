import { constrains } from "../../data";
import { random, randomChoice, randomIntInclusive } from "../../random";
import * as constant from "../constant";

import { getValidValueOrBest } from "./general";

interface GenOptions {
  strict: boolean;
  include: boolean;
}

interface URLOptions {
  includeUserInfo: boolean;
  includePath: boolean;
  includeQuery: boolean;
  includeFragment: boolean;
}

interface HostDefaults {
  entity: constrains.Constrain;
  tld: constrains.Constrain;
}

const EXTRA_CHARS = [".", "-", "+", "~"];

function getSectionLength(
  size: number,
  offset: number,
  constrain: constrains.Constrain,
  strict = false
): number {
  const proposedLimit = size - offset;
  const max = getValidValueOrBest(constrain, proposedLimit);
  return strict ? max : randomIntInclusive(max, constrain.min);
}

function isInvalidChar(val1: string, val2: string, options: string[]): boolean {
  if (options.lastIndexOf(val1) === -1 || options.lastIndexOf(val2) === -1) {
    return true;
  }
  return false;
}

function _genSection(size: number, extraChars: string[]) {
  const chars = [...constant.LETTERS, ...extraChars];
  const stack = [randomChoice<string>(constant.LETTERS)];
  let _size = size - 1;
  while (_size > 0) {
    const c = randomChoice<string>(chars);
    if (isInvalidChar(c, stack[stack.length - 1], extraChars)) {
      stack.push(c);
      _size -= 1;
    }
  }
  if (extraChars.lastIndexOf(stack[stack.length - 1]) > -1) {
    stack.pop();
    stack.push(randomChoice<string>(constant.LETTERS));
  }
  return stack.join("");
}

function genSection(size: number, extraChars: string[]) {
  if (size <= 0) {
    return "";
  }
  return _genSection(size, extraChars);
}

function genEntity(size: number): string {
  return genSection(size, EXTRA_CHARS.slice(0, 2));
}

function genHost(size: number, defaults: HostDefaults, strict = false) {
  // offset = TLD (x1)
  const entitySize = getSectionLength(size, 1, defaults.entity);
  const entity = genEntity(entitySize);
  const tldSize = getSectionLength(
    size - entity.length,
    0,
    defaults.tld,
    strict
  );
  const tld = genEntity(tldSize);
  return `${entity}.${tld}`;
}

export function genEmail(
  size: number,
  defaults: constrains.EmailConstrain
): string {
  // offset = .(x1) @(x1)
  const _size = size - 2;
  // offset = tld(x1) entity(x1)
  const userSize = getSectionLength(_size, 2, defaults.username);
  const username = genSection(userSize, EXTRA_CHARS.slice(0, 3));
  const host = genHost(_size - username.length, defaults);
  return `${username}@${host}`;
}

function _genUserInfo(size: number): string {
  // offset = :(x1) @(x1)
  const userSize = randomIntInclusive(size - 2);
  const stack = [genSection(userSize, EXTRA_CHARS.slice(0, 3)), ":"];
  if (userSize > 0 && random() > 0.4) {
    const passwordSize = randomIntInclusive(size - stack[0].length - 2);
    stack.push(genSection(passwordSize, EXTRA_CHARS.slice(0, 3)));
  }
  stack.push("@");
  return stack.join("");
}

function genUserInfo(size: number): string {
  return size === 2 ? ":@" : _genUserInfo(size);
}

function genAuthority(
  size: number,
  defaults: constrains.URLConstrain,
  options: GenOptions
) {
  // offset = .(x1)
  let _size = size - 1;
  const stack = [];
  if (options.include && _size > 4) {
    // offset = entity (x1) TLD (x3)
    const userInfoSize = getSectionLength(_size, 4, defaults.userInfo);
    const userInfo = genUserInfo(userInfoSize);
    _size -= userInfo.length;
    stack.push(userInfo);
  }
  /**@todo missing port, could be ip address instead */
  stack.push(genHost(_size, defaults, options.strict));
  return stack.join("");
}

function _genPath(size: number, strict: boolean): string {
  const stack = [""];
  const sections = randomIntInclusive(size, 1);
  let _size = size - sections;
  for (let i = sections; i > 0; i -= 2) {
    const pathSize = randomIntInclusive(_size, 1);
    const path = genSection(pathSize, EXTRA_CHARS);
    _size -= path.length + 1;
    stack.push(path);
  }
  const output = stack.join("/");
  return strict
    ? output + genSection(size - output.length, EXTRA_CHARS)
    : output;
}

function genPath(size: number, options: GenOptions): string {
  if (!options.include || size === 0) {
    return "";
  }
  return size === 1 ? "/" : _genPath(size, options.strict);
}

export function genUrl(
  size: number,
  defaults: constrains.URLConstrain,
  options: URLOptions
): string {
  /**@todo implement all url options */
  let strict = !(
    options.includePath ||
    options.includeQuery ||
    options.includeFragment
  );
  const stack = [
    genAuthority(size, defaults, {
      include: options.includeUserInfo,
      strict: strict,
    }),
  ];
  strict = !(options.includeQuery || options.includeFragment);
  stack.push(
    genPath(size - stack[0].length, {
      include: options.includePath,
      strict: strict,
    })
  );
  return stack.join("");
}
