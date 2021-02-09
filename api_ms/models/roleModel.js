const _ = require(`lodash`);

var baseModel   = require( appRoot+'/models/baseModel' );
let userController = require('../controllers/user')
const helper = require("../helpers/commonHelper");
const userModel = require('../models/userModel');

// {
// 	"operation" : "create",
// 	"role_name" : "demoRoleType1",
// 	"role_id" : 30 ,
// 	"updateRoles": [
//         {
//             "role_id": 30,
//             "role_name": "demoRoleType",
//             "status": 0
//         }
// 	],
// 	"roleModuleArray": [
		
// 		{
// 			"role_id": 31,
// 		    "module_id": 5,
// 		    "features": [
// 				{
// 					"feature_id": 1,
// 		            "status": 0
// 		        }
// 		    ]
// 		},
// 		{
// 			"role_id": 30,
// 		    "module_id": 5,
// 		    "features": [
// 				{
// 					"feature_id": 1,
// 		            "status": 0
// 		        }
// 		    ]
// 		}
		
// 	],
// 	"roleModulePermissions": [
		
// 	    {
// 	       "role_id": 31,
// 	       "module_id": 5,
// 	       "p_create": 0,
// 	       "p_read": 1,
// 	       "p_update": 1,
// 	       "p_delete":0
// 	    },
// 	    {
// 	       "role_id": 30,
// 	       "module_id": 5,
// 	       "p_create": 1,
// 	       "p_read": 1,
// 	       "p_update": 1,
// 	       "p_delete":0
// 	    }
    
//     ]
		
		
		
// }


exports.createRole = async (rolename,is_all_sites_access,uid,roleString,rank) => {
    //console.log(req);
    let query = await baseModel.read(`SELECT * FROM users WHERE email = '${uid}'`);
    let userId = (!_.isEmpty(query))?query[0].id:0;

    //check role name already exist or not
    let selectres = await baseModel.read(`SELECT * FROM role_types WHERE role_name = '${rolename}'`);
    
    if(!_.isEmpty(selectres)){
        
        return "role_type_already_exists";
      
    }else{

        let userData = await baseModel.create(`insert into role_types (role_name,status,created_by,created_date,updated_by,is_all_sites_access,role_string,rank) values('${rolename}',1,${userId},now(),${userId},${is_all_sites_access},'${roleString}',${rank})`);
        // //console.log( userData );
        return userData;
       
    }

	
};

