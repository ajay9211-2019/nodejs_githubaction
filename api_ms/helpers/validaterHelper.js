"use strict";

const payloadCheck = require('payload-validator');
 
//validator Function
//input parameters => requestObj ={}, targetObj = {}, mandatoryFields=[]
exports.validatefields = async (requestObj ,targetObj, mandatoryFields) =>
{
	let result = false;
	if(Object.keys(targetObj).length > 0 && mandatoryFields.length > 0)
	{
		result = payloadCheck.validator(requestObj, targetObj, mandatoryFields, true);
	}
	return result;
}

