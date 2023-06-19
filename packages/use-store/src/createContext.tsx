import React from 'react';

export const createContext = <S extends Record<string, unknown>>(
  initialStore: S
): {
  useStore: <T>(selector: (store: S) => T) => [T, (value: Partial<S>) => void];
  Provider: React.FC<{ children: React.ReactNode }>;
} => {
  type UseStoreInternal = () => {
    get: () => S;
    set: (value: Partial<S>) => void;
    subscribe: (callback: () => void) => () => void;
  };

  /**
   * Setup internal store
   */
  const useStoreInternal: UseStoreInternal = () => {
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

  type UseStoreDataReturnType = ReturnType<typeof useStoreInternal>;

  /** Context for store */
  const StoreContext = React.createContext<UseStoreDataReturnType | null>(null);

  interface Props {
    children: React.ReactNode;
  }

  /** Provider for store context */
  const Provider: React.FC<Props> = ({ children }) => {
    return (
      <StoreContext.Provider value={useStoreInternal()}>
        {children}
      </StoreContext.Provider>
    );
  };

  type UseStore = <T>(
    selector: (store: S) => T
  ) => [T, (value: Partial<S>) => void];

  /** hooks retuning state and setter for store */
  const useStore: UseStore = (selector) => {
    const store = React.useContext(StoreContext);
    if (!store) {
      throw new Error('Provider required for useStore.');
    }

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

    return [state, store.set];
  };

  return {
    Provider,
    useStore,
  };
};
