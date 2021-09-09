import { constrains } from "../../data";
import { random, randomChoice, randomIntInclusive } from "../../random";
import * as constant from "../constant";

import { getValidValueOrBest } from "./general";

interface URLOptions {
  includeUserInfo?: boolean;
  includePath?: boolean;
  includeQuery?: boolean;
  includeFragment?: boolean;
}

interface HostDefaults {
  entity: constrains.Constrain;
  tld: constrains.Constrain;
}

function getSectionLength(
  size: number,
  offset: number,
  constrain: constrains.Constrain
): number {
  const proposedLimit = size - offset;
  const max = getValidValueOrBest(constrain, proposedLimit);
  return randomIntInclusive(max, constrain.min);
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
  if (size === 0) {
    return "";
  }
  return _genSection(size, extraChars);
}

function genEntity(size: number): string {
  return genSection(size, ["-", "."]);
}

function genHost(size: number, defaults: HostDefaults) {
  // offset = TLD (x1)
  const entitySize = getSectionLength(size, 1, defaults.entity);
  const entity = genEntity(entitySize);
  const tldSize = getSectionLength(size - entity.length, 0, defaults.tld);
  const tld = genEntity(tldSize);
  return `${entity}.${tld}`;
}

export function genEmail(
  size: number,
  defaults: constrains.EmailConstrain
): string {
  const extraChars = [".", "+", "-"];
  // offset = .(x1) @(x1)
  const _size = size - 2;
  // offset = tld(x1) entity(x1)
  const userSize = getSectionLength(_size, 2, defaults.username);
  const username = genSection(userSize, extraChars);
  const host = genHost(_size - username.length, defaults);
  return `${username}@${host}`;
}

function _genUserInfo(size: number): string {
  const extraChars = [".", "+", "-"];
  // offset = :(x1) @(x1)
  const userSize = randomIntInclusive(size - 2);
  const stack = [genSection(userSize, extraChars), ":"];
  if (userSize > 0 && random() > 0.4) {
    const passwordSize = randomIntInclusive(size - stack[0].length - 2);
    stack.push(genSection(passwordSize, extraChars));
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
  includeUserInfo = false
) {
  // offset = .(x1)
  let _size = size - 1;
  const stack = [];
  if (includeUserInfo) {
    // offset = entity (x1) TLD (x3)
    const userInfoSize = getSectionLength(_size, 4, defaults.userInfo);
    const userInfo = genUserInfo(userInfoSize);
    _size -= userInfo.length;
    stack.push(userInfo);
  }
  /**@todo missing port, could be ip address instead */
  stack.push(genHost(_size, defaults));
  return stack.join("");
}

export function genUrl(
  size: number,
  defaults: constrains.URLConstrain,
  options: URLOptions
): string {
  /**@todo implement all url options */
  return genAuthority(size, defaults, options.includeUserInfo);
}
