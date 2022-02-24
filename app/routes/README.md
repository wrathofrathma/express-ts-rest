# Routes
This folder should contain all of our logic for routing requests to specific controllers. 

By moving routing logic to their own files / routers, we clean up the top level server.ts file.

For more information, visit [Express.js Routing Documentation](https://expressjs.com/en/guide/routing.html)

# Minimal router example
```typescript
// app/routes/index.ts
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
```

```typescript
// server.ts
...
/** Import routers from ``app/routes/index`` **/
import indexRouter from './app/routes/index';

/** Configure application to use routers **/
app.use('/', indexRouter);
...
```