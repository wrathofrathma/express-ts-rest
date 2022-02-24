/**
 * Base exception class that attaches a HTTP status code to the error.
 * 
 */
export default class BaseException extends Error {
	/**
	 * HTTP Status Code
	 *
	 * @type Number 
	 */
	status: number

	constructor(message: string, status: number) {
		super(message);

		this.status = status;
	}
}