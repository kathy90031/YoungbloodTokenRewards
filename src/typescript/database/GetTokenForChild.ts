
export class GetTokenForChild {
    private AWS = require('aws-sdk');

    private options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
    };

    private dynamoDb = new this.AWS.DynamoDB.DocumentClient(this.options);

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
