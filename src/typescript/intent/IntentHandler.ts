import {TokenInfo} from "../../domain/TokenInfo";
import {CreateToken} from "../database/CreateToken";
import {ChildValidationUtil} from "../util/ChildValidationUtil";
import {GetTokenForChild} from "../database/GetTokenForChild";
import {UpdateTokenForChild} from "../database/UpdateTokenForChild";
import {TokenActionUtil} from "../util/TokenActionUtil";
import {TokenActionType} from "../type/TokenActionType";
import {SpeechResponseHandler} from "../handler/SpeechResponseHandler";

export class IntentHandler {

    private createTokenAttributes(childName) {
        return {childName};
    }
    private async receiveTokens(intent,  callback) {
        const cardTitle = intent.name;
        const childName = intent.slots.child;
        const tokens = intent.slots.tokenCount;
        let speechResponseHandler = new SpeechResponseHandler();

        let repromptText = '';
        let sessionAttributes = {};
        const shouldEndSession = false;
        let speechOutput = '';

         let isValid = ChildValidationUtil.isChildValid(childName);

         if (isValid){
             let tokenForChild = new GetTokenForChild();
             let updateTokensForChild = new UpdateTokenForChild();

             let count = await tokenForChild.execute(childName);
             let totalTokens = TokenActionUtil
                 .calculateTokensForAction(TokenActionType.GIVE_TOKENS,parseInt(count),parseInt(tokens));

             updateTokensForChild.execute(childName,totalTokens);
             sessionAttributes = this.createTokenAttributes(childName);
             speechOutput = `${childName} received ${tokens} tokens`;
             repromptText = "";
         } else {
             speechOutput = "There was a problem. Please try again.";
             repromptText = "";
         }


        callback(sessionAttributes,
            speechResponseHandler.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }

     loseTokens(intent, session, callback) {
        const cardTitle = intent.name;
        const childSlot = intent.slots.child;
        const tokenSlot = intent.slots.tokenCount;

        let repromptText = '';
        let sessionAttributes = {};
        const shouldEndSession = false;
        let speechOutput = '';

        if (childSlot && tokenSlot) {
            let childName = childSlot.value;
            let tokenCount = tokenSlot.value;
            let tokenInfo = createTokenInfo(childName, tokenCount);
            invokeTakeAwayTokens(tokenInfo);
            sessionAttributes = createTokenAttributes(childName);
            speechOutput = `${childName} lost ${tokenCount} tokens`;
            repromptText = "";
        } else {
            speechOutput = "There was a problem. Please try again.";
            repromptText = "";
        }

        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }

     resetTokens(intent, session, callback) {
        const cardTitle = intent.name;
        const childSlot = intent.slots.child;

        console.log('resetTokens intent');
        let repromptText = '';
        let sessionAttributes = {};
        const shouldEndSession = false;
        let speechOutput = '';

        if (childSlot) {
            let childName = childSlot.value;
            let tokenInfo = createTokenInfo(childName, '0');
            invokeResetTokens(tokenInfo);
            sessionAttributes = createTokenAttributes(childName);
            speechOutput = `${childName} has 0 tokens.`;
            repromptText = "";
        } else {
            speechOutput = "There was a problem. Please try again.";
            repromptText = "";
        }

        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }

    async  getTokenCount(intent, session, callback) {
        const cardTitle = intent.name;
        const childSlot = intent.slots.child;


        let repromptText = '';
        let sessionAttributes = {};
        const shouldEndSession = false;
        let speechOutput = '';

        if (childSlot) {
            let childName = childSlot.value;
            let tokenInfo = createTokenInfo(childName,'');
            let tokenCount = await invokeGetTokenCount(tokenInfo);
            sessionAttributes = createTokenAttributes(childName);
            speechOutput = `${childName} has ${tokenCount} tokens`;
            repromptText = "";
        } else {
            speechOutput = "There was a problem. Please try again.";
            repromptText = "";
        }

        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }

     createTokenInfo(childName,tokenCount){
        let tokenInfo = new TokenInfo();

        if (childName) {
            tokenInfo.childName = childName;
        }
        if (tokenCount) {
            tokenInfo.tokenCount = tokenCount;
        }

        return tokenInfo;
    }

    async  invokeReceiveTokens(tokenInfo){
        let tokenCount = await invokeGetTokenCount(tokenInfo);
        let tokenCountInt = parseInt(tokenCount);
        let recievedTokenCountInt = parseInt(tokenInfo.tokenCount);
        let totalTokens = tokenCountInt + recievedTokenCountInt;
        console.log('give tokens: ' + totalTokens);

        tokenInfo.tokenCount = totalTokens;
        console.log('give tokensInfo.tokenCount: ' + tokenInfo.tokenCount);
        let receiveTokenService = new CreateToken(tokenInfo);
        receiveTokenService.execute();
    }

    async  invokeTakeAwayTokens(tokenInfo){
        console.log('in take away tokens ');
        let tokenCount = await invokeGetTokenCount(tokenInfo);
        let tokenCountInt = parseInt(tokenCount);
        let recievedTokenCountInt = parseInt(tokenInfo.tokenCount);
        let totalTokens = tokenCountInt - recievedTokenCountInt;
        console.log('take away tokens: ' + totalTokens);

        tokenInfo.tokenCount = totalTokens;
        console.log('take away tokensInfo.tokenCount: ' + tokenInfo.tokenCount);
        let receiveTokenService = new CreateToken(tokenInfo);
        receiveTokenService.execute();
    }

    async  invokeResetTokens(tokenInfo){
        console.log('inside reset tokens '
            + tokenInfo.childName + ' - '
            + tokenInfo.tokenCount);
        let receiveTokenService = new CreateToken(tokenInfo);
        receiveTokenService.execute();
    }

    async  invokeGetTokenCount(tokenInfo){

        const uuid = require('uuid');
        const AWS = require('aws-sdk');
        const dynamoDb = new AWS.DynamoDB.DocumentClient();
        const timestamp = new Date().getTime();
        const params = {
            TableName: process.env.DYNAMODB_TABLE_TOKEN,
            Key: {
                childName: tokenInfo.childName,
            },
        };

        let tokenPromise = await dynamoDb.get(params).promise().then(function(result){

            return result.Item['token'];
        });

        console.log('tokenPromise returned' + tokenPromise);

        return tokenPromise;

    }

    /**
     * Called when the user specifies an intent for this skill.
     */
    onIntent(intentRequest, session, callback) {
        console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

        const intent = intentRequest.intent;
        const intentName = intentRequest.intent.name;

        // Dispatch to your skill's intent handlers

        if (intentName === 'receiveTokens') {
            receiveTokens(intent, session, callback);
        } else if (intentName === 'getTokenCount') {
            getTokenCount(intent, session, callback);
        } else if (intentName === 'loseTokens') {
            loseTokens(intent, session, callback);
        } else if (intentName === 'resetTokens') {
            console.log('calling intent resetTokens');
            resetTokens(intent, session, callback);
        } else if (intentName === 'AMAZON.HelpIntent') {
            getWelcomeResponse(callback);
        } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
            handleSessionEndRequest(callback);
        } else {
            throw new Error('Invalid intent');
        }
    }

}
