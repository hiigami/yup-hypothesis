export enum InternetConstrainType {
  UserInfo = "userInfo",
  Username = "username",
}

export enum PresenceType {
  Defined = "defined",
  Optional = "optional",
  Required = "required",
}

export enum SchemaType {
  Array = "array",
  Boolean = "boolean",
  Conditional = "conditional",
  Date = "date",
  Email = "email",
  Float = "float",
  Mixed = "mixed",
  Number = "number",
  Object = "object",
  String = "string",
  Tuple = "tuple",
  URL = "url",
  UUID = "uuid",
}

export enum Sign {
  Indifferent = 0,
  Negative = -1,
  Positive = 1,
}

export enum TestName {
  Defined = "defined",
  Email = "email",
  Integer = "integer",
  IsValue = "is-value",
  Max = "max",
  Min = "min",
  URL = "url",
  UUID = "uuid",
}

export enum TestParameter {
  Length = "length",
  Less = "less",
  Max = "max",
  Min = "min",
  More = "more",
  Value = "value",
}
