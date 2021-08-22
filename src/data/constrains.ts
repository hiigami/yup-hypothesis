export interface Constrain {
  max: number;
  min: number;
}

export interface EmailConstrain extends Constrain {
  username: Constrain;
  entity: Constrain;
}

export interface FloatConstrain extends Constrain {
  precision: number;
}

export interface StringConstrain extends Constrain {
  chars: Constrain;
}
