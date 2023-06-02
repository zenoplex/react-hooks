import { createContext } from '@gen/async-tracker';
import React from 'react';

const { Provider, useAsyncTracker } = createContext({
  global: 0,
  other: 0,
});

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = (props) => {
  return (
    <button
      {...props}
      type="button"
      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    ></button>
  );
};

const GlobalStatus: React.FC = () => {
  const [count] = useAsyncTracker((store) => store.global);

  return <div>{count > 0 ? 'global loading' : 'global not loading'}</div>;
};

const OtherStatus: React.FC = () => {
  const [count] = useAsyncTracker((store) => store.other);

  return <div>{count > 0 ? 'other loading' : 'other not loading'}</div>;
};

const LoadGlobal: React.FC = () => {
  const [count, trackPromise] = useAsyncTracker((store) => store.global);

  const asyncFn = async (): Promise<number> => {
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });

    return Date.now();
  };

  return (
    <div>
      <Button
        disabled={count > 0}
        onClick={() => void trackPromise(asyncFn(), 'global')}
      >
        global load
      </Button>
    </div>
  );
};

const LoadOther: React.FC = () => {
  const [count, trackPromise] = useAsyncTracker((store) => store.other);

  const asyncFail = async (): Promise<number> => {
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
    throw new Error('fail');
  };

  return (
    <div>
      <Button
        disabled={count > 0}
        onClick={() => void trackPromise(asyncFail(), 'other')}
        // onClick={() => asyncFail()}
      >
        other load
      </Button>
    </div>
  );
};

export const UseAsyncTracker: React.FC = () => {
  // const { isInProgress } = useAsyncTracker();
  const [state, setState] = React.useState(true);

  // const onClick = async (): Promise<void> => {
  //   await trackPromise(asyncFn());
  // };

  return (
    <Provider>
      <div>
        <button
          type="button"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          // disabled={isInProgress}
          // onClick={() => void onClick()}
        >
          {/* {isInProgress ? 'Loading...' : 'Click me'} */}
        </button>

        <label>
          <input type="checkbox" onChange={() => setState((s) => !s)}></input>
          Show child
        </label>

        {state && (
          <div>
            <GlobalStatus />
            <OtherStatus />
          </div>
        )}

        <LoadGlobal />
        <LoadOther />
      </div>
    </Provider>
  );
};
