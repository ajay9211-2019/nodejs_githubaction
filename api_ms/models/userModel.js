const _ = require(`lodash`);
const moment = require("moment");
let FUNC = require("../utils/functions");
var baseModel = require(appRoot + '/models/baseModel');
const tableName = 'users';

exports.getDetails = (resourse_id, resource_type) => {
	//console.log(req);
	let userData = baseModel.read(`select * from ${resource_type} WHERE id = ${resourse_id}`);
	//console.log( userData );
	return userData;
};

exports.GetUserDetails = (reqData) => {
	const resource_id = reqData.user.resource_id;
	const resource_type = reqData.user.resource_type;

	let usrdetails = baseModel.read(`select res.*,induction.approved_items,induction.rejected_items from ${resource_type} as res left join induction on res.id = induction.resource_id WHERE res.id = ${resource_id} `);

	//console.log(usrdetails);

	return usrdetails;
}

exports.saveDetails = (reqData) => {
	const resource_type = reqData.user.resource_type;
	const resource_id = reqData.user.resource_id;
	const session_id = reqData.user.session_id;
	const fieldData = reqData.data;

	const form_data = fieldData.formData;
	const form_document = fieldData.document;

	var update_query = `UPDATE ${resource_type} SET `;

	for (var key in form_data) {
		if (form_data.hasOwnProperty(key)) {
			update_query += `${key} = '${form_data[key]}',`;
		}
	}
	update_query += `WHERE id = ${resource_id}`;
	//console.log(update_query);
	var uquery = update_query.replace(",WHERE", " WHERE");

	let saveData = baseModel.update(`${uquery}`);

	var rtype = (resource_type == "drivers") ? "Driver" : "Vehicle";

	//check resource_id data exist in induction table or not

	let selectRidData = baseModel.read(`select id,resource_type from induction WHERE resource_id = ${resource_id}`);

	console.log(selectRidData);
	if (_.isEmpty(selectRidData)) {
		//console.log('no data');
	} else {
		//console.log('has data');
	}

	//let saveDocument = baseModel.create(`INSERT INTO induction (resource_id, resource_type, approved_items, rejected_items, comments, created_by) VALUES('${resource_id}','${rtype}','${form_document.approved_doc}','${form_document.rejected_doc}','${form_document.comment}','${session_id}')`);

	//var inductId = saveDocument.insertId;
	//console.log(selectRidData.length);

	return selectRidData;

}
exports.getBAList = () => {

	let userData = baseModel.read(`select id,legal_name from business_associates`);

	return userData;


}

exports.getDashboardTatList = () => {
	const tatList = {
		"non_complient": {
			"driver": 23,
			"vehicle": 20,
		}, "draft": {
			"driver": 25,
			"vehicle": 45,
		}, "new_request": {
			"driver": 250,
			"vehicle": 450,
		}, "qc_pending": {
			"driver": 125,
			"vehicle": 45,
		}, "rejected": {
			"driver": 2,
			"vehicle": 4,
		}, "inducted": {
			"driver": 15,
			"vehicle": 34,
		}
	}
	return tatList;
}

exports.dashboardFilter = () => {
	var data = [
		{
			"resource_id": 454,
			"ba_legal_name": "CAB TRAVELS LTD",
			"licence_number": "ABDN7657",
			"gender": "Male",
			"induction_status": "Registered",
			"date_of_registration": ""
		},
		{
			"resource_id": 455,
			"ba_legal_name": "CAB TRAVELS LTD",
			"licence_number": "ABDN7657",
			"gender": "Male",
			"induction_status": "Registered",
			"date_of_registration": ""
		},
		{
			"resource_id": 456,
			"ba_legal_name": "CAB TRAVELS LTD",
			"licence_number": "ABDN7657",
			"gender": "Male",
			"induction_status": "Registered",
			"date_of_registration": ""
		},

	]
	return data;
}

