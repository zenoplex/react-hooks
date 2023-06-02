import { Emitter } from './events';

export const eventIdentifier = 'async-tracker:in-progress';

export const emitter = new Emitter<{
  [eventIdentifier]: { isInProgress: boolean; location: Location };
}>();

type Counter = {
  global: number;
  [key: string]: number;
};

type Location = keyof Counter;

const counter: Counter = {
  global: 0,
};

type GetCount = <T extends Location>(location: T) => number;
export const getCount: GetCount = (location) => counter[location];

type TrackPromise = <T extends Promise<unknown>, K extends Location>(
  promise: T,
  location?: K
) => T;
export const trackPromise: TrackPromise = (promise, location) => {
  // Couldn't use default parameter due to type mismatch
  const loc = location ?? 'global';
  incrementCounter(loc);

  const onResolve = (): void => decrementCounter(loc);
  promise.then(onResolve, onResolve);

  return promise;
};

type IncrementCounter = (location: Location) => void;
const incrementCounter: IncrementCounter = (location) => {
  const count = counter[location];
  // eslint-disable-next-line functional/immutable-data
  counter[location] = count === undefined ? 1 : count + 1;

  const isInProgress = getIsInProgress(location);
  emitter.emit(eventIdentifier, { isInProgress, location });
};

type GetIsInProgress = (location: Location) => boolean;
const getIsInProgress: GetIsInProgress = (location) => counter[location] > 0;

type DecrementCounter = (location: Location) => void;
const decrementCounter: DecrementCounter = (location) => {
  const count = counter[location];
  // eslint-disable-next-line functional/immutable-data
  counter[location] = Math.max(count - 1, 0);

  const isInProgress = getIsInProgress(location);
  emitter.emit(eventIdentifier, { isInProgress, location });
};
