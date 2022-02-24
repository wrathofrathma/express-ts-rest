import { NextFunction, Request, Response } from "express";
import {AuthService} from '../../services/AuthService'
import UnauthorizedException from '../../exceptions/UnauthorizedException'

/**
 * An example of authentication middleware to create authorized views / routes.
 * 
 * @param req {Request} Express request object
 * @param res {Response} Express response object
 * @param next {NextFunction} Express next function
 */
export default async function (req: Request, res: Response, next: NextFunction) {
	// Check request headers for authorization token of some kind
	// We'll just assume the entire authorization header is the token for the example.
	const token = req.headers.authorization ? req.headers.authorization : "";  // auth header or empty string.

	// If the auth service doesn't validate the user	
	if (!AuthService.validate(token)) {
		return next(new UnauthorizedException());
	}

	// Go to the next middleware / controller
	return next()
}