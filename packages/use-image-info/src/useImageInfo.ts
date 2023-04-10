import React from 'react';
import { ImageInfo, Nullable, SuccessFromWorker } from './types';

type Status = 'idle' | 'loading' | 'success' | 'error';

type Data = Nullable<ImageInfo>;

type UseImageInfo = () => {
  data: Nullable<ImageInfo>;
  error: unknown | null;
  status: Status;
  check: (file: File) => Promise<void>;
};

const useImageInfo: UseImageInfo = () => {
  const [data, setData] = React.useState<Data>({
    resolution: null,
    color: null,
  });
  const [error, setError] = React.useState<unknown | null>(null);
  const [status, setStatus] = React.useState<Status>('idle');

  const worker = React.useMemo(() => {
    return new Worker('./worker.ts');
  }, []);

  const check = React.useCallback(
    async (file: File) => {
      setStatus('loading');
      try {
        const url = URL.createObjectURL(file);

        worker.postMessage(url);
        // eslint-disable-next-line functional/immutable-data
        worker.onmessage = (event: MessageEvent<SuccessFromWorker>) => {
          const { payload } = event.data;
          setData({
            resolution: payload.resolution,
            color: payload.color,
          });
          setStatus('success');
        };

        URL.revokeObjectURL(url);
      } catch (err) {
        setError(err);
        setStatus('error');
      }
    },
    [worker]
  );

  React.useEffect(() => {
    return () => {
      worker.terminate();
    };
  }, [worker]);

  return { data, error, status, check };
};

export default useImageInfo;
