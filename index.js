const express = require('./config/express');
const {logger} = require('./config/winston');
const http = require('http');
const app = express();
const port = 3000;

//express().listen(port); -> 배포를 위해 수정
http.createServer(app).listen(process.env.PORT || 3000);

logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);