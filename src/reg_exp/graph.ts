const epsilon = Symbol("ε");

type Symbols = string | symbol;

class State {
  value: string;
  final: boolean;
  constructor(value: string, final = false) {
    this.value = value;
    this.final = final;
  }
}

class Transition extends Map<State, Map<Symbols, Set<State>>> {
  add(a: State, s: Symbols, b: State) {
    if (!this.has(a)) {
      this.set(a, new Map());
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const _state = this.get(a)!;

    if (!_state.has(s)) {
      _state.set(s, new Set());
    }
    const _symbol = _state.get(s);
    _symbol?.add(b);
  }
}

export class Graph {
  root: State;
  current: State;
  index: number;
  transitions: Transition;
  constructor(index: number) {
    this.index = index;
    this.root = new State(this.getStateName());
    this.current = this.root;
    this.transitions = new Transition();
  }
  private getStateName() {
    return `q${++this.index}`;
  }
  join(r2: Graph) {
    this.index = Math.max(this.index, r2.index);
    this.transitions = new Transition([...this.transitions, ...r2.transitions]);
    this.transitions.add(this.current, epsilon, r2.root);
    this.current.final = false;
    this.current = r2.current;
  }
  concat(symbol: Symbols) {
    const end = new State(this.getStateName(), true);
    this.transitions.add(this.current, symbol, end);
    this.current.final = false;
    this.current = end;
  }
  union(r2: Graph) {
    this.index = Math.max(this.index, r2.index);
    this.transitions = new Transition([...this.transitions, ...r2.transitions]);
    const start = new State(this.getStateName());
    this.transitions.add(start, epsilon, this.root);
    this.transitions.add(start, epsilon, r2.root);
    this.root = start;
    const end = new State(this.getStateName(), true);
    this.transitions.add(this.current, epsilon, end);
    this.current.final = false;
    this.transitions.add(r2.current, epsilon, end);
    r2.current.final = false;
    this.current = end;
  }
  star() {
    const start = new State(this.getStateName());
    const end = new State(this.getStateName(), true);
    this.current.final = false;
    this.transitions.add(this.current, epsilon, end);
    this.transitions.add(end, epsilon, start);
    this.transitions.add(start, epsilon, end);
    this.transitions.add(start, epsilon, this.root);
    this.root = start;
    this.current = end;
  }
  optional() {
    const start = new State(this.getStateName());
    const end = new State(this.getStateName(), true);
    this.current.final = false;
    this.transitions.add(this.current, epsilon, end);
    this.transitions.add(start, epsilon, this.root);
    this.transitions.add(start, epsilon, end);
    this.root = start;
    this.current = end;
  }
  plus() {
    this.transitions.add(this.current, epsilon, this.root);
  }
  range(start: number, end?: number) {
    this.transitions.add(this.current, Symbol(`{${start},${end}}`), this.root);
  }
}
