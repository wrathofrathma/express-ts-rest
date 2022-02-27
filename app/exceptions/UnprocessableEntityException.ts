import BaseException from "./BaseException";

/**
 * Exception class tailored to 422 unprocessable entity status code.
 * 
 * Contains a default error message and sets the HTTP response status.
 */
export default class UnprocessableEntityException extends BaseException {
	constructor(message: string = "UnprocessableEntity") {
		super(message, 422);
	}
}