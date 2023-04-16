import React from 'react';
import useImage from '@gen/use-image';

export const UseImage: React.FC = () => {
  const { data, status, load } = useImage();

  React.useEffect(() => {
    load('/file_example_JPG_100kB.jpg');
  }, [load]);

  return (
    <div>
      {status === 'loading' ? <div>loading</div> : null}
      {status === 'success' && data ? <img src={data.src} /> : null}
      {status === 'error' ? <div>error</div> : null}
    </div>
  );
};
