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
  // Inbetween tests, let's delete all of the user records we create.
  group.each.setup(async () => {
    await prisma.user.deleteMany({});
  })

  test('User Registration', async ({ expect }) => {
    const username = "Rathma";
    const password = "MySSNForReal";
    const email = "rathma@kyso.dev";

    const user = await AuthService.register(username, password, email);
    expect(user).toMatchObject({
      username,
      password,
      email
    });
  });

  test('User Registration Duplicate', async ({ expect }) => {
    const username = "Rathma";
    const password = "MySSNForReal";
    const email = "rathma@kyso.dev";

    // Create the user once.
    await AuthService.register(username, password, email);

    // Do it again, but it should fail.
    expect(async () => {
      await AuthService.register(username, password, email)
    }).rejects.toThrow(ConflictException);
  });

  test('User login', async({ expect }) => {
    const username = "Rathma";
    const password = "MySSNForReal";
    const email = "rathma@kyso.dev";

    // Create the user
    await AuthService.register(username, password, email);

    // Test log in.
    const token = await AuthService.login(email, password);

    // verify the token returned is valid by making sure this doesn't throw any exceptions
    expect(() => {
      jwt.verify(token, config.auth.signature)
    }).not.toThrow();
  });

  test('User invalid login credentials', async ({ expect }) => {
    const username = "Rathma";
    const password = "MySSNForReal";
    const wrong_password = "Definitely not my ssn";
    const email = ""

    // Create the user
    await AuthService.register(username, password, email);

    // Test logging in using the wrong password
    expect(async () => {
      await AuthService.login(email, wrong_password)
    }).rejects.toThrow(UnprocessableEntityException);
  });

  test('User not found', async ({ expect }) => {
    const password = "MySSNForReal";
    const email = ""

    // Test logging in (knowing there is no user in the db right now)
    expect(async () => {
      await AuthService.login(email, password)
    }).rejects.toThrow(NotFoundException);
  });
});
