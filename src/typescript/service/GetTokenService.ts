import {GetTokenForChild} from "../database/GetTokenForChild";
import {ChildValidationUtil} from "../util/ChildValidationUtil";
import {SpeechResponseHandler} from "../handler/SpeechResponseHandler";
import {AlexaIntentNameType} from "../type/AlexaIntentNameType";

export const getTokenService = async (event: any, context: any, callback: any) => {

    let childName = event.queryStringParameters.childName;
    let isValid = ChildValidationUtil.isChildValid(childName);
    let responseHandler = new SpeechResponseHandler();

    let response: any;

    if (isValid){
        let tokenForChild =  new GetTokenForChild();
        let count = await tokenForChild.execute(childName);
        console.log('count ' + count);
        response = responseHandler.getValidChildResponse(childName, count, AlexaIntentNameType.GET_TOKENS);
    } else {
        response = responseHandler.getInvalidChildResponse(childName);
    }


    callback(null, response);
};

