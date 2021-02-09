"use strict";

const _ = require(`lodash`);
const request = require("request");
const CONST = require("../utils/constants");
const moment = require("moment");
const moment_timezone = require("moment-timezone");
const helper = require("../helpers/commonHelper");
const authenticate = require("../controllers/authenticate");
const roleModel = require("../models/roleModel");
const baseModel = require("../models/baseModel");
const userController = require('./user')
let FUNC = require("../utils/functions");



exports.roleTypeOperations = async (req, res, next) => {
  try {
    
      let operation = req.body.operation;
      let updateRole = req.body.updateRoles;
      let roleName = req.body.role_name;
      let roleString = req.body.role_string;
      let is_all_sites_access = req.body.is_all_sites_access;
      let rank = req.body.rank;
      let roleId = req.body.role_id;
      let roleModuleArr = req.body.roleModuleArray;
      let roleModulePermissions = req.body.roleModulePermissions;
      let viewtype = req.body.viewType;

      /* 
      res.setHeader("role-rank", role.rank);
      res.setHeader("role-id", roleId);
      res.setHeader("role-name", role.role_name);
      */

      let uid = req.headers.uid;
      let loggedUserRoleRank  = req.headers["role-rank"] || 0;
      let loggedUserRoleId = req.headers["role-id"] || 0;
      let loggedUserRoleName = req.headers["role-name"] || 0;

      console.log("roleId  "+roleId);
      
    if(!['create','update','view','delete','assign-module-to-role','assign-module-permissions'].includes(operation)){
      helper.makeResponse(res,200,false,{ operation: operation},[],"Role operation is Invalid , it must be from ['create','update','view','assign-module-to-role','assign-module-permissions'] "
      );
      return;
    }
    let result = '';
    if(operation == 'create'){

      if(roleName == undefined || roleName == ""){
        helper.makeResponse(res, 200, false, [], [], "Please provide role name");
        return;
      }
      if(!_.isString(roleName)){
        helper.makeResponse(res, 200, false, [], [{"error":"role name expected in a string format"}], "Please provide valid role name");
        return;
      }
      let pattrn = /^[a-zA-Z ]*$/;
      if(!pattrn.test(roleName)){
      
        helper.makeResponse(res, 200, false, [], [{"error":"Number and Special character not allowed"}], "Please provide valid role name");
        return;
      }
      // if( await userController.isSuperAdminLogged(req,res) && is_all_sites_access == undefined || is_all_sites_access == "" || is_all_sites_access == null){
      //   helper.makeResponse(res, 200, false, [], [], "Please provide is_all_sites_access");
      //   return;
      // }
      if( await userController.isSuperAdminLogged(req,res) && !([0,1,'0','1']).includes(is_all_sites_access)){
        helper.makeResponse(res, 200, false, [], [], "is_all_sites_access value should be 1 or 0");
        return;
      }

      /* 
      ****** rank ******
      Super Admin : 1
      Super Admin of product, MDM, Control Tower, QC Team : 2
      Admin of product, MDM, Control Tower, QC Team : 3
      Data Entry, SuperVisor, Auditor : 4
      Customer / Cilent. Bussiness Associates: 5
      Employee / Driver:6
      */

      if(isNaN(rank)){
        helper.makeResponse(res, 200, false, [], [], "rank value should be in number");
        return;
      }
      rank=parseInt(rank);

      if( !([1,2,3,4,5,6]).includes(rank)){
        helper.makeResponse(res, 200, false, [], [], "rank value should be between 1 and 6");
        return;
      }
      
      if(
        loggedUserRoleRank != 1 && loggedUserRoleRank>rank
        ){
        helper.makeResponse(res, 200, false, [], [], "rank should be lower than logged user rank");
        return;
      }

      if((roleName != undefined || roleName != "") && _.isString(roleName) ){
        // if(['employee','driver'].includes(roleName)){

        //   helper.makeResponse(res, 200, false, [], [], "permission denied to create or update role type in ['employee','driver']");
        //   return;

        // }else{

          if(!(await userController.isSuperAdminLogged(req,res))){
            is_all_sites_access=0;
          }
          console.log("-----"+roleName + is_all_sites_access + uid + roleString);

          
          let result = await roleModel.createRole(roleName,is_all_sites_access,uid,roleString,rank);
          await FUNC.logSave(req,req.body,{result:result},req.headers,'RBAC create role','role created successfully','INFO','RBAC CRUD Role');
          
          if(result == "role_type_already_exists"){
            helper.makeResponse(res, 200, false, [], [{"error":"Role type already exists"}], "role type already exists");
            return;
          }else{
            helper.makeResponse(
              res,
              200,
              true,
              result,
              [],
              "Role operation successful"
            );
          }



        //}
       

      }

      
      
    }
    if(operation == 'view'){

      if(viewtype == undefined || viewtype == ""){
        helper.makeResponse(res, 200, false, [], [], "Please provide view type");
        return;
      }
      if(!['role','role_module'].includes(viewtype)){
        helper.makeResponse(res, 200, false, [], [{"error":"role type should in ['role','role_module']"}], "Please provide valid view type");
        return;
      }if((viewtype != undefined || viewtype != "") && ['role','role_module'].includes(viewtype)){

        let role = roleId;
        let result = await roleModel.getRoleList(viewtype,role,loggedUserRoleRank);

        await FUNC.logSave(req,req.body,result,req.headers,'RBAC view role','role listed successfully','INFO','RBAC CRUD Role');

        helper.makeResponse(
          res,
          200,
          true,
          result,
          [],
          "Role operation successful"
        );
      
      }
      
      
    }
    if(operation == 'update'){

      if(updateRole == undefined || updateRole == ""){
        helper.makeResponse(res, 200, false, [], [], "Please provide role data to update ");
        return;
      }
      let pattrn = /^[a-zA-Z ]*$/;
      if(!pattrn.test(roleName)){
      
        helper.makeResponse(res, 200, false, [], [{"error":"Number and Special character not allowed"}], "Please provide valid role name");
        return;
      }
      if(!_.isArray(updateRole)){
        helper.makeResponse(res, 200, false, [], [{"error":"role data expected in an array format"}], "Please provide valid role data");
        return;
      }
      
      if((updateRole != undefined || updateRole != "") && _.isArray(updateRole) ){
        
        for(var i = 0 ; i < updateRole.length; i++){
          let rank = ((updateRole[i].rank !== undefined) || (updateRole[i].rank != "" || updateRole[i].rank != null)) ? updateRole[i].rank : 0;

          if(isNaN(rank)){
            helper.makeResponse(res, 200, false, [], [], "rank value should be in number");
            return;
          }
          rank=parseInt(rank);
    
          if( !([1,2,3,4,5,6]).includes(rank)){
            helper.makeResponse(res, 200, false, [], [], "rank value should be between 1 and 6");
            return;
          }
          
          if(
            loggedUserRoleRank != 1 && loggedUserRoleRank>rank
          ){
            helper.makeResponse(res, 200, false, [], [], "rank should be lower than logged user rank");
            return;
          }
          
        }

        let result = await roleModel.updateRole(updateRole,uid,req);

        await FUNC.logSave(req,req.body,result,req.headers,'RBAC update role','role updated successfully','INFO','RBAC CRUD Role');

        helper.makeResponse(
          res,
          200,
          true,
          result,
          [],
          "Role operation successful"
        );

      }
    }

    if(operation == 'assign-module-to-role'){

      if(roleModuleArr == undefined || roleModuleArr == ""){
        helper.makeResponse(res, 200, false, [], [], "Please provide role module array ");
        return;
      }
      if(!_.isArray(roleModuleArr)){
        helper.makeResponse(res, 200, false, [], [{"error":"role module expected in an array format"}], "Please provide valid role module data");
        return;
      }
      if((roleModuleArr != undefined || roleModuleArr != "") && _.isArray(roleModuleArr) ){

        let result = await roleModel.assignRoleModule(roleModuleArr,uid);

        await FUNC.logSave(req,req.body,result,req.headers,'RBAC assign role to module','role assigned successfully','INFO','RBAC CRUD Role');

        helper.makeResponse(
          res,
          200,
          true,
          result,
          [],
          "Role operation successful"
        );

      }
    }
    if(operation == 'assign-module-permissions'){

      if(roleModulePermissions == undefined || roleModulePermissions == ""){
        helper.makeResponse(res, 200, false, [], [], "Please provide role module array ");
        return;
      }
      if(!_.isArray(roleModulePermissions)){
        helper.makeResponse(res, 200, false, [], [{"error":"role module expected in an array format"}], "Please provide valid role module data");
        return;
      }
      if((roleModulePermissions != undefined || roleModulePermissions != "") && _.isArray(roleModulePermissions) ){

        result = await roleModel.assignRoleModulePermissions(roleModulePermissions,uid);

        helper.makeResponse(
          res,
          200,
          true,
          result,
          [],
          "Role operation successful"
        );

      }
    }
    if(operation == 'delete'){

      if(roleId == undefined || roleId == ""){
        helper.makeResponse(res, 200, false, [], [], "Please provide role id to delete");
        return;
      }
      if(!_.isNumber(roleId)){
        helper.makeResponse(res, 200, false, [], [], "Please provide valid role id to delete");
        return;
      }
           
        
      let result = await roleModel.deleteRole(roleId,uid);

      await FUNC.logSave(req,req.body,result,req.headers,'RBAC update role','role deleted successfully','INFO','RBAC CRUD Role');

      helper.makeResponse(
        res,
        200,
        true,
        result,
        [],
        "Role operation successful"
      );

      
    }



    
    
  } catch (exception) {
    console.log(exception);
    helper.makeResponse(res, 200, false, [], exception, "Something Went Wrong");
  }
};

