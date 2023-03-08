import {NextFunction, Request, Response} from "express";
import "express-async-errors"

export class ValidationError extends Error {
}


export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {

    res.status(err instanceof ValidationError ? 400 : 500)
    res.json(err instanceof ValidationError ? {err: err.message} : {err: "Wystąpił błąd, spróbuj ponownie później"})
}
