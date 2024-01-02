const awsServerlessExpress = require('aws-serverless-express');
const express = require('express');
const cors = require("cors");
const { auth } = require("express-oauth2-jwt-bearer");
const endpoints = require('./endpoints');
const bodyParser =  require("body-parser");

const app = express();
app.use(bodyParser.json());

app.use(express.body)
app.use(cors({ origin: '*' }));

const checkJwt = auth({
    audience: "atppredictions",
    issuerBaseURL: `https://${constants.DOMAIN}/`,
    algorithms: ["RS256"],
});

app.post('/save_prediction', checkJwt, async (req, res) => {
    endpoints.save_prediction_handler(req, res);
})

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) =>  awsServerlessExpress.proxy(server, event, context);