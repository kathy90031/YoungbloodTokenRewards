import {GetTokenForChild} from "../database/GetTokenForChild";
import {ChildValidationUtil} from "../util/ChildValidationUtil";
import {ResponseHandler} from "../handler/ResponseHandler";
import {TokenActionUtil} from "../util/TokenActionUtil";
import {UpdateTokenForChild} from "../database/UpdateTokenForChild";

export const updateTokenService = async (event: any, context: any, callback: any) => {
    let body = JSON.parse(event.body);
    let childName = body.childName;
    let tokens = body.tokens;
    let action = body.action;

    let response: any;
    let responseHandler = new ResponseHandler();

    let isValid = ChildValidationUtil.isChildValid(childName);

    if (isValid){
        let tokenForChild = new GetTokenForChild();
        let updateTokensForChild = new UpdateTokenForChild();

        let count = await tokenForChild.execute(childName);
        let totalTokens = TokenActionUtil
            .calculateTokensForAction(action,parseInt(count),parseInt(tokens));

        updateTokensForChild.execute(childName,totalTokens);
        response = responseHandler.getValidChildResponse(childName, totalTokens);
    } else {
        response = responseHandler.getInvalidChildResponse();
    }


    callback(null, response);
};

