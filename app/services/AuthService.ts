import { PrismaClient, Prisma, User } from '@prisma/client'
import ConflictException from '../exceptions/ConflictException';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import UnprocessableEntity from '../exceptions/UnprocessableEntityException';
import NotFoundException from '../exceptions/NotFoundException';
import ForbiddenException from '../exceptions/ForbiddenException';

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
	validate(token: string): boolean {
		// Attempt to validate the token using jsonwebtoken library and the signature we signed it with.
		try {
			jwt.verify(token, config.auth.signature);
		}
		catch (e) {
			return false;
		}

		return true;
	},

	/**
	 * Registers a new user in the database.
	 *  
	 * @param {string} username Username
	 * @param {string} password Password
	 * @param {string} email Email
	 * 
	 * @throws ConflictException
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
	},

	/**
	 * Attempts to log in using email / password validation against the database.
	 *  
	 * @param {string} email Email
	 * @param {string} password Password
	 * 
	 * @throws NotFoundException, UnprocessableEntityException
	 * 
	 * @return {string} JWT token containing the user's information.
	 */
	async login(email: string, password: string): Promise<string> {
		// Find a user using their unique email address.
		const user = await prisma.user.findUnique({
			where: {
				email
			}
		});

		// If the user doesn't exist, throw an error.
		if (!user) {
			throw new NotFoundException();
		}

		if (user.password === password) {
			// user is authenticated and we can make their jwt
			// TODO how the fuck do we make this not ugly. 
			return jwt.sign(
				{id: user.id, email: user.email, username: user.username}, 
				config.auth.signature, 
				{expiresIn: config.auth.expiration});
		}
		else {
			throw new UnprocessableEntity("Invalid Credentials");
		}
	},

	/**
	 * Fetches the user by their ID
	 *  
	 * @param {number} id User ID
	 * 
	 * @throws NotFoundException
	 * 
	 * @return {User} User model containing their data.
	 */
	async getUser(id: number): Promise<User> {
		const user = await prisma.user.findUnique({
			where: {
				id
			}
		});

		if (!user) {
			throw new NotFoundException();
		}
		return user;
	},

}