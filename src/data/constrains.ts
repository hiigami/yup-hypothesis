export interface Constrain {
  max: number;
  min: number;
}

export interface EmailConstrain extends Constrain {
  username: Constrain;
  entity: Constrain;
  tld: Constrain;
}

export interface FloatConstrain extends Constrain {
  precision: number;
}

export interface StringConstrain extends Constrain {
  chars: Constrain;
}

export interface URLConstrain extends Constrain {
  userInfo: Constrain;
  entity: Constrain;
  tld: Constrain;
}
