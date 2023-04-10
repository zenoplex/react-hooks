import React from 'react';
import { expect, test, describe, afterEach, vi, SpyInstance } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { useImageInfo } from '../useImageInfo';
// Required for pdfjs
import 'pdfjs-dist/legacy/build/pdf.worker.entry';

type Props = Parameters<typeof useImageInfo>[0];

describe('useImageInfo', () => {
  afterEach(cleanup);
  test('Renders nothing if url is falsy', () => {});
});
