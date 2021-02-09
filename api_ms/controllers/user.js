const request = require("request");
const CONST = require("../utils/constants");
const moment = require("moment");
const moment_timezone = require("moment-timezone");
const helper = require("../helpers/commonHelper");
const baseModel = require("../models/baseModel");
const userModel = require("../models/userModel");
let fs = require('fs');
const AWS = require('aws-sdk');
const authenticate = require('../controllers/authenticate')
let log = console.log;
//password encryption
let bcrypt = require("bcryptjs");
//create hash
let salt = bcrypt.genSaltSync(10);
const uat_url = process.env.UAT_URL;
const FUNC = require('../utils/functions')

let isSuperAdminLogged = async (req,res)=>{
    let uid = req.headers.uid;

    console.log("uid ------------ "+uid);
    if(uid == "" || uid == undefined || uid == null){
        helper.makeResponse(
        res,
        200,
        false,
        {},
        [],
        "Header uid can not be blank"
        );
        return ;
    }

    let siteid = req.headers.siteid;
    if(siteid == "" || siteid == undefined || siteid == null){
        helper.makeResponse(
        res,
        200,
        false,
        {},
        [],
        "Header siteid can not be blank"
        );
        return ;
    }

    let userAccess = await baseModel.read(`
    select user_id from users_sites where 
    user_id = (select id from users where email = "${uid}" limit 1) and
    site_id = ${siteid} and
    role_id = (select id from role_types where role_name = "SuperAdmin"  limit 1)
    `);
    
    let isSuperAdminLogged=true;
    if(userAccess.length == 0){
        isSuperAdminLogged = false;
    }
    console.log("isSuperAdminLogged ---"+isSuperAdminLogged);
    return isSuperAdminLogged;
}
exports.isSuperAdminLogged=isSuperAdminLogged;

exports.getRoles = async (req, res) => {
    try {

        let roleString=req.body.roleString;
        let roleRank = req.headers["role-rank"];

        let roles=await userModel.roles(roleString,roleRank);
        /* if(await isSuperAdminLogged(req)){
            roles = roles.filter((role)=>{
                return !(['employee','driver']).includes(role.role_name)
            });
        }else{ */
            roles = roles.filter((role)=>{
                return !(['employee','driver']).includes(role.role_name)
            });
        // }
        
        helper.makeResponse(
            res,
            200,
            true,
            { roles:roles  },
            [],
            "Role List Fetch Successfully"
        );
    } catch (e) {
        helper.makeResponse(
            res,
            200,
            false,
            {},
            [],
            (e.msg != undefined) ? e.msg : "Something Went Wrong"
        );
        if ((e.msg != undefined)) {
            FUNC.logSave(req, {}, {}, req.headers, "api_ms", "getRoles error occurred", "FATAL", "api", e)
        }
    }

};

exports.getRolesOfAllSiteAccess = async (req, res) => {
    try {


        let roles=await userModel.rolesByIsAllSitesAccess();
        
        if(!(await isSuperAdminLogged(req))){

            let uid = req.headers.uid;
            let siteid = req.headers.siteid;

            let users = await baseModel.read('select * from users where email="'+uid+'"');
            let userSites = await baseModel.read('select * from users_sites where user_id='+users[0].id+' and site_id='+siteid+'');
            let userRoles =  await baseModel.read('select id,role_name,is_all_sites_access,rank from role_types where id='+userSites[0].role_id);

            if (userRoles[0].is_all_sites_access == 1){
                // roles=userRoles; // user who have is_all_site_access role other than SuperAdmin
                let roleRank = parseInt(userRoles[0].rank);
                roles = roles.filter((role)=>{
                    return !(['employee','driver']).includes(role.role_name) && role.rank > roleRank
                })
                roles = [
                    ...roles,
                    userRoles[0]
                ]
            }else{
                roles=[]; // normal user
            }

            roles = roles.filter((role)=>{
                return !(['employee','driver','SuperAdmin']).includes(role.role_name)
            });

        }else{

            // user who have is_all_site_access role SuperAdmin
            roles = roles.filter((role)=>{
                return !(['employee','driver']).includes(role.role_name)
            });

        }

        roles=[
            {
                "id": 0,
                "role_name": "Select All Site Access Role"
            },
            ...roles
        ]

        helper.makeResponse(
            res,
            200,
            true,
            { roles:roles  },
            [],
            "Role List Fetch Successfully"
        );
    } catch (e) {
        console.log(e)
        helper.makeResponse(
            res,
            200,
            false,
            {},
            [],
            (e.msg != undefined) ? e.msg : "Something Went Wrong"
        );
        if ((e.msg != undefined)) {
            FUNC.logSave(req, {}, {}, req.headers, "api_ms", "getRoles error occurred", "FATAL", "api", e)
        }
    }

};

