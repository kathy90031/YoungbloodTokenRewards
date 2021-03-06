import { HandlerInput, RequestHandler } from "ask-sdk";
import { Response } from "ask-sdk-model"
import {AlexaEventType} from "../type/AlexaEventType";
import {ChildValidationUtil} from "../util/ChildValidationUtil";
import {SpeechResponseHandler} from "./SpeechResponseHandler";
import {GetTokenForChild} from "../database/GetTokenForChild";
import {AlexaIntentNameType} from "../type/AlexaIntentNameType";
import {UpdateTokenForChild} from "../database/UpdateTokenForChild";
import {TokenActionUtil} from "../util/TokenActionUtil";

export class ResetTokensHandler implements RequestHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type ===  AlexaEventType.INTENT_REQUEST
            && request.intent.name === AlexaIntentNameType.RESET_TOKENS;
    }

    async handle(handlerInput: HandlerInput): Promise<Response> { //  Response | Promise<Response>

        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;

        console.log(JSON.stringify(request));
        let childName = '';
        let tokens = 0;
        let action = '';
        if (request.type === AlexaEventType.INTENT_REQUEST) {
            childName = request.intent.slots.child.value;
        }

        let isValid = ChildValidationUtil.isChildValid(childName);
        let responseHandler = new SpeechResponseHandler();

        let response: string;

        if (isValid){

            let updateTokensForChild = new UpdateTokenForChild();

            updateTokensForChild.execute(childName,0);
            response = responseHandler.getValidChildResponse(childName, 0, AlexaIntentNameType.GET_TOKENS);
        } else {
            response = responseHandler.getInvalidChildResponse(childName);
        }

        return responseBuilder
            .speak(response)
            .reprompt(responseHandler.getRepromptResponse())
            .getResponse();
    }
}
