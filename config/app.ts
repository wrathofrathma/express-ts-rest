/**
 * Application related configuration
 */
export default {
	/** 
	* The port the web server listens on for connections.
	*/
	port: process.env.PORT ? process.env.PORT : 3000,

	/** 
	* Json web token secret used for signing and verifying tokens.
	*/
	jwtSignature: "Hello world"
}