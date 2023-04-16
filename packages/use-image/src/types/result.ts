export type Result<T, E> = Ok<T> | Err<E>;

export interface Ok<T> {
  readonly ok: true;
  readonly val: T;
  readonly err?: null | undefined;
}

export interface Err<E> {
  readonly ok: false;
  readonly val?: null | undefined;
  readonly err: E;
}
