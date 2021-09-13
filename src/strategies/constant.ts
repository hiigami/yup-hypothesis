import { constrains } from "../data";

enum InternetConstrainType {
  UserInfo = "userInfo",
  Username = "username",
}

type InternetConstrain = constrains.EmailConstrain | constrains.URLConstrain;

function createConstrain(min: number, max: number): constrains.Constrain {
  return { min, max };
}

function internetConstrain<T extends InternetConstrain>(
  min: number,
  max: number,
  key: InternetConstrainType
): T {
  return {
    ...createConstrain(min, max),
    [key]: { max: 64, min: 2 },
    entity: { max: 186, min: 1 },
    tld: { max: 16, min: 1 },
  } as T;
}

export const EMAIL_DEFAULTS = internetConstrain<constrains.EmailConstrain>(
  6,
  256,
  InternetConstrainType.Username
);

export const FLOAT_DEFAULTS: constrains.FloatConstrain = {
  ...createConstrain(0, 99999),
  precision: 4,
};

export const NUMBER_DEFAULTS = createConstrain(0, 99999);

export const STRATEGY_DEFAULTS = Object.freeze({
  bool: 0.5,
  default: 0.75,
  defined: 0.4,
  nullable: 0.75,
  sign: 0.5,
});

export const STRING_DEFAULTS: constrains.StringConstrain = {
  ...createConstrain(0, 255),
  chars: createConstrain(32, 126),
};

export const URL_DEFAULTS = internetConstrain<constrains.URLConstrain>(
  9,
  2000,
  InternetConstrainType.UserInfo
);

export const URL_SCHEMAS = Object.freeze(["http", "https", "ftp"]);
