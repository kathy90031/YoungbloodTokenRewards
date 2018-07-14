'use strict';
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

// The document client affords developers the use of native JavaScript
// types instead of AttributeValues to simplify the JavaScript development
// experience with Amazon DynamoDB.
// - AWS Documentation
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const create: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);
    if (typeof data.name !== 'string' || typeof data.token !== 'string') {
        console.error('Validation Failed');
        cb(new Error('Couldn\'t create the student.'));
        return;
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE_TOKEN,
        Item: {
            id: uuid.v1(),
            name: data.name,
            token: data.token,
            date: timestamp,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    };

    // write the pet to the database
    dynamoDb.put(params, (error) => {
        // handle potential errors
        if (error) {
            console.error(error);
            cb(new Error('Couldn\'t create the token.'));
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(params.Item),
        };
        cb(null, response);
    });
}
