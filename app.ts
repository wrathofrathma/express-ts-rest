// Import config to setup the global configuration object.
import { config } from './config'
import express from 'express';

const app = express();

/** Setup request body parsing */
import bodyParser from 'body-parser';
app.use(bodyParser.json());

import indexRouter from './app/routes/index';
import authRouter from './app/routes/auth';

app.use('/', indexRouter);
app.use('/auth', authRouter);

/** Using a custom error handler */
import ExceptionHandler from './app/exceptions/ExceptionHandler';
app.use(ExceptionHandler);

export {
	app,
	config
};
