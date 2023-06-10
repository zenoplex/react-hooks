import React from 'react';
import createContext from '@gen/use-async-tracker';

const { useAsyncTracker, Provider } = createContext({ global: 0, other: 0 });

const wait = async (ms = 1000): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const Second: React.FC = () => {
  const [count, trackAsync] = useAsyncTracker((store) => store.other);

  const handleClick = async (): Promise<void> => {
    await trackAsync(wait(), 'other');
  };
  return (
    <div className="bg-slate-200">
      <div data-testid="other-count">Other count: {count}</div>
      <button disabled={count > 0} onClick={() => void handleClick()}>
        {count > 0 ? 'loading...' : 'load other'}
      </button>
    </div>
  );
};

const First: React.FC = () => {
  const [count, trackAsync] = useAsyncTracker((store) => store.global);

  const handleClick = async (): Promise<void> => {
    await trackAsync(wait(), 'global');
  };

  return (
    <div>
      <div data-testid="global-count">Global count: {count}</div>
      <div>
        <button disabled={count > 0} onClick={() => void handleClick()}>
          {count > 0 ? 'loading...' : 'load global'}
        </button>
      </div>
    </div>
  );
};

const Buttons: React.FC = () => {
  const [, trackAsync] = useAsyncTracker((store) => store.global);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const { value } = e.currentTarget;
    if (value !== 'global' && value !== 'other') return;
    void trackAsync(wait(), value);
  };

  return (
    <div className="flex flex-col items-start">
      <button value="global" onClick={handleClick}>
        load global 2
      </button>
      <button value="other" onClick={handleClick}>
        load other 2
      </button>
    </div>
  );
};

export const UseAsyncTracker: React.FC = () => {
  return (
    <Provider>
      <First />
      <Second />
      <Buttons />
    </Provider>
  );
};
