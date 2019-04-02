import { HandlerInput, RequestHandler } from "ask-sdk";
import { Response } from "ask-sdk-model"
import {AlexaEventType} from "../type/AlexaEventType";
import {ChildValidationUtil} from "../util/ChildValidationUtil";
import {SpeechResponseHandler} from "./SpeechResponseHandler";
import {GetTokenForChild} from "../database/GetTokenForChild";
import {AlexaIntentNameType} from "../type/AlexaIntentNameType";

export class GetTokensHandler implements RequestHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type ===  AlexaEventType.INTENT_REQUEST
            && request.intent.name === AlexaIntentNameType.GET_TOKENS;
    }

    async handle(handlerInput: HandlerInput): Promise<Response> { //  Response | Promise<Response>

        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let childName = '';
        if (request.type === AlexaEventType.INTENT_REQUEST) {
            childName = request.intent.slots.child.value;
        }

        let isValid = ChildValidationUtil.isChildValid(childName);
        let responseHandler = new SpeechResponseHandler();

        let response: string;

        if (isValid){
            let tokenForChild =  new GetTokenForChild();
            let count = await tokenForChild.execute(childName);
            response = responseHandler.getValidChildResponse(childName, count, AlexaIntentNameType.GET_TOKENS);
        } else {
            response = responseHandler.getInvalidChildResponse(childName);
        }

        return responseBuilder
            .speak(response)
            .reprompt(responseHandler.getRepromptResponse())
            .getResponse();
    }
}
