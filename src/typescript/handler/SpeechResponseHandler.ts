import {AlexaIntentNameType} from "../type/AlexaIntentNameType";

export class SpeechResponseHandler {

    getInvalidChildResponse(childName: string) {
        return `There isn't any child named ${childName} in the family. Please use either Gabriel or Jackson`;
    }

    getValidChildResponse(childName: string, tokenCount: any, action: string): string {
        let tokenWord = '';
        if (tokenCount === 1){
            tokenWord = 'token ';
        } else {
            tokenWord = 'tokens';
        }
        let verb = '';
        switch (action){
            case AlexaIntentNameType.GET_TOKENS:
                verb = 'has';
                break;
            case AlexaIntentNameType.GIVE_TOKENS:
                verb = 'received';
                break;
            case AlexaIntentNameType.RESET_TOKENS:
                verb = 'has been reset to';
                break;
            case AlexaIntentNameType.LOSE_TOKENS:
                verb = 'lost';
                break;
            default:
                verb = 'has';
                break;
        }
        return `${childName} ${verb} ${tokenCount} ${tokenWord}`;
    }

    getRepromptResponse() {
        return 'Do you need anything else?';
    }


}
