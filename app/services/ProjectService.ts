import { PrismaClient, Project } from '@prisma/client'
import ForbiddenException from '../exceptions/ForbiddenException';
import NotFoundException from '../exceptions/NotFoundException';
const prisma = new PrismaClient()

/**
 * Project service to handle CRUD operations on projects.
 */
export const ProjectService = {
	/**
	 * Verify user has access to a given project.
	 * 
	 * @param {number} id Project ID
	 * @param {number} userId  User ID
	 */
	async verifyPermission(id: number, userId: number): Promise<void> {
		const project = await prisma.project.findUnique({
			where: {
				id
			}
		});
		
		if (!project) {
			throw new NotFoundException();
		}

		if (project.userId !== userId) {
			throw new ForbiddenException();
		}
	},

	/**
	 * Create a new project for a user
	 * 
	 * @param {number} userId  User ID
	 * @param {string} title Title of the project 
	 */
	async create(userId: number, title: string): Promise<Project> {
		return await prisma.project.create({
			data: {
				userId,
				title
			}
		});
	},

	/**
	 * Returns all projects related to a given user id.
	 * 
	 * @param {number} userId User ID
	 */
	async index(userId: number): Promise<Project[]> {
		return await prisma.project.findMany({
			where: {
				userId
			}
		});
	},

	async get() {

	}, 

	/**
	 * Updates an existing project after checking user permissions
	 * 
	 * @param {number} id Project id
	 * @param {number} userId User id that is making the request
	 * @param {object} payload Data values to update.
	 * 
	 * @throws NotFoundException
	 */
	async update(id: number, payload: { title: string}): Promise<Project> {
		// Find the project
		const project = await prisma.project.findUnique({
			where: {
				id
			}
		});

		// If the project doesn't exist. Throw a 404.
		if (!project) {
			throw new NotFoundException();
		}

		// If that didn't throw, then we're free to update the project.
		const {title} = payload;

		return await prisma.project.update({
			where: {
				id
			},
			data: {
				title
			}
		});
	},

	/**
	 * Deletes an existing project after checking user permissions
	 * 
	 * @param {number} id Project id
	 * @param {number} userId User id that is making the request
	 * 
	 * @throws NotFoundException
	 */
	async delete(id: number): Promise<Project> {
		// Find the project
		const project = await prisma.project.findUnique({
			where: {
				id
			}
		});

		// If the project doesn't exist. Throw a 404.
		if (!project) {
			throw new NotFoundException();
		}

		// If that didn't throw, then we're free to delete the project.
		return await prisma.project.delete({
			where: {
				id
			}
		});
	}
}