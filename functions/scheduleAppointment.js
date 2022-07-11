const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const config = require('../config.json');
const tableName = config.DYNAMODB_TABLE;

module.exports.scheduleAppointment = async (event) => {
    const body = JSON.parse(event.body);
    //todo: check if userId and employeeId are valid
    //todo: check dynamodb transactions
    //todo: delete next appointments from table
    const { employeeId, appointmentStartTime, userId } = body;

    const params = {
        TableName: tableName,
        Key: {
            employeeId: employeeId,
            appointmentStartTime: appointmentStartTime
        },
        UpdateExpression: 'SET userId = :userIdVal',
        ConditionExpression: 'attribute_not_exists(userId) AND ' +
            'attribute_exists(employeeId) AND ' +
            'attribute_exists(appointmentStartTime)',
        ExpressionAttributeValues: {
            ':userIdVal': userId
        },
        ReturnValues: "ALL_NEW"
    };

    let statusCode;
    let response;
    try {
        const responseDynamo = await dynamoDb.update(params).promise();
        response = responseDynamo.Attributes;
        statusCode = 200;
    } catch (error) {
        if (error.code === 'ConditionalCheckFailedException') {
            response = { "message": "Appointment not available!" };
            statusCode = 400;
        } else {
            console.log(error);
            response = { "message": "Something went wrong!" };
            statusCode = 500;
        }
    }

    return {
        statusCode: statusCode,
        body: JSON.stringify(response),
    };

};