import express from 'express';

import { AuthController } from '../http/controllers/AuthController';

const router = express.Router();

router.post('/register', AuthController.register);

// Export the router
export default router;