exports.insertUser = async (req, res, next) => {
    let isImageUploadOnAWS = false, file_name = "";
    try {
        const uidHeader = req.headers.uid;
        const loggedUserRoleRank = req.headers["role-rank"];
        let userCreatedBy = await userModel.getUserByuId(uidHeader);
        let created_by = userCreatedBy[0].id;

        let reqBody = req.body;
        reqBody.site_id = 0;
        // log(reqBody)
        let { email, f_name, m_name, l_name, phone, process_code, company_id, legal_name, pan, tan, business_type, service_tax_no, hq_address, avatar_content_type, avatar_file_size, site_role_list, all_site_role_id
        } = reqBody;

        reqBody={
            ...reqBody,
            loggedUserRoleRank
        }

        if(typeof site_role_list == "string"){
            site_role_list=JSON.parse(site_role_list);
        }

        if (m_name == undefined || m_name == "" || m_name == null) {
            m_name = "";
        }
        if (process_code == undefined || process_code == "" || process_code == null) {
            process_code = ""
        }
        if (company_id == undefined || company_id == "" || company_id == null) {
            company_id = null
        }
        if (legal_name == undefined || legal_name == "" || legal_name == null) {
            legal_name = ""
        }
        if (pan == undefined || pan == "" || pan == null) {
            pan = ""
        }
        if (tan == undefined || tan == "" || tan == null) {
            tan = ""
        }
        if (service_tax_no == undefined || service_tax_no == "" || service_tax_no == null) {
            service_tax_no = ""
        }
        if (hq_address == undefined || hq_address == "" || hq_address == null) {
            hq_address = ""
        }
        if (avatar_content_type == undefined) {
            avatar_content_type = ""
        }
        if (avatar_file_size == undefined) {
            avatar_file_size = 0
        }
        if (business_type == undefined || business_type == "" || business_type == null) {
            business_type = ""
        }
        let role, site_id;
        // console.log(site_role_list)
        /* 
        provider : email
        uid : email
        reset_password_token,reset_password_sent_at : null | use for forgot password 
        remember_created_at : null | remember me
        status : 2 active 0 ,1, 2
        passcode : not required
        process_code : any code
        invite_count : 0 | no mail | after registration mail
        is_password_expired : false | job 
        */

        //validate needed fields and data
        let valRes = await validateUserRequest(reqBody);
        if(valRes == 0){
            site_id = await userModel.findFirstSiteId();
            role = all_site_role_id;
        }else{
            site_id = valRes[0];
            role = valRes[1];
        }
        let roleData = await userModel.rolesFindById(role);
        roleData = roleData[0];

        log(role, roleData)
        let username = (email.replace(/@/gi, "-")).replace(/\./g, "-");
        let entity_type = roleData.role_name;
        let provider = "email";
        let uid = email;
        let status = 2;
        let passcode = null;
        let invite_count = 0;//mail count
        let current_location = null;
        let is_password_expired = 0;
        let currentDateTime = moment().utc().format('YYYY-MM-DD HH:mm:ss');
        let entity_id = 0, encrypted_password, reset_password_token = null, reset_password_sent_at = null, remember_created_at = null, sign_in_count = 0, current_sign_in_at = null, last_sign_in_at = null, current_sign_in_ip = null, last_sign_in_ip = null, created_at = currentDateTime, updated_at = currentDateTime, tokens = "{}", avatar_file_name = null, avatar_updated_at = null, last_active_time = null;

        if (req.files != undefined && Object.keys(req.files).length > 0) {
            isImageUploadOnAWS = true;
            let filePath = `${req.files["avatar_file"].path}`;
            let uploadedFileData = await uploadFileS3(filePath)
            avatar_file_name = `"${uploadedFileData.data.Location}"`;
            avatar_updated_at = `"${currentDateTime}"`
            file_name = avatar_file_name;
        }

        // let htmlText = `
        //     <p>Welcome ${email}</p>
        //     <p>You can confirm your account email through the link below:</p>
        //     <p><a href="#">Confirm my account</a></p>
        //     `;
        // //mail send here and change invite_count to 1
        // helper.sendEmailFromClient(email,"Alyte User Registered",htmlText).then(async (info) => {
        //     let query = `update users set invite_count=1 where email="${info.envelope.to[0]}"`
        //     // log(query)
        //     await baseModel.update(query)
        // })
        // sendMail(email, htmlText).then(async (info) => {
        //     let query = `update users set invite_count=1 where email="${info.envelope.to[0]}"`
        //     // log(query)
        //     await baseModel.update(query)
        // });

        let hash = bcrypt.hashSync("password", salt);
        encrypted_password = "";

        //insert user into db
        query = `
        insert into users(
            email, f_name, m_name, l_name, role, phone, process_code, site_id,username,entity_type,
            provider,uid,status,passcode,invite_count,is_password_expired,entity_id,encrypted_password,sign_in_count,created_at,updated_at,avatar_file_name,avatar_content_type,avatar_file_size,avatar_updated_at,tokens,
            company_id,legal_name,pan,tan,business_type,service_tax_no,hq_address,active
        ) values (
            "${email}", "${f_name}", "${m_name}", "${l_name}", ${role}, ${phone}, "${process_code}", ${site_id},"${username}","${entity_type}",
            "${provider}","${uid}",${status},"${passcode}",${invite_count},${is_password_expired},${entity_id},"${encrypted_password}",${sign_in_count},"${created_at}","${updated_at}",${avatar_file_name},"${avatar_content_type}",${avatar_file_size},${avatar_updated_at},"${tokens}","${company_id}","${legal_name}","${pan}","${tan}","${business_type}","${service_tax_no}","${hq_address}",1
        );
        SELECT * FROM users WHERE id= LAST_INSERT_ID();`;
        // log(query)
        let user = await baseModel.create(query);
        // log(JSON.stringify(user[1][0]))

        //reset token mail
        let token = await resetPasswordTokenGen(user[1][0].id)
        let welcomeMailText = `
                Dear ${f_name},

                    Welcome to Alyte! You are now ready to use the platform!
                    Please reset a password using link at: <a href="${process.env.COMPLIANCE_URL}/#/reset/${token}">Change my password</a>

                - Alyte Team`;
        // sendMail(email, welcomeMailText);
        helper.sendEmailFromClient(email,"Alyte User Registered" ,welcomeMailText);

        if(all_site_role_id == 0){
            //site role define of user
            for (let i = 0; i < site_role_list.length; i++) {
                let site_id = site_role_list[i][0];
                let role_id = site_role_list[i][1];
                let is_default_site_id = site_role_list[i][2];

                query = `Insert into users_sites(
                        user_id,
                        site_id,
                        selected,
                        created_at,
                        updated_at,
                        created_by,
                        updated_by,
                        role_id) values(
                            ${user[1][0].id},
                            ${site_id},
                            "${is_default_site_id}",
                            "${created_at}",
                            "${updated_at}",
                            ${created_by},
                            ${created_by},
                            ${role_id}
                        )`;
                await baseModel.create(query);
            }
        }else{
            await userModel.assignRoleToAllSite(role,user[1][0].id,created_by);
        }

        //local file delete
        if (req.files != undefined && Object.keys(req.files).length > 0) {
            await deleteBackendCreatedFile(`${req.files["avatar_file"].path}`);
        }

        helper.makeResponse(
            res,
            200,
            true,
            {},
            [],
            `User Added Successfully`
        );


        return;
    } catch (e) {
        log("User registration : ", e)

        // server file delete
        if (isImageUploadOnAWS) {
            await deleteFileS3(file_name)
        }

        //local file delete
        if (req.files != undefined && Object.keys(req.files).length > 0) {
            await deleteBackendCreatedFile(`${req.files["avatar_file"].path}`);
        }

        helper.makeResponse(
            res,
            200,
            false,
            {},
            [],
            (e.msg != undefined) ? e.msg : "Something Went Wrong"
        );

        if (e.msg != undefined) {
            FUNC.logSave(req, req.body, {}, req.headers, "api_ms", "insertUser error occurred", "FATAL", "api", e)
        }
        return;
    }

}

