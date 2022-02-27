// Import dotenv as early as possible in the runtime.
import 'dotenv/config';
// Import configuration objects
import app from './app';
import auth from './auth';


/** Configuration loaded from ``config/`` & environmental variables */
export const config = {
	app,
	auth
}