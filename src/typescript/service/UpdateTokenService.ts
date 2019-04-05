import {GetTokenForChild} from "../database/GetTokenForChild";
import {ChildValidationUtil} from "../util/ChildValidationUtil";
import {SpeechResponseHandler} from "../handler/SpeechResponseHandler";
import {TokenActionUtil} from "../util/TokenActionUtil";
import {UpdateTokenForChild} from "../database/UpdateTokenForChild";
import {AlexaIntentNameType} from "../type/AlexaIntentNameType";

export const updateTokenService = async (event: any, context: any, callback: any) => {
    let body = JSON.parse(event.body);
    let childName = body.childName;
    let tokens = body.tokens;
    let action = body.action;

    let response: any;
    let responseHandler = new SpeechResponseHandler();

    let isValid = ChildValidationUtil.isChildValid(childName);
    let count: number;
    let responseCount: any;
    if (isValid){
        let tokenForChild = new GetTokenForChild();
        let updateTokensForChild = new UpdateTokenForChild();

        responseCount = await tokenForChild.execute(childName);
        count = parseInt(responseCount);
        let totalTokens = TokenActionUtil
            .calculateTokensForAction(action,count,parseInt(tokens));

        updateTokensForChild.execute(childName,totalTokens);
        response = responseHandler.getValidChildResponse(childName, totalTokens, action);
    } else {
        response = responseHandler.getInvalidChildResponse(childName);
    }


    callback(null, response);
};

