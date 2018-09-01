'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var TokenInfo_1 = require("../../domain/TokenInfo");
var CreateToken_1 = require("../database/CreateToken");
var uuid = require('uuid');
var AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
// --------------- Helpers that build all of the responses -----------------------
function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession: shouldEndSession,
    };
}
function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes: sessionAttributes,
        response: speechletResponse,
    };
}
function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = 'Welcome';
    var speechOutput = 'Welcome Youngbloods.';
    var repromptText = 'To give tokens say Give Gabriel 5 tokens.';
    var shouldEndSession = false;
    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}
/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId + ", sessionId=" + session.sessionId);
}
/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId + ", sessionId=" + session.sessionId);
    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId + ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}
/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId + ", sessionId=" + session.sessionId);
    var intent = intentRequest.intent;
    var intentName = intentRequest.intent.name;
    // Dispatch to your skill's intent handlers
    if (intentName === 'receiveTokens') {
        receiveTokens(intent, session, callback);
    }
    else if (intentName === 'getTokenCount') {
        getTokenCount(intent, session, callback);
    }
    else if (intentName === 'loseTokens') {
        loseTokens(intent, session, callback);
    }
    else if (intentName === 'resetTokens') {
        console.log('calling intent resetTokens');
        resetTokens(intent, session, callback);
    }
    else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    }
    else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    }
    else {
        throw new Error('Invalid intent');
    }
}
function createTokenAttributes(child) {
    return {
        child: child
    };
}
function receiveTokens(intent, session, callback) {
    var cardTitle = intent.name;
    var childSlot = intent.slots.child;
    var tokenSlot = intent.slots.tokenCount;
    var repromptText = '';
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = '';
    if (childSlot && tokenSlot) {
        var childName = childSlot.value;
        var tokenCount = tokenSlot.value;
        var tokenInfo = createTokenInfo(childName, tokenCount);
        invokeReceiveTokens(tokenInfo);
        sessionAttributes = createTokenAttributes(childName);
        speechOutput = childName + " received " + tokenCount + " tokens";
        repromptText = "";
    }
    else {
        speechOutput = "There was a problem. Please try again.";
        repromptText = "";
    }
    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}
function loseTokens(intent, session, callback) {
    var cardTitle = intent.name;
    var childSlot = intent.slots.child;
    var tokenSlot = intent.slots.tokenCount;
    var repromptText = '';
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = '';
    if (childSlot && tokenSlot) {
        var childName = childSlot.value;
        var tokenCount = tokenSlot.value;
        var tokenInfo = createTokenInfo(childName, tokenCount);
        invokeTakeAwayTokens(tokenInfo);
        sessionAttributes = createTokenAttributes(childName);
        speechOutput = childName + " lost " + tokenCount + " tokens";
        repromptText = "";
    }
    else {
        speechOutput = "There was a problem. Please try again.";
        repromptText = "";
    }
    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}
function resetTokens(intent, session, callback) {
    var cardTitle = intent.name;
    var childSlot = intent.slots.child;
    console.log('resetTokens intent');
    var repromptText = '';
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = '';
    if (childSlot) {
        var childName = childSlot.value;
        var tokenInfo = createTokenInfo(childName, '0');
        invokeResetTokens(tokenInfo);
        sessionAttributes = createTokenAttributes(childName);
        speechOutput = childName + " has 0 tokens.";
        repromptText = "";
    }
    else {
        speechOutput = "There was a problem. Please try again.";
        repromptText = "";
    }
    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}
