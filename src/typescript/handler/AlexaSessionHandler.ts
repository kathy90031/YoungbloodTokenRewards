import {SpeechResponseHandler} from "./SpeechResponseHandler";

export class AlexaSessionHandler {
    /**
     * Called when the user launches the skill without specifying what they want.
     */
    onLaunch(launchRequest, session, callback) {
        console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);
        let speechResponseHandler = new SpeechResponseHandler();
        // Dispatch to your skill's launch.
        speechResponseHandler.getWelcomeResponse(callback);
    }

    onSessionEnded(sessionEndedRequest, session) {
        console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
        // Add cleanup logic here
    }

    /**
     * Called when the session starts.
     */
     onSessionStarted(sessionStartedRequest, session) {
        console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
    }


     handleSessionEndRequest(callback) {
        const cardTitle = 'Session Ended';
        const speechOutput = 'Thank you for trying the Alexa Skills Kit sample. Have a nice day!';
        // Setting this to true ends the session and exits the skill.
        const shouldEndSession = true;
        let speechResponseHandler = new SpeechResponseHandler();
        callback({}, speechResponseHandler.buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
    }

}
