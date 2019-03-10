"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GetTokenForChild = /** @class */ (function () {
    function GetTokenForChild(tokenInfo) {
        this.uuid = require('uuid');
        this.AWS = require('aws-sdk');
        this.dynamoDb = new this.AWS.DynamoDB.DocumentClient();
        this.timestamp = new Date().getTime();
        this.params = {
            TableName: process.env.DYNAMODB_TABLE_TOKEN,
            Key: {
                childName: '',
            },
        };
        this.tokenInfo = tokenInfo;
        this.params['Key']['childName'] = tokenInfo.childName;
    }
    GetTokenForChild.prototype.execute = function (cb) {
        console.log('here in get with callback ');
        this.dynamoDb.get(this.params, function (error, result) {
            // handle potential errors
            if (error) {
                console.error(error);
                return;
            }
            console.log('result 2 ');
            console.log(result.Item);
            var returnedCount = result.Item['token'];
            console.log('RETURNED COUNT: ' + returnedCount);
            return cb(returnedCount);
        });
    };
    return GetTokenForChild;
}());
exports.GetTokenForChild = GetTokenForChild;
//# sourceMappingURL=GetTokenForChild.js.map