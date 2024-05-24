import React from 'react';

/**
 * useAsync status
 * TODO: Should be discriminated union.
 */
type Status = 'idle' | 'loading' | 'success' | 'error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncFn = (...args: any[]) => Promise<any>;

type UseAsync = <T extends AsyncFn>(
  fn: (signal: AbortSignal) => T,
  options?: {
    onSuccess?: (args: Awaited<ReturnType<T>>) => void;
    onError?: (args: unknown) => void;
  }
) => {
  /** Result on success, defaults to null */
  data: Awaited<ReturnType<T>> | null;
  /** Result on error, defaults to null */
  error: unknown | null;
  /** status */
  status: Status;
  /** function to execute async operation */
  execute: (...args: Parameters<T>) => Awaited<ReturnType<T>>;
  /** abort function */
  abort: AbortController['abort'];
};

/**
 * Hooks to execute async operation.
 *
 * @remarks
 *
 * Should use @tanstack/react-query where possible.
 */
export const useAsync: UseAsync = (fn, options) => {
  /** ref to save options */
  const callbackRefs = React.useRef(options);

  React.useEffect(() => {
    // eslint-disable-next-line functional/immutable-data
    callbackRefs.current = options;
  }, [options]);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [data, setData] = React.useState<ReturnType<UseAsync>['data']>(null);
  const [error, setError] = React.useState<unknown | null>(null);
  const [status, setStatus] = React.useState<Status>('idle');
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const execute = React.useCallback<ReturnType<UseAsync>['execute']>(
    async (...params) => {
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      setStatus('loading');
      try {
        const asyncFn = fn(abortController.signal);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
        const response = await asyncFn(...params);
        setData(response);
        setError(null);
        setStatus('success');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        callbackRefs.current?.onSuccess?.(response);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return response;
      } catch (err) {
        setError(err);
        setData(null);
        setStatus('error');
        callbackRefs.current?.onError?.(err);
      }
    },
    [fn]
  );

  const abort = React.useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  }, []);

  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    data,
    error,
    execute,
    status,
    abort,
  };
};
