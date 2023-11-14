import React from 'react';
import { expect, test, describe, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useClickOutside } from './useClickOutside';
// Required for pdfjs
import 'pdfjs-dist/legacy/build/pdf.worker.entry';

type Props = {
  callback: Parameters<typeof useClickOutside>[0];
};

const Component = ({ callback }: Props): JSX.Element => {
  const [setRef] = useClickOutside(callback);
  return (
    <div data-testid="root">
      <div ref={setRef}>
        <button>inside</button>
      </div>
      <div>
        <button>outside</button>
      </div>
    </div>
  );
};

const LazyComponent = ({ callback }: Props): JSX.Element => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(false);
  }, []);
  const [setRef] = useClickOutside(callback);
  if (isLoading) return <div>Loading</div>;
  return (
    <div data-testid="root">
      <div ref={setRef}>
        <button>inside</button>
      </div>
      <div>
        <button>outside</button>
      </div>
    </div>
  );
};

describe('use-click-outside', () => {
  afterEach(cleanup);

  test('Should call onClickOutside if clicked outside', async () => {
    const onClickOutside = vi.fn();

    render(<Component callback={onClickOutside} />);

    await userEvent.click(screen.getByRole('button', { name: 'outside' }));

    expect(onClickOutside).toHaveBeenNthCalledWith(1, expect.any(MouseEvent));
  });

  test('Should call onClickOutside if clicked outside(lazy)', async () => {
    const onClickOutside = vi.fn();

    render(<LazyComponent callback={onClickOutside} />);

    await userEvent.click(screen.getByRole('button', { name: 'outside' }));

    expect(onClickOutside).toHaveBeenNthCalledWith(1, expect.any(MouseEvent));
  });

  test('Should not call onClickOutside if clicked inside', async () => {
    const onClickOutside = vi.fn();

    render(<Component callback={onClickOutside} />);

    await userEvent.click(screen.getByRole('button', { name: 'inside' }));

    expect(onClickOutside).not.toHaveBeenCalled();
  });

  test('Should not call onClickOutside if clicked inside(lazy)', async () => {
    const onClickOutside = vi.fn();

    render(<LazyComponent callback={onClickOutside} />);

    await userEvent.click(screen.getByRole('button', { name: 'inside' }));

    expect(onClickOutside).not.toHaveBeenCalled();
  });
});
