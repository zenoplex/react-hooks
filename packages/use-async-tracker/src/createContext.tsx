import React from 'react';
import createStoreContext from '@gen/use-store';
import { isObject } from './utils/isObject';

const getCurrentCount = (value: unknown, key: string): number | null => {
  if (typeof value === 'number') {
    return value;
  }
  if (isObject(value) && key in value) {
    const v = value[key];
    return typeof v === 'number' ? v : null;
  }
  return null;
};

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
    const [state, updateFn] = useStore(selector);

    /** Promise wrapper */
    const trackPromise = React.useCallback<TrackPromise>(
      (promise, key) => {
        const currentCount = getCurrentCount(state, key as string);
        console.log('currentCount', currentCount);
        if (currentCount != null) {
          updateFn({
            [key]: Math.min(currentCount + 1, Number.MAX_SAFE_INTEGER),
          } as Partial<S>);
        }

        const onResolve = (): void => {
          const currentCount = getCurrentCount(state, key as string);
          console.log('currentCount resolve', currentCount);
          if (currentCount == null) return;

          console.log({ [key]: Math.max(currentCount - 1, 0) });
          updateFn({ [key]: Math.max(currentCount - 1, 0) } as Partial<S>);
        };

        promise.then(onResolve, onResolve);
        return promise;
      },
      [state, updateFn]
    );

    return [state, trackPromise];
  };

  return {
    useAsyncTracker,
    Provider,
  };
};