exports.roles = async (roleString,roleRank) => {
	
	if(roleString=="all")
	{
		let query = `select id,role_name,is_all_sites_access from role_types where status=1 and is_deleted = 0`;
		return await baseModel.read(query);
	}
	else
	{
		let query = `select id,role_name,is_all_sites_access from role_types where status=1 and is_deleted = 0
		${roleString=="employee"?` and role_string = "employee"`:` ${roleRank != 1 ? ` and rank>${roleRank}` : ''}`}
	`;
		return await baseModel.read(query);
	}
}

exports.rolesByIsAllSitesAccess = async () => {
	let query = "select id,role_name,is_all_sites_access,rank from role_types where status=1 and is_all_sites_access = 1 and is_deleted = 0";
	return await baseModel.read(query);
}

exports.rolesFindById = async (id) => {
	let query = "select id,role_name,role_string from role_types where status=1 and is_deleted = 0 and id=" + id;
	return await baseModel.read(query);
}

let getUserByuId = async (uid) => {
	let query = `
        select * from users usr
        where
        usr.email = '${uid}' OR 
        usr.username = '${uid}' OR 
        usr.phone = '${uid}';
      `;
	return await baseModel.read(query);
}
exports.getUserByuId=getUserByuId;

exports.getUserById = async (id) => {
	return await baseModel.read(`select * from users where id = ${id}`)
}

exports.userSites = async (user_id) => {

	let user = await baseModel.read(`select * from users where id = ${user_id}`);
	if (user.length == 0) {
		throw { msg: "Invalid user_id" }
	}

	let roleDriver = await baseModel.read(`select * from role_types where id = ${user[0].role} and role_name = "driver"`);
	if(roleDriver.length != 0){
		let drivers = await baseModel.read(`select * from drivers where id = ${user[0].entity_id}`);

		let siteid = drivers[0].site_id
		let siteCheck = await baseModel.read(`select * from sites where id = ${siteid} and active = 1`);
		if(siteCheck.length == 0){
			throw { msg : "Site Disabled"}
		}

		let query = `
			select 
			sites.id site_id,
			sites.name as site_name,
			sites.site_type as site_type,
			"true" as is_default,
			0 role_id ,
			"NA" as role_name,
			0 as role_rank,
			0 as is_all_sites_access,
			(case when sites.site_type = "end_to_end" then 0 else 1 end) is_operations_only_site,
            (select name from employee_companies where id = sites.employee_company_id) customer_name
			from 
			sites
			where 
			sites.id = ${siteid}
            order by customer_name
		`;
		return await baseModel.read(query)
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

		let query = `
			select 
			sites.id site_id,
			sites.name as site_name,
			sites.site_type as site_type,
			"true" as is_default,
			${roleId} role_id ,
			(select role_name from role_types where id=${roleId}) as role_name,
			(select rank from role_types where id=${roleId}) as role_rank,
			(select is_all_sites_access from role_types where id = ${roleId}) as is_all_sites_access,
			(case when sites.site_type = "end_to_end" then 0 else 1 end) is_operations_only_site,
            (select name from employee_companies where id = sites.employee_company_id) customer_name
			from 
			sites
			where 
			sites.id = ${siteid}
            order by customer_name
		`;
		return await baseModel.read(query)
	}

    let query = `
        select 
        site_id,
		sites.name as site_name,
		sites.site_type as site_type,
        selected as is_default,
		role_id ,
		(select rank from role_types where id=role_id) as role_rank,
		(select role_name from role_types where id=role_id) as role_name,
		(select is_all_sites_access from role_types where id=role_id) as is_all_sites_access,
		(case when sites.site_type = "end_to_end" then 0 else 1 end) is_operations_only_site,
		(select name from employee_companies where id = sites.employee_company_id) customer_name
        from users_sites join sites on sites.id=users_sites.site_id where user_id = ${user_id} and sites.active=1
		order by customer_name;
	`;
    return await baseModel.read(query)
}

exports.findFirstSiteId = async ()=>{
	return (await baseModel.read('select id from sites limit 1'))[0].id;
}

