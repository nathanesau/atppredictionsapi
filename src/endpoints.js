const fetch = require("node-fetch");
const constants = require('./constants');
const uuid = require("uuid");
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

async function get_entrants(tournament_id) {
    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    let entrants = [];

    await ddb.query({
        TableName: "Entrant",
        IndexName: "tournamentIdIndex",
        KeyConditionExpression: "tournament_id = :tournament_id",
        ExpressionAttributeValues: {
            ":tournament_id": {
                S: tournament_id
            }
        }
  }, function(err, data) {
    if (err) {
        console.log("Unable to fetch entrants", err);
    } else {
        console.log("Successfully fetched entrants");
        for (const entrant of data.Items) {
            entrants.push({
                last_updated: entrant.last_updated.S,
                order: entrant.order.N,
                player_id: entrant.player_id.S,
                player_name: entrant.player_name.S,
                id: entrant.id.S
            });
        }
    }
  }).promise();

  return entrants;
}

async function save_prediction(prediction, user_id) {
    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    prediction_item = {
        id: {"S": uuid.v4()},
        winner_id: {"S": prediction['winner_id']},
        winner_name: {"S": prediction['winner_name']},
        runner_up_id: {"S": prediction['runner_up_id']},
        runner_up_name: {"S": prediction['runner_up_name']},
        semi_finalist_1_id: {"S": prediction['semi_finalist_1_id']},
        semi_finalist_1_name: {"S": prediction['semi_finalist_1_name']},
        semi_finalist_2_id: {"S": prediction['semi_finalist_2_id']},
        semi_finalist_2_name: {"S": prediction['semi_finalist_2_name']},
        user_id: {"S": user_id},
        last_updated: {"S": new Date().toISOString()}
    }

    await ddb.putItem({
        TableName: "Predictions",
        Item: prediction_item
    }, function(err, data) {
        if (err) {
            console.log("Unable to save prediction", err);
        } else {
            console.log("Successfully saved prediction");
        }
    }).promise();

    return prediction_item
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

module.exports.get_entrants_handler = async function(req, res) {
    const tournament_id = req.query.tournament_id;
    const entrants = await get_entrants(tournament_id);
    res.send({ entrants: entrants });
}

module.exports.save_prediction_handler = async function(req, res) {
    const userId = await getUserId(req);
    const prediction = await save_prediction(req.body, userId);
    res.send({ prediction: prediction });
}
