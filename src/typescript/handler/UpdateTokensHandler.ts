import { HandlerInput, RequestHandler } from "ask-sdk";
import { Response } from "ask-sdk-model"
import {AlexaEventType} from "../type/AlexaEventType";
import {ChildValidationUtil} from "../util/ChildValidationUtil";
import {SpeechResponseHandler} from "./SpeechResponseHandler";
import {GetTokenForChild} from "../database/GetTokenForChild";
import {AlexaIntentNameType} from "../type/AlexaIntentNameType";
import {UpdateTokenForChild} from "../database/UpdateTokenForChild";
import {TokenActionUtil} from "../util/TokenActionUtil";

export class UpdateTokensHandler implements RequestHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type ===  AlexaEventType.INTENT_REQUEST
            && (request.intent.name === AlexaIntentNameType.GIVE_TOKENS
                || request.intent.name === AlexaIntentNameType.LOSE_TOKENS);
    }

    async handle(handlerInput: HandlerInput): Promise<Response> { //  Response | Promise<Response>

        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;


        let childName = '';
        let tokens = 0;
        let action = '';
        if (request.type === AlexaEventType.INTENT_REQUEST) {
            childName = request.intent.slots.child.value;
            tokens = parseInt(request.intent.slots.tokenCount.value);
            action = request.intent.name;
        }

        let isValid = ChildValidationUtil.isChildValid(childName);
        let responseHandler = new SpeechResponseHandler();

        let response: string;

        if (isValid && !Number.isNaN(tokens)){
            let tokenForChild = new GetTokenForChild();
            let updateTokensForChild = new UpdateTokenForChild();

            let count = await tokenForChild.execute(childName);

            let totalTokens = TokenActionUtil
                .calculateTokensForAction(action,count,tokens);

            updateTokensForChild.execute(childName,totalTokens);
            response = responseHandler.getValidChildResponse(childName, tokens, action);
            response = response + ' and now '
                + responseHandler.getValidChildResponse(childName, totalTokens, AlexaIntentNameType.GET_TOKENS);
        }  else if (Number.isNaN(tokens)) {
            response = responseHandler.getInvalidTokenCount();
        } else {
            console.log("isValid: " + isValid);
            response = responseHandler.getInvalidChildResponse(childName);
        }


        return responseBuilder
            .speak(response)
            .reprompt(responseHandler.getRepromptResponse())
            .getResponse();
    }
}
