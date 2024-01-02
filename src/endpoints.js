const fetch = require("node-fetch");
const constants = require('./constants');
var AWS = require('aws-sdk');

// global aws configuration
AWS.config.update({region: 'us-east-1'});

async function getUserId(req) {
    const userInfo = await fetch(`https://${constants.DOMAIN}/userinfo`, {
        headers: {
            Authorization: `Bearer ${req.auth.token}`
        }
    });

    const body = await userInfo.json();

    // use email as userId
    return body.email;
}

async function get_tournaments() {
    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    let tournaments = [];

    await ddb.scan({ TableName: "Tournament"}, function (err, data) {
        if (err) {
            console.log("Unable to fetch tournaments", err);
        } else {
            console.log("Successfully fetched tournaments");
            for (const tournament of data.Items) {
                tournaments.push({
                    last_updated: tournament.last_updated.S,
                    location: tournament.location.S,
                    end_date: tournament.end_date.S,
                    start_date: tournament.start_date.S,
                    category: tournament.category.S,
                    name: tournament.name.S,
                    id: tournament.id.S
                });
            }
        }
    }).promise();

    return tournaments;
}

module.exports.get_generic_tournaments_handler = async function(req, res) {
    const tournaments = await get_tournaments();
    res.send({ tournaments: tournaments });
}

module.exports.get_customized_tournaments_handler = async function(req, res) {
    const userId = await getUserId(req);

    // TODO: get tournaments enriched with prediction information
    const tournaments = await get_tournaments();
    res.send({ userId: userId, tournaments: tournaments });
}

//module.exports.get_generic_leaderboard_handler = async function(req, res) {
//    // TODO: get leaderboard from predictions table
//    res.send({ msg: "hello world" });
//}

//module.exports.get_customized_leaderboard_handler = async function(req, res) {
//    // TODO: get leaderboard from predictions table
//    res.send({ msg: "hello world" });
//}

