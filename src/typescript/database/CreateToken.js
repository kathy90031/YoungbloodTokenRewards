"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CreateToken = /** @class */ (function () {
    function CreateToken(tokenInfo) {
        this.uuid = require('uuid');
        this.AWS = require('aws-sdk');
        this.dynamoDb = new this.AWS.DynamoDB.DocumentClient();
        this.timestamp = new Date().getTime();
        this.params = {
            TableName: process.env.DYNAMODB_TABLE_TOKEN,
            Item: {
                childName: '',
                token: 0,
                date: this.timestamp,
                createdAt: this.timestamp,
                updatedAt: this.timestamp,
            },
        };
        this.tokenInfo = tokenInfo;
        this.params['Item']['childName'] = tokenInfo.childName;
        this.params['Item']['token'] = tokenInfo.tokenCount;
    }
    CreateToken.prototype.execute = function () {
        var _this = this;
        if (!this.tokenInfo.childName || !this.tokenInfo.tokenCount) {
            console.error('Validation Failed');
            return;
        }
        this.dynamoDb.put(this.params, function (error) {
            // handle potential errors
            if (error) {
                console.error(error);
                return;
            }
            // create a response
            var response = {
                statusCode: 200,
                body: JSON.stringify(_this.params.Item),
            };
        });
    };
    return CreateToken;
}());
exports.CreateToken = CreateToken;
//# sourceMappingURL=CreateToken.js.map