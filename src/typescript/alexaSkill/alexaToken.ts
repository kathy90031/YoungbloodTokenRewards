'use strict';

import {LambdaHandler} from "ask-sdk-core/dist/skill/factory/BaseSkillFactory";
import {SkillBuilders} from "ask-sdk";
import {CancelIntentHandler} from "../handler/CancelIntentHandler";
import {AmazonStopIntentHandler} from "../handler/StopIntentHandler";
import {LaunchRequestHandler} from "../handler/LaunchHandler";
import {SessionEndedHandler} from "../handler/SessionEndedHandler";
import {TokenErrorHandler} from "../handler/TokenErrorHandler";
import {GetTokensHandler} from "../handler/GetTokensHandler";
import {UpdateTokensHandler} from "../handler/UpdateTokensHandler";
import {ResetTokensHandler} from "../handler/ResetTokensHandler";


export const invokeTokenRewards = buildYoungbloodTokenSkill();

function buildYoungbloodTokenSkill(): LambdaHandler {
    return SkillBuilders.standard()
        .addRequestHandlers(
            new CancelIntentHandler,
            new AmazonStopIntentHandler,
            new LaunchRequestHandler,
            new SessionEndedHandler,
            new GetTokensHandler,
            new UpdateTokensHandler,
            new ResetTokensHandler
        )
        .addErrorHandlers(new TokenErrorHandler())
        .lambda();
}