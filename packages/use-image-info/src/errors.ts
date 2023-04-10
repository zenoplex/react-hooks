export class UnexpectedError extends Error {
  readonly cause?: Error;
  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'UnexpectedError';
    this.cause = cause;
    this.message = message;
  }
}

export class FileReadError extends Error {
  readonly cause?: Error;
  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'FileReadError';
    this.cause = cause;
    this.message = message;
  }
}
