import { NextFunction, Request, Response } from "express";
import UnprocessableEntityException from "../../exceptions/UnprocessableEntityException";
import { ProjectService } from "../../services/ProjectService";
import { TaskService } from "../../services/TaskService";

/**
 * Controller to handle task related requests
 */
export const TaskController = {
	/**
	 * Handles the GET request on /projects/:id/tasks and returns all of the tasks related to the project
	 * 
	 * @param req {Request} Express request object
	 * @param res {Response} Express response object
	 * @param next {NextFunction} Express NextFunction (used for middleware)
	 */
	async index(req: Request, res: Response, next: NextFunction) {
		// Fetch the user from the request.
		const user = req.user;

		// Fetch the project id
		const projectId = parseInt(req.params.id);

		// Validate permissions
		await ProjectService.verifyPermission(projectId, user.id);

		// Fetch & send all projects created by the user.
		res.send(await TaskService.index(projectId));

		return next();
	},

	/**
	 * Handles the POST request on /projects/:id/tasks and creates a new task.
	 * 
	 * @param req {Request} Express request object
	 * @param res {Response} Express response object
	 * @param next {NextFunction} Express NextFunction (used for middleware)
	 */
	async create(req: Request, res: Response, next: NextFunction) {
		// Fetch parameters from the body.
		const { description }  = req.body;

		// Fetch the user from the request.
		const user = req.user;

		// Fetch the project
		const projectId = parseInt(req.params.id);

		// Validate permissions
		await ProjectService.verifyPermission(projectId, user.id);

		// Create new task 
		const task = await TaskService.create(projectId, description);

		res.send(task);

		return next();
	},
}