exports.getAllModuleAndFeaturesList = async (req, res) => {
  try{
    let uid = req.headers.uid;
    //let siteId = req.headers.site_id;
    let roleId = req.body.role_id;
    console.log("roleId - " + roleId);
    if(roleId == undefined || roleId == ""){
      helper.makeResponse(
        res,
        200,
        false,
        [],
        [],
        "Please provide role id"
      );
    }
    //logged user active siteid
    let siteid = req.headers.siteid;

    //logged user active site role
    let headerRoleId = req.headers["role-id"];

    //find access of logged user
    let userid = req.headers.userid;
    let accessLst = await accessList(userid,siteid,headerRoleId);

    //logged user accessible modules by active siteid
    let modules = accessLst[0].modules;

    //get modulesIds in access lists
    let moduleIds = modules.map((m)=>m.moduleid);

    //all featureTexts in one array
    let featureTexts = modules.map((m)=>m.features);
    featureTexts = [].concat.apply([], featureTexts);
    featureTexts=featureTexts.map(f=>`'${f}'`);

    let result = await roleModel.getAllModuleFeatureList(uid,roleId,moduleIds,featureTexts);

    helper.makeResponse(
      res,
      200,
      true,
      result,
      [],
      "Role operation successful"
    );
  } catch (exception) {
    console.log(exception);
    helper.makeResponse(res, 200, false, [], exception, "Something Went Wrong");
  }
}

