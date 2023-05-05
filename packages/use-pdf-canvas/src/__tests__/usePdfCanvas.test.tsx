import path from 'path';
import React from 'react';
import { expect, test, describe, afterEach, vi, SpyInstance } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { usePdfCanvas } from '../usePdfCanvas';
// Required for pdfjs
import 'pdfjs-dist/legacy/build/pdf.worker.entry';

const suppressStdout = (): SpyInstance =>
  vi.spyOn(console, 'log').mockImplementation(() => {
    // console.log suppressed
  });

type Props = Parameters<typeof usePdfCanvas>[0];

const Component = (props: Props): JSX.Element => {
  const [setRef] = usePdfCanvas(props);
  return <div data-testid="root" ref={setRef} />;
};

const LazyComponent = (props: Props): JSX.Element => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(false);
  }, []);
  const [ref] = usePdfCanvas(props);
  if (isLoading) return <div>Loading</div>;
  return <div data-testid="root" ref={ref} />;
};

describe('use-pdf-canvas', () => {
  afterEach(cleanup);
  test('Renders nothing if url is falsy', () => {
    const spyFn = suppressStdout();

    const onLoad = vi.fn();
    const onError = vi.fn();

    render(<Component url={null} onLoad={onLoad} onError={onError} />);
    expect(screen.getByTestId('root').children.length).toBe(0);
    expect(onLoad).not.toHaveBeenCalledOnce();
    expect(onError).not.toHaveBeenCalled();

    spyFn.mockRestore();
  });

  test('Should render canvas with component', async () => {
    const spyFn = suppressStdout();
    // 2page pdf
    const url = `file://${path.resolve(__dirname, './sample.pdf')}`;
    const onLoad = vi.fn();
    const onError = vi.fn();
    render(<Component url={url} onLoad={onLoad} />);

    await waitFor(() => {
      expect(screen.getByTestId('root').children.length).toBe(2);
      expect(screen.getByTestId('pdf-canvas-1')).toBeTruthy();
      expect(screen.getByTestId('pdf-canvas-2')).toBeTruthy();
      expect(onLoad).toHaveBeenCalledOnce();
      expect(onError).not.toHaveBeenCalled();
    });

    spyFn.mockRestore();
  });

  test('Should render canvas with LazyComponent', async () => {
    const spyFn = suppressStdout();
    // 2page pdf
    const url = `file://${path.resolve(__dirname, './sample.pdf')}`;
    const onLoad = vi.fn();
    const onError = vi.fn();
    render(<LazyComponent url={url} onLoad={onLoad} onError={onError} />);

    await waitFor(() => {
      expect(screen.getByTestId('root').children.length).toBe(2);
      expect(screen.getByTestId('pdf-canvas-1')).toBeTruthy();
      expect(screen.getByTestId('pdf-canvas-2')).toBeTruthy();
      expect(onLoad).toHaveBeenCalledOnce();
      expect(onError).not.toHaveBeenCalled();
    });
    spyFn.mockRestore();
  });

  test('Should render single canvas with page option', async () => {
    const spyFn = suppressStdout();
    // 2page pdf
    const url = `file://${path.resolve(__dirname, './sample.pdf')}`;
    render(<LazyComponent url={url} pageNum={1} />);

    await waitFor(() => {
      expect(screen.getByTestId('root').children.length).toBe(1);
      expect(screen.getByTestId('pdf-canvas-1')).toBeTruthy();
    });
    spyFn.mockRestore();
  });

  test('Should call onError if pdf is not reachable', async () => {
    const spyFn = suppressStdout();

    const url = `NON_EXISTING_URL`;
    const onLoad = vi.fn();
    const onError = vi.fn();

    render(<LazyComponent url={url} onLoad={onLoad} onError={onError} />);

    await waitFor(() => {
      expect(screen.getByTestId('root').children.length).toBe(0);
      expect(onLoad).not.toHaveBeenCalledOnce();
      expect(onError).toHaveBeenCalledWith(
        // UnknownErrorException is not exported from pdfjs-dist
        expect.any(Error)
      );
      expect(onError).toHaveBeenCalledOnce();
    });
    spyFn.mockRestore();
  });

  test('Should call onError if pdf is password protected', async () => {
    const url = `file://${path.resolve(__dirname, './sample-protected.pdf')}`;
    const onLoad = vi.fn();
    const onError = vi.fn();

    render(<LazyComponent url={url} onLoad={onLoad} onError={onError} />);

    await waitFor(() => {
      expect(screen.getByTestId('root').children.length).toBe(0);
      expect(onLoad).not.toHaveBeenCalledOnce();
      expect(onError).toHaveBeenCalledWith(
        // PasswordException is not exported from pdfjs-dist
        expect.objectContaining({
          name: 'PasswordException',
          message: 'No password given',
          code: 1,
        })
      );
      expect(onError).toHaveBeenCalledOnce();
    });
  });
});
