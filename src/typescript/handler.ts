require('source-map-support').install();
import {getTokenService} from "./service/GetTokenService";
import {updateTokenService} from "./service/UpdateTokenService";
import {alextTestService} from "./service/AlexaTokenTestService";

exports.getTokenService =  getTokenService;
exports.updateTokenService = updateTokenService;
exports.alexaTestService = alextTestService;
