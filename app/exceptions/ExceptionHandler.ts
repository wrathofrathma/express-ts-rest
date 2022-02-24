import { NextFunction, Request, Response } from "express";
import BaseException from "./BaseException";

/**
 * Custom error handler that sends a JSON response containing the error message, and an appropriate status code.
 * 
 * @param err {BaseException} Custom exception class that includes a status code.
 * @param req {Request} Express request object
 * @param res {Response} Express response object
 * @param next {NextFunction} Express NextFunction
 */
export default async function (err: BaseException, req: Request, res: Response, next: NextFunction) {
	// If headers have been sent, we must defer to the default express handler.
	if (res.headersSent) {
		return next(err);
	}

	// If the exception is one we're expecting, we have a status code for it. 
	// Otherwise, use 400.
	err.status ? res.status(err.status) : res.status(400);

	// Send a JSON response since this template is mostly for APIs
	res.send({
		"status": err.status,
		"message": err.message
	});

}