exports.updateUser = async (req, res, next) => {
    let isImageUploadOnAWS = false, file_name = "";
    try {

        const uidHeader = req.headers.uid;
        const loggedUserRoleRank = req.headers["role-rank"];
        let userCreatedBy = await userModel.getUserByuId(uidHeader);
        let created_by = userCreatedBy[0].id;

        let reqBody = req.body;

        if(typeof req.body.site_role_list == "string"){
            req.body.site_role_list=JSON.parse(req.body.site_role_list);
        }

        // log(reqBody)
        let { id, email, f_name, m_name, l_name, phone, process_code, company_id, legal_name, pan, tan, business_type, service_tax_no, hq_address, avatar_content_type, avatar_file_size, site_role_list,all_site_role_id
        } = reqBody;

        reqBody={
            ...reqBody,
            loggedUserRoleRank
        }

        if (m_name == undefined || m_name == "" || m_name == null) {
            m_name = "";
        }
        if (process_code == undefined || process_code == "" || process_code == null) {
            process_code = ""
        }
        if (company_id == undefined || company_id == "" || company_id == null) {
            company_id = null
        }
        if (legal_name == undefined || legal_name == "" || legal_name == null) {
            legal_name = ""
        }
        if (pan == undefined || pan == "" || pan == null) {
            pan = ""
        }
        if (tan == undefined || tan == "" || tan == null) {
            tan = ""
        }
        if (service_tax_no == undefined || service_tax_no == "" || service_tax_no == null) {
            service_tax_no = ""
        }
        if (hq_address == undefined || hq_address == "" || hq_address == null) {
            hq_address = ""
        }
        if (avatar_content_type == undefined) {
            avatar_content_type = ""
        }
        if (avatar_file_size == undefined) {
            avatar_file_size = 0
        }
        if (business_type == undefined || business_type == "" || business_type == null) {
            business_type = ""
        }
        let role, site_id;

        /* 
        provider : email
        uid : email
        reset_password_token,reset_password_sent_at : null | use for forgot password 
        remember_created_at : null | remember me
        status : 2 active 0 ,1, 2
        passcode : not required
        process_code : any code
        invite_count : 0 | no mail | after registration mail
        is_password_expired : false | job 
        */

        //id validation
        if (isNaN(id)) {
            throw { msg: "Invalid id" }
        }

        let user = await userModel.getUserById(id);
        if (user.length == 0) {
            throw { msg: "Invalid id" }
        }
        user = user[0];

        //validate needed fields and data
        let valRes = await validateUserUpdateRequest(reqBody)
        if(valRes == 0){
            site_id = await userModel.findFirstSiteId();
            role = all_site_role_id;
        }else{
            site_id = valRes[0];
            role = valRes[1];
        }

        let roleData = await userModel.rolesFindById(role);
        roleData = roleData[0];

        let username = (email.replace(/@/gi, "-")).replace(/\./g, "-");
        let entity_type = roleData.role_name;
        let provider = "email";
        let uid = email;
        // let status = 2;
        let passcode = null;
        // let invite_count = 0;//mail count
        // let current_location = null;
        // let is_password_expired = 0;
        let currentDateTime = moment().utc().format('YYYY-MM-DD HH:mm:ss');
        let entity_id = 0,
            // encrypted_password,
            /* reset_password_token = null, reset_password_sent_at = null, remember_created_at = null, sign_in_count = 0, current_sign_in_at = null, last_sign_in_at = null, current_sign_in_ip = null, last_sign_in_ip = null,  */
            created_at = currentDateTime,
            updated_at = currentDateTime,
            // tokens = "{}",
            avatar_file_name = null, avatar_updated_at = null
            // last_active_time = null
            ;

        if (Object.keys(req.files).length > 0) {
            isImageUploadOnAWS = true;
            let filePath = `${req.files["avatar_file"].path}`;
            let uploadedFileData = await uploadFileS3(filePath)
            avatar_file_name = `"${uploadedFileData.data.Location}"`;
            file_name = avatar_file_name;
            avatar_updated_at = `"${currentDateTime}"`
        }

        /* //mail send here and change invite_count to 1
        sendMail(email).then(async (info) => {
            let query = `update users set invite_count=1 where email="${info.envelope.to[0]}"`
            // log(query)
            await baseModel.update(query)
        }); */

        /* //password encryption
        let bcrypt = require("bcryptjs");
        //create hash
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync("password", salt);
        encrypted_password = hash; */

        //update user into db
        query = `   
        update users set
            email="${email}", f_name="${f_name}", m_name="${m_name}", l_name="${l_name}", role=${role}, phone=${phone}, process_code="${process_code}", site_id=${site_id},username="${username}",entity_type="${entity_type}",
            provider="${provider}",uid="${uid}",passcode="${passcode}",entity_id=${entity_id},updated_at="${updated_at}",avatar_file_name=${avatar_file_name},avatar_content_type="${avatar_content_type}",avatar_file_size=${avatar_file_size},avatar_updated_at=${avatar_updated_at},
            company_id="${company_id}",legal_name="${legal_name}",pan="${pan}",tan="${tan}",business_type="${business_type}",service_tax_no="${service_tax_no}",hq_address="${hq_address}"  
            where id= ${id}
        `;
        // log(query)
        await baseModel.update(query);

        //delete old site role list of user
        query = `delete from users_sites where user_id = ${id}`;
        await baseModel.read(query)

        if(all_site_role_id == 0){
           //site role define of user
            for (let i = 0; i < site_role_list.length; i++) {
                let site_id = site_role_list[i][0];
                let role_id = site_role_list[i][1];
                let is_default_site_id = site_role_list[i][2];

                query = `Insert into users_sites(
                        user_id,
                        site_id,
                        selected,
                        created_at,
                        updated_at,
                        created_by,
                        updated_by,
                        role_id) values(
                            ${id},
                            ${site_id},
                            "${is_default_site_id}",
                            "${created_at}",
                            "${updated_at}",
                            ${created_by},
                            ${created_by},
                            ${role_id}
                        )`;
                await baseModel.create(query);
            }
        }else{
            await userModel.assignRoleToAllSite(role,id,created_by);
        }

        //local file delete
        if (Object.keys(req.files).length > 0) {
            await deleteBackendCreatedFile(`${req.files["avatar_file"].path}`);
        }

        helper.makeResponse(
            res,
            200,
            true,
            {},
            [],
            `User Update Successfully`
        );

        return;
    } catch (e) {
        log("User update : ", e)

        // server file delete
        if (isImageUploadOnAWS) {
            await deleteFileS3(file_name)
        }

        //local file delete
        if (Object.keys(req.files).length > 0) {
            await deleteBackendCreatedFile(`${req.files["avatar_file"].path}`);
        }

        helper.makeResponse(
            res,
            200,
            false,
            {},
            [],
            (e.msg != undefined) ? e.msg : "Something Went Wrong"
        );

        if ((e.msg != undefined)) {
            FUNC.logSave(req, req.body, {}, req.headers, "api_ms", "updateUser error occurred", "FATAL", "api", e)
        }
        return;
    }

}

