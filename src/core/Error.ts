export enum ErrorType {
  NotFound = 404,
}

export class CustomError extends Error {
  constructor(public readonly type: ErrorType, message: string) {
    super(message);
  }
}

export class NotFoundError extends CustomError {
  constructor(nameOfItem: string, id?: string) {
    super(
      ErrorType.NotFound,
      `Not found ${nameOfItem}` + (!!id ? ` with id '${id}'` : "")
    );
  }
}
