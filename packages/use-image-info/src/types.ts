export type UrlToWorker = { type: 'setUrl'; payload: { url: string } };

type Color = 'full' | 'limited';

export interface ImageInfo {
  resolution: { width: number; height: number; dpi: number };
  color: Color;
}

export type SuccessFromWorker = { type: 'success'; payload: ImageInfo };

export type ErrorFromWorker = { type: 'error'; payload: Error };

export type Nullable<T> = { [K in keyof T]: T[K] | null };
