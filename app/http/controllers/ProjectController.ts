import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { NextFunction, Request, Response } from "express";

/**
 * Controller to handle project related requests
 */
export const ProjectController = {
	/**
	 * Handles the GET request on / and returns all of the projects related to the user.
	 * 
	 * @param req {Request} Express request object
	 * @param res {Response} Express response object
	 * @param next {NextFunction} Express NextFunction (used for middleware)
	 */
	async index(req: Request, res: Response, next: NextFunction) {
		// Fetch the user from the request.
		const user = req.user;

		// Fetch & send all projects created by the user.
		res.send(await prisma.project.findMany({
			where: {
				userId: user.id 
			}
		}));

		return next();
	},

	/**
	 * Handles the POST request on / and creates a new project.
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
		const project = await prisma.project.create({
			data: {
				userId: user.id,
				title
			}
		});

		res.send(project);

		return next();
	} 
}