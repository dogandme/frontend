export class HttpError extends Error {
  code: number;
  snackbarOnError: boolean = true;

  constructor({
    code,
    message,
    snackbarOnError = true,
  }: {
    code: number;
    message: string;
    snackbarOnError?: boolean;
  }) {
    super(message);
    this.name = "HttpError";
    this.code = code;
    this.snackbarOnError = snackbarOnError;
  }
}
