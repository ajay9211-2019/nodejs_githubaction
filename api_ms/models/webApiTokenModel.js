var baseModel   = require( appRoot+'/models/baseModel' );

exports.validateApiToken = (token) => {
    return baseModel.read(`select * from web_api_tokens WHERE value = "${token}"`);
};