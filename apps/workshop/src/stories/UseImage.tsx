import React from 'react';
import useImage from '@gen/use-image';

export const UseImage: React.FC = () => {
  const { data, status, load } = useImage();

  const inputRef = React.useRef<HTMLInputElement>(null);

  const onSubmit = React.useCallback<React.FormEventHandler>(
    (e) => {
      e.preventDefault();
      if (!inputRef.current) return;

      load(inputRef.current.value);
    },
    [load]
  );

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label htmlFor="url">url</label>
        <input
          ref={inputRef}
          id="url"
          type="text"
          name="url"
          defaultValue="/200x200.jpg"
        />
        <button type="submit">load</button>
      </form>

      <div data-testid="result">
        {status === 'loading' ? <div>loading</div> : null}
        {status === 'success' && data ? (
          <img alt="image" src={data.src} />
        ) : null}
        {status === 'error' ? <div>error</div> : null}
      </div>
    </div>
  );
};
