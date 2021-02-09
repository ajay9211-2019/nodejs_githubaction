const rbackmodel = require('../models/rbackFeature');
var commonHelper = require('../helpers/commonHelper');
var validaterHelper = require('../helpers/validaterHelper');
let FUNC = require("../utils/functions");
let userModel = require('../models/userModel');

exports.featureOperations = async(req, res) =>{
    try {
        let reqbody, responseObj;
        reqbody = req.body;
        reqheaders = req.headers;
        await FUNC.logSave(req,reqbody,{},req.headers,"api_ms","Feature Operations API","INFO","Feature");
        if(reqbody.operation == 'insert'){
            let payloadValid = await validaterHelper.validatefields(req.body, {
                "features": [
                    {
                        "feature_name":"",
                        "check_string":"",
                        "status":0
                    }
                ],
                "module_name": "",
                "operation": ""
            }, ["features", "operation", "module_name"]);
            if (false === payloadValid.success) {
                return res.json(commonHelper.responseFormat(false, null, payloadValid.response));
            } 
            responseObj = await rbackmodel.addRbackFeature({
                uid : reqheaders.uid,
                features : reqbody.features,
                module_name : reqbody.module_name
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
            responseObj = await rbackmodel.updateRbackFeature({
                uid : reqheaders.uid,
                update_fields : reqbody.update_fields,
                moduleid : reqbody.id
            });
        }
        else if(reqbody.operation == 'delete'){
            let payloadValid = await validaterHelper.validatefields(req.body, {
                "name": "",
                "status": 0,
                "operation": ""
            }, ["name", "status", "operation"]);
            if (false === payloadValid.success) {
                return res.json(commonHelper.responseFormat(false, null, payloadValid.response));
            }
            let isDeleteFlag = false
            if(req.body.isDelete == "true") isDeleteFlag = true
            responseObj = await rbackmodel.deleteRbackFeature({
                uid : reqheaders.uid,
                status : reqbody.status,
                featurename : reqbody.name,
                isDelete : isDeleteFlag
            });
        }
        else if(reqbody.operation == 'read'){
            let payloadValid = await validaterHelper.validatefields(req.body, {
                "module_name": "",
                "operation": ""
            }, ["module_name", "operation"]);
            if (false === payloadValid.success) {
                return res.json(commonHelper.responseFormat(false, null, payloadValid.response));
            }
            responseObj = await rbackmodel.readRbackFeature({
                featurename : reqbody.module_name
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
            errmessage = "Feature API listed successfully"
        else
        {
            errmessage = responseObj.msg; 
            message1 = ""
        }

        //reset SuperAdmin roles module and features
        await userModel.assignAllSiteAndAccessToSuperAdmin(req);

        let objtosend = commonHelper.responseFormat(flag, message1,  {}, errmessage);
        await FUNC.logSave(req,reqbody,objtosend,req.headers,"api_ms","response generated","INFO","Module");
        res.json(objtosend);
    } catch (error) {
        console.log('exception in featureOperations :'+error);
        await FUNC.logSave(req,reqbody,{},req.headers,"api_ms",error,"ERROR","Feature");
        res.set('status_code', 200);
        let objtosend = commonHelper.responseFormat(false, {}, {}, 'featureOperations API Failed');
        res.json(objtosend);
    }
}