exports.getUserById = async (req, res) => {
    try {

        let id = req.params.id;

        //id validation
        if (isNaN(id)) {
            throw { msg: "Invalid id" }
        }
        let query = `
            select 
            id,
            email,
            username,
            f_name,
            m_name,
            l_name,
            role,
            entity_type,
            entity_id,
            phone,
            current_sign_in_at,
            last_sign_in_at,
            provider,
            uid,
            avatar_file_name,
            avatar_content_type,
            avatar_file_size,
            last_active_time,
            status,
            passcode,
            current_location,
            process_code,
            site_id,
            company_id,
            legal_name,
            pan,
            tan,
            business_type,
            service_tax_no,
            hq_address
            from users u where id = ${id};
        `;
        let user = await baseModel.read(query);
        if (user.length == 0) {
            throw { msg: "Invalid id" }
        }
        user = user[0];

        user.user_sites = await userModel.userSites(user.id);

        helper.makeResponse(
            res,
            200,
            true,
            { user },
            [],
            "User Found"
        );
    } catch (e) {
        log("User find : ", e)
        helper.makeResponse(
            res,
            200,
            false,
            {},
            [],
            (e.msg != undefined) ? e.msg : "Something Went Wrong"
        );
        if ((e.msg != undefined)) {
            FUNC.logSave(req, req.body, {}, req.headers, "api_ms", "getUserById error occurred", "ERROR", "api", e)
        }
        return;
    }
}

