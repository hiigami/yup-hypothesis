export enum PresenceType {
  Defined = "defined",
  Optional = "optional",
  Required = "required",
}

export enum SchemaType {
  Boolean = "boolean",
  Date = "date",
  Email = "email",
  Float = "float",
  Number = "number",
  String = "string",
  URL = "url",
  UUID = "uuid",
}

export enum Sign {
  Positive,
  Negative,
  Indifferent,
}

export enum TestName {
  Email = "email",
  Integer = "integer",
  Max = "max",
  Min = "min",
  StringCase = "string_case",
  Trim = "trim",
  URL = "url",
  UUID = "uuid",
}

export enum TestParameter {
  Length = "length",
  Less = "less",
  Max = "max",
  Min = "min",
  More = "more",
}

export enum TestMutation {
  Upper = "upper case",
  Lower = "lower case",
}