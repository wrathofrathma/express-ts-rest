import { test } from '@japa/runner'
import ConflictException from '../app/exceptions/ConflictException';
import { AuthService } from "../app/services/AuthService";

// Import prisma client so we can directly make calls to our db
import { PrismaClient } from '@prisma/client'
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
})