/** 
 * user list with pagination
 * */
exports.getUserList = async (req, res) => {
    try {
        let pageNo = req.body.pageNo;
        let pageSize = req.body.pageSize;
        let uid = req.headers.uid;
        let limit = pageSize;
        let offset = pageSize * (pageNo - 1);
        let loggedUserId = req.headers.userid;
        let loggedUserRoleRank = req.headers["role-rank"];
        if (isNaN(pageNo)) {
            throw { msg: "Invalid pageNo" }
        }
        if (isNaN(pageSize)) {
            throw { msg: "Invalid pageSize" }
        }

        let siteIds = await baseModel.read(`select site_id from users_sites where user_id = (select id from users where email = "${uid}");`);
        siteIds = siteIds.map((s)=>s.site_id);

        let role = await baseModel.read('select id from role_types where role_name = "SuperAdmin"');
        if(role.length == 0){
            throw { msg : "SuperAdmin role not defined" }
        }
        let roleId = role[0].id;

        let query = `
            select 
            distinct
            users.id,
            users.email,
            users.username,
            users.f_name,
            users.m_name,
            users.l_name,
            users.role,
            users.entity_type,
            users.entity_id,
            users.phone,
            users.current_sign_in_at,
            users.last_sign_in_at,
            users.provider,
            users.uid,
            users.avatar_file_name,
            users.avatar_content_type,
            users.avatar_file_size,
            users.last_active_time,
            users.status,
            users.passcode,
            users.current_location,
            users.process_code,
            users.business_type,
            users.service_tax_no,
            users.hq_address,
            users.tan,
            users.legal_name,
            users.company_id,
            users.pan,
            users.site_id,
            users.active
            from users , users_sites
            where 
            users_sites.site_id in (${siteIds.toString()}) and
            ${!(await isSuperAdminLogged(req))?` users_sites.role_id <> ${roleId} and `:''}
            users_sites.user_id = users.id

            ${loggedUserRoleRank != 1 ? `
            and
            ${loggedUserRoleRank}<(
                select max(rank) from role_types 
                where 
                id in (
                    select distinct role_id from users_sites where user_id = users.id
                )
            )`:''}
            and
            entity_type not in ('employee','driver')
            order by id desc limit ${limit} offset ${offset};
        `;
        let userList = await baseModel.read(query);

        for (let i = 0; i < userList.length; i++) {
            let user_sites = await userModel.userSites(userList[i].id)
            let roleIds = user_sites.map((u) => u.role_id);
            roleIds=Array.from(new Set(roleIds));

            userList[i].is_all_site_role_selected=(roleIds.length == 1 && await isRoleHaveAllSiteAccess(roleIds[0]))?1:0;

            if(userList[i].is_all_site_role_selected == 0){
                userList[i].user_sites = user_sites;
            }else{
                userList[i].user_sites=[];
            }
        }

        helper.makeResponse(
            res,
            200,
            true,
            { userList },
            [],
            "User List"
        );

    } catch (e) {
        log("User list : ", e)
        helper.makeResponse(
            res,
            200,
            false,
            {},
            [],
            (e.msg != undefined) ? e.msg : "Something Went Wrong"
        );
        if ((e.msg != undefined)) {
            FUNC.logSave(req, req.body, {}, req.headers, "api_ms", "getUserList error occurred", "ERROR", "api", e)
        }
    }
}

let isRoleHaveAllSiteAccess = async(roleId) =>{
    let role = await baseModel.read('select * from role_types where id = '+roleId);
    return role[0].is_all_sites_access == 1
}

/**
 * user registration request data validation
 */
