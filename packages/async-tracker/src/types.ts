export const eventIdentifier = 'async-tracker:in-progress';

export interface Events {
  [eventIdentifier]: { isInProgress: boolean; location: Location };
}
