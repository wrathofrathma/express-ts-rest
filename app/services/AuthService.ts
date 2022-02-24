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
	}
}