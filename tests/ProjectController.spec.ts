import { test } from '@japa/runner'
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { app } from '../app';

// Import prisma client so we can directly make calls to our db
import { PrismaClient } from '@prisma/client'
import { config } from '../config';
import { AuthService } from '../app/services/AuthService';
// import { expect } from '@japa/expect';
const prisma = new PrismaClient()

// Grouping tests together allows us to use the lifecycle hooks to apply setup / teardown scripts en masse
test.group('ProjectController', (group) => {
  // Variables reused for creating users that don't break our unique constraints.
  const username = "projectcontroller";
  const password = "MySSNForReal";
  const existing_email = "pc_user@gmail.com";
  const fake_token = "Helloworld"
  const fake_project_id = 13123;

  const created_project_title = "A very good title";
  const existing_project_title = "The best title";
  const updated_project_title = "A new fun title";

  group.setup(async () => {
    // Setup hooks needed before the tests can run. 
    // Creating our temporary accounts
    const user = await prisma.user.create({
      data:{
        email: existing_email,
        username,
        password
      }
    });

	// Creating an existing project
	await prisma.project.create({
		data: {
			userId: user.id,
			title: existing_project_title
		}
	})
  });

  group.teardown(async () => {
    // Teardown / cleanup hook we return here gets run after the tests all complete.
    // Delete all accounts that match the username.
    return await prisma.user.deleteMany({
      where: {
        username
      }
    });
  });

  test('Create Project', async ({expect}, done: Function) => {
	// Fetch valid token (I probably shouldn't rely on the AuthService for this)
	const token = await AuthService.login(existing_email, password);

	// Fetch user whose id we should be checking against
	const user = await prisma.user.findUnique({
		where: {
			email: existing_email
		}
	});

	request(app)
		.post('/projects')
		.set('Accept', 'application/json')
		.set('Authorization', `Bearer ${token}`)
		.send({
			title: created_project_title
		})
		.expect(200)
		.then(async ({body}) => {
			expect(body).toMatchObject({
				title: created_project_title,
				userId: 200
			});
			done();
		});
  }).waitForDone();

  test('Create Project: Not Authenticated', async ({expect}, done: Function) => {
	request(app)
		.post('/projects')
		.set('Accept', 'application/json')
		.set('Authorization', `Bearer ${fake_token}`)
		.send({
			title: created_project_title
		})
		.expect(401)
		.then(async () => {
			done();
		});
  }).waitForDone();

  test('Fetch Project Index', async ({expect}, done: Function) => {
	// Fetch valid token (I probably shouldn't rely on the AuthService for this)
	const token = await AuthService.login(existing_email, password);

	// Fetch user whose id we should be checking against
	const user = await prisma.user.findUnique({
		where: {
			email: existing_email
		}
	});

	request(app)
		.get('/projects')
		.set('Accept', 'application/json')
		.set('Authorization', `Bearer ${token}`)
		.expect(200)
		.then(async ({body}) => {
			expect(body).toMatchObject([
				{
					title: existing_project_title,
					userId: user.id
				},
				{
					title: created_project_title,
					userId: user.id
				}
			]);
			done();
		});
  }).waitForDone();

  test('Fetch Project Index: Not Authenticated', async ({expect}, done: Function) => {
	request(app)
		.get('/projects')
		.set('Accept', 'application/json')
		.set('Authorization', `Bearer ${fake_token}`)
		.expect(401)
		.then(async ({body}) => {
			done();
		});
  }).waitForDone();

  test('Update Project Title: Not Authenticated', async ({expect}, done: Function) => {
	// Fetch user whose id we should be checking against
	const user = await prisma.user.findUnique({
		where: {
			email: existing_email
		}
	});

	// Fetch the existing project so we can use its id
	const project = await prisma.project.findFirst({
		where: {
			userId: user.id,
			title: existing_project_title
		}
	});

	request(app)
		.patch(`/projects/${project.id}`)
		.set('Accept', 'application/json')
		.set('Authorization', `Bearer ${fake_token}`)
		.send({ title: updated_project_title })
		.expect(401)
		.then(async ({body}) => {
			done();
		});

  }).waitForDone();

  test('Update Project Title: Bad Input', async ({expect}, done: Function) => {
	// Fetch valid token (I probably shouldn't rely on the AuthService for this)
	const token = await AuthService.login(existing_email, password);

	// Fetch user whose id we should be checking against
	const user = await prisma.user.findUnique({
		where: {
			email: existing_email
		}
	});

	// Fetch the existing project so we can use its id
	const project = await prisma.project.findFirst({
		where: {
			userId: user.id,
			title: existing_project_title
		}
	});

	request(app)
		.patch(`/projects/${project.id}`)
		.set('Accept', 'application/json')
		.set('Authorization', `Bearer ${token}`)
		.send({ titlef: updated_project_title })
		.expect(422)
		.then(async ({body}) => {
			done();
		});

  }).waitForDone();

  test('Update Project Title: Not Found', async ({expect}, done: Function) => {
	// Fetch valid token (I probably shouldn't rely on the AuthService for this)
	const token = await AuthService.login(existing_email, password);

	// Fetch user whose id we should be checking against
	const user = await prisma.user.findUnique({
		where: {
			email: existing_email
		}
	});

	request(app)
		.patch(`/projects/${fake_project_id}`)
		.set('Accept', 'application/json')
		.set('Authorization', `Bearer ${token}`)
		.send({ title: updated_project_title })
		.expect(404)
		.then(async ({body}) => {
			done();
		});

  }).waitForDone();

  test('Update Project Title', async ({expect}, done: Function) => {
	// Fetch valid token (I probably shouldn't rely on the AuthService for this)
	const token = await AuthService.login(existing_email, password);

	// Fetch user whose id we should be checking against
	const user = await prisma.user.findUnique({
		where: {
			email: existing_email
		}
	});

	// Fetch the existing project so we can use its id
	const project = await prisma.project.findFirst({
		where: {
			userId: user.id,
			title: existing_project_title
		}
	});

	request(app)
		.patch(`/projects/${project.id}`)
		.set('Accept', 'application/json')
		.set('Authorization', `Bearer ${token}`)
		.send({ title: updated_project_title })
		.expect(200)
		.then(async ({body}) => {
			expect(body).toMatchObject({
					title: updated_project_title,
					userId: user.id
			});
			done();
		});

  }).waitForDone();

  test('Delete Project: Not Authenticated', async ({expect}, done: Function) => {
	// Fetch user whose id we should be checking against
	const user = await prisma.user.findUnique({
		where: {
			email: existing_email
		}
	});

	// Fetch the existing project so we can use its id
	const project = await prisma.project.findFirst({
		where: {
			userId: user.id,
			title: updated_project_title 
		}
	});

	request(app)
		.delete(`/projects/${project.id}`)
		.set('Accept', 'application/json')
		.set('Authorization', `Bearer ${fake_token}`)
		.expect(401)
		.then(async ({body}) => {
			done();
		});
  }).waitForDone();

  test('Delete: Not Found', async ({expect}, done: Function) => {
	// Fetch valid token (I probably shouldn't rely on the AuthService for this)
	const token = await AuthService.login(existing_email, password);

	request(app)
		.delete(`/projects/${fake_project_id}`)
		.set('Accept', 'application/json')
		.set('Authorization', `Bearer ${token}`)
		.expect(404)
		.then(async ({body}) => {
			done();
		});

  }).waitForDone();

  test('Delete Project', async ({expect}, done: Function) => {
	// Fetch valid token (I probably shouldn't rely on the AuthService for this)
	const token = await AuthService.login(existing_email, password);

	// Fetch user whose id we should be checking against
	const user = await prisma.user.findUnique({
		where: {
			email: existing_email
		}
	});

	// Fetch the existing project so we can use its id
	const project = await prisma.project.findFirst({
		where: {
			userId: user.id,
			title: updated_project_title 
		}
	});

	request(app)
		.delete(`/projects/${project.id}`)
		.set('Accept', 'application/json')
		.set('Authorization', `Bearer ${token}`)
		.expect(200)
		.then(async ({body}) => {
			expect(body).toMatchObject({
					title: updated_project_title,
					userId: user.id
			});
			done();
		});

  }).waitForDone();
});
