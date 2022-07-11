const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const config = require('../config.json');
const tableName = config.DYNAMODB_TABLE;

module.exports.getAvailableAppointments = async (event) => {
    //todo: check if employeeId is valid 
    const employeeId = event.pathParameters.employeeId;
    const date = event.pathParameters.date;

    const params = {
        TableName: tableName,
        KeyConditionExpression: 'employeeId = :employeeId and begins_with(appointmentStartTime, :startDate)',
        ExpressionAttributeValues: {
            ":employeeId": employeeId,
            ":startDate": date
        },
        FilterExpression: "attribute_not_exists(userId)"
    }

    let statusCode;
    let response;
    try {
        const responseDynamo = await dynamoDb.query(params).promise();
        response = responseDynamo.Items;
        statusCode = 200;
    } catch (error) {
        console.log(error);
        response = { "message": "Something went wrong!" };
        statusCode = 500;
    }

    return {
        statusCode: statusCode,
        body: JSON.stringify(response),
    };

};