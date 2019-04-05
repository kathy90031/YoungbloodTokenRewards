import { Handler } from 'aws-lambda';
import {invokeTokenRewards} from "../alexaSkill/alexaToken";
export const alextTestService = async (event: any, context: any, callback: any) => {

    let body = JSON.parse(event.body);
    let response: any;

    //console.log('callback: ' + JSON.stringify(callback));
    const skill = executeAlexaSkill(body, context, callback,invokeTokenRewards);

    console.log('skill', JSON.stringify(skill));
   // executeCallback('youngblood was here', testCallBack);
   //  const response = {
   //      statusCode: 200,
   //      body: JSON.stringify({
   //          event: body
   //
   //      }),
   //  };


};

function getResponse(value: any){
    console.log(value);
    return value;
}

function executeAlexaSkill(event: any, context: any, callback: any, cb: any){
    console.log('we are executing a call back passing it a function');
    cb(event,null,null);
}

