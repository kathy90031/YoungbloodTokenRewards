
import {TokenActionType} from "../type/TokenActionType";

export class TokenActionUtil {

    static calculateTokensForAction(action: string,tokenCount: number, tokenUpdateCount: number): number {
        let totalTokens = 0;
        switch (action) {
            case TokenActionType.GIVE_TOKENS:
                totalTokens = tokenCount + tokenUpdateCount;
                break;
            case TokenActionType.LOSE_TOKENS:
                totalTokens = tokenCount - tokenUpdateCount;
                break;
            case TokenActionType.RESET_TOKENS:
                totalTokens = 0;
                break;
            default:
                totalTokens = 0;
                break;
        }

        return totalTokens;
    }
}
