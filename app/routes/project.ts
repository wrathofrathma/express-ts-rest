import express from 'express';

// Import route controller(s)
import { ProjectController } from '../http/controllers/ProjectController';
import { TaskController } from '../http/controllers/TaskController';
import AuthMiddleware from '../http/middleware/AuthMiddleware';

// Create a router instance for our nested routes.
const router = express.Router();

// All of our requests should be authenticated.
router.use(AuthMiddleware);

router.get('/', ProjectController.index);
router.post('/', ProjectController.create);
router.patch('/:id', ProjectController.update);
router.delete('/:id', ProjectController.delete);

// Task related routes
router.get('/:id/tasks', TaskController.index);
router.post('/:id/tasks', TaskController.create);

// Export the router
export default router;