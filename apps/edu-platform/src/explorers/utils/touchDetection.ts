import { writable, type Writable } from 'svelte/store';

const TOUCH_BREAKPOINT_PX = 1024;

function detect(): boolean {
  if (typeof window === 'undefined') return false;
  const hasTouch =
    'ontouchstart' in window || navigator.maxTouchPoints > 0;
  return hasTouch && window.innerWidth < TOUCH_BREAKPOINT_PX;
}

/**
 * Reactive store that tracks whether the current device should display
 * the mobile control bar. True when the device reports touch input AND
 * the viewport is narrower than the desktop breakpoint.
 */
export const isTouchMode: Writable<boolean> = writable(false);

/**
 * Initialise touch detection. Sets the initial value of the store and
 * subscribes to resize/orientationchange so the store updates whenever
 * the viewport changes (covers device rotation and DevTools toggling).
 *
 * Returns a cleanup function that removes the listeners.
 */
export function initTouchDetection(): () => void {
  if (typeof window === 'undefined') return () => {};

  isTouchMode.set(detect());

  const onChange = () => isTouchMode.set(detect());
  window.addEventListener('resize', onChange, { passive: true });
  window.addEventListener('orientationchange', onChange, { passive: true });

  return () => {
    window.removeEventListener('resize', onChange);
    window.removeEventListener('orientationchange', onChange);
  };
}
