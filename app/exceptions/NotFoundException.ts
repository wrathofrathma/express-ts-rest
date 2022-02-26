import BaseException from "./BaseException";

/**
 * Exception class tailored to 404 Not Found exceptions.
 * 
 * Contains a default error message and sets the HTTP response status.
 */
export default class NotFoundException extends BaseException {
	constructor(message: string = "Resource Not Found") {
		super(message, 404);
	}
}