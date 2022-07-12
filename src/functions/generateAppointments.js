const dynamoDb = require('../dynamo/dynamodb');

const config = require('../../config.json');
const tableName = config.DYNAMODB_TABLE;
const maxItems = 25;

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

module.exports.generateAppointments = async (event) => {
    //todo: check if employeeId is valid 
    //todo: calculate latest available time 
    const body = JSON.parse(event.body);
    const { employeeId, startTime, endTime } = body;

    if (isNaN(Date.parse(startTime)) || isNaN(Date.parse(endTime))) {
        return {
            statusCode: 400,
            body: JSON.stringify({"message" : "Dates are not valid!"})
        };
    }
    let startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);

    let statusCode;
    let response;
    try {

        let slots = [];
        slots.push({
            PutRequest: {
                Item: {
                    employeeId,
                    appointmentStartTime: startDateTime.toISOString()
                }
            }
        });
        while (endDateTime > startDateTime) {
            let newDateTime = addMinutes(startDateTime, 15);
            slots.push({
                PutRequest: {
                    Item: {
                        employeeId,
                        appointmentStartTime: newDateTime.toISOString()
                    }
                }
            });
            startDateTime = newDateTime;
        }

        const chunks = split(slots);
        for (const slot of chunks) {
            let params = {
                RequestItems: {
                    [tableName]: slot
                }
            };
            const responseFromDynamo = await dynamoDb.batchWrite(params).promise();
            console.log(responseFromDynamo);
        }

        response = { "message": "Success!" };
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

function split(inputArray) {
    if (inputArray.lenght <= maxItems) {
        return inputArray;
    }
    return inputArray.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / maxItems)

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []
        }

        resultArray[chunkIndex].push(item)

        return resultArray
    }, []);
}

