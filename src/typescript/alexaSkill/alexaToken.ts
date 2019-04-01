'use strict';
import { Handler } from 'aws-lambda';
import {AlexaSessionHandler} from "../handler/AlexaSessionHandler";
import {AlexaEventType} from "../type/AlexaEventType";
import {IntentHandler} from "../intent/IntentHandler";
import {CallbackHandler} from "../handler/CallbackHandler";
import {SpeechResponseHandler} from "../handler/SpeechResponseHandler";
// --------------- Main handler -----------------------


// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
export const invokeTokenRewards: Handler = (event, context, callback) => {

    let alexaSessionHandler = new AlexaSessionHandler();
    let intentHandler = new IntentHandler();
    let callbackHandler = new CallbackHandler();
    const sessionAttributes = {};
    const speechletResponse = {};

    if (event.session.new) {
        alexaSessionHandler
            .onSessionStarted({ requestId: event.request.requestId }, event.session);

    }

    switch (event.request.type){
        case AlexaEventType.LAUNCH_REQUEST:
            alexaSessionHandler.onLaunch(event.request,
                event.session,
                callbackHandler.getAlexaCallback(sessionAttributes, speechletResponse, callback));
            break;
        case AlexaEventType.INTENT_REQUEST:
            intentHandler.onIntent(event.request,
                event.session,
                callbackHandler.getAlexaCallback(sessionAttributes, speechletResponse, callback));

            break;
        case AlexaEventType.SESSION_ENDED:
            alexaSessionHandler.onSessionEnded(event.request, event.session);
            break;

        default:
            alexaSessionHandler.onSessionEnded(event.request, event.session);
            break;
    }

}

