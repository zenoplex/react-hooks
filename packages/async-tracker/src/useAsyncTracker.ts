import React from 'react';
import { emitter, eventIdentifier } from './trackPromise';

export const useAsyncTracker = (): { isInProgress: boolean } => {
  // const [isInProgress, setIsInProgress] = React.useState<boolean>(false);
  // React.useEffect(() => {
  //   const listener = ({ isInProgress, location }: any): void => {
  //     console.log(isInProgress, location);
  //     setIsInProgress(isInProgress);
  //   };
  //   emitter.on(eventIdentifier, listener);

  //   return () => {
  //     emitter.off(eventIdentifier, listener);
  //   };
  // });

  return { isInProgress: false };
};
