// Import config to setup the global configuration object.
import { config } from './config'
import express from 'express';

const app = express();

/** Setup request body parsing */
import bodyParser from 'body-parser';
app.use(bodyParser.json());

import indexRouter from './app/routes/index';
import authRouter from './app/routes/auth';
import projectRouter from './app/routes/project'
import taskRouter from './app/routes/task'

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/projects', projectRouter);
app.use('/tasks', taskRouter);

/** Using a custom error handler */
import ExceptionHandler from './app/exceptions/ExceptionHandler';
app.use(ExceptionHandler);

export {
	app,
	config
};
