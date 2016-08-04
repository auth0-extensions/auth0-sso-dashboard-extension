export default class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, this.constructor);

    this.message = message;
    this.name = 'ForbiddenError';
  }

  toString() {
    return 'ForbiddenError';
  }
}
