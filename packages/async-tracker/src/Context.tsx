import React from 'react';
import { Emitter } from './events';

// type Store = { global: number; [key: string]: number };

// type Place = 'global' & string;

const EMITTER_KEY = 'test';

// type EmitterEvent = {
//   [EMITTER_KEY]: { isInProgress: boolean; location: Place };
// };

// type UseStoreData = <T extends Record<string, number>>(
//   initialStore: T
// ) => {
//   get: () => T;
//   set: (value: Partial<T>) => void;
//   subscribe: (callback: () => void) => () => void;
//   emitter: Emitter<{
//     [EMITTER_KEY]: { isInProgress: boolean; location: keyof T };
//   }>;
// };

const useStoreData = <T extends Record<string, number>>(
  initialStore: T
): {
  get: () => T;
  set: (value: Partial<T>) => void;
  subscribe: (callback: () => void) => () => void;
  emitter: Emitter<{
    [EMITTER_KEY]: { isInProgress: boolean; location: keyof T };
  }>;
} => {
  const emitterRef = React.useRef(
    new Emitter<{
      [EMITTER_KEY]: { isInProgress: boolean; location: keyof T };
    }>()
  );
  const store = React.useRef<T>(initialStore);

  const get = React.useCallback(() => store.current, []);

  const subscribers = React.useRef(new Set<() => void>());

  const set = React.useCallback((value: Partial<T>) => {
    // eslint-disable-next-line functional/immutable-data
    store.current = { ...store.current, ...value };
    subscribers.current.forEach((callback) => callback());
  }, []);

  const subscribe = React.useCallback((callback: () => void) => {
    subscribers.current.add(callback);
    return () => subscribers.current.delete(callback);
  }, []);

  emitterRef.current.on(EMITTER_KEY, ({ isInProgress, location }) => {
    const loc = location ?? 'global';
    const count = store.current[loc];
    const newCount = isInProgress ? count + 1 : Math.max(count - 1, 0);
    set({ [loc]: newCount } as Partial<T>);
  });

  return {
    emitter: emitterRef.current,
    get,
    set,
    subscribe,
  };
};

type UseStoreDataReturnType = ReturnType<
  typeof useStoreData<Record<string, number>>
>;

const StoreContext = React.createContext<UseStoreDataReturnType | null>(null);

interface Props {
  store?: Record<string, number>;
  children: React.ReactNode;
}

export const Provider: React.FC<Props> = ({
  store = { global: 0 },
  children,
}) => {
  return (
    <StoreContext.Provider value={useStoreData(store)}>
      {children}
    </StoreContext.Provider>
  );
};

type TrackPromise = <P extends Promise<unknown>>(promise: P) => P;

// type UseAsyncTracker = <T>(selector: (store: Store) => T) => [T, TrackPromise];

export const useAsyncTracker = <S, T>(
  selector: (store: S) => T
): [T, TrackPromise] => {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error('Provider missing for useAsyncTracker.');
  }

  const [state, setState] = React.useState(() => selector(store.get() as S));

  const trackPromise = React.useCallback<TrackPromise>(
    (promise) => {
      store.emitter.emit(EMITTER_KEY, {
        isInProgress: true,
        location: 'global',
      });

      const onResolve = (): void => {
        store.emitter.emit(EMITTER_KEY, {
          isInProgress: false,
          location: 'global',
        });
      };
      promise.then(onResolve, onResolve);
      return promise;
    },
    [store.emitter]
  );

  // Subscribe to store changes
  React.useEffect(() => {
    return store.subscribe(() => setState(() => selector(store.get() as S)));
  }, [selector, store]);

  // For react 18
  // const state = React.useSyncExternalStore(store.subscribe, () =>
  //   selector(store.get())
  // );

  return [state, trackPromise];
};
