import { useAsyncTracker, Provider } from '@gen/async-tracker';

import React from 'react';

const Child: React.FC = () => {
  // const { isInProgress } = useAsyncTracker();
  // console.log(isInProgress);

  // return <div>{isInProgress ? 'loading' : 'not loading'}</div>;
  return null;
};

const TextInput = () => {
  const [fieldValue, trackPromise] = useAsyncTracker(
    (store) => store['global']
  );

  const asyncFn = async (): Promise<number> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(123);
      }, 2000);
    });
  };

  const asyncFail = async (): Promise<void> => {
    return new Promise((_resolve, reject) => {
      setTimeout(reject, 2000);
    });
  };

  const a: Promise<number> = trackPromise(asyncFn());

  return (
    <div className="field">
      <input type="checkbox" checked={fieldValue}></input>

      <div>
        <button disabled={fieldValue > 0} onClick={() => void a}>
          button
        </button>
      </div>
      <div>
        <button
          disabled={fieldValue > 0}
          onClick={() => trackPromise(asyncFail())}
        >
          reject
        </button>
      </div>
    </div>
  );
};

export const UseAsyncTracker: React.FC = () => {
  // const { isInProgress } = useAsyncTracker();
  const [state, setState] = React.useState(false);

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

        {state && <Child></Child>}

        <TextInput />
        <TextInput />
      </div>
    </Provider>
  );
};
