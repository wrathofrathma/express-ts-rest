import express from 'express';

// Import route controller(s)
import { TaskController } from '../http/controllers/TaskController';
import AuthMiddleware from '../http/middleware/AuthMiddleware';

// Create a router instance for our nested routes.
const router = express.Router();

// All of our requests should be authenticated.
router.use(AuthMiddleware);

router.patch('/:id', TaskController.update);
router.delete('/:id', TaskController.delete);

// Export the router
export default router;