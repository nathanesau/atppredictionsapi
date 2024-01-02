const awsServerlessExpress = require('aws-serverless-express');
const express = require('express');
const cors = require("cors");
const { auth } = require("express-oauth2-jwt-bearer");
const endpoints = require('./endpoints');
const constants = require('./constants');

const app = express();

app.use(cors({ origin: '*' }));

const checkJwt = auth({
    audience: "atppredictions",
    issuerBaseURL: `https://${constants.DOMAIN}/`,
    algorithms: ["RS256"],
});

app.get('/get_customized_tournaments', checkJwt, async (req, res) => {
    endpoints.get_customized_tournaments_handler(req, res);
})

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) =>  awsServerlessExpress.proxy(server, event, context);