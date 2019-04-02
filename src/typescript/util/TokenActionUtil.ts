
import {AlexaIntentNameType} from "../type/AlexaIntentNameType";

export class TokenActionUtil {

    static calculateTokensForAction(action: string,tokenCount: number, tokenUpdateCount: number): number {
        let totalTokens = 0;
        switch (action) {
            case AlexaIntentNameType.GIVE_TOKENS:
                totalTokens = tokenCount + tokenUpdateCount;
                break;
            case AlexaIntentNameType.LOSE_TOKENS:
                totalTokens = tokenCount - tokenUpdateCount;
                break;
            default:
                totalTokens = 0;
                break;
        }

        return totalTokens;
    }
}
