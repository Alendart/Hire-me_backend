import {NextFunction, Request, Response} from "express";

export class ValidationError extends Error {
}


export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {

}
