const express = require('express');
const cors = require("cors");
const { auth } = require("express-oauth2-jwt-bearer");
const app = express();
const fetch = require("node-fetch");

// TODO: manage this via secrets
const domain = "dev-e7x276delr7bwmo8.us.auth0.com";

app.use(cors({ origin: '*' }));

const checkJwt = auth({
    audience: "atppredictions",
    issuerBaseURL: `https://${domain}/`,
    algorithms: ["RS256"],
});

async function getUserId(req) {
    const userInfo = await fetch(`https://${domain}/userinfo`, {
        headers: {
            Authorization: `Bearer ${req.auth.token}`
        }
    });

    const body = await userInfo.json();

    // use email as userId
    return body.email;
}

function saveprediction(userId, body) {
    return `user ${userId} saveprediction`;
}

app.get('/', checkJwt, async (req, res) => {

    const method = req.query.method;
    const userId = await getUserId(req);

    if (method === 'saveprediction') {
        res.send({ msg: saveprediction(userId, req.body) });
    } else {
        res.send({ msg: "undefined method passed!"});
    }
});

module.exports = app;