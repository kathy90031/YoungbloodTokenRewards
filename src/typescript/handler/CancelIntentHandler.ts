import { HandlerInput, RequestHandler } from "ask-sdk";
import { Response } from "ask-sdk-model"
import {AlexaEventType} from "../type/AlexaEventType";
import {AlexaIntentNameType} from "../type/AlexaIntentNameType";

export class CancelIntentHandler implements RequestHandler {

    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === AlexaEventType.INTENT_REQUEST
            && request.intent.name === AlexaIntentNameType.CANCEL_INTENT;
    }

    handle(handlerInput: HandlerInput): Response {
        const responseBuilder = handlerInput.responseBuilder;

        return responseBuilder.speak('No worries. Catch you later.  BOO YA')
            .withShouldEndSession(true)
            .getResponse();
    }
}
