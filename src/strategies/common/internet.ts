import { constrains, ReadOnlyArray } from "../../data";
import { random, randomChoice, randomIntInclusive } from "../../random";

import { URL_SCHEMAS } from "../constant";

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

const LETTERS = Object.freeze([
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
]);
const EXTRA_CHARS = Object.freeze([".", "-", "+", "~"]);

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

function isInvalidChar(
  val1: string,
  val2: string,
  options: ReadOnlyArray<string>
): boolean {
  if (options.lastIndexOf(val1) === -1 || options.lastIndexOf(val2) === -1) {
    return true;
  }
  return false;
}

function _genSection(size: number, extraChars: ReadOnlyArray<string>) {
  const chars = [...LETTERS, ...extraChars];
  const stack = [randomChoice<string>(LETTERS)];
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
    stack.push(randomChoice<string>(LETTERS));
  }
  return stack.join("");
}

function genSection(size: number, extraChars: ReadOnlyArray<string>) {
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
  const _size = strict ? size - defaults.tld.max : size;
  const entitySize = getSectionLength(_size, 1, defaults.entity);
  const entity = genEntity(entitySize);
  const tldSize = strict
    ? size - entity.length
    : getSectionLength(size - entity.length, 0, defaults.tld, strict);
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
  const host = genHost(_size - username.length, defaults, true);
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

function _genSections(size: number, joinChar: string, strict: boolean): string {
  const stack = [""];
  const sections = randomIntInclusive(size, 1);
  let _size = size - sections;
  for (let i = sections; i > 0; i -= 2) {
    const pathSize = randomIntInclusive(_size, 1);
    const path = genSection(pathSize, EXTRA_CHARS);
    _size -= path.length + 1;
    stack.push(path);
  }
  const output = stack.join(joinChar);
  return strict
    ? output + genSection(size - output.length, EXTRA_CHARS)
    : output;
}

function genPath(size: number, options: GenOptions): string {
  if (!options.include || size === 0) {
    return "";
  }
  return size === 1 ? "/" : _genSections(size, "/", options.strict);
}

function getRandomSchema(size: number, default_min: number): string {
  if (size === default_min) {
    return "ftp";
  }
  return randomChoice(URL_SCHEMAS);
}

function genSearchParams(url: URL, size: number, options: GenOptions) {
  if (!options.include) {
    return;
  }
  let _size = size - 1;
  const items = [];
  while (_size > 0) {
    const qSize = randomIntInclusive(_size - 2, 1);
    const q = genSection(qSize, []);
    _size -= q.length + 1;
    if (items.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      url.searchParams.set(items.pop()!, q);
    } else {
      items.push(q);
    }
  }
  _size = size - (url.searchParams.toString().length + 1);
  if (options.strict && _size > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    url.searchParams.set(genSection(_size, []), "");
  }
}

export function genUrl(
  size: number,
  defaults: constrains.URLConstrain,
  options: URLOptions
): string {
  /**@todo implement all url options */
  const schema = getRandomSchema(size, defaults.min);
  let strict = !(
    options.includePath ||
    options.includeQuery ||
    options.includeFragment
  );
  let _size = size - (schema.length + 3);
  const authority = genAuthority(_size, defaults, {
    include: options.includeUserInfo,
    strict: strict,
  });
  _size -= authority.length;
  strict = !(options.includeQuery || options.includeFragment);
  const path = genPath(_size, {
    include: options.includePath,
    strict: strict,
  });
  _size -= path.length;
  const url = new URL(`${schema}://${authority}${path}`);
  genSearchParams(url, _size, {
    include: options.includeQuery,
    strict: !options.includeFragment,
  });
  const _url = url.toString();
  if (_url.length > size) {
    return _url.slice(0, size);
  }
  return _url.length === size
    ? _url
    : _url + _genSection(size - _url.length, []);
}
