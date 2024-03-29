import { URL_SCHEMAS } from "../../config";
import { constrains } from "../../data";
import { ReadOnlyArray } from "../../data/types";
import { random, randomChoice, randomIntInclusive } from "../../random";
import { getValidValueOrBest } from "./general";

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

const LETTERS = Object.freeze(
  Array.from(Array(26)).map((e, i) => String.fromCharCode(97 + i))
);
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

function replaceInvalidChar(txt: string) {
  let tmp = txt;
  if (EXTRA_CHARS.lastIndexOf(txt.slice(-1)) > -1) {
    tmp = tmp.slice(0, tmp.length - 1) + randomChoice<string>(LETTERS);
  }
  if (EXTRA_CHARS.lastIndexOf(tmp[0]) > -1) {
    return randomChoice<string>(LETTERS) + tmp.slice(1, tmp.length);
  }
  return tmp;
}

function ensureHostDotRule(txt: string): string {
  const tmp = txt.split(".");
  const size = tmp.length - 1;
  for (let i = size; i > -1; i--) {
    const l = tmp[i].length;
    if (l > 61) {
      const half = Math.floor(l / 2);
      const item = tmp[i];
      tmp[i] = replaceInvalidChar(item.slice(0, half));
      tmp.push(replaceInvalidChar(item.slice(half, l - 1)));
    }
  }
  return tmp.join(".");
}

export function genHost(size: number, defaults: HostDefaults, strict = false) {
  // offset = TLD (x1)
  const _size = strict ? size - defaults.tld.max : size;
  const entitySize = getSectionLength(_size, 1, defaults.entity);
  const entity = ensureHostDotRule(genEntity(entitySize));
  const tldSize = strict
    ? size - entity.length
    : getSectionLength(size - entity.length, 0, defaults.tld, strict);
  const tld = ensureHostDotRule(genEntity(tldSize));
  return ensureHostDotRule(`${entity}.${tld}`);
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

function genUserInfo(
  include: boolean,
  size: number,
  constrain: constrains.Constrain
): string {
  if (!include) {
    return "";
  }
  // offset = entity (x1) TLD (x3)
  const _size = getSectionLength(size, 4, constrain);
  return _size === 2 ? ":@" : _genUserInfo(_size);
}

function genAuthority(
  size: number,
  defaults: constrains.URLConstrain,
  options: URLOptions
) {
  // offset = .(x1)
  const _size = size - 1;
  const userInfo = genUserInfo(
    options.includeUserInfo && _size > 3,
    _size,
    defaults.userInfo
  );
  /**@todo missing port, could be ip address instead */
  const strict = !(
    options.includePath ||
    options.includeQuery ||
    options.includeFragment
  );
  const host = genHost(_size - userInfo.length, defaults, strict);
  return `${userInfo}${host}`;
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

function genPath(size: number, include: boolean, strict: boolean): string {
  if (!include) {
    return "";
  }
  return size === 1 ? "/" : _genSections(size, "/", strict);
}

function getRandomSchema(size: number): string {
  if (size === 9) {
    return URL_SCHEMAS[0];
  }
  return size === 10
    ? randomChoice(URL_SCHEMAS.slice(0, 2))
    : randomChoice(URL_SCHEMAS);
}

function _genSearchParams(size: number): string {
  const stack = [];
  let _size = size;
  while (_size > 0) {
    const k = genSection(randomIntInclusive(_size - 2, 1), []);
    _size -= k.length + 1;
    const v = genSection(randomIntInclusive(_size - 2, 1), []);
    _size -= v.length + 1;
    stack.push(k);
    stack.push("=");
    stack.push(v);
  }
  return stack.join("");
}

function genSearchParams(
  size: number,
  include: boolean,
  strict: boolean
): string {
  if (include) {
    const searchParams = _genSearchParams(size - 1);
    const _size = size - (searchParams.length + 1);
    const missing = strict ? genSection(_size, []) : "";
    return `?${searchParams}${missing}`;
  }
  return "";
}

function genFragment(size: number, include: boolean): string {
  if (include) {
    return size === 1 ? "#" : "#" + _genSection(size - 1, []);
  }
  return "";
}

export function genUrl(
  size: number,
  defaults: constrains.URLConstrain,
  options: URLOptions
): string {
  /**@todo implement all url options */
  const schema = getRandomSchema(size);
  let _size = size - (schema.length + 3);
  const authority = genAuthority(_size, defaults, options);
  _size -= authority.length;
  const path = genPath(
    _size,
    options.includePath && _size > 0,
    !(options.includeQuery || options.includeFragment)
  );
  _size -= path.length;
  const queryParams = genSearchParams(
    _size,
    options.includeQuery && _size > 0,
    !options.includeFragment
  );
  _size -= queryParams.length;
  const includeFragment = options.includeFragment && _size > 0;
  const fragment = genFragment(_size, includeFragment);
  return `${schema}://${authority}${path}${queryParams}${fragment}`;
}
