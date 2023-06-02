import React from 'react';

export const createContext = <S extends Record<string, number>>(
  initialStore: S
): {
  useAsyncTracker: <T>(
    selector: (store: S) => T
  ) => [T, <P extends Promise<unknown>>(promise: P, key: keyof S) => P];
  Provider: React.FC<{ children: React.ReactNode }>;
} => {
  type UseStore = () => {
    get: () => S;
    set: (value: Partial<S>) => void;
    subscribe: (callback: () => void) => () => void;
  };

  /**
   * Setup internal store
   */
  const useStore: UseStore = () => {
    const store = React.useRef<S>(initialStore);

    const get = React.useCallback(() => store.current, []);

    const subscribers = React.useRef(new Set<() => void>());

    const set = React.useCallback((value: Partial<S>) => {
      // eslint-disable-next-line functional/immutable-data
      store.current = { ...store.current, ...value };
      subscribers.current.forEach((callback) => callback());
    }, []);

    const subscribe = React.useCallback((callback: () => void) => {
      subscribers.current.add(callback);
      return () => subscribers.current.delete(callback);
    }, []);

    return {
      get,
      set,
      subscribe,
    };
  };

  type UseStoreDataReturnType = ReturnType<typeof useStore>;

  const StoreContext = React.createContext<UseStoreDataReturnType | null>(null);

  interface Props {
    children: React.ReactNode;
  }

  /**
   * Provider for store context
   */
  const Provider: React.FC<Props> = ({ children }) => {
    return (
      <StoreContext.Provider value={useStore()}>
        {children}
      </StoreContext.Provider>
    );
  };

  type TrackPromise = <P extends Promise<unknown>>(
    promise: P,
    key: keyof S
  ) => P;
  type UseAsyncTracker = <T>(selector: (store: S) => T) => [T, TrackPromise];

  const useAsyncTracker: UseAsyncTracker = (selector) => {
    const store = React.useContext(StoreContext);
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
        // Using finally instead of then to avoid changing the promise value
        promise.finally(onResolve);
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
