const express = require('express');
const cors = require("cors");
const { auth } = require("express-oauth2-jwt-bearer");
const app = express();
const fetch = require("node-fetch");

//const appOrigin = `https://nathanesau.github.io/atppredictions/external-api`;
app.use(cors({ origin: '*' }));

const checkJwt = auth({
    audience: "atppredictions",
    issuerBaseURL: "https://dev-e7x276delr7bwmo8.us.auth0.com/",
    algorithms: ["RS256"],
});

app.get('/', checkJwt, async (req, res) => {

    const userInfo = await fetch('https://dev-e7x276delr7bwmo8.us.auth0.com/userinfo', {
        headers: {
            Authorization: `Bearer ${req.auth.token}`
        }
    });

    const body = await userInfo.text();


  res.send({ msg: `hello world ${body}` });
});

module.exports = app;