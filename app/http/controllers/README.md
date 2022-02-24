# Controllers
Controllers are the logic behind a route/endpoint.

This structure helps clean up route files by moving inline route handlers to their own files.

# Definitions
Right now I'm defining route controllers as an object containing route handlers. If anyone knows a cleaner or more convenient way, I'm all ears.

```typescript
import { NextFunction, Request, Response } from "express";

/**
 * Basic controller to handle requests on /
 */
export const IndexController = {
	/**
	 * Handles the default request on /
	 * 
	 * @param req {Request} Express request object
	 * @param res {Response} Express response object
	 * @param next {NextFunction} Express NextFunction (used for middleware)
	 */
	index(req: Request, res: Response, next: NextFunction) {
		res.send("Welcome to Rathma's express.js / typescript template.");

		return next();
	} 
}
```

# Assigning a route controller
Below is a minimal example of how to import and use a route controller for a specific route.

```typescript

// Import route controller(s)
...
import { IndexController } from '../http/controllers/IndexController';

...

// Assign routes to our router
router.get('/', IndexController.index);
...
```