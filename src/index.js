// this is a local app for debugging purpose only
// for deployment, a separate handler is initialized for each endpoint
const awsServerlessExpress = require('aws-serverless-express');

const express = require('express');
const cors = require("cors");
const { auth } = require("express-oauth2-jwt-bearer");
const endpoints = require('./endpoints');
const constants = require('./constants');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.use(cors({ origin: '*' }));

const checkJwt = auth({
    audience: "atppredictions",
    issuerBaseURL: `https://${constants.DOMAIN}/`,
    algorithms: ["RS256"],
});

/**
 * returns the tournaments (for non-authenticated user)
 */
app.get('/get_generic_tournaments', async (req, res) => {
    endpoints.get_generic_tournaments_handler(req, res);
});

/**
 * returns the tournaments (for authenticated user)
 */
app.get('/get_customized_tournaments', checkJwt, async (req, res) => {
    endpoints.get_customized_tournaments_handler(req, res);
})

/**
 * returns the entrants for a tournament
 */
app.get('/get_entrants', async (req, res) => {
    endpoints.get_entrants_handler(req, res);
});

/**
 * save a prediction for a tournament
 */
app.post('/save_prediction', checkJwt, async (req, res) => {
    endpoints.save_prediction_handler(req, res);
});

/**
 * returns the leaderboard (for non-authenticated user)
 */
//app.get('/get_generic_leaderboard', async (req, res) => {
//    endpoints.get_generic_leaderboard_handler(req, res);
//})

/**
 * returns the leaderboard (for authenticated user)
 */
//app.get('/get_customized_leaderboard', async (req, res) => {
//    endpoints.get_customized_leaderboard_handler(req, res);
//})

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) =>  awsServerlessExpress.proxy(server, event, context);

app.listen(3001, () => console.log(`API Server listening on port ${3001}`));