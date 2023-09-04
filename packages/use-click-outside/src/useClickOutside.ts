import React, { RefCallback } from 'react';

interface UseClickOutsideOptions {
  onClickOutside: (e: MouseEvent) => void;
}

interface UseClickOutside {
  (options: UseClickOutsideOptions): [RefCallback<HTMLElement>];
}

export const useClickOutside: UseClickOutside = ({ onClickOutside }) => {
  const callbackRef = React.useRef(onClickOutside);
  const clickHandlerRef = React.useRef<((e: MouseEvent) => void) | null>(null);
  const ref = React.useRef<HTMLElement | null>(null);

  const setRef = React.useCallback((node: HTMLElement) => {
    if (ref.current && clickHandlerRef.current) {
      document.removeEventListener('click', clickHandlerRef.current);
    }

    if (node) {
      // Can't safely use useCallback() to define event handler
      // because we must make sure to pass the same value to addEventListener and removeEventListener.
      const handleClick = (e: MouseEvent): void => {
        if (!(e.target instanceof Node)) return;
        const isInside = ref.current && ref.current.contains(e.target);

        if (!isInside) callbackRef.current(e);
      };
      clickHandlerRef.current = handleClick;

      document.addEventListener('click', clickHandlerRef.current);
    }

    // save node reference
    ref.current = node;
  }, []);

  return [setRef];
};
