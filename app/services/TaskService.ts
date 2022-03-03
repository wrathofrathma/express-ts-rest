import { PrismaClient, Task } from '@prisma/client'
import ForbiddenException from '../exceptions/ForbiddenException';
import NotFoundException from '../exceptions/NotFoundException';
import { AuthService } from './AuthService';
import { ProjectService } from './ProjectService';
const prisma = new PrismaClient()

/**
 * Service to handle CRUD operations on tasks.
 */
export const TaskService = {
	/**
	 * Verify user has access to a given task
	 * 
	 * @param {number} id Task ID
	 * @param {number} userId  User ID
	 */
	async verifyPermission(id: number, userId: number): Promise<void> {
		const task = await prisma.task.findUnique({
			where: {
				id
			}
		});
		
		if (!task) {
			throw new NotFoundException();
		}

		await ProjectService.verifyPermission(task.projectId, userId);
	},

	/**
	 * Create a new task for a project
	 * 
	 * @param {number} projectId Project ID
	 * @param {string} description Description of the task.
	 * @param {number} userId  User ID
	 */
	async create(projectId: number, description: string): Promise<Task> {
		return await prisma.task.create({
			data: {
				projectId,
				description
			}
		});
	},

	/**
	 * Returns all tasks related to a project.
	 * 
	 * @param {number} id Project ID
	 * @param {number} userId User ID
	 */
	async index(id: number): Promise<Task[]> {
		return await prisma.task.findMany({
			where: {
				projectId: id
			}
		});
	},
}