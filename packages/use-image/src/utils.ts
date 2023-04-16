import { Err, Ok } from './types/result';

/** Does nothing */
export const noop = (): void => {
  // noop
};

export const createOk = <T>(val: T): Ok<T> => ({
  ok: true,
  val,
});

export const createErr = <T>(err: T): Err<T> => ({
  ok: false,
  err,
});
