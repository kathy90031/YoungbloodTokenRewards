
export class UpdateTokenForChild {
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
        Item: {
            childName: '',
            token: 0,
        },
    };

     execute(childName: string, tokenCount: number) {
         this.params.Item.childName = childName;
         this.params.Item.token = tokenCount;
         this.dynamoDb.put(this.params, (error) => {
            // handle potential errors
            if (error) {
                console.error(error);
                return;
            }
        });

    }

}
