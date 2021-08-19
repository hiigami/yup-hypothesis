import { constrains } from "../data";

export const BOOL_CHANGE = 0.5;
export const EMAIL_DEFAULTS: constrains.EmailConstrain = {
  min: 7,
  max: 256,
  username: { max: 64, min: 2 },
  entity: { max: 186, min: 1 },
};
export const FLOAT_DEFAULTS: constrains.FloatConstrain = {
  min: 0,
  max: 99999,
  precision: 4,
};
export const IS_DEFAULT = 0.75;
export const IS_NULLABLE = 0.75;
export const LETTERS = "abcdefghijklmnopqrstuvwxyz";
export const NUMBER_DEFAULTS: constrains.Constrain = {
  min: 0,
  max: 99999,
};
export const SIGN_CHANGE = 0.5;
export const STRING_DEFAULTS: constrains.StringConstrain = {
  min: 0,
  max: 255,
  chars: { min: 32, max: 126 },
};
export const URL_DEFAULTS: constrains.Constrain = {
  min: 10,
  max: 2000,
};
export const URL_SCHEMAS = ["http", "https", "ftp", "file", "data", "irc"];
