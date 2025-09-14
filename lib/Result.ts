export type Result<T, R> = Promise<
  { error: null; data: T } | { error: R; data: null }
>;
