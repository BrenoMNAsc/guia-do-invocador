export const http = {
  get: async <T>(resolver: () => T, delayMs = 450): Promise<T> =>
    new Promise((resolve) => setTimeout(() => resolve(resolver()), delayMs)),
};
