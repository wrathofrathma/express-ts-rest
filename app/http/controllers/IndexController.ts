import { NextFunction, Request, Response } from "express";

/**
 * Basic controller to handle requests on /
 */
export const IndexController = {
	/**
	 * Handles the default request on /
	 * 
	 * @param req {Request} Express request object
	 * @param res {Response} Express response object
	 * @param next {NextFunction} Express NextFunction (used for middleware)
	 */
	index(req: Request, res: Response, next: NextFunction) {
		res.send("Welcome to Rathma's express.js / typescript template.");

		return next();
	} 
}