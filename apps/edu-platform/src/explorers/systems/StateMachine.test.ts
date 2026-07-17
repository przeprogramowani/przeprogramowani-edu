import { describe, it, expect, vi } from 'vitest';
import { StateMachine, type StateMachineConfig } from './StateMachine';

type TestState = 'idle' | 'walking' | 'dialogue';

function createTestMachine(overrides?: Partial<StateMachineConfig<TestState>>) {
  const config: StateMachineConfig<TestState> = {
    initial: 'idle',
    transitions: {
      idle: ['walking', 'dialogue'],
      walking: ['idle'],
      dialogue: ['idle'],
    },
    ...overrides,
  };
  return new StateMachine<TestState>(config);
}

describe('StateMachine', () => {
  it('starts in initial state', () => {
    const sm = createTestMachine();
    expect(sm.state).toBe('idle');
    expect(sm.isState('idle')).toBe(true);
  });

  it('allows valid transitions', () => {
    const sm = createTestMachine();
    expect(sm.canTransition('walking')).toBe(true);
    expect(sm.transition('walking')).toBe(true);
    expect(sm.state).toBe('walking');
  });

  it('rejects invalid transitions', () => {
    const sm = createTestMachine();
    sm.transition('walking');
    expect(sm.canTransition('dialogue')).toBe(false);
    expect(sm.transition('dialogue')).toBe(false);
    expect(sm.state).toBe('walking');
  });

  it('calls onEnter and onExit callbacks', () => {
    const onEnterWalking = vi.fn();
    const onExitIdle = vi.fn();

    const sm = createTestMachine({
      onEnter: { walking: onEnterWalking },
      onExit: { idle: onExitIdle },
    });

    sm.transition('walking');
    expect(onExitIdle).toHaveBeenCalledOnce();
    expect(onEnterWalking).toHaveBeenCalledOnce();
  });

  it('isState returns correct boolean', () => {
    const sm = createTestMachine();
    expect(sm.isState('idle')).toBe(true);
    expect(sm.isState('walking')).toBe(false);
    sm.transition('walking');
    expect(sm.isState('idle')).toBe(false);
    expect(sm.isState('walking')).toBe(true);
  });
});
