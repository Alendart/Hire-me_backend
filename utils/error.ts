import {NextFunction, Request, Response} from "express";

export class ValidationError extends Error {
}


export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {

    res.status(err instanceof ValidationError ? 400 : 500)
    res.json(err instanceof ValidationError ? err : "Wystąpił błąd, spróbuj ponownie później")
}
