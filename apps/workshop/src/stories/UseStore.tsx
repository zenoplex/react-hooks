import React from 'react';
import createContext from '@gen/use-store';

const { useStore, Provider } = createContext({ global: 0, other: 0 });

const Second: React.FC = () => {
  const [count, update] = useStore((store) => store.other);

  const handleClick = (): void => {
    update({ other: count + 1 });
  };
  return (
    <div className="bg-slate-200">
      <div data-testid="other-count">Other count: {count}</div>
      <button onClick={handleClick}>{`other ${count}`}</button>
    </div>
  );
};

const First: React.FC = () => {
  const [count, update] = useStore((store) => store.global);

  const handleClick = (): void => {
    update({ global: count + 1 });
  };

  return (
    <div>
      <div data-testid="global-count">Global count: {count}</div>
      <div>
        <button onClick={handleClick}>{`global ${count}`}</button>
      </div>
    </div>
  );
};

const Buttons: React.FC = () => {
  const [state, update] = useStore((store) => store);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const { value } = e.currentTarget;
    if (value !== 'global' && value !== 'other') return;
    update({ [value]: state[value] + 1 });
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

export const UseStore: React.FC = () => {
  return (
    <Provider>
      <First />
      <Second />
      <Buttons />
    </Provider>
  );
};
