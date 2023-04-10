import { FileReadError, UnexpectedError } from './errors';

/** Does nothing */
export const noop = (): void => {
  // noop
};

export const blobToArrayBuffer = async (blob: Blob): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // eslint-disable-next-line functional/immutable-data
    reader.onload = () => {
      // We should receive an ArrayBuffer since we use readAsArrayBuffer
      if (!(reader.result instanceof ArrayBuffer)) {
        throw new UnexpectedError(
          'FileReader result should be an ArrayBuffer.'
        );
      }
      resolve(reader.result);
    };
    // eslint-disable-next-line functional/immutable-data
    reader.onerror = () => {
      reject(new FileReadError('FileReader failed to read the file.'));
    };
    reader.readAsArrayBuffer(blob);
  });
};
