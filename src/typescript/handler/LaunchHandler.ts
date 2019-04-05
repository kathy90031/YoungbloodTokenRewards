import { HandlerInput, RequestHandler } from "ask-sdk";
import { Response } from "ask-sdk-model"
import {AlexaEventType} from "../type/AlexaEventType";

export class LaunchRequestHandler implements RequestHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === AlexaEventType.LAUNCH_REQUEST;
    }

    handle(handlerInput: HandlerInput): Response {
        const responseBuilder = handlerInput.responseBuilder;
        const promptText = 'Who are you giving tokens to today?';
        return responseBuilder
            .speak('Welcome Youngbloods!')
            .reprompt('')
            .withSimpleCard('Tokens', promptText)
            .getResponse();
    }
}
