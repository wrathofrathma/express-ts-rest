import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { NextFunction, Request, Response } from "express";
import UnprocessableEntityException from "../../exceptions/UnprocessableEntityException";
import { AuthService } from "../../services/AuthService";
import { ProjectService } from "../../services/ProjectService";

/**
 * Controller to handle project related requests
 */
export const ProjectController = {
	/**
	 * Handles the GET request on /projects and returns all of the projects related to the user.
	 * 
	 * @param req {Request} Express request object
	 * @param res {Response} Express response object
	 * @param next {NextFunction} Express NextFunction (used for middleware)
	 */
	async index(req: Request, res: Response, next: NextFunction) {
		// Fetch the user from the request.
		const user = req.user;

		// Fetch & send all projects created by the user.
		res.send(await ProjectService.index(user.id));

		return next();
	},

	/**
	 * Handles the POST request on /projects and creates a new project.
	 * 
	 * @param req {Request} Express request object
	 * @param res {Response} Express response object
	 * @param next {NextFunction} Express NextFunction (used for middleware)
	 */
	async create(req: Request, res: Response, next: NextFunction) {
		// Fetch parameters from the body.
		const { title }  = req.body;

		// Fetch the user from the request.
		const user = req.user;

		// Create new project
		const project = await ProjectService.create(user.id, title);

		res.send(project);

		return next();
	},

	/**
	 * Handles the PATCH request on /projects/:id and updates the project by the given id
	 * 
	 * @param req {Request} Express request object
	 * @param res {Response} Express response object
	 * @param next {NextFunction} Express NextFunction (used for middleware)
	 */
	async update(req: Request, res: Response, next: NextFunction) {
		// Fetch parameters from the body. The only editable parameter of a project is its title
		const { title }  = req.body;

		// Some horrible input validation
		if (!title) {
			return next(new UnprocessableEntityException())
		}
		// Fetch project id
		const project_id = parseInt(req.params.id);

		// Fetch the user from the request.
		const user = req.user;

		try {
			res.send(await ProjectService.update(
				project_id,
				user.id,
				{
					title
				}
			));
		}
		catch (e) {
			next(e);
		}


		return next();
	},

	/**
	 * Handles the DELETE request on /projects/:id and deletes the project by the given id
	 * 
	 * @param req {Request} Express request object
	 * @param res {Response} Express response object
	 * @param next {NextFunction} Express NextFunction (used for middleware)
	 */
	async delete(req: Request, res: Response, next: NextFunction) {
		// Fetch the id parameter from the request
		const project_id = parseInt(req.params.id);

		// Fetch the user from the request.
		const user = req.user;

		try {
			res.send(await ProjectService.delete(project_id, user.id));
			return next();
		}
		catch (e) {
			return next(e);
		}
	},
}