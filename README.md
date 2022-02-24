# Express Typescript Template
An opinionated project scaffold for a REST API with express / typescript.

# Technologies & Features
- [server] Express.js
- [language] Typescript
- [nodemon] Hot reloading development environment
- [dotenv] .env parsing into configuration before startup
- [custom] Global configuration files parsed before startup
- [prisma] Database ORM & migrations
- [custom] Sane project structure with middleware, controllers, routes, configuration, exceptions, services, etc.
- [ ] Unit testing

# Project Structure
This project structure is inspired by an older version of Adonis.js. It seemed sane, scalable, and simple.

- ``app/`` - All of the application logic.
	- ``exceptions/`` - Exceptions & Exception handlers
	- ``http/``
		- ``controllers/`` - Route controllers / logic.
		- ``middleware/`` - All HTTP middleware.
	- ``routes/`` - Collection of routers/routes.
	- ``services/`` - Business logic / where the 'how' is implemented.
- ``config/`` - Dedicated, importable configuration files.
- ``prisma/`` - Anything to do with prisma database schemas / migrations. 
- ``server.ts`` - Entry point to the application
- ``.env`` - Environmental variables loaded by DotEnv.

# Resource links
Here are some key resource links that I found useful
## Express
- [Express.js](https://expressjs.com/)
- [Express Routing Guide](https://expressjs.com/en/guide/routing.html)
- [Express Writing Middleware Guide](https://expressjs.com/en/guide/writing-middleware.html)
- [Express Using Middleware Guide](https://expressjs.com/en/guide/using-middleware.html)
- [Express Error Handling](https://expressjs.com/en/guide/error-handling.html)
- [Express Best Practices: Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [Express Best Practices: Performance & Reliability](https://expressjs.com/en/advanced/best-practice-performance.html)


## Typescript
- [Google Typescript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [Typescript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
## Prisma
- [Adding Prisma to an Existing Project](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases-typescript-postgres)
- [Prisma Concepts](https://www.prisma.io/docs/concepts)
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Seeding Your Database](https://www.prisma.io/docs/guides/database/seed-database)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Generating the Client](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/generating-prisma-client)
- [Prisma Data Model](https://www.prisma.io/docs/concepts/components/prisma-schema/data-model)