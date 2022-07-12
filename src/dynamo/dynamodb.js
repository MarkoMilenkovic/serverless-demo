const AWS = require('aws-sdk');

let options = {};
if (process.env.IS_OFFLINE) {
  options.endpoint = "http://localhost:8000";
  options.region = "localhost";
}

const dynamoDb = new AWS.DynamoDB.DocumentClient(options);

module.exports = dynamoDb;