let getRoleList = async (viewtype,role_id,loggedUserRoleRank) => {
    let query = '';
    //console.log(viewtype+"--------------"+role_id);
    if(role_id != "" && role_id != 0){
       
        if(viewtype == "role"){

            let query2 = await baseModel.read(`SELECT id as role_id,role_name,status,is_all_sites_access,role_string FROM role_types WHERE id = ${role_id} AND is_deleted = 0 order by id DESC`);

            let res11 = [];
            if(query2.length > 0){
                for(let m = 0; m < query2.length; m++ ){

                    let qry = await baseModel.read(`SELECT * FROM role_modules WHERE role_id = ${query2[m].role_id}`);
    
                    let temp = {
                        "role_id": query2[m].role_id,
                        "role_string": query2[m].role_string,
                        "role_name": query2[m].role_name,
                        "status": query2[m].status,
                        "is_all_sites_access":query2[m].is_all_sites_access,
                        "role_module_count": qry.length,
                    }
                    res11.push(temp);
                }
            }

            return res11;

        }else{
            query = await baseModel.read(`SELECT role_id,main_module_id,feature_id,status FROM role_modules WHERE role_id = ${role_id} group by role_id,main_module_id`);

            //console.log("-------------------- "+JSON.stringify(query));

            let queryRes = [];
            for(var i = 0 ; i < query.length ; i++){
                6
                var modalqry = '';
                modalqry = await baseModel.read(`SELECT rm.role_id,rm.main_module_id,rm.feature_id,rm.status as role_module_status,mmf.name as feature_name,mm.name as main_module_name,mm.status as main_module_status,mmf.status as feature_status FROM role_modules rm JOIN main_modules_features mmf ON rm.feature_id = mmf.id JOIN main_modules mm ON rm.main_module_id = mm.id WHERE role_id = ${query[i].role_id} AND main_module_id = ${query[i].main_module_id} AND mm.isdeleted != 1 AND mmf.isdeleted != 1 order by rm.id`);

                //console.log(`role_id = ${query[i].role_id} AND main_module_id = ${query[i].main_module_id}`+JSON.stringify(modalqry));
                let featureTeampObj = [];
                //let moduleTeampObj = [];
                let module_id = '';
                let main_module_name = '';
                let module_status = '';
                let role_module_status = '';
                //let moduleObj = '';
                for(var j = 0 ; j < modalqry.length ; j++){
                    let tempobj = {
                            
                        "feature_id": modalqry[j].feature_id,
                        "feature_name": modalqry[j].feature_name,
                        "feature_status": modalqry[j].role_module_status
                      
                    } 
                  
                    module_id = query[i].main_module_id,
                    main_module_name = modalqry[j].main_module_name,
                    module_status = modalqry[j].main_module_status
                    role_module_status = modalqry[j].main_module_status;

                    featureTeampObj.push(tempobj);
                   

                }
               // moduleTeampObj.push(moduleObj);
                let tempMainObj = {
                    "role_id": query[i].role_id,
                    "role_module_status":role_module_status,
                    "module_id": module_id,
                    "main_module_name":main_module_name,
                    "module_status": module_status,
                    "features":featureTeampObj
                }
                queryRes.push(tempMainObj);
                

            }
            return queryRes;
        }
        
    }else{

        if(viewtype == "role"){

            let query1 = await baseModel.read(`SELECT id as role_id,role_name,status,is_all_sites_access,role_string,rank as role_rank FROM role_types WHERE is_deleted = 0 
            ${loggedUserRoleRank != 1? ` and rank > ${loggedUserRoleRank}` : ''} 
            order by id DESC`);
            let res11 = [];
            for(let m = 0; m < query1.length; m++ ){

                if((['employee','driver','SuperAdmin']).includes(query1[m].role_name)){
                    continue;
                }

                let qry = await baseModel.read(`SELECT * FROM role_modules WHERE role_id = ${query1[m].role_id}`);

                let temp = {
                    "role_id": query1[m].role_id,
                    "role_string": query1[m].role_string,
                    "role_name": query1[m].role_name,
                    "role_rank": query1[m].role_rank,
                    "status": query1[m].status,
                    "is_all_sites_access": query1[m].is_all_sites_access,
                    "role_module_count": qry.length,
                }
                res11.push(temp);
            }

            return res11;
        }else{
            query = await baseModel.read(`SELECT role_id,main_module_id,feature_id,status FROM role_modules group by role_id,main_module_id`);

            let queryRes = [];
            for(var i = 0 ; i < query.length ; i++){
                
                var modalqry = '';
                modalqry = await baseModel.read(`SELECT rm.role_id,rm.main_module_id,rm.feature_id,rm.status as role_module_status,mmf.name as feature_name,mm.name as main_module_name,mm.status as main_module_status,mmf.status as feature_status FROM role_modules rm JOIN main_modules_features mmf ON rm.feature_id = mmf.id JOIN main_modules mm ON rm.main_module_id = mm.id WHERE role_id = ${query[i].role_id} AND main_module_id = ${query[i].main_module_id} AND mm.isdeleted != 1 AND mmf.isdeleted != 1 order by rm.id`);

                //console.log(`role_id = ${query[i].role_id} AND main_module_id = ${query[i].main_module_id}`+JSON.stringify(modalqry));
                let featureTeampObj = [];
                //let moduleTeampObj = [];
                let module_id = '';
                let main_module_name = '';
                let module_status = '';
                let role_module_status = '';
                //let moduleObj = '';
                for(var j = 0 ; j < modalqry.length ; j++){
                    let tempobj = {
                            
                        "feature_id": modalqry[j].feature_id,
                        "feature_name": modalqry[j].feature_name,
                        "feature_status": modalqry[j].role_module_status
                      
                    } 
                    module_id = query[i].main_module_id,
                    main_module_name = modalqry[j].main_module_name,
                    module_status = modalqry[j].main_module_status
                    role_module_status = modalqry[j].main_module_status;
                  
                    featureTeampObj.push(tempobj);
                   

                }
                //moduleTeampObj.push(moduleObj);
                let tempMainObj = {
                    "role_id": query[i].role_id,
                    "role_module_status":role_module_status,
                    "module_id": module_id,
                    "main_module_name":main_module_name,
                    "module_status": module_status,
                    "features":featureTeampObj
                }
                queryRes.push(tempMainObj);
                

            }
            return queryRes;
        }
        
    }
       
}

