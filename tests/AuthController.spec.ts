import { test } from '@japa/runner'
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { app } from '../app';

// Import prisma client so we can directly make calls to our db
import { PrismaClient } from '@prisma/client'
import { config } from '../config';
// import { expect } from '@japa/expect';
const prisma = new PrismaClient()

// Grouping tests together allows us to use the lifecycle hooks to apply setup / teardown scripts en masse
test.group('AuthController', (group) => {
  // Variables reused for creating users that don't break our unique constraints.
  const username = "authcontroller";
  const password = "MySSNForReal";
  const wrong_password = "NotMySSN";
  const existing_email = "ac_user@gmail.com";
  const register_email = "ac_user1@gmail.com";
  const non_existent_email = "ac_bad_user@gmail.com";

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

  test('User Registration', async ({expect}, done: Function) => {
    request(app)
      .post('/auth/register')
      .send({ username, password, email: register_email})
      .set( 'Accept', 'application/json')
      .expect(200)
      .then(async ({ body } ) => {
        // Check that the body has a token
        expect(body).toHaveProperty("token");
        // Extract token from the body
        const { token } = body;
        // Token should be truthy since it's not empty / null
        expect(token).toBeTruthy();
        // We should be able to validate / verify the token using jsonwebtoken. So we expect it not to throw any errors.
        expect(() => jwt.verify(token, config.auth.signature)).not.toThrow();
        done();
      });
  }).waitForDone();

  test('User Registration: Duplicate', async ({expect}) => {
    request(app)
      .post('/auth/register')
      .send({ username, password, email: register_email})
      .set( 'Accept', 'application/json')
      .expect(409)
      .then(async ({ body } ) => {
        // Expect the body to have our message property
        expect(body).toHaveProperty("message");

        // Expect the message to say the email is already registered.
        const {message} = body;
        expect(message).toBe("Email address already registered.");
      });
  });

  test('User Login', async ({expect}, done: Function) => {
    request(app)
      .post('/auth/login')
      .send( { email: existing_email, password })
      .set( 'Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        // Check that the body has a token
        expect(body).toHaveProperty("token");
        // Extract token from the body
        const { token } = body;
        // Token should be truthy since it's not empty / null
        expect(token).toBeTruthy();
        // We should be able to validate / verify the token using jsonwebtoken. So we expect it not to throw any errors.
        expect(() => jwt.verify(token, config.auth.signature)).not.toThrow();
        done();
      })
  }).waitForDone();

  test('User Login: Invalid Credentials', async ({ expect}, done: Function) => {
    request(app)
      .post('/auth/login')
      .send( { email: existing_email, password: wrong_password })
      .set( 'Accept', 'application/json')
      .expect(422)
      .then(({ body }) => {
        expect(body).toHaveProperty("message");
        // Parse message out
        const { message } = body;
        // Test the exect error message
        expect(message).toBe("Invalid Credentials")
        done();
      })
  }).waitForDone();

  test('User Login: Not Found', async ({ expect}, done: Function) => {
    request(app)
      .post('/auth/login')
      .send( { email: non_existent_email, password: wrong_password })
      .set( 'Accept', 'application/json')
      .expect(404)
      .then(({ body }) => {
        expect(body).toHaveProperty("message");
        // Parse message out
        const { message } = body;
        // Test the exect error message
        expect(message).toBe("Resource Not Found")
        done();
      })
  }).waitForDone();
});