let validateUserRequest = async (userData) => {

    let { email, f_name, m_name, l_name, role, phone, site_id, site_role_list ,business_type,all_site_role_id,loggedUserRoleRank
    } = userData;

    //email validation
    if (!helper.isValidEmail(email)) {
        throw { msg: "Invalid Email" }
    }

    let query;

    //email duplication check
    query = `select * from users where email="${email}"`;
    let user = await baseModel.read(query);
    if (user.length > 0) {
        throw { msg: "Email Id already exist" };
    }

    //validate f_name, m_name, l_name
    if (helper.isNullOrEmpty(f_name)) {
        throw { msg: "First Name can not be empty" };
    }
    if (!helper.isHaveOnlyAlphabetes(f_name)) {
        throw { msg: "Invalid First Name" };
    }
    if (!helper.isNullOrEmpty(m_name) && !helper.isHaveOnlyAlphabetes(m_name)) {
        throw { msg: "Invalid Middle Name" };
    }
    if (helper.isNullOrEmpty(l_name)) {
        throw { msg: "Last Name can not be empty" };
    }
    if (!helper.isHaveOnlyAlphabetes(l_name)) {
        throw { msg: "Invalid Last Name" };
    }

    /* //role validate
    let roles = helper.roles;
    if (role > roles.length - 1) {
        throw { msg: "Invalid role" };
    } */

    //phone validation
    if (isNaN(phone)) {
        throw { msg: "Invalid phone number" }
    }
    if ((phone + "").length != 10) {
        throw { msg: "Phone number length must be 10 digit" }
    }
    query = `select * from users where phone=${phone}`;
    user = await baseModel.read(query);
    if (user.length > 0) {
        throw { msg: "Phone number already exist" }
    }

    // if(business_type == "" || business_type == undefined || business_type == null){
    //     throw { msg: "Invalid business_type" }
    // }
    // if(!(['BA','DCO']).includes(business_type)){
    //     throw { msg: "Invalid business_type" }
    // }

    /* //site id validation
    if (helper.isNullOrEmpty(site_id)) {
        throw { msg: "Site Id can not be empty" };
    }
    if (isNaN(site_id)) {
        throw { msg: "Invalid Site Id" }
    } */

    if (isNaN(all_site_role_id)){
        throw { msg : "all_site_role_id must be a number" }
    }

    if(all_site_role_id == 0){

        if(typeof site_role_list == "string"){
            site_role_list=JSON.parse(site_role_list);
        }

        if (!Array.isArray(site_role_list) || site_role_list.length == 0) {
            throw { msg: "Site and role list not found" }
        }

        let siteRolesCheck = [];

        let site_selected = 0, site_id_main, role_id_main;
        for (let i = 0; i < site_role_list.length; i++) {
            let site_id = site_role_list[i][0];
            let role_id = site_role_list[i][1];
            let is_site_selected = site_role_list[i][2];

            if(siteRolesCheck.indexOf(`${site_id}_${role_id}`) != -1){
                throw { msg: "Site and role list should not have duplicate records" }
            }

            query = `select * from sites where id=${site_id}`;
            let sites = await baseModel.read(query);
            if (sites.length == 0) {
                throw { msg: site_id + " is Invalid site_id" }
            }

            query = `select * from role_types where id=${role_id}`;
            let roles = await baseModel.read(query);
            if (roles.length == 0) {
                throw { msg: role_id + " is Invalid role_id" }
            }
            if((['employee','driver']).includes(roles[0].role_name)){
                throw { msg: "Driver or Employee role are restricted" }
            }
            if(loggedUserRoleRank != 1 && loggedUserRoleRank>roles[0].rank){
                throw { msg: `"${roles[0].role_name}" role should not have higher or equal rank than logged user` }
            }

            if (is_site_selected == "true") {
                site_id_main = site_id;
                role_id_main = role_id;
                site_selected++;
            }
            siteRolesCheck.push(`${site_id}_${role_id}`)
        }

        if (site_selected != 1) {
            throw { msg: "Please select single default site" }
        }

        return [site_id_main, role_id_main];
    }else{

        let query = `select * from role_types where id = ${all_site_role_id} and is_all_sites_access = 1`;
        let role = await baseModel.read(query);
        if(role == null){
            throw { msg : "All site role not have all sites access" }
        }

        return 0;
    }
}

/**
 * user update request data validation
 */