exports.assignRoleToAllSite = async (roleId,userId,loggedUserId)=>{
	let currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
	let sites = await baseModel.read('select * from sites');
	
	await baseModel.read(`delete from users_sites where user_id = ${userId};`)

	let isSelected = false;
	let isDefaultSiteSet = false;
	for(let i=0; i<sites.length; i++){
		let siteId = sites[i].id;
		if(!isDefaultSiteSet){
			isSelected = sites[i].active == 1;
		}
		let query =`
		INSERT INTO users_sites
		(user_id,site_id,role_id,selected,created_by,updated_by,created_at,updated_at)
		values
		(${userId},${siteId},${roleId},"${isSelected}",${loggedUserId},${loggedUserId},"${currentDate}","${currentDate}");	`
		await baseModel.read(query)
		if(isSelected){
			isDefaultSiteSet = true
			isSelected = false;
		}
	}
}

/**
for superAdmin : 
call when 
	- new module, feature, site added in system
	- module, feature, site update in system
*/
exports.assignAllSiteAndAccessToSuperAdmin = async (req)=>{
	try{

		//find logged user userId
		let uidHeader = req.headers.uid;
		let userCreatedBy = await getUserByuId(uidHeader);
		let created_by = userCreatedBy[0].id;

		//current date
		let currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

		// find super admin role
		let superAdminRole = await baseModel.read(`select * from role_types where role_name = "SuperAdmin";`);
		if(superAdminRole.length == 0){
			throw { msg : "Super Admin role not found" }
		}

		//find userIds which have super admin role
		let userIds = await baseModel.read(`select distinct user_id from users_sites where role_id = ${superAdminRole[0].id} ;`);
		
		let sites = await baseModel.read('select * from sites');

		//assign all active sites to super admin users
		for(let i=0; i<userIds.length; i++){
			let userId = userIds[i].user_id;
	
			await baseModel.read(`delete from users_sites where user_id = ${userId};`)

			let isDefaultSiteSet = false;
			let isSelected = false;
			for(let i=0; i<sites.length; i++){
				let siteId = sites[i].id;
				if(!isDefaultSiteSet){
					isSelected = sites[i].active == 1;
				}
				let query =`
				INSERT INTO users_sites
				(user_id,site_id,role_id,selected,created_by,updated_by,created_at,updated_at)
				values
				(${userId},${siteId},${superAdminRole[0].id},"${isSelected}",${created_by},${created_by},"${currentDate}","${currentDate}");	`
				await baseModel.read(query)
				if(isSelected){
					isDefaultSiteSet = true
					isSelected = false;
				}
			}
		}

		//assign all access to SuperAdmin role
		await baseModel.read(`
			delete from role_modules where role_id = ${superAdminRole[0].id};

			INSERT INTO role_modules
			(role_id,main_module_id,feature_id,status,created_by,created_date,updated_by,updated_date)
			select ${superAdminRole[0].id},main_modules_id,main_modules_features.id,1,${created_by},"${currentDate}",${created_by},"${currentDate}" from main_modules_features,main_modules
			where
			main_modules_features.isdeleted = 0 and
			main_modules.isdeleted = 0 and
			main_modules_features.main_modules_id = main_modules.id;
		`);

	}catch(err){
		console.error(" assignAllSiteAndAccessToSuperAdmin error : ",err);
		
		let req = { originalUrl: "assignAllSiteAndAccessToSuperAdmin", method: "-", headers : {} };
        FUNC.logSave(req, {}, {}, req.headers, "api_ms", "assignAllSiteAndAccessToSuperAdmin error occurred", "FATAL", "api", err)
	}
}

