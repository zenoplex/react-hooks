import { vi, expect, test, describe } from 'vitest';
import { trackPromise, emitter, getCount } from '../trackPromise';

describe('trackPromise', () => {
  describe('using global location', () => {
    test('Unresolved promise should count to 1', () => {
      // eslint-disable-next-line functional/immutable-data
      emitter.emit = vi.fn();

      void trackPromise(Promise.resolve());

      expect(emitter.emit).toHaveBeenCalledTimes(1);

      expect(emitter.emit).toHaveBeenCalledWith('async-tracker:in-progress', {
        isInProgress: true,
        location: 'global',
      });
      expect(getCount('global')).toBe(1);
    });

    test('Resolved promise', async () => {
      // eslint-disable-next-line functional/immutable-data
      emitter.emit = vi.fn();

      const pendingPromise = trackPromise(Promise.resolve());
      expect(getCount('global')).toBe(1);
      await pendingPromise;
      expect(getCount('global')).toBe(0);

      expect(emitter.emit).toHaveBeenCalledTimes(2);
      expect(emitter.emit).toHaveBeenNthCalledWith(
        1,
        'async-tracker:in-progress',
        { isInProgress: true, location: 'global' }
      );
      expect(emitter.emit).toHaveBeenNthCalledWith(
        2,
        'async-tracker:in-progress',
        { isInProgress: false, location: 'global' }
      );
    });

    test('Promise rejected', async () => {
      // eslint-disable-next-line functional/immutable-data
      emitter.emit = vi.fn();

      const pendingPromise = trackPromise(Promise.reject('error'));
      expect(getCount('global')).toBe(1);
      await expect(pendingPromise).rejects.toEqual('error');
      expect(getCount('global')).toBe(0);

      expect(emitter.emit).toHaveBeenCalledTimes(2);
      expect(emitter.emit).toHaveBeenNthCalledWith(
        1,
        'async-tracker:in-progress',
        { isInProgress: true, location: 'global' }
      );
      expect(emitter.emit).toHaveBeenNthCalledWith(
        2,
        'async-tracker:in-progress',
        { isInProgress: false, location: 'global' }
      );
    });

    test('Multiple promise resolved', async () => {
      // eslint-disable-next-line functional/immutable-data
      emitter.emit = vi.fn();

      const promises = [
        trackPromise(Promise.resolve()),
        trackPromise(Promise.resolve()),
      ];
      expect(getCount('global')).toBe(2);
      await Promise.all(promises);
      expect(getCount('global')).toBe(0);
      expect(emitter.emit).toHaveBeenCalledTimes(4);
      expect(emitter.emit).toHaveBeenNthCalledWith(
        1,
        'async-tracker:in-progress',
        { isInProgress: true, location: 'global' }
      );
      expect(emitter.emit).toHaveBeenNthCalledWith(
        2,
        'async-tracker:in-progress',
        { isInProgress: true, location: 'global' }
      );
      expect(emitter.emit).toHaveBeenNthCalledWith(
        3,
        'async-tracker:in-progress',
        { isInProgress: true, location: 'global' }
      );
      expect(emitter.emit).toHaveBeenNthCalledWith(
        4,
        'async-tracker:in-progress',
        { isInProgress: false, location: 'global' }
      );
    });

    test('Multiple promises resolved and rejected', async () => {
      // eslint-disable-next-line functional/immutable-data
      emitter.emit = vi.fn();

      const promises = [
        trackPromise(Promise.reject('error')),
        trackPromise(Promise.resolve()),
      ];
      expect(getCount('global')).toBe(2);
      await expect(Promise.all(promises)).rejects.toEqual('error');
      expect(getCount('global')).toBe(0);
      expect(emitter.emit).toHaveBeenCalledTimes(4);
      expect(emitter.emit).toHaveBeenNthCalledWith(
        1,
        'async-tracker:in-progress',
        { isInProgress: true, location: 'global' }
      );
      expect(emitter.emit).toHaveBeenNthCalledWith(
        2,
        'async-tracker:in-progress',
        { isInProgress: true, location: 'global' }
      );
      expect(emitter.emit).toHaveBeenNthCalledWith(
        3,
        'async-tracker:in-progress',
        { isInProgress: true, location: 'global' }
      );
      expect(emitter.emit).toHaveBeenNthCalledWith(
        4,
        'async-tracker:in-progress',
        { isInProgress: false, location: 'global' }
      );
    });

    test('Promise returned must handle transparently the result when resolved', async () => {
      const expectedPromiseResult = 'promise result';
      const promise = Promise.resolve(expectedPromiseResult);

      const trackedPromiseResult = await trackPromise(promise);
      expect(trackedPromiseResult).toEqual(expectedPromiseResult);
    });
  });
});