let validateUserUpdateRequest = async (userData) => {

    let { id, email, f_name, m_name, l_name, role, phone, site_id, business_type,site_role_list,all_site_role_id, loggedUserRoleRank
    } = userData;

    //email validation
    if (!helper.isValidEmail(email)) {
        throw { msg: "Invalid Email" }
    }

    let query;

    //email duplication check
    query = `select * from users where email="${email}" and id <> ${id}`;
    let user = await baseModel.read(query);
    if (user.length > 0) {
        throw { msg: "Email Id already exist" };
    }

    //validate f_name, m_name, l_name
    if (helper.isNullOrEmpty(f_name)) {
        throw { msg: "First Name can not be empty" };
    }
    if (!helper.isHaveOnlyAlphabetes(f_name)) {
        throw { msg: "Invalid First Name" };
    }
    if (!helper.isNullOrEmpty(m_name) && !helper.isHaveOnlyAlphabetes(m_name)) {
        throw { msg: "Invalid Middle Name" };
    }
    if (helper.isNullOrEmpty(l_name)) {
        throw { msg: "Last Name can not be empty" };
    }
    if (!helper.isHaveOnlyAlphabetes(l_name)) {
        throw { msg: "Invalid Last Name" };
    }

    /* //role validate
    let roles = helper.roles;
    if (role > roles.length - 1) {
        throw { msg: "Invalid role" };
    } */

    //phone validation
    if (isNaN(phone)) {
        throw { msg: "Invalid phone number" }
    }
    if ((phone + "").length != 10) {
        throw { msg: "Phone number length must be 10 digit" }
    }
    query = `select * from users where phone=${phone}  and id <> ${id}`;
    user = await baseModel.read(query);
    if (user.length > 0) {
        throw { msg: "Phone number already exist" }
    }

    // if(business_type == "" || business_type == undefined || business_type == null){
    //     throw { msg: "Invalid business_type" }
    // }
    // if(!(['BA','DCO']).includes(business_type)){
    //     throw { msg: "Invalid business_type" }
    // }

    //site id validation
    /* if (helper.isNullOrEmpty(site_id)) {
        throw { msg: "Site Id can not be empty" };
    }
    if (isNaN(site_id)) {
        throw { msg: "Invalid Site Id" }
    }
    query = `select * from sites where id=${site_id}`;
    let sites = await baseModel.read(query);
    if (sites.length == 0) {
        throw { msg: "Invalid Site" }
    }
 */
    if (isNaN(all_site_role_id)){
        throw { msg : "all_site_role_id must be a number" }
    }

    if(all_site_role_id == 0){
        if (!Array.isArray(site_role_list) || site_role_list.length == 0) {
            throw { msg: "Site and role list not found" }
        }

        let siteRolesCheck = [];


        let site_selected = 0, site_id_main, role_id_main;
        for (let i = 0; i < site_role_list.length; i++) {
            let site_id = site_role_list[i][0];
            let role_id = site_role_list[i][1];
            let is_site_selected = site_role_list[i][2];

            if(siteRolesCheck.indexOf(`${site_id}_${role_id}`) != -1){
                throw { msg: "Site and role list should not have duplicate records" }
            }

            query = `select * from sites where id=${site_id}`;
            let sites = await baseModel.read(query);
            if (sites.length == 0) {
                throw { msg: site_id + " is Invalid site_id" }
            }

            query = `select * from role_types where id=${role_id}`;
            let roles = await baseModel.read(query);
            if (roles.length == 0) {
                throw { msg: role_id + " is Invalid role_id" }
            }
            if((['employee','driver']).includes(roles[0].role_name)){
                throw { msg: "Driver or Employee role are restricted" }
            }
            if(loggedUserRoleRank != 1 && loggedUserRoleRank>roles[0].rank){
                throw { msg: `"${roles[0].role_name}" role should not have higher or equal rank than logged user` }
            }

            if (is_site_selected == "true") {
                site_id_main = site_id;
                role_id_main = role_id;
                site_selected++;
            }

            siteRolesCheck.push(`${site_id}_${role_id}`)
        }

        if (site_selected != 1) {
            throw { msg: "Please select single default site" }
        }

        return [site_id_main, role_id_main];
    }else{

        let query = `select * from role_types where id = ${all_site_role_id} and is_all_sites_access = 1`;
        let role = await baseModel.read(query);
        if(role == null){
            throw { msg : "All site role not have all sites access" }
        }

        return 0;

    }

}


let uploadFileS3 = async (fileData) => {

    let readFileData = fs.createReadStream(fileData);

    //console.log(awsConfig);
    //const fs = require('fs');
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_accessKeyId,
        secretAccessKey: process.env.AWS_secretAccessKey,
        region: process.env.AWS_region
    });

    let splits = fileData.split('.')
    let extention = splits[splits.length - 1];
    let fileNameGen = `doc_${moment().unix()}.${extention}`;
    // console.log("fileNameGen => ", fileNameGen)
    // console.log('fileData.originalFilename => ', fileData.originalFilename)

    let params = {

        Bucket: process.env.AWS_s3bucket_renewal_document,
        ACL: 'public-read',
        Key: fileNameGen, //fileData.originalFilename,
        Body: readFileData
    };

    return new Promise(function (fulfill, reject) {


        s3.upload(params, function (err, data) {

            if (err) {
                reject({
                    "status": true,
                    "data": err
                });
                console.log("error in create contract file => ", err)

                let req = { originalUrl: "AWS File save", method: "-" };
                FUNC.logSave(req, {}, {}, req.headers, "api_ms", "uploadFileS3 error occurred", "FATAL", "api", err)
            }

            // console.log("upload ", data)

            fulfill({
                "status": true,
                "data": data
            });
        });

    });
}

/* delete file from aws s3 */
let deleteFileS3 = async (filePath) => {

    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_accessKeyId,
        secretAccessKey: process.env.AWS_secretAccessKey,
        region: process.env.AWS_region
    });

    let arr = filePath.split("/");
    let path = arr[arr.length - 1];

    let params = {
        Bucket: process.env.AWS_s3bucket_renewal_document,
        Delete: { // required
            Objects: [ // required
                {
                    Key: path // required
                }
            ],
            Quiet: false
        }
    };

    return new Promise(function (fulfill, reject) {

        s3.deleteObjects(params, function (err, data) {

            if (err) {
                reject({
                    "status": true,
                    "data": err
                });
                console.log("error in delete contract file => ", err)

                let req = { originalUrl: "AWS File delete", method: "-" };
                FUNC.logSave(req, {}, {}, req.headers, "api_ms", "deleteFileS3 error occurred", "FATAL", "api", err)
            }

            console.log("delete file ", data)
            fulfill({
                "status": true,
                "data": data
            });
        });
    });
}

let deleteBackendCreatedFile = (filePath) => {
    try{
        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log("user image : File not deleted", err);

                    let req = { originalUrl: "deleteBackendCreatedFile", method: "-" };
                    FUNC.logSave(req, {}, {}, req.headers, "api_ms", "deleteBackendCreatedFile error occurred", "FATAL", "api", err)

                    reject(err);
                } else {
                    console.log("user image : Backend Contract File deleted");
                    resolve({
                        success: true
                    })
                }
            });
        })
    }catch( exception ){
        console.log( "deleteBackendCreatedFile",  exception );
    }
}

