export class ApplicationError extends Error {
  public statusCode: number;
  public details: string[];

  constructor(statusCode: number, message: string, details: string[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = "ApplicationError";
  }
}
