const awsServerlessExpress = require('aws-serverless-express');
const express = require('express');
const cors = require("cors");
const endpoints = require('./endpoints');

const app = express();

app.use(cors({ origin: '*' }));

app.get('/get_entrants', async (req, res) => {
    endpoints.get_entrants_handler(req, res);
})

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) =>  awsServerlessExpress.proxy(server, event, context);