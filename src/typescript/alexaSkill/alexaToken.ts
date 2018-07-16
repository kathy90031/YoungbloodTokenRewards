'use strict';
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import {TokenInfo} from "../../domain/TokenInfo";
import {CreateToken} from "../database/CreateToken";
import {GetTokenForChild} from "../database/GetTokenForChild"

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies


// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'Welcome Youngbloods.  I hope someone is recieving tokens today'
    const repromptText = 'To give tokens say Give Gabriel 5 tokens.';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}



/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers

    if (intentName === 'receiveTokens') {
        receiveTokens(intent, session, callback);
    } else if (intentName === 'getTokenCount') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}

function createTokenAttributes(child) {
    return {
        child
    };
}

function receiveTokens(intent, session, callback) {
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
        invokeGetTokenCount(tokenInfo);
        sessionAttributes = createTokenAttributes(childName);
        speechOutput = `${childName} received ${tokenCount} tokens`;
        repromptText = "";
    } else {
        speechOutput = "There was a problem. Please try again.";
        repromptText = "";
    }

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getTokenCount(intent, session, callback) {
    const cardTitle = intent.name;
    const childSlot = intent.slots.child;


    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = false;
    let speechOutput = '';

    if (childSlot) {
        let childName = childSlot.value;
        let tokenInfo = createTokenInfo(childName,'');
        let tokenCount = invokeGetTokenCount(tokenInfo);
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

function createTokenInfo(childName,tokenCount){
    let tokenInfo = new TokenInfo();

    if (childName) {
        tokenInfo.childName = childName;
    }
    if (tokenCount) {
        tokenInfo.tokenCount = tokenCount;
    }

    return tokenInfo;
}



function invokeGetTokenCount(tokenInfo){

    let getChild = new GetTokenForChild(tokenInfo);

    getChild.execute();


    console.log('tokenCount: ' + getChild.tokenCount);
    return getChild.tokenCount;
}



function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'Thank you for trying the Alexa Skills Kit sample. Have a nice day!';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}


// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
export const invokeTokenReward: Handler = (event, context, callback) => {


    if (event.session.new) {
        onSessionStarted({ requestId: event.request.requestId }, event.session);
    }

    if (event.request.type === 'LaunchRequest') {
        onLaunch(event.request,
            event.session,
            (sessionAttributes, speechletResponse) => {
                callback(null, buildResponse(sessionAttributes, speechletResponse));
            });
    } else if (event.request.type === 'IntentRequest') {
        onIntent(event.request,
            event.session,
            (sessionAttributes, speechletResponse) => {
                callback(null, buildResponse(sessionAttributes, speechletResponse));
            });
    } else if (event.request.type === 'SessionEndedRequest') {
        onSessionEnded(event.request, event.session);
        callback();
    }
}
