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
  const { Context, Provider } = createStoreContext(initialStore);

  type TrackPromise = <P extends Promise<unknown>>(
    promise: P,
    key: keyof S
  ) => P;
  type UseAsyncTracker = <T>(selector: (store: S) => T) => [T, TrackPromise];

  const useAsyncTracker: UseAsyncTracker = (selector) => {
    const store = React.useContext(Context);
    if (!store) {
      throw new Error('Provider missing for useAsyncTracker.');
    }

    /** Promise wrapper */
    const trackPromise = React.useCallback<TrackPromise>(
      (promise, key) => {
        const currentCount = store.get()[key];
        store.set({
          [key]: Math.min(currentCount + 1, Number.MAX_SAFE_INTEGER),
        } as Partial<S>);

        const onResolve = (): void => {
          const currentCount = store.get()[key];
          store.set({ [key]: Math.max(currentCount - 1, 0) } as Partial<S>);
        };
        promise.then(onResolve, onResolve);
        return promise;
      },
      [store]
    );

    // Subscribe to store changes
    // Should be replaced with useSyncExternalStore in react 18
    // const state = React.useSyncExternalStore(store.subscribe, () =>
    //   selector(store.get())
    // );
    const [state, setState] = React.useState(() => selector(store.get()));

    React.useEffect(() => {
      const pubSub = store.subscribe(() =>
        setState(() => selector(store.get()))
      );
      return pubSub;
    }, [selector, store]);

    return [state, trackPromise];
  };

  return {
    useAsyncTracker,
    Provider,
  };
};
