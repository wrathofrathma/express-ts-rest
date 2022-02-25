import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../services/AuthService";

export const AuthController = {
	/**
	 * Handles registration requests
	 * 
	 * @param req {Request} Express request object
	 * @param res {Response} Express response object
	 * @param next {NextFunction} Express NextFunction (used for middleware)
	 */
	async register(req: Request, res: Response, next: NextFunction) {
		// Fetch the parameters from the body.
		const {username, password, email} = req.body;

		try {
			// Have the auth service create the user
			const user = await AuthService.register(username, password, email);
			// Send the user their information / account info. 
			res.send(user);
			// Go to the next function in the middleware stack
			return next();
		}
		catch (e) {
			// Catch potential errors from the auth service
			return next(e);
		}
	} 
}