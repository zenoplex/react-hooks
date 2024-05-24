import React, { RefCallback } from 'react';

interface UseClickOutside {
  (callback: (e: MouseEvent) => void): [RefCallback<HTMLElement>];
}

export const useClickOutside: UseClickOutside = (callback) => {
  /** Callback reference */
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  /** EventHandler reference */
  const handleMousedownRef = React.useRef<((e: MouseEvent) => void) | null>(
    null
  );
  /** Element reference */
  const elementRef = React.useRef<HTMLElement | null>(null);

  const setRef: RefCallback<HTMLElement> = React.useCallback((node) => {
    if (handleMousedownRef.current) {
      document.removeEventListener('mousedown', handleMousedownRef.current);
      elementRef.current = null;
    }

    if (node) {
      // Can't safely use useCallback() to define event handler
      // because we must make sure to pass the same reference to addEventListener and removeEventListener.
      const handleMousedown = (e: MouseEvent): void => {
        if (!(e.target instanceof Node)) {
          return;
        }
        const isInside =
          elementRef.current && elementRef.current.contains(e.target);

        if (!isInside) {
          callbackRef.current(e);
        }
      };

      handleMousedownRef.current = handleMousedown;
      document.addEventListener('mousedown', handleMousedownRef.current);
    }

    elementRef.current = node;
  }, []);

  return [setRef];
};
