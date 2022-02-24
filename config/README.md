# Configuration
This directory should be a collection of configuration files used in our project. 

server.ts is configured to import ``config/index.ts``, so any inclusion / exclusion of configuration files happens there.

# Config files
Configuration files are just typescript files that export an object.

I have most of my configuration optionally overridden by the environmental variables set in .env.

```typescript
// config/app.ts
/**
 * Application related configuration
 */
export default {
	/** 
	The port the web server listens on for connections.
	*/
	port: process.env.PORT ? process.env.PORT : 3000,
}
```