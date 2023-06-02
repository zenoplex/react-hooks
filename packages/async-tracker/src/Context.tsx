import React from 'react';
import { Emitter } from './events';

type Store = { global: number; other: number };

type Place = keyof Store;

const EMITTER_KEY = 'test';

type EmitterEvent = {
  [EMITTER_KEY]: { isInProgress: boolean; location: Place };
};

type UseStoreData = () => {
  get: () => Store;
  set: (value: Partial<Store>) => void;
  subscribe: (callback: () => void) => () => void;
  emitter: Emitter<EmitterEvent>;
};

const useStoreData: UseStoreData = () => {
  const emitterRef = React.useRef(
    new Emitter<{ test: { isInProgress: boolean; location: Place } }>()
  );
  const store = React.useRef<Record<Place, number>>({
    global: 0,
    other: 0,
  });

  const get = React.useCallback(() => store.current, []);

  const subscribers = React.useRef(new Set<() => void>());

  const set = React.useCallback((value: Partial<Store>) => {
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
    set({ [loc]: newCount });
  });

  return {
    emitter: emitterRef.current,
    get,
    set,
    subscribe,
  };
};

type UseStoreDataReturnType = ReturnType<typeof useStoreData>;

const StoreContext = React.createContext<UseStoreDataReturnType | null>(null);

interface Props {
  children: React.ReactNode;
}

export const Provider: React.FC<Props> = ({ children }) => {
  return (
    <StoreContext.Provider value={useStoreData()}>
      {children}
    </StoreContext.Provider>
  );
};

type TrackPromise = <P extends Promise<unknown>>(promise: P) => P;

type UseAsyncTracker = <T>(selector: (store: Store) => T) => [T, TrackPromise];

export const useAsyncTracker: UseAsyncTracker = (selector) => {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error('Provider missing for useAsyncTracker.');
  }

  const [state, setState] = React.useState(() => selector(store.get()));

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
    return store.subscribe(() => setState(() => selector(store.get())));
  }, [selector, store]);

  // For react 18
  // const state = React.useSyncExternalStore(store.subscribe, () =>
  //   selector(store.get())
  // );

  return [state, trackPromise];
};
