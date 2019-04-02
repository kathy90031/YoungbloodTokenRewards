
export class GetTokenForChild {
    private AWS = require('aws-sdk');




    constructor() {
        console.log('is process offline after update?: ' + process.env.IS_OFFLINE);
        let options = {};
        // if (process.env.IS_OFFLINE) {
        //     options = {
        //         region: 'localhost',
        //         endpoint: 'http://localhost:8000',
        //     };
        // }
        this.dynamoDb = new this.AWS.DynamoDB.DocumentClient(options);
    }

    private dynamoDb: any;

    private params = {
        TableName: process.env.DYNAMODB_TABLE_TOKEN,
        Key: {
            childName: '',
        },
    };

    async execute(childName: string) {
        console.log('in execute 12:');
        this.params.Key.childName = childName;
        console.log(JSON.stringify(this.params));
        let tokenPromise = await this.dynamoDb
            .get(this.params)
            .promise()
            .then(function(result){
            return result.Item['token'];
        });

        console.log('tokenPromise returned' + tokenPromise);

        return tokenPromise;
    }

}
