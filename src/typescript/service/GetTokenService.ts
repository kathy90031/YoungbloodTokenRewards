import {GetTokenForChild} from "../database/GetTokenForChild";
import {ChildValidationUtil} from "../util/ChildValidationUtil";
import {ResponseHandler} from "../handler/ResponseHandler";

export const getTokenService = async (event: any, context: any, callback: any) => {

    let childName = event.queryStringParameters.childName;
    let isValid = ChildValidationUtil.isChildValid(childName);
    let responseHandler = new ResponseHandler();
    let count = 0;
    let response: any;

    if (isValid){
        let tokenForChild = new GetTokenForChild();
        count = await tokenForChild.execute(childName);
        console.log('count ' + count);
        response = responseHandler.getValidChildResponse(childName, count);
    } else {
        response = responseHandler.getInvalidChildResponse();
    }


    callback(null, response);
};

