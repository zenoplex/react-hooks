import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist';
import React from 'react';
import { UnexpectedError } from './errors';
import { noop } from './utils';

const cdnPath = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@';

interface UsePdfCanvasOptions {
  /** pdf file url */
  url: string | null;
  /** specify page to render, undefined value will render all pages by default */
  pageNum?: number;
  /** url for workerSrc, defaults to cdn */
  workerSrc?: string;
  /** Callback on loading complete */
  onLoad?: () => void;
  /** Callback on error */
  onError?: (err: Error) => void;
}

interface UsePdfCanvas {
  (options: UsePdfCanvasOptions): [(node: HTMLDivElement) => void];
}

export const usePdfCanvas: UsePdfCanvas = ({
  url,
  pageNum,
  workerSrc = `${cdnPath}${version}/build/pdf.worker.js`,
  onLoad = noop,
  onError = noop,
}) => {
  // prevent useCallback recreation
  const callbackRef = React.useRef({ onLoad, onError });
  const ref = React.useRef<HTMLDivElement | null>(null);
  const setRef = React.useCallback(
    async (node: HTMLDivElement) => {
      if (ref.current) {
        // Cleanup
        ref.current.innerHTML = '';
      }

      if (node) {
        if (!url) return;

        // eslint-disable-next-line functional/immutable-data
        GlobalWorkerOptions.workerSrc = workerSrc;

        const canvasWrapper = node;

        try {
          const pdf = await getDocument({
            url,
            cMapUrl: `${cdnPath}${version}/cmaps/`,
            cMapPacked: true,
          }).promise;

          const pageNums: number[] = pageNum
            ? [pageNum]
            : [...(new Array(pdf.numPages) as number[])].map(
                (_, idx) => idx + 1
              );
          const promises = pageNums.map((n) => pdf.getPage(n));
          const pdfPages = await Promise.all(promises);

          for await (const page of pdfPages) {
            const canvas = document.createElement('canvas');
            const viewport = page.getViewport({
              // setting pixel density to 2x for retina display
              scale: Math.max(window.devicePixelRatio, 2),
            });
            const canvasContext = canvas.getContext('2d');

            if (!canvasContext) {
              throw new UnexpectedError('canvasContext is null');
            }

            // eslint-disable-next-line functional/immutable-data
            canvas.width = viewport.width;
            // eslint-disable-next-line functional/immutable-data
            canvas.height = viewport.height;
            canvas.setAttribute('data-testid', `pdf-canvas-${page.pageNumber}`);
            canvasWrapper.appendChild(canvas);

            const renderTask = page.render({
              canvasContext,
              viewport,
            });
            await renderTask.promise;
          }
          callbackRef.current.onLoad();
        } catch (err) {
          if (err instanceof Error) {
            callbackRef.current.onError(err);
            return;
          }
          callbackRef.current.onError(
            new UnexpectedError('Loading pdf failed.')
          );
        }
      }

      // save node reference
      ref.current = node;
    },
    [url, workerSrc, pageNum]
  );

  return [setRef];
};
