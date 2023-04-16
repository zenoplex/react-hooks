export class UnexpectedError extends Error {
  readonly cause?: Error;
  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'UnexpectedError';
    this.cause = cause;
    this.message = message;
  }
}

export class ImageLoadError extends Error {
  readonly cause?: Error;
  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'ImageLoadError';
    this.cause = cause;
    this.message = message;
  }
}
