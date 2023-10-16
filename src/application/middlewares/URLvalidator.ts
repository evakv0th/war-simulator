import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/http-exceptions';
import HttpStatusCode from '../exceptions/statusCode';

export const validatorURL = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const validRoutes = ['/api/v1/auth'];

  const requestedUrl = request.originalUrl;

  if (!validRoutes.includes(requestedUrl)) {
    throw new HttpException(
      HttpStatusCode.NOT_FOUND,
      `Requested URL not found on server`);
  } else {
    next();
  }
};
