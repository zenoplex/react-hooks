import React from 'react';
import usePdfCanvas from '@gen/use-pdf-canvas';

export const UsePdfCanvas: React.FC = () => {
  const [setRef] = usePdfCanvas({
    url: './sample.pdf',
    onError: console.error,
    onLoad: () => {
      console.log('onload');
    },
  });
  return (
    <div>
      <div ref={setRef}></div>
    </div>
  );
};
