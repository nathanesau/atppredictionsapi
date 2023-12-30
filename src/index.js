const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');
const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) =>  awsServerlessExpress.proxy(server, event, context);

if (process.env.LOCAL) {
    app.listen(3001, () => console.log(`API Server listening on port ${3001}`));
}