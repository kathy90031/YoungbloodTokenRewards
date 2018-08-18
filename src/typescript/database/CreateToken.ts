import {TokenInfo} from "../../domain/TokenInfo";


export class CreateToken {
    private uuid = require('uuid');
    private AWS = require('aws-sdk');
    private dynamoDb = new this.AWS.DynamoDB.DocumentClient();
    private timestamp = new Date().getTime();
    private params = {
        TableName: process.env.DYNAMODB_TABLE_TOKEN,
        Item: {
            childName: '',
            token: 0,
            date: this.timestamp,
            createdAt: this.timestamp,
            updatedAt: this.timestamp,
        },
    };
    private tokenInfo: TokenInfo;


    constructor(tokenInfo: TokenInfo) {
        this.tokenInfo = tokenInfo;
        this.params['Item']['childName'] = tokenInfo.childName;
        this.params['Item']['token'] = tokenInfo.tokenCount;
    }

    execute(): void {
        if (!this.tokenInfo.childName || !this.tokenInfo.tokenCount) {
            console.error('Validation Failed');
            return;
        }

        this.dynamoDb.put(this.params, (error) => {
            // handle potential errors
            if (error) {
                console.error(error);
                return;
            }

            // create a response
            const response = {
                statusCode: 200,
                body: JSON.stringify(this.params.Item),
            };
        });

    }

}
