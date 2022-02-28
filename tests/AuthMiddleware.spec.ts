import { test } from '@japa/runner'
import request from 'supertest';
import { app } from '../app';

// Import prisma client so we can directly make calls to our db
import { PrismaClient } from '@prisma/client'
import { AuthService } from '../app/services/AuthService';
// import { expect } from '@japa/expect';
const prisma = new PrismaClient()

// Grouping tests together allows us to use the lifecycle hooks to apply setup / teardown scripts en masse
test.group('AuthMiddleware', (group) => {
  // Variables reused for creating users that don't break our unique constraints.
  const username = "authmiddleware";
  const password = "MySSNForReal";
  const existing_email = "am_user@gmail.com";
  const invalid_token = "Hello world";


  group.setup(async () => {
    // Setup hooks needed before the tests can run. 
    // Creating our temporary accounts
    await prisma.user.create({
      data:{
        email: existing_email,
        username,
        password
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

  test('Valid Token', async ({expect}, done: Function) => {
	// Fetch valid token (I probably shouldn't rely on the AuthService for this)
	const token = await AuthService.login(existing_email, password);

	// Attempt to authenticate against a project related route
    request(app)
      .get('/projects')
      .set( 'Accept', 'application/json')
	  .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(async () => {
        done();
      });
  }).waitForDone();

  test('Invalid Token', async ({expect}, done: Function) => {
	// Attempt to authenticate against a project related route
    request(app)
      .get('/projects')
      .set( 'Accept', 'application/json')
	  .set('Authorization', `Bearer ${invalid_token}`)
      .expect(401)
      .then(async () => {
        done();
      });
  }).waitForDone();

});
