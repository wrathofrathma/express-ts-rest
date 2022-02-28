import BaseException from "./BaseException";

/**
 * Exception class tailored to 403 Forbidden exceptions.
 * 
 * Contains a default error message and sets the HTTP response status.
 */
export default class ForbiddenException extends BaseException {
	constructor(message: string = "Forbidden Access") {
		super(message, 403);
	}
}