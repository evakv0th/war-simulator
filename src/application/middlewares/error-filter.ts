import { Request, Response } from "express";
import HttpException from "../exceptions/http-exceptions";
import HttpStatusCode from "../exceptions/statusCode";

export const exceptionsFilter = (error: HttpException, request: Request, response:Response) => {
    const status = error.status || HttpStatusCode.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Something went wrong';
    response.status(status).send({status, message});
}

