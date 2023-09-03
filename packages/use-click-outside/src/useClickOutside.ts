import React, { RefCallback } from 'react';

interface UseClickOutsideOptions {
  onClickOutside: (e: MouseEvent) => void;
}

interface UseClickOutside {
  (options: UseClickOutsideOptions): [RefCallback<HTMLElement>];
}

export const useClickOutside: UseClickOutside = ({ onClickOutside }) => {
  // prevent useCallback recreation
  const callbackRef = React.useRef(onClickOutside);
  const ref = React.useRef<HTMLElement | null>(null);

  const handleClick = React.useCallback((e: MouseEvent) => {
    if (!(e.target instanceof Node)) return;
    const isInside = ref.current && ref.current.contains(e.target);

    if (!isInside) callbackRef.current(e);
  }, []);

  const setRef = React.useCallback(
    (node: HTMLElement) => {
      if (ref.current) {
        // Make sure to cleanup any events/references added to the last instance
        document.removeEventListener('click', handleClick);
      }

      if (node) {
        document.addEventListener('click', handleClick);
      }

      // save node reference
      ref.current = node;
    },
    [handleClick]
  );

  return [setRef];
};
