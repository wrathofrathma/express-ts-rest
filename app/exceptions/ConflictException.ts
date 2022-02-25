import BaseException from "./BaseException";

/**
 * Exception class tailored to 409 Conflict exceptions.
 * 
 * Contains a default error message and sets the HTTP response status.
 */
export default class ConflictException extends BaseException {
	constructor(message: string = "Conflict Access") {
		super(message, 409);
	}
}