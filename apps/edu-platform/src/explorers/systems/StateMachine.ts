import { devWarn } from '../utils/logger';

export interface StateMachineConfig<S extends string> {
  initial: S;
  transitions: Record<S, S[]>;
  onEnter?: Partial<Record<S, () => void>>;
  onExit?: Partial<Record<S, () => void>>;
}

export class StateMachine<S extends string> {
  private current: S;
  private readonly transitions: Record<S, S[]>;
  private readonly onEnter: Partial<Record<S, () => void>>;
  private readonly onExit: Partial<Record<S, () => void>>;

  constructor(config: StateMachineConfig<S>) {
    this.current = config.initial;
    this.transitions = config.transitions;
    this.onEnter = config.onEnter ?? {};
    this.onExit = config.onExit ?? {};
  }

  get state(): S {
    return this.current;
  }

  isState(state: S): boolean {
    return this.current === state;
  }

  canTransition(to: S): boolean {
    const allowed = this.transitions[this.current];
    return allowed?.includes(to) ?? false;
  }

  transition(to: S): boolean {
    if (!this.canTransition(to)) {
      devWarn(`[StateMachine] Invalid transition: ${this.current} → ${to}`);
      return false;
    }

    const prev = this.current;
    this.onExit[prev]?.();
    this.current = to;
    this.onEnter[to]?.();
    return true;
  }
}
