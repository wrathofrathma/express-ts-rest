import { NextFunction, Request, Response } from "express";
import UnprocessableEntityException from "../../exceptions/UnprocessableEntityException";
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
			// Very crude input checking to make sure we don't send null values to the auth service.
			if (!email || !password || !username) {
				throw new UnprocessableEntityException();
			}
			// Have the auth service create the user
			const user = await AuthService.register(username, password, email);
			// Go to the next function in the middleware stack
			return AuthController.login(req, res, next);
		}
		catch (e) {
			// Catch potential errors from the auth service
			return next(e);
		}
	},

	/**
	 * Handles sign in requests
	 * 
	 * @param req {Request} Express request object
	 * @param res {Response} Express response object
	 * @param next {NextFunction} Express NextFunction (used for middleware)
	 */
	async login(req: Request, res: Response, next: NextFunction) {
		// Fetch the parameters from the body.
		const {email, password} = req.body;

		try {
			// Very crude input checking to make sure we don't send null values to the auth service.
			if (!email || !password) {
				throw new UnprocessableEntityException();
			}

			// Have the auth service create the user
			const token = await AuthService.login(email, password);
			// Send the user their information / account info. 
			res.send({token});
			// Go to the next function in the middleware stack
			return next();
		}
		catch (e) {
			// Catch potential errors from the auth service
			return next(e);
		}
	} 
}