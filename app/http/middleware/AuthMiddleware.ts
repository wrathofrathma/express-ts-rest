import { NextFunction, Request, Response } from "express";
import {AuthService} from '../../services/AuthService'
import UnauthorizedException from '../../exceptions/UnauthorizedException'

/**
 * Dangerous helper function to split the token from the Bearer string, with absolutely 0 checking for indices.
 * 
 * @param header Authorization header
 * @return {string} The raw token.
 */
function splitToken(header: string): string {
	return header.split(' ')[1];
}

/**
 * An example of authentication middleware to create authorized views / routes.
 * 
 * @param req {Request} Express request object
 * @param res {Response} Express response object
 * @param next {NextFunction} Express next function
 */
export default async function (req: Request, res: Response, next: NextFunction) {
	// Check request headers for authorization token of some kind
	if (!req.headers.authorization) {
		return next(new UnauthorizedException());
	}

	const token = splitToken(req.headers.authorization);


	// If the auth service doesn't validate the user	
	if (!AuthService.validate(token)) {
		return next(new UnauthorizedException());
	}

	// Go to the next middleware / controller
	return next()
}