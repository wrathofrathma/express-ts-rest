import { test } from '@japa/runner'
import ConflictException from '../app/exceptions/ConflictException';
import { AuthService } from "../app/services/AuthService";
import jwt from 'jsonwebtoken';

// Import prisma client so we can directly make calls to our db
import { PrismaClient } from '@prisma/client'
import { config } from '../config';
import NotFoundException from '../app/exceptions/NotFoundException';
import UnprocessableEntityException from '../app/exceptions/UnprocessableEntityException';
const prisma = new PrismaClient()

// Grouping tests together allows us to use the lifecycle hooks to apply setup / teardown scripts en masse
test.group('AuthService', (group) => {
  const username = "authservice";
  const password = "MySSNForReal";
  const wrong_password = "NotMySSN";
  const existing_email = "as_user1@gmail.com"
  const register_email = "as_user2@gmail.com"
  const non_existent_email = "as_bad_user@gmail.com"

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
  })

  group.teardown(async () => {
    // Teardown / cleanup hook we return here gets run after the tests all complete.
    // Delete all accounts that match the username.
    return await prisma.user.deleteMany({
      where: {
        username
      }
    });
  });

  test('User Registration', async ({ expect }, done: Function) => {
    const user = await AuthService.register(username, password, register_email);

    expect(user).toMatchObject({
      username,
      password,
      email: register_email
    });
  });

  test('User Registration: Duplicate', async ({ expect }) => {
    // Attempt to register the existing user
    await expect(async () => {
      await AuthService.register(username, password, existing_email)
    }).rejects.toThrow(ConflictException);
  });

  test('User Login', async({ expect }) => {
    // Test log in.
    const token = await AuthService.login(existing_email, password);

    // verify the token returned is valid by making sure this doesn't throw any exceptions
    expect(() => {
      jwt.verify(token, config.auth.signature)
    }).not.toThrow();
  });

  test('User Login: Invalid Credentials', async ({ expect }, done: Function) => {
    // Test logging in using the wrong password
    await expect(async () => {
      await AuthService.login(existing_email, wrong_password);
    }).rejects.toThrow(UnprocessableEntityException);
    
  });

  test('User Login: Not Found', async ({ expect }) => {
    // Test logging in (knowing there is no user in the db right now)
    await expect(async () => {
      await AuthService.login(non_existent_email, password)
    }).rejects.toThrow(NotFoundException);
  });
});