function getTokenCount(intent, session, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var cardTitle, childSlot, repromptText, sessionAttributes, shouldEndSession, speechOutput, childName, tokenInfo, tokenCount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cardTitle = intent.name;
                    childSlot = intent.slots.child;
                    repromptText = '';
                    sessionAttributes = {};
                    shouldEndSession = false;
                    speechOutput = '';
                    if (!childSlot) return [3 /*break*/, 2];
                    childName = childSlot.value;
                    tokenInfo = createTokenInfo(childName, '');
                    return [4 /*yield*/, invokeGetTokenCount(tokenInfo)];
                case 1:
                    tokenCount = _a.sent();
                    sessionAttributes = createTokenAttributes(childName);
                    speechOutput = childName + " has " + tokenCount + " tokens";
                    repromptText = "";
                    return [3 /*break*/, 3];
                case 2:
                    speechOutput = "There was a problem. Please try again.";
                    repromptText = "";
                    _a.label = 3;
                case 3:
                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                    return [2 /*return*/];
            }
        });
    });
}
function createTokenInfo(childName, tokenCount) {
    var tokenInfo = new TokenInfo_1.TokenInfo();
    if (childName) {
        tokenInfo.childName = childName;
    }
    if (tokenCount) {
        tokenInfo.tokenCount = tokenCount;
    }
    return tokenInfo;
}
function invokeReceiveTokens(tokenInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenCount, tokenCountInt, recievedTokenCountInt, totalTokens, receiveTokenService;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, invokeGetTokenCount(tokenInfo)];
                case 1:
                    tokenCount = _a.sent();
                    tokenCountInt = parseInt(tokenCount);
                    recievedTokenCountInt = parseInt(tokenInfo.tokenCount);
                    totalTokens = tokenCountInt + recievedTokenCountInt;
                    console.log('give tokens: ' + totalTokens);
                    tokenInfo.tokenCount = totalTokens;
                    console.log('give tokensInfo.tokenCount: ' + tokenInfo.tokenCount);
                    receiveTokenService = new CreateToken_1.CreateToken(tokenInfo);
                    receiveTokenService.execute();
                    return [2 /*return*/];
            }
        });
    });
}
function invokeTakeAwayTokens(tokenInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenCount, tokenCountInt, recievedTokenCountInt, totalTokens, receiveTokenService;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('in take away tokens ');
                    return [4 /*yield*/, invokeGetTokenCount(tokenInfo)];
                case 1:
                    tokenCount = _a.sent();
                    tokenCountInt = parseInt(tokenCount);
                    recievedTokenCountInt = parseInt(tokenInfo.tokenCount);
                    totalTokens = tokenCountInt - recievedTokenCountInt;
                    console.log('take away tokens: ' + totalTokens);
                    tokenInfo.tokenCount = totalTokens;
                    console.log('take away tokensInfo.tokenCount: ' + tokenInfo.tokenCount);
                    receiveTokenService = new CreateToken_1.CreateToken(tokenInfo);
                    receiveTokenService.execute();
                    return [2 /*return*/];
            }
        });
    });
}
function invokeResetTokens(tokenInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var receiveTokenService;
        return __generator(this, function (_a) {
            console.log('inside reset tokens '
                + tokenInfo.childName + ' - '
                + tokenInfo.tokenCount);
            receiveTokenService = new CreateToken_1.CreateToken(tokenInfo);
            receiveTokenService.execute();
            return [2 /*return*/];
        });
    });
}
function invokeGetTokenCount(tokenInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var uuid, AWS, dynamoDb, timestamp, params, tokenPromise;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uuid = require('uuid');
                    AWS = require('aws-sdk');
                    dynamoDb = new AWS.DynamoDB.DocumentClient();
                    timestamp = new Date().getTime();
                    params = {
                        TableName: process.env.DYNAMODB_TABLE_TOKEN,
                        Key: {
                            childName: tokenInfo.childName,
                        },
                    };
                    return [4 /*yield*/, dynamoDb.get(params).promise().then(function (result) {
                            return result.Item['token'];
                        })];
                case 1:
                    tokenPromise = _a.sent();
                    console.log('tokenPromise returned' + tokenPromise);
                    return [2 /*return*/, tokenPromise];
            }
        });
    });
}
function handleSessionEndRequest(callback) {
    var cardTitle = 'Session Ended';
    var speechOutput = 'Thank you for trying the Alexa Skills Kit sample. Have a nice day!';
    // Setting this to true ends the session and exits the skill.
    var shouldEndSession = true;
    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}
// --------------- Main handler -----------------------
// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.invokeTokenRewards = function (event, context, callback) {
    if (event.session.new) {
        onSessionStarted({ requestId: event.request.requestId }, event.session);
    }
    if (event.request.type === 'LaunchRequest') {
        onLaunch(event.request, event.session, function (sessionAttributes, speechletResponse) {
            callback(null, buildResponse(sessionAttributes, speechletResponse));
        });
    }
    else if (event.request.type === 'IntentRequest') {
        onIntent(event.request, event.session, function (sessionAttributes, speechletResponse) {
            callback(null, buildResponse(sessionAttributes, speechletResponse));
        });
    }
    else if (event.request.type === 'SessionEndedRequest') {
        onSessionEnded(event.request, event.session);
        callback();
    }
};
//# sourceMappingURL=alexaToken.js.map