exports.getRoleList = getRoleList;

exports.updateRole = async (updateRoles,uid,req) => {

    let query = await baseModel.read(`SELECT * FROM users WHERE email = '${uid}'`);

    let userId = (!_.isEmpty(query))?query[0].id:0;

    let result = [];

    for(var i = 0 ; i < updateRoles.length; i++){

        let existing_data = await baseModel.read(`SELECT * FROM role_types WHERE id = ${updateRoles[i].role_id}`);

        console.log(JSON.stringify(existing_data));

        if(!_.isEmpty(existing_data)){

            let role_status = (_.isNumber(updateRoles[i].status)) ? updateRoles[i].status : existing_data[0].status;

            let is_all_sites_access = ((await userController.isSuperAdminLogged(req)) && _.isNumber(updateRoles[i].is_all_sites_access) && ([0,1,'0','1']).includes(updateRoles[i].is_all_sites_access)) ? updateRoles[i].is_all_sites_access : existing_data[0].is_all_sites_access;

            //console.log(role_status);

            let role_name = (_.isString(updateRoles[i].role_name) && (updateRoles[i].role_name != undefined || updateRoles[i].role_name != "")) ? updateRoles[i].role_name : existing_data[0].role_name;

            let role_string = ((updateRoles[i].role_string !== undefined) || (updateRoles[i].role_string != "" || updateRoles[i].role_string != null)) ? updateRoles[i].role_string : existing_data[0].role_string;

            let rank = ((updateRoles[i].rank !== undefined) || (updateRoles[i].rank != "" || updateRoles[i].rank != null)) ? updateRoles[i].rank : existing_data[0].rank;

            //console.log(role_name);

            //if(!['employee','driver'].includes(role_name)){

                let res = await baseModel.update(`
                UPDATE 
                role_types 
                SET 
                status = ${role_status},
                role_name = '${role_name}',
                role_string = '${role_string}',
                updated_by = ${userId},
                updated_date = now(),
                is_all_sites_access = ${is_all_sites_access},
                rank = ${rank}  
                WHERE id = ${updateRoles[i].role_id}`);

                result.push(res);
            //}

            if(is_all_sites_access == 1){
                await userModel.assignRoleToAllRemainingSitesOfUsers(uid,updateRoles[i].role_id);
            }
                  
        }
    }
    return result;
}
//"roleModuleArray" : [
		
//     {
//         "role_id" : 30,
//         "module_id" : 5,
//         "features" :[
//             {
//                 "feature_id" : 1,
//                 "status" : 1
//             }
//         ]
//     }
    
