import { EventEmitter } from 'events';

type EventMap = Record<string, unknown>;
type EventKey<T extends EventMap> = string & keyof T;
type EventReceiver<T> = (params: T) => void;

/**
 * Typed emitter
 */
export class Emitter<T extends EventMap> {
  private emitter = new EventEmitter();

  on = <K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void => {
    this.emitter.on(eventName, fn);
  };

  off = <K extends EventKey<T>>(
    eventName: K,
    fn: EventReceiver<T[K]>
  ): void => {
    this.emitter.off(eventName, fn);
  };

  emit = <K extends EventKey<T>>(eventName: K, params: T[K]): void => {
    this.emitter.emit(eventName, params);
  };
}
