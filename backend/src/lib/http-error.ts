export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }

  static notFound(message = 'Resource not found') {
    return new HttpError(404, message);
  }

  static badRequest(message: string, details?: unknown) {
    return new HttpError(400, message, details);
  }
}
