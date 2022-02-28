import { PrismaClient, Project } from '@prisma/client'
import NotFoundException from '../exceptions/NotFoundException';
import { AuthService } from './AuthService';
const prisma = new PrismaClient()

/**
 * Project service to handle CRUD operations on projects.
 */
export const ProjectService = {
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
	async update(id: number, userId: number, payload: { title: string}): Promise<Project> {
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

		// Verify the user has permissions to alter this resource
		AuthService.verifyPermissions(project, userId);

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
	async delete(id: number, userId: number): Promise<Project> {
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

		// Verify the user has permissions to alter this resource
		AuthService.verifyPermissions(project, userId);

		// If that didn't throw, then we're free to delete the project.
		await prisma.project.delete({
			where: {
				id
			}
		});

		return project;
	}
}