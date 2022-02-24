import { NextFunction, Request, Response } from "express";

/**
 * A very basic example of middleware that displays a message in the terminal every time a request hits.
 * 
 * @param req {Request} Express request object
 * @param res {Response} Express response object
 * @param next {NextFunction} Express next function
 */
export default async function (req: Request, res: Response, next: NextFunction) {
	// Display a message
	console.log("Hello world! I am an example of middleware.");

	// Go to the next middleware / controller
	return next()
}