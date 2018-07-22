import {TokenInfo} from "../../domain/TokenInfo";
import {CreateToken} from "./CreateToken";


export class GetTokenForChild {
    private uuid = require('uuid');
    private AWS = require('aws-sdk');
    private dynamoDb = new this.AWS.DynamoDB.DocumentClient();
    private timestamp = new Date().getTime();

    private params = {
        TableName: process.env.DYNAMODB_TABLE_TOKEN,
        Key: {
            childName: '',
        },
    };

    private tokenInfo: TokenInfo;


    constructor(tokenInfo: TokenInfo) {
        this.tokenInfo = tokenInfo;
        this.params['Key']['childName'] = tokenInfo.childName;
    }

    execute(cb) {
        console.log('here in get with callback ');

        this.dynamoDb.get(this.params, (error, result) => {
            // handle potential errors
            if (error) {
                console.error(error);

                return;
            }

            console.log('result 2 ');
            console.log(result.Item);
            let returnedCount = result.Item['token'];
            console.log('RETURNED COUNT: '+ returnedCount);

            return cb(returnedCount);
        });

    }




}