let accessList = async (user_id,siteId,roleId) => {


  let user = await baseModel.read(`select * from users where id = ${user_id}`);
  if (user.length == 0) {
    throw { msg: "Invalid user_id" }
  }

  let roleDriver = await baseModel.read(`select * from role_types where id = ${user[0].role} and role_name = "driver"`);
  if(roleDriver.length != 0){
    return [];
  }

  let roleEmployee = await baseModel.read(`select * from role_types where id = ${user[0].role} and role_name = "employee"`);
  if(roleEmployee.length != 0){
    
    let employee = await baseModel.read(`select * from employees where id = ${user[0].entity_id}`);

    let employeeSiteRole = await baseModel.read(`select * from employee_site_role where site_id = ${employee[0].site_id}`);
    if(employeeSiteRole.length==0){
      return [];
    }

    let roleId = employeeSiteRole[0].role_id;
    let siteid = employee[0].site_id;
    let siteCheck = await baseModel.read(`select * from sites where id = ${siteid} and active = 1`);
    if(siteCheck.length == 0){
      throw { msg : "Site Disabled"}
    }

    let roleData = await baseModel.read(`select * from role_types where id = ${roleId} and status = 1`);
    if(roleData.length == 0){
      throw { msg : "Role Disabled"}
    }

    let query = `select * from main_modules where status = 1 and (isdeleted is null or isdeleted <> 1);
    select * from main_modules_features where status = 1 and (isdeleted is null or isdeleted <> 1);`
    let modulesAndFeatures = await baseModel.read(query);
    let main_modules = modulesAndFeatures[0];
    let main_modules_features = modulesAndFeatures[1];

    let modules = [];

    query = `select * from role_modules where role_id = ${roleId} and status = 1`
    let role_modules = await baseModel.read(query);

    for (let i = 0; i < main_modules.length; i++) {
      let main_module = main_modules[i];


      let features = main_modules_features.filter((e) => {
        return e.main_modules_id == main_module.id;
      });

      let featuresRes = [];
      features = features.forEach((e) => {
        let access = role_modules.filter((e1) => {
          return e1.feature_id == e.id && main_module.id == e1.main_module_id
        })
        if (access.length > 0) {
          /* featuresRes.push({
            "featureid": e.id,
            "feature_string": e.check_string,
            "status": access[0].status
          }); */
          featuresRes.push( e.check_string);
        } else {
          /* featuresRes.push({
            "featureid": e.id,
            "feature_string": e.check_string,
            "status": 0
          }); */
        }
      });
      if(featuresRes.length > 0){
        modules.push({
          "moduleid": main_module.id,
          "module_string": main_module.check_string,
          "features": featuresRes
        })
      }
    };

    let site = await baseModel.read(`select * from sites where id = ${employee[0].site_id}`);
    let role = await baseModel.read(`select * from role_types where id = ${roleId}`);

    let siteData = {
      "site": site[0].name,
      "siteId":site[0].id,
      "role": role[0].role_name,
      modules: modules
    }

    return [siteData]
  }else{

    let query = `
			select 
			sites.id site_id,
			sites.name as site_name,
			"true" as is_default,
			${roleId} role_id ,
			(select role_name from role_types where id=${roleId}) as role_name,
			(select is_all_sites_access from role_types where id = ${roleId}) as is_all_sites_access
			from 
			sites
			where 
			sites.id = ${siteId}
		`;
		let sites =  await baseModel.read(query);

    query = `select * from main_modules where status = 1 and (isdeleted is null or isdeleted <> 1);
      select * from main_modules_features where status = 1 and (isdeleted is null or isdeleted <> 1);`
    let modulesAndFeatures = await baseModel.read(query);
    let main_modules = modulesAndFeatures[0];
    let main_modules_features = modulesAndFeatures[1];

    let sites_access = []

    for (let i = 0; i < sites.length; i++) {
      let siteRole = sites[i];
      let modules = [];

      let roleData = await baseModel.read(`select * from role_types where id = ${siteRole.role_id} and status = 1`);
      if(roleData.length != 0){
        let query = `select * from role_modules where role_id = ${siteRole.role_id} and status = 1`
        let role_modules = await baseModel.read(query);

        for (let i = 0; i < main_modules.length; i++) {
          let main_module = main_modules[i];


          let features = main_modules_features.filter((e) => {
            return e.main_modules_id == main_module.id;
          });

          let featuresRes = [];
          features = features.forEach((e) => {
            let access = role_modules.filter((e1) => {
              return e1.feature_id == e.id && main_module.id == e1.main_module_id
            })
            if (access.length > 0) {
              /* featuresRes.push({
                "featureid": e.id,
                "feature_string": e.check_string,
                "status": access[0].status
              }); */
              featuresRes.push( e.check_string);
            } else {
              /* featuresRes.push({
                "featureid": e.id,
                "feature_string": e.check_string,
                "status": 0
              }); */
            }
          });
          if(featuresRes.length > 0){
            modules.push({
              "moduleid": main_module.id,
              "module_string": main_module.check_string,
              "features": featuresRes
            })
          }
        };
      }
      let siteData = {
        "site": siteRole.site_name,
        "siteId":siteRole.site_id,
        "role": siteRole.role_name,
        modules: modules
      }

      sites_access.push(siteData);

    }

    return sites_access;
  }

}

