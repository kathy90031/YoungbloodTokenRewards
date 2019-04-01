import {SpeechResponseHandler} from "./SpeechResponseHandler";

export class CallbackHandler {
    getAlexaCallback(sessionAttributes, speechletResponse, callback) {
        let speechResponseHandler = new SpeechResponseHandler();
        callback(null, speechResponseHandler.buildResponse(sessionAttributes, speechletResponse));
        return callback;
    }
}