let resetPasswordTokenGen = async (id) => {

    let token;
    for (; ;) {
        token = await authenticate.getCryptoHash();
        let query = `select id from users where reset_password_token="${token}"`;
        let users = await baseModel.read(query);
        if (users.length == 0) {
            break;
        }
    }
    let reset_password_token = token;
    let reset_password_sent_at = moment().utc().format("YYYY-MM-DD HH:mm:ss");

    query = `update users set 
    reset_password_token="${reset_password_token}",
    reset_password_sent_at="${reset_password_sent_at}"
    where id=${id}
    `;
    await baseModel.update(query);

    return token;
}

exports.resetPasswordRequest = async (req, res) => {
    try {

        let email = req.body.email;

        let query = `select * from users where email="${email}"`;
        let users = await baseModel.read(query);
        if (users.length == 0) {
            throw { msg: "Email not exist" }
        }

        let token = await resetPasswordTokenGen(users[0].id)

        //send mail
        let htmlText = `
            <p>Hello ${email}</p>
            <p>You have requested a link to change your password. You can do this through the link below.</p>
            <p><a href="${process.env.COMPLIANCE_URL}/#/reset/${token}">Change my password</a></p>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Your password won't change until you access the link above and create a new one.</p>        
            `;
        // await sendMail(email, htmlText)
        helper.sendEmailFromClient(email,"Reset password instructions",htmlText);

        helper.makeResponse(
            res,
            200,
            true,
            { 
                // token: token 
            },
            [],
            "Reset password request accepted"
        );

    } catch (e) {
        log("Reset password : ", e)
        helper.makeResponse(
            res,
            200,
            false,
            {},
            [],
            (e.msg != undefined) ? e.msg : "Something Went Wrong"
        );
        if ((e.msg != undefined)) {
            FUNC.logSave(req, req.body, {}, req.headers, "api_ms", "resetPasswordRequest error occurred", "FATAL", "api", e)
        }
    }
}

exports.update_changed_password = async (req, res) => {
    try {
        let token = req.body.token;
        let password = req.body.password;
        if (token == "" || token == undefined || token == null) {
            throw { msg: "Token should not be empty" }
        }
        if (password == "" || password == undefined || password == null) {
            throw { msg: "Password should not be empty" }
        }

        let query = `select * from users where reset_password_token="${token}"`;
        let users = await baseModel.read(query);
        if (users.length == 0) {
            throw { msg: "Invalid token" }
        }
        let reset_password_sent_at = users[0].reset_password_sent_at;

        let check_datetime = moment(reset_password_sent_at).add(330, "minutes").add(2, "hours");
        let now = moment()
        console.log(moment(reset_password_sent_at).format("YYYY-MM-DD HH:mm:ss"))
        console.log(check_datetime.format("YYYY-MM-DD HH:mm:ss"))
        console.log(moment(now).format('YYYY-MM-DD HH:mm:ss'))
        if (check_datetime.isBefore(now)) {
            throw { msg: "Token has expired" }
        }

        //password hash create
        password = bcrypt.hashSync(password, salt);

        //update password
        query = `update users set 
        reset_password_token=null,
        reset_password_sent_at=null,
        encrypted_password = "${password}"
        where id=${users[0].id}
        `;
        await baseModel.update(query);

        helper.makeResponse(
            res,
            200,
            true,
            {},
            [],
            "Password changed successfully"
        );

    } catch (e) {
        log("Reset password : ", e)
        helper.makeResponse(
            res,
            200,
            false,
            {},
            [],
            (e.msg != undefined) ? e.msg : "Something Went Wrong"
        );
        if ((e.msg != undefined)) {
            FUNC.logSave(req, req.body, {}, req.headers, "api_ms", "update_changed_password error occurred", "FATAL", "api", e)
        }
    }
}

exports.activateDeactivateUser = async (req, res) => {
    try {
        let uid = req.headers.uid;
        let userId = req.body.user_id;
        let currentStatus = req.body.currentStatus;
        let updateStatus = req.body.updateStatus;

        if(userId == "" || userId == undefined || userId < 0){
            throw { msg: "Invalid user id" }
        }

        if(!([1,0].includes(currentStatus)) || !([1,0].includes(updateStatus))){
            throw { msg: "Invalid status code" }
        }
        
        let query = `select * from users where email != "asdfafg@sdf.com" AND id = ${userId} AND active = ${currentStatus} AND entity_type not in('Employee','Driver')`;
        let users = await baseModel.read(query);
        if (users.length == 0) {
            throw { msg: "User not found" }
        }
        
        //update password
        query = `update users set 
        active = ${updateStatus}
        where id=${users[0].id}
        `;
        await baseModel.update(query);

        let userStatus = (updateStatus == 1)?'activated':'deactivated';

        helper.makeResponse(
            res,
            200,
            true,
            {},
            [],
            `User ${userStatus} successfully`
        );

    } catch (e) {
        log("activate deactivate user : ", e)
        helper.makeResponse(
            res,
            200,
            false,
            {},
            [],
            (e.msg != undefined) ? e.msg : "Something Went Wrong"
        );
        if ((e.msg != undefined)) {
            FUNC.logSave(req, req.body, {}, req.headers, "api_ms", "activate deactivate user error occurred", "FATAL", "api", e)
        }
    }
}


