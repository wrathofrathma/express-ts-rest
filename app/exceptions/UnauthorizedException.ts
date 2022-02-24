import BaseException from "./BaseException";

/**
 * Exception class tailored to 401 Unauthorized exceptions.
 * 
 * Contains a default error message and sets the HTTP response status.
 */
export default class UnauthorizedException extends BaseException {
	constructor(message: string = "Unauthorized Access") {
		super(message, 401);
	}
}