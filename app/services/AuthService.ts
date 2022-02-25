import { PrismaClient, Prisma, User } from '@prisma/client'
import ConflictException from '../exceptions/ConflictException';
const prisma = new PrismaClient()

/**
 * An example of an authorization service to validate authorization tokens, or attempt sign ins.
 */
export const AuthService = {
	/**
	 * Validates an authorization token for authentication.
	 *  
	 * @param token Authorization token attached to the HTTP header.
	 * @return {boolean} True if their token is valid, false if it isn't.
	 */
	validate(token: String): boolean {
		if (token.length != 0) {
			return true;
		}
		return false;
	},

	/**
	 * Registers a new user in the database.
	 *  
	 * @param {string} username Username
	 * @param {string} password Password
	 * @param {string} email Email
	 * 
	 * @throws 
	 * 
	 * @return {User} Returns the new user.
	 */
	async register(username: string, password: string, email: string): Promise<User> {
		try {
			const user = await prisma.user.create({
				data: {
					username,
					password,
					email
				}
			});

			return user;
		}
		// Catch any database errors and convert them into prettier HTTP errors.
		catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				throw new ConflictException("Email address already registered.");
			}
		}
	}
}