/** 
for otherthan superAdmin role who have all site access : 
call when 
	- new site added in system
	- site update in system
*/
exports.assignNewSiteToAllSiteAccessibleRoles = async (siteId,req) => {
	try{

		//find logged user userId
		let uidHeader = req.headers.uid;
		let userCreatedBy = await getUserByuId(uidHeader);
		let created_by = userCreatedBy[0].id;

		//current date
		let currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
		
		let roles = await baseModel.read('select * from role_types where is_all_sites_access = 1 and role_name <> "SuperAdmin";');

		for(let i=0; i<roles.length; i++){
			let roleId = roles[i].id;

			let userIds = await baseModel.read(`select distinct user_id from users_sites where role_id = ${roleId};`);

			//assign new site with same role
			for(let j=0; j<userIds.length; j++){
				let userId = userIds[j].user_id;

				let roleIds = await baseModel.read(`select role_id from users_sites where user_id = ${userId};`);

				let newRoleId = findMaxUsedRoleId(roleIds);

				let isAlreadyAdded = await baseModel.read(`select role_id from users_sites where user_id = ${userId} and site_id = ${siteId};`);

				if(newRoleId == roleId && isAlreadyAdded.length == 0){
					let query =`
					INSERT INTO users_sites
					(user_id,site_id,selected,created_at,updated_at,created_by,updated_by,role_id)
					values(${userId},${siteId},1,"${currentDate}","${currentDate}",${created_by},${created_by},${roleId});
					`;
					await baseModel.read(query);
				}
			}
		}

	}catch(err){
	
		console.error(" assignNewSiteToAllSiteAccessibleRoles error : ",err);
		
		let req = { originalUrl: "assignNewSiteToAllSiteAccessibleRoles", method: "-", headers : {} };
		FUNC.logSave(req, {}, {}, req.headers, "api_ms", "assignNewSiteToAllSiteAccessibleRoles error occurred", "FATAL", "api", err)
		
	}
}

/** 

1.if role get selected as is_all_site_role = 1 
	- then 
	- find all users who have that role
	- assign that role to all remaining sites who didn't assined

*/
exports.assignRoleToAllRemainingSitesOfUsers = async (uid,roleId)=>{

	//find logged user userId
	let uidHeader = uid;
	let userCreatedBy = await getUserByuId(uidHeader);
	let created_by = userCreatedBy[0].id;

	//current date
	let currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

	//find users who belongs to this role
	let userIds = await baseModel.read(`select distinct user_id from users_sites where role_id = ${roleId};`);

	//find all sites
	let sites = await baseModel.read('select * from sites');
	let allSiteIds = sites.map((s) => s.id)

	//assign this role to all remaining sites of users
	for(let i=0; i<userIds.length; i++){
		let userId = userIds[i].user_id;

		//find sites which already belongs to that user
		let siteIds = await baseModel.read(`select distinct site_id from users_sites where user_id = ${userId};`);
		siteIds = siteIds.map((s)=> s.site_id);

		//find remaining sites
		let remainingSites = arr_diff(allSiteIds,siteIds);

		//assigin this role all remaining sites for this user
		for(let j=0; j<remainingSites.length; j++){
			let siteId = remainingSites[j];

			let query =`
			INSERT INTO users_sites
			(user_id,site_id,selected,created_at,updated_at,created_by,updated_by,role_id)
			values(${userId},${siteId},1,"${currentDate}","${currentDate}",${created_by},${created_by},${roleId});
			`;
			await baseModel.read(query);
		}
		
	}

}


//find non unique values from two array
let  arr_diff = (a1, a2) => {

    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
} 

let findMaxUsedRoleId = (roleIds)=>{
	let roleIdsCount=[];
	for(let i=0; i<roleIds.length; i++){
		let roleId = roleIds[i].role_id;		
		let roleCount = roleIdsCount.find((r) => r.role_id == roleId);
		let roleCountIndex = roleIdsCount.findIndex((r) => r.role_id == roleId);
		if(roleCount === undefined){
			roleIdsCount.push({
				role_id : roleId,
				count:1
			})
		}else{
			roleIdsCount[roleCountIndex].count++;
		}  
	}

	roleIdsCount=roleIdsCount.sort((a, b)=> b.count - a.count);
	return roleIdsCount[0].role_id;
}