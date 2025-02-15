export class CustomError extends Error {
  constructor(
    public statusCode: number,
    message?: string
  ) {
    super(message);
    this.statusCode = statusCode;
  }
  public get() {
    return `Error ${this.statusCode}: ${this.message}`;
  }
}
