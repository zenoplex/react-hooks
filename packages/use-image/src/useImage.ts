import React from 'react';
import { ImageLoadError } from './errors';
import { Result } from './types/result';
import { createErr, createOk } from './utils';

type Status = 'idle' | 'loading' | 'success' | 'error';

type Data = {
  url: string;
  src: HTMLImageElement['src'];
  width: HTMLImageElement['naturalWidth'];
  height: HTMLImageElement['naturalHeight'];
};

type UseImage = () => {
  data: Data | null;
  error: unknown | null;
  status: Status;
  load: (url: string) => Promise<void>;
};

const loadImage = (url: string): Promise<Result<Data, ImageLoadError>> => {
  return new Promise((resolve) => {
    const img = new Image();
    // eslint-disable-next-line functional/immutable-data
    img.onload = () => {
      resolve(
        createOk({
          url,
          src: img.src,
          width: img.naturalWidth,
          height: img.naturalHeight,
        })
      );
    };
    // eslint-disable-next-line functional/immutable-data
    img.onerror = () => {
      resolve(createErr(new ImageLoadError('Failed to load image.')));
    };
    // eslint-disable-next-line functional/immutable-data
    img.src = url;
  });
};

const useImage: UseImage = () => {
  const [data, setData] = React.useState<Data | null>(null);
  const [error, setError] = React.useState<unknown | null>(null);
  const [status, setStatus] = React.useState<Status>('idle');

  const load = React.useCallback(async (url: string) => {
    setStatus('loading');
    const result = await loadImage(url);
    if (result.ok) {
      setStatus('success');
      setData(result.val);
      setError(null);
    } else {
      setStatus('error');
      setData(null);
      setError(result.err);
    }
  }, []);

  return { data, error, status, load };
};

export default useImage;
