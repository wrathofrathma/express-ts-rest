/** Basic router example */

// Import express
import express from 'express';

// Import route controller(s)
import { IndexController } from '../http/controllers/IndexController';

// Create a router instance for our nested routes.
const router = express.Router();

// Assign routes to our router
router.get('/', IndexController.index);

// authed example
import AuthMiddleware from '../http/middleware/AuthMiddleware';
// Everywhere below here will require authentication.
router.use(AuthMiddleware);
router.get('/auth', IndexController.index);

// Export the router
export default router;