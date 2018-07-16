import {TokenInfo} from "../../domain/TokenInfo";
import {CreateToken} from "./CreateToken";


export class GetTokenForChild {
    private uuid = require('uuid');
    private AWS = require('aws-sdk');
    private dynamoDb = new this.AWS.DynamoDB.DocumentClient();
    private timestamp = new Date().getTime();

    private _tokenCount: number;
    get tokenCount(): number {
        return this._tokenCount;
    }

    set tokenCount(value: number) {
        this._tokenCount = value;
    }

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

    execute(): number {
        console.log('here in get');
        let tokenCount = 0;
        // write the pet to the database
        console.log('params: ');
        console.log(JSON.stringify(this.params));
        this.dynamoDb.get(this.params, (error, result) => {
            // handle potential errors
            if (error) {
                console.error(error);

                return;
            }

            console.log('result ');
            console.log(result.Item);
            let returnedCount = result.Item['tokenCount'];
            // this.tokenInfo.tokenCount = this.tokenInfo.tokenCount + returnedCount;
            // let createToken = new CreateToken(this.tokenInfo);
            // createToken.execute();
            this.tokenCount = returnedCount;

        });
        return this.tokenCount;
    }


}
