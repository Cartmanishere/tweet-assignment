import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import config from 'config'
import mongoose from 'mongoose'

import logger from './utils/logger'
import usersRouter from './routes/users';
import tweetRouter from './routes/tweet';

var app = express();

app.use(morgan('combined', {stream: logger.stream}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const mongoOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
};

mongoose.connect(config.get('mongoURI'), mongoOptions).then( () => {
    logger.info("Connection to mongo established");
}).catch( (err) => {
   logger.error(err);
});

// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tweets', tweetRouter);

module.exports = app;
