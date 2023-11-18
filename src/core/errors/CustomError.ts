export enum ErrorType {
  NotFound = 404,
}

export type CustomErrorContent = {
  message  : string;
  context? : { [key: string]: unknown };
};

export abstract class CustomError extends Error {

  abstract readonly statusCode: number;
  abstract readonly errors: CustomErrorContent[];

  constructor(message: string) {
    super(message);
  }

}
