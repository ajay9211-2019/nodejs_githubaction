
let request = require('request');

let logSave = async (req,
    req_body,
    response,
    headers,
    service_name,
    msg,
    log_type,//must be one of from process.env.log_types
    module,
    error = {}) => {

    return new Promise((resolve, reject) => {
        let env = process.env.log_env; //must be one of from process.env.env_types
        let request_type = req.method; //must be one of from process.env.request_types
        let api = req.originalUrl;

        let reqBody = {
            env,
            api,
            request_type,
            req_body,
            response,
            headers,
            service_name,
            msg,
            log_type,
            module,
            error
        }

        var options1 = {
            url: process.env.log_insert_url,
            headers: {
                "access-token": process.env.logger_token,
                "Content-Type": "application/json"
            },
            body: reqBody,
            method: "POST",
            json: true
        };

        function callback1(error, response, body) {
            try {

                if (error) {
                    throw error;
                }
                if (body.success) {
                    resolve(true)
                } else {
                    throw body.message;
                }
            } catch (exp) {

                console.log("Log Error : ", exp)
                reject(exp)
            }
        }
        request(options1, callback1);
    })
}
//example for call function => !set in await for synchronised
// let smpObj = {
//     "name": "sachin",
//     "mob": 1234567899
// };
// let req = { originalUrl: "temp.com", method: "POST" }
// logSave(req, smpObj, smpObj, smpObj, "temp_service", "temp msg", "DEBUG", "test")

exports.logSave = logSave;