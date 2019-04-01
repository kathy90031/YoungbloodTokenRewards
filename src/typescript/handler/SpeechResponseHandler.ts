export class SpeechResponseHandler {
    // --------------- Helpers that build all of the responses -----------------------

    buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
        return {
            outputSpeech: {
                type: 'PlainText',
                text: output,
            },
            card: {
                type: 'Simple',
                title: `SessionSpeechlet - ${title}`,
                content: `SessionSpeechlet - ${output}`,
            },
            reprompt: {
                outputSpeech: {
                    type: 'PlainText',
                    text: repromptText,
                },
            },
            shouldEndSession,
        };
    }

    buildResponse(sessionAttributes, speechletResponse) {
        return {
            version: '1.0',
            sessionAttributes,
            response: speechletResponse,
        };
    }

    getWelcomeResponse(callback) {
        // If we wanted to initialize the session to have some attributes we could add those here.
        const sessionAttributes = {};
        const cardTitle = 'Welcome';
        const speechOutput = 'Welcome Youngbloods.';
        const repromptText = 'To give tokens say Give Gabriel 5 tokens.';
        const shouldEndSession = false;

        callback(sessionAttributes,
            this.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }

}
