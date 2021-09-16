import { constrains, enumerations } from "../data";
import { createConstrain, createInternetConstrain } from "../common";

export const ARRAY_DEFAULTS = createConstrain(0, 99);

export const EMAIL_DEFAULTS =
  createInternetConstrain<constrains.EmailConstrain>(
    6,
    256,
    enumerations.InternetConstrainType.Username
  );

export const FLOAT_DEFAULTS: Readonly<constrains.FloatConstrain> =
  Object.freeze({
    ...createConstrain(0, 99999),
    precision: 4,
  });

export const NUMBER_DEFAULTS = createConstrain(0, 99999);

export const STRATEGY_DEFAULTS = Object.freeze({
  bool: 0.5,
  default: 0.75,
  defined: 0.4,
  nullable: 0.75,
  sign: 0.5,
});

export const STRING_DEFAULTS: Readonly<constrains.StringConstrain> =
  Object.freeze({
    ...createConstrain(0, 255),
    chars: createConstrain(32, 126),
  });

export const URL_DEFAULTS = createInternetConstrain<constrains.URLConstrain>(
  9,
  2000,
  enumerations.InternetConstrainType.UserInfo
);

export const URL_SCHEMAS = Object.freeze(["ftp", "http", "https"]);
