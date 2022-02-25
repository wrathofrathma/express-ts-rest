/** Basic router example */

// Import express
import express from 'express';

// Import route controller(s)
import { IndexController } from '../http/controllers/IndexController';

// Create a router instance for our nested routes.
const router = express.Router();

// Assign routes to our router
router.get('/', IndexController.index);

// Export the router
export default router;