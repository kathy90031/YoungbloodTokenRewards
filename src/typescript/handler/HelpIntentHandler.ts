import { HandlerInput, RequestHandler } from "ask-sdk";
import { Response } from "ask-sdk-model"
import {AlexaEventType} from "../type/AlexaEventType";
import {AlexaIntentNameType} from "../type/AlexaIntentNameType";

export class HelpIntentHandler implements RequestHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === AlexaEventType.INTENT_REQUEST
            && request.intent.name === AlexaIntentNameType.HELP_INTENT;
    }

    handle(handlerInput: HandlerInput): Response {
        const responseBuilder = handlerInput.responseBuilder;

        return responseBuilder.speak('No help is available at this time')
            .getResponse();
    }
}
