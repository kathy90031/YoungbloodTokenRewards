require('source-map-support').install();
import {getTokenService} from "./service/GetTokenService";
import {updateTokenService} from "./service/UpdateTokenService";

exports.getTokenService =  getTokenService;
exports.updateTokenService = updateTokenService;
