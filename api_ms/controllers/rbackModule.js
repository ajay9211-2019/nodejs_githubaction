const rbackmodel = require('../models/rbackModule');
var commonHelper = require('../helpers/commonHelper');
var validaterHelper = require('../helpers/validaterHelper');
let FUNC = require("../utils/functions");
let userModel = require('../models/userModel');

exports.moduleOperations = async(req, res) =>{
    try {
        let reqbody, responseObj;
        reqbody = req.body;
        reqheaders = req.headers;
        await FUNC.logSave(req,reqbody,{},req.headers,"api_ms","Module Operations API","INFO","Module");
        if(reqbody.operation == 'insert'){
            let payloadValid = await validaterHelper.validatefields(req.body, {
                "module_name": "",
                "check_string": "",
                "status": 0,
                "operation": ""
            }, ["module_name", "check_string", "status", "operation"]);
            if (false === payloadValid.success) {
                return res.json(commonHelper.responseFormat(false, null, payloadValid.response));
            }

            let pattrn = /^[a-zA-Z -]*$/;
            if(!pattrn.test(reqbody.module_name)){
            
                return res.json(commonHelper.responseFormat(false, null, "Please provide valid model name","Please provide valid model name('number and special chanracters are not allowed')"));
            }
            responseObj = await rbackmodel.addRbackModule({
                uid : reqheaders.uid,
                module_name : reqbody.module_name,
                check_string : reqbody.check_string,
                status : reqbody.status
            });
        }
        else if(reqbody.operation == 'update'){
            let payloadValid = await validaterHelper.validatefields(req.body, {
                "id": 0,
                "update_fields": {},
                "operation": ""
            }, ["id", "update_fields", "operation"]);
            if (false === payloadValid.success) {
                return res.json(commonHelper.responseFormat(false, null, payloadValid.response));
            }
            let pattrn = /^[a-zA-Z -]*$/;
            if(!pattrn.test(reqbody.update_fields.name)){
            
                return res.json(commonHelper.responseFormat(false, null, "Please provide valid model name","Please provide valid model name('number and special chanracters are not allowed')"));
            }
            responseObj = await rbackmodel.updateRbackModule({
                uid : reqheaders.uid,
                update_fields : reqbody.update_fields,
                moduleid : reqbody.id
            });
        }
        else if(reqbody.operation == 'delete'){
            let payloadValid = await validaterHelper.validatefields(req.body, {
                "id": 0,
                "status": 0,
                "operation": ""
            }, ["id", "status", "operation"]);
            if (false === payloadValid.success) {
                return res.json(commonHelper.responseFormat(false, null, payloadValid.response));
            }
            let isDeleteFlag = false
            if(req.body.isDelete == "true") isDeleteFlag = true
            responseObj = await rbackmodel.deleteRbackModule({
                uid : reqheaders.uid,
                status : reqbody.status,
                moduleid : reqbody.id,
                isDelete : isDeleteFlag
            });
        }
        else if(reqbody.operation == 'read'){
            let payloadValid = await validaterHelper.validatefields(req.body, {
                "name": "",
                "operation": ""
            }, ["id", "operation"]);
            if (false === payloadValid.success) {
                return res.json(commonHelper.responseFormat(false, null, payloadValid.response));
            }
            responseObj = await rbackmodel.readRbackModule({
                modulename : reqbody.name
            });
        }
        else if(reqbody.operation == 'readall'){
            let payloadValid = await validaterHelper.validatefields(req.body, {
                "operation": ""
            }, ["operation"]);
            if (false === payloadValid.success) {
                return res.json(commonHelper.responseFormat(false, null, payloadValid.response));
            }
            responseObj = await rbackmodel.readAllRbackModule({
                modulename : reqbody.name
            });
        }
        else
        {
            return res.json(commonHelper.responseFormat(false, null, "Please provide proper operation value"));
        }
        res.set('status_code', 200);
        let flag = responseObj.sucessflag
        let message1 = responseObj.msg;
        let errmessage;
        if(flag == true) 
            errmessage = "Module API listed successfully"
        else
        {
            errmessage = responseObj.msg; 
            message1 = ""
        }

        //reset SuperAdmin roles module and features
        userModel.assignAllSiteAndAccessToSuperAdmin(req);

        let objtosend = commonHelper.responseFormat(flag, message1,  {}, errmessage);
        await FUNC.logSave(req,reqbody,objtosend,req.headers,"api_ms","response generated","INFO","Module");
        res.json(objtosend);
    } catch (error) {
        console.log('exception in moduleOperations :',error);
        await FUNC.logSave(req,reqbody,{},req.headers,"api_ms",error,"ERROR","Module");
        res.set('status_code', 200);
        let objtosend = commonHelper.responseFormat(false, {}, {}, 'moduleOperations API Failed');
        res.json(objtosend);
    }
}