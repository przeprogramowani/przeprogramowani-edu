/** Dev-only logger — calls are no-ops in production builds (tree-shaken). */
export const devLog = import.meta.env.DEV
  ? (...args: unknown[]) => console.log(...args)
  : () => {};

export const devWarn = import.meta.env.DEV
  ? (...args: unknown[]) => console.warn(...args)
  : () => {};