// ]
exports.assignRoleModule = async(roleModuleArr,uid) => {

    try{

        let query = await baseModel.read(`SELECT * FROM users WHERE email = '${uid}'`);

        //console.log(JSON.stringify(query));

        let userId = (!_.isEmpty(query))?query[0].id:0;

        let result_arr = [];

        for(var i = 0 ; i < roleModuleArr.length ; i++){

            //check role_id exists or not
            let roleid = roleModuleArr[i].role_id;

            let roleModuleStatus = roleModuleArr[i].role_module_status;
            
            let moduleArr = roleModuleArr[i].modules;
        
            let featureArr = roleModuleArr[i].features;

            if(!_.isEmpty(featureArr)){
        
                //console.log(JSON.stringify(featureArr));

                for(var q = 0 ; q < moduleArr.length ; q++){

                    for(var j = 0 ; j < featureArr.length ; j++ ){

                        console.log("in for loop");
                        //check role id 
                        let roleModulequery = await baseModel.read(`SELECT * FROM role_modules WHERE role_id = ${roleid} AND main_module_id = ${moduleArr[q].module_id} AND feature_id = ${featureArr[j].feature_id}`);
    
                        console.log(JSON.stringify(roleModulequery));
    
                        if(_.isEmpty(roleModulequery)){
                            //insert                   
                            console.log("do insert");
    
                            let insertqry = await baseModel.create(`INSERT INTO role_modules (role_id, main_module_id, feature_id, status, created_by, created_date, updated_by) VALUES(${roleid},${moduleArr[q].module_id},${featureArr[j].feature_id},${featureArr[j].feature_status},${userId},now(),${userId})`);

                            //update main module status

                            //await baseModel.update(`UPDATE main_modules SET status = ${moduleArr[q].module_status},updated_by = ${userId},updated_date = now() WHERE id = ${moduleArr[q].module_id}`);

                            //update feature status
                            //await baseModel.update(`UPDATE main_modules_features SET status = ${featureArr[j].feature_status},updated_by = ${userId},updated_date = now() WHERE id = ${featureArr[j].feature_id} AND main_modules_id = ${moduleArr[q].module_id}`);
    
                            result_arr.push(insertqry);
    
    
                        }else{
                            //update
                            console.log("do update");
    
                            let updateqry = await baseModel.update(`UPDATE role_modules SET role_id = ${roleid},main_module_id = ${moduleArr[q].module_id},feature_id = ${featureArr[j].feature_id}, status = ${featureArr[j].feature_status},updated_by = ${userId},updated_date = now() WHERE  role_id = ${roleid} AND main_module_id = ${moduleArr[q].module_id} AND feature_id = ${featureArr[j].feature_id}`);

                            //update main module status

                            //await baseModel.update(`UPDATE main_modules SET status = ${moduleArr[q].module_status},updated_by = ${userId},updated_date = now() WHERE id = ${moduleArr[q].module_id}`);

                            //update feature status
                            //await baseModel.update(`UPDATE main_modules_features SET status = ${featureArr[j].feature_status},updated_by = ${userId},updated_date = now() WHERE id = ${featureArr[j].feature_id} AND main_modules_id = ${moduleArr[q].module_id}`);
    
                            result_arr.push(updateqry);
                        }
                    }
                }

                
            }else{
                continue;
            }
        }

        return result_arr;

    }catch(e){

        console.log(e);
        // let res = null;
        // helper.makeResponse(res, 200, false, [], e, "Something Went Wrong");
    }
   

}

//  "roleModulePermissions": [
		
//     {
//        "role_id": 31,
//        "module_id": 5,
//        "p_create": 1,
//        "p_read": 1,
//        "p_update": 1,
//        "p_delete":0
//     }
    
// ]
exports.assignRoleModulePermissions = async(roleModulePermissions,uid) => {

    try{

        let result_arr = [];

        for(var i = 0 ; i < roleModulePermissions.length ; i++){
                    
            let roleModulequery = await baseModel.read(`SELECT * FROM role_permissions WHERE role_id = ${roleModulePermissions[i].role_id} AND module_id = ${roleModulePermissions[i].module_id}`);

            //console.log(JSON.stringify(roleModulequery));

            if(_.isEmpty(roleModulequery)){

                //insert                   
                //console.log("do insert");

                let insertqry = await baseModel.create(`INSERT INTO role_permissions (role_id, module_id, p_create, p_read, p_update, p_delete) VALUES(${roleModulePermissions[i].role_id},${roleModulePermissions[i].module_id},${roleModulePermissions[i].p_create},${roleModulePermissions[i].p_read},${roleModulePermissions[i].p_update},${roleModulePermissions[i].p_delete})`);

                result_arr.push(insertqry);


            }else{

                //update
                //console.log("do update");

                let updateqry = await baseModel.update(`UPDATE role_permissions SET role_id = ${roleModulePermissions[i].role_id},module_id = ${roleModulePermissions[i].module_id}, p_create = ${roleModulePermissions[i].p_create}, p_read = ${roleModulePermissions[i].p_read}, p_update = ${roleModulePermissions[i].p_update}, p_delete = ${roleModulePermissions[i].p_delete} WHERE  role_id = ${roleModulePermissions[i].role_id} AND module_id = ${roleModulePermissions[i].module_id}`);

                result_arr.push(updateqry);
            }
              
        }

        return result_arr;

    }catch(e){

        console.log(e);
        // let res = null;
        // helper.makeResponse(res, 200, false, [], e, "Something Went Wrong");
    }

    

}

