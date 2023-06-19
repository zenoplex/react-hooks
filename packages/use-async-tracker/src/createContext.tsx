import React from 'react';
import createStoreContext from '@gen/use-store';

export const createContext = <S extends Record<string, number>>(
  initialStore: S
): {
  useAsyncTracker: <T>(
    selector: (store: S) => T
  ) => [T, <P extends Promise<unknown>>(promise: P, key: keyof S) => P];
  Provider: React.FC<{ children: React.ReactNode }>;
} => {
  const { Provider, useStore } = createStoreContext(initialStore);

  type TrackPromise = <P extends Promise<unknown>>(
    promise: P,
    key: keyof S
  ) => P;
  type UseAsyncTracker = <T>(selector: (store: S) => T) => [T, TrackPromise];

  const useAsyncTracker: UseAsyncTracker = (selector) => {
    const [state, updateFn] = useStore((store) => store);

    /** Promise wrapper */
    const trackPromise = React.useCallback<TrackPromise>(
      (promise, key) => {
        const currentCount = state[key];
        updateFn({
          [key]: Math.min(currentCount + 1, Number.MAX_SAFE_INTEGER),
        } as Partial<S>);

        const onResolve = (): void => {
          const currentCount = state[key];
          updateFn({ [key]: Math.max(currentCount - 1, 0) } as Partial<S>);
        };
        promise.then(onResolve, onResolve);
        return promise;
      },
      [state, updateFn]
    );

    return [selector(state), trackPromise];
  };

  return {
    useAsyncTracker,
    Provider,
  };
};
