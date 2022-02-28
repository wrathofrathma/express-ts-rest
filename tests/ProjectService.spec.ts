import { test } from '@japa/runner'

// Import prisma client so we can directly make calls to our db
import { PrismaClient } from '@prisma/client'
import { ProjectService } from '../app/services/ProjectService';
import ForbiddenException from '../app/exceptions/ForbiddenException';
import NotFoundException from '../app/exceptions/NotFoundException';
// import { expect } from '@japa/expect';
const prisma = new PrismaClient()

// Grouping tests together allows us to use the lifecycle hooks to apply setup / teardown scripts en masse
test.group('ProjectService', (group) => {
  // Variables reused for creating users that don't break our unique constraints.
  const username = "projectservice";
  const password = "MySSNForReal";
  const existing_email = "ps_user@gmail.com";
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

  test('Create Project', async ({expect}) => {
	// Fetch user data
	const user = await prisma.user.findUnique({
		where: {
			email: existing_email
		}
	});

	const project = await ProjectService.create(user.id, created_project_title);

	expect(project).toMatchObject({
		title: created_project_title,
		userId: user.id
	});
  });

  test('Fetch Project Index', async ({expect}) => {
	// Fetch user data
	const user = await prisma.user.findUnique({
		where: {
			email: existing_email
		}
	});

	const projects = await ProjectService.index(user.id);

	expect(projects).toMatchObject([
		{
			title: existing_project_title,
			userId: user.id
		},
		{
			title: created_project_title,
			userId: user.id
		}
	]);
  });

  test('Update Project Title', async ({expect}) => {
	// Fetch user data
	const user = await prisma.user.findUnique({
		where: {
			email: existing_email
		}
	});

	// Fetch an existing project
	const project = await prisma.project.findFirst({
		where: {
			userId: user.id,
			title: existing_project_title
		}
	});

	const updated_project = await ProjectService.update(project.id, user.id, {
		title: updated_project_title
	});

	expect(updated_project).toMatchObject({
		userId: user.id,
		title: updated_project_title
	});
  });

  test('Update Project Title: Not Authenticated', async ({expect}) => {
	// Fetch user data that has an existing project.
	const user = await prisma.user.findUnique({
		where: {
			email: existing_email
		}
	});
	// Create a fake user id
	const userId = 4123;

	// Fetch an existing project
	const project = await prisma.project.findFirst({
		where: {
			userId: user.id, 
			title: updated_project_title
		}
	});

	try {
		await ProjectService.update(project.id, userId, {
			title: updated_project_title
		});
	}
	catch (e) {
		expect(e).toBeInstanceOf(ForbiddenException);
	}
  })

  test('Update Project Title: Not Found', async ({expect}) => {
	// Fetch user data that has an existing project.
	const user = await prisma.user.findUnique({
		where: {
			email: existing_email
		}
	});
	// Create a fake project id
	const projectId = 4123;

	try {
		await ProjectService.update(projectId, user.id, {
			title: updated_project_title
		});
	}
	catch (e) {
		expect(e).toBeInstanceOf(NotFoundException);
	}
  });

  test('Delete Project: Not Authenticated', async ({expect}) => {
	// Fetch user data that has an existing project.
	const user = await prisma.user.findUnique({
		where: {
			email: existing_email
		}
	});
	// Create a fake user id
	const userId = 4123;

	// Fetch an existing project
	const project = await prisma.project.findFirst({
		where: {
			userId: user.id,
			title: updated_project_title
		}
	});

	try {
		await ProjectService.delete(project.id, userId); 
	}
	catch (e) {
		expect(e).toBeInstanceOf(ForbiddenException);
	}
  });

  test('Delete Project: Not Found', async ({expect}) => {
	// Fetch user data that has an existing project.
	const user = await prisma.user.findUnique({
		where: {
			email: existing_email
		}
	});
	// Create a fake project id
	const projectId = 4123;

	try {
		await ProjectService.delete(projectId, user.id);
	}
	catch (e) {
		expect(e).toBeInstanceOf(NotFoundException);
	}

  });

  test('Delete Project', async ({expect}) => {
	// Fetch user data
	const user = await prisma.user.findUnique({
		where: {
			email: existing_email
		}
	});

	// Fetch an existing project
	const project = await prisma.project.findFirst({
		where: {
			userId: user.id,
			title: updated_project_title
		}
	});

	const deleted_project = await ProjectService.delete(project.id, user.id);

	expect(deleted_project).toMatchObject(project);
  });
});