exports.getAllModuleFeatureList = async (uid,roleId,moduleIds,featureTexts) => {

    //get role id from uid
    // let userQuery = await baseModel.read(`SELECT * FROM users_sites WHERE site_id = ${siteId} and user_id in (SELECT id from users WHERE email = '${uid}') limit 1`);

    // let role_id = userQuery[0].role_id


    let query = '';
    //console.log(viewtype+"--------------"+role_id);
    
    query = await baseModel.read(`SELECT * FROM main_modules WHERE status = 1 AND  isdeleted != 1 and 
    id in (${moduleIds.toString()})
    order by id desc`);

    let res11 = [];
    if(!_.isEmpty(query)){

        for(let m = 0; m < query.length; m++ ){

            let qry = await baseModel.read(`SELECT * FROM main_modules_features WHERE 
            main_modules_id = ${query[m].id} AND 
            isdeleted != 1 and
            check_string in (${featureTexts.toString()})`);

            let features = [];
    
            for(let n = 0; n < qry.length; n++ ){
                let temp = {
                    "feature_id": qry[n].id,
                    "feature_name": qry[n].name,
                    "feature_status": qry[n].status
                    
                }
                features.push(temp);
            }
            let mainmoduleArr = {
                    "module_id":query[m].id,
                    "module_name":query[m].name,
                    "module_status":query[m].status,
                    "features":features
                }

                       
            res11.push(mainmoduleArr);
        }
    }

    let roleModuleById = await getRoleList("role_module",roleId);
    let resultFinalArr = [];

    if(roleModuleById.length == 0){

        for(let m = 0 ; m < res11.length ; m++ ){

            res11[m].module_status = 0;

            let featureArr = res11[m].features;

            if(featureArr.length != 0){

                for(let f = 0 ; f < featureArr.length ; f++){

                    featureArr[f].feature_status = 0;
                }
            }

        }

        return res11;
        
    }else{

        let is_module_found = '';

        for(let m = 0 ; m < res11.length ; m++ ){

            is_module_found = 0

            for(let n = 0 ; n < roleModuleById.length ; n++){

                //check if module assigned or not
                if(res11[m].module_id == roleModuleById[n].module_id){

                    is_module_found = 1;

                    res11[m].module_status = roleModuleById[n].module_status

                    let mainfeatureArr = res11[m].features;

                    let featureArr = roleModuleById[n].features;

                    if(mainfeatureArr.length > 0){

                        if(featureArr.length > 0){

                            let isFeatureFound = '';

                            for(let mf = 0 ; mf < mainfeatureArr.length ; mf++){

                                isFeatureFound = 0

                                for(let fe = 0 ; fe < featureArr.length ; fe++){

                                    if(mainfeatureArr[mf].feature_id == featureArr[fe].feature_id){

                                        isFeatureFound = 1;

                                        mainfeatureArr[mf].feature_status = featureArr[fe].feature_status

                                    }
                                }
                                if(isFeatureFound == 0){

                                    mainfeatureArr[mf].feature_status = 0
                                }

                            }

                        }else{

                            for(let mf = 0 ; mf < mainfeatureArr.length ; mf++){

                                mainfeatureArr[mf].feature_status = 0;
                            }
                        }

                    }

                }

            }
            if(is_module_found == 0){
                res11[m].module_status = 0;
                let featureArr = res11[m].features;
                if(featureArr.length != 0){
                    for(let f = 0 ; f < featureArr.length ; f++){
                        featureArr[f].feature_status = 0;
                    }
                }
            }
        }
        return res11;
    }

    //return res11;
 
       
}

exports.deleteRole = async(role_id,uid) => {

    let query = await baseModel.read(`SELECT * FROM users WHERE email = '${uid}'`);

    let userId = (!_.isEmpty(query))?query[0].id:0;

    let result = [];

    let existing_data = await baseModel.read(`SELECT * FROM role_types WHERE id = ${role_id}`);

    console.log(JSON.stringify(existing_data));

    if(!_.isEmpty(existing_data)){

        let res = await baseModel.update(`UPDATE role_types SET is_deleted = 1,updated_by = ${userId},updated_date = now()  WHERE id = ${role_id}`);

        result.push(res);
    }

    return result;


}