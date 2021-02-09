const request = require("request");
const CONST = require("../utils/constants");
const moment = require("moment");
const moment_timezone = require("moment-timezone");
const helper = require("../helpers/commonHelper");
const baseModel = require("../models/baseModel");
const userModel = require("../models/userModel");
var bcrypt = require("bcryptjs");
var UrlPattern = require('url-pattern');
//create hash
var salt = bcrypt.genSaltSync(10);
const userJs = require("../controllers/user");

exports.signin = async (req, res) => {
  let statusCode=203;
  try {
    let { username, password/* , app */ } = req.body;
    if (username == null || username == "" || username == undefined) {
      console.log("Request : ",req.body,"login failed : Username cant not be blank")
      helper.makeResponse(
        res,
        statusCode,
        false,
        {},
        { errors : ['Username can not be blank'] },
        // { "errors" : ["Invalid login credentials. Please try again."] },
        // "Login failed"
        'Username can not be blank'
      );
      return;
    }
    if (password == null || password == "" || password == undefined) {
      console.log("Request : ",req.body,"login failed : Password cant not be blank")
      helper.makeResponse(
        res,
        statusCode,
        false,
        {},
        { "errors" : ["Password can not be blank"] },
        // { "errors" : ["Invalid login credentials. Please try again."] },
        // "Login failed"
        "Password can not be blank"
      );
      return;
    }
    /* if (app == null || app == "" || app == undefined) {
      helper.makeResponse(
        res,
        200,
        false,
        {},
        [],
        "App Type cant not be blank"
      );
      return;
    } */

    let user = await baseModel.read(`
        select * from users 
        where 
        email = '${username}' OR 
        username = '${username}' OR 
        phone = '${username}'
    `);
    // console.log(user)
    if (user.length == 0) {
      console.log("Request : ",req.body,"login failed : Invalid Username")
      helper.makeResponse(
        res, 
        statusCode, 
        false, 
        {}, 
        { "errors" : ["Invalid Username"] },
        // { "errors" : ["Invalid login credentials. Please try again."] },
        // "Login Failed"
        "Invalid Username"
        );
      return;
    }

    user = user[0];
    if (user.active == 0) {
      console.log("Request : ",req.body,"login failed : User deactivated")
      helper.makeResponse(
        res, 
        statusCode, 
        false, 
        {}, 
        { "errors" : ["Your account has blocked"] },
        // { "errors" : ["Invalid login credentials. Please try again."] },
        // "Login Failed"
        "Your account has blocked"
        );
      return;
    }
    
    let roleData = await userModel.rolesFindById(user.role);

    console.log("roleData == "+JSON.stringify(roleData));
    
    /* if (user.entity_type.toLowerCase() != app.toLowerCase()) {
      helper.makeResponse(res, 200, false, {}, [], "Invalid Username");
      return;
    }  */

    if ((roleData[0].role_name).toLowerCase() == "driver") {
      let driver = await baseModel.read(`
            select * from drivers
            where id = ${user.entity_id}
       `);
      driver = driver[0];
      console.log(driver.blacklisted, driver.active, driver.compliance_status, driver.induction_status)
      if (
        parseInt(driver.blacklisted) == 1 ||
        parseInt(driver.active) == 0 /* ||
        driver.compliance_status != "Ready For Allocation"*/ ||
        (typeof driver.induction_status == "string" &&
          driver.induction_status != "Inducted") 
      ) {
        console.log("Request : ",req.body,"login failed : Your account has blocked or not Inducted or not ready for allocation")
        let errMsg = '';
        if(parseInt(driver.blacklisted) == 1){
          errMsg = "Your account has blacklisted"
        }else if(parseInt(driver.active) == 0){
          errMsg = "Your account has deactivated"
        }/* else if(driver.compliance_status != "Ready For Allocation"){
          errMsg = "Your account has not ready for allocation"
        }*/else if((typeof driver.induction_status == "string" &&
        driver.induction_status != "Inducted")){
          errMsg = "Your account has not inducted"
        } 
        helper.makeResponse(
          res,
          statusCode,
          false,
          {},
          {errors : [errMsg]},
          // {errors : ['Invalid login credentials. Please try again.']},
          // "Login failed"
          errMsg
        );
        return;
      }
    }

    if ((roleData[0].role_name).toLowerCase() == "employee") {
      let employees = await baseModel.read(`
            select * from employees
            where id = ${user.entity_id}
       `);
       employees = employees[0];
       if(employees.active == 0){
        console.log("Request : ",req.body,"login failed : Your account has blocked")
        helper.makeResponse(
          res,
          statusCode,
          false,
          {},
          // {errors : ['Invalid login credentials. Please try again.']},
          {errors : ['Your account has deactivated']},
          // "Login failed"
          'Your account has deactivated'
        );
        return;
       }
    }

    // let helper = require('../helpers/commonHelper')
    // let roles = await role_names_without_view_names();
    // let roles = helper.roles;
    // console.log(roles,user.role,roles[user.role])
    /* if (!has_access_to_app(app, user.role)) {
      helper.makeResponse(
        res,
        200,
        false,
        {},
        [],
        `Please use ${(roleData.role_name).toUpperCase()} app`
      );
      return;
    } */

    // var hash = bcrypt.hashSync(password, salt);

    //check password
    let is_correct = bcrypt.compareSync(password, user.encrypted_password); // true/false
    // console.log(is_correct);
    if (!is_correct) {
      console.log("Request : ",req.body,"login failed : Invalid Password")
      helper.makeResponse(res, statusCode, false, {}, 
        {errors : ['Invalid Password']},
        // {errors : ['Invalid login credentials. Please try again.']},
        // "Login failed"
        'Invalid Password'
        );
      return;
    }

    let token, client_id;
    token = await getCryptoHash();
    client_id = await getCryptoHash();

    let next_year_timestamp = moment()
      .add(330, "minutes")
      .add(1, "year")
      .unix();
    // console.log(next_year_timestamp)
    // console.log(token);
    if(user.tokens === null){
      user.tokens="{}";
    }
    let tokens = JSON.parse(user.tokens);
    if (Object.keys(user.tokens).length === 0) {
      tokens[client_id] = {
        token: bcrypt.hashSync(token, salt),
        expiry: next_year_timestamp
      };
    } else {
      tokens[client_id] = {
        token: bcrypt.hashSync(token, salt),
        expiry: next_year_timestamp
      };
    }
    user.tokens = tokens;

    let current_date = moment().format("YYYY-MM-DD HH:mm:ss");

    //save token
    await baseModel.update(
      `UPDATE users SET updated_at = "${current_date}", tokens ='${JSON.stringify(
        user.tokens
      )}' WHERE id = ${user.id}`
    );

    let sign_count = user.sign_in_count;
    if (sign_count != null) {
      sign_count = parseInt(sign_count) + 1;
    } else {
      sign_count = 1;
    }

    let last_sign_in_at = user.last_sign_in_at;
    let current_sign_in_at = user.current_sign_in_at;

    if(current_sign_in_at != null){
      last_sign_in_at = moment(current_sign_in_at).format("YYYY-MM-DD HH:mm:ss");
    }else{
      last_sign_in_at = current_date
    }


    //update sign count
    let query = `
    UPDATE users SET sign_in_count = ${sign_count}, current_sign_in_at = '${current_date}', last_sign_in_at = '${last_sign_in_at}' WHERE id = ${user.id}
    `;
    // console.log(query)
    await baseModel.update(query);

    let status = ["pending", "on_boarded", "active"];
    //gettting user sites starts here
    let set_user_site_list = await userModel.userSites(user.id);
    //getting user sites end here
    let data = {
      id: user.id,
      email: user.email,
      username: user.username,
      f_name: user.f_name,
      m_name: user.m_name,
      l_name: user.l_name,
      role: roleData[0].role_string,
      entity_type: user.entity_type,
      entity_id: user.entity_id,
      phone: user.phone,
      provider: user.provider,
      uid: user.uid,
      avatar_file_name: user.avatar_file_name,
      avatar_content_type: user.avatar_content_type,
      avatar_file_size: user.avatar_file_size,
      avatar_updated_at: user.avatar_updated_at,
      last_active_time: moment(user.last_active_time).format(
        "ddd DD MMM YYYY HH:mm:ss UTC +00:00"
      ), //Thu, 23 May 2019 15:51:12 UTC +00:00,
      status: status[user.status],
      passcode: user.passcode,
      invite_count: user.invite_count,
      current_location: user.current_location,
      process_code: user.process_code,
      is_password_expired:
        parseInt(user.is_password_expired) == 0 ? false : true,
      site_id: user.site_id,
      user_sites: await user_site_list(set_user_site_list),
      //user_sites: await userModel.userSites(user.id),
      access_list: await accessList(user.id)//await getAccessByUserName(username)
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Server-Timestamp", moment().unix());
    res.setHeader("access-token", token);
    res.setHeader("client", client_id);
    res.setHeader("uid", user.email);

    res.set("status_code", 200);
    res.json({
      data:{
        permissions: "dummy",
        assets: "dummy",
        data: data
      },
      success: true,
      "errors": {},
      "message": "Login Successfully"
    });
  } catch (e) {
    console.log(e);
    helper.makeResponse(res, statusCode, false, {}, {errors : ['Invalid login credentials. Please try again.']}, (e.msg == undefined) ? 'Invalid login credentials. Please try again.' : e.msg);
  }
};

let getCryptoHash = () => {
  return new Promise((resolve, reject) => {
    try {
      let crypto = require("crypto");
      crypto.randomBytes(48, function (ex, buf) {
        token = buf
          .toString("base64")
          .replace(/\//g, "_")
          .replace(/\+/g, "-");
        resolve(token);
      });
    } catch (exception) {
      reject(exception);
    }
  });
};
exports.getCryptoHash = getCryptoHash;



exports.getAccessListByUserName = async (req, res, next) => {
  try {
    const userName = req.body.uid;


    let users = await userModel.getUserByuId(userName);
    if (users.length == 0) {
      throw { msg: "Invalid uid" }
    }
    helper.makeResponse(res, 200, true, { access_list: await accessList(users[0].id) }, [], "Access List");

  } catch (e) {
    console.log(e);
    helper.makeResponse(res, 200, false, {}, [], e.msg == undefined ? "Something Went Wrong" : e.msg);
  }
};

let accessList = async (user_id) => {


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

    let sites = await userModel.userSites(user_id);
    if (sites.length == 0) {
      throw { msg: "User sites not found" }
    }

    let query = `select * from main_modules where status = 1 and (isdeleted is null or isdeleted <> 1);
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

exports.signout = async (req, res) => {

  try {

    const uid = req.headers.uid;
    const access_token = req.headers.access_token;
    const client = req.headers.client;

    let users = await userModel.getUserByuId(uid);
    if (users.length == 0) {
      throw { msg: "Invalid Crendentials" }
    }

    let user = users[0];

    //find role of user
    let role = await userModel.rolesFindById(user.role)
    role = role[0];

    //if driver is role then make unpair vehicle and make driver off_duty
    if (role.role_name.toLowerCase() == "driver") {

      //find driver according entity id
      let query = "select * from drivers where id = " + user.entity_id;
      let drivers = await baseModel.read(query);
      if (drivers.length == 0) {
        throw { msg: "Driver info not found" }
      }
      //find driver according entity id
      query = "select * from trips where status = 'active' and driver_id = " + user.entity_id;
      let trips = await baseModel.read(query);
      if (trips.length != 0) {
        throw { msg: "Cannot logout during active trip." }
      }
      //find vehicle of that driver
      query = "select * from vehicles where driver_id = " + user.entity_id;
      let vehicles = await baseModel.read(query);
      if (vehicles.length > 0) {
        //remove driver id from vehicles
        query = 'update vehicles set driver_id=null where id = ' + vehicles[0].id
        await baseModel.update(query)
      }
      //make driver off duty
      query = 'update drivers set status="off_duty" where id = ' + user.entity_id
      await baseModel.update(query)
    }

    //delete token from user
    let tokens = JSON.parse(user.tokens);
    delete tokens[client];

    let current_date = moment().format("YYYY-MM-DD HH:mm:ss");

    //save token
    await baseModel.update(
      `UPDATE users SET updated_at = "${current_date}", tokens ='${JSON.stringify(
        tokens
      )}' WHERE id = ${user.id}`
    );

    helper.makeResponse(res, 200, true, {}, [], "Sign Out Successfully");
  } catch (e) {
    console.log(e);
    helper.makeResponse(res, 422, false, {}, [], e.msg == undefined ? "Something Went Wrong" : e.msg);
  }

}

exports.authenticateAccess =async (req, res, next) => {
  try{

    //for temporary check for old operator check
    if(process.env.IS_HEADER_SKIP == 1 || req.headers["auth-token"]){
      next();
      return true;
    }

    let reqUrl1 = req.originalUrl.split("?");
    reqUrl1=reqUrl1[0].split(".");
    let reqUrl = reqUrl1[0];

    console.log("reqUrl "+reqUrl);

    // "/induction/getAllBaList",

  //   "/induction/getDashboardTatList",
  //   "/induction/getDetails",
  //   "/induction/saveDetails",
  //   "/induction/dashboardFilter",
  //   "/induction/docdetails",
  //   "/induction/docdashboard",
  //   "/induction/getAllRenewDocList",
  //   "/induction/addRenewalRequest",


    let skipArray = [
      "/validateToken",
      "/signout",
      "/auth/signin",
      "/auth/sign_out",
      "/auth/check-module-access",
      "/api/v1/getDetails",
      "/induction/dashboardFilter",
      "/induction/getDashboardTatList",
      "/download-file/:fileName",
      "/update-trip-lat-lng",
      "/user/reset-password",
      "/user/update-password",
      "/driver/upcoming_trip",

      //i commented this as i discussed with pranjali
      // "/rback/role",
      // "/rback/role/getAllModuleAndFeatures",
      // "/rback/module/insert",
      // "/rback/module/update",
      // "/rback/module/delete",
      // "/rback/module/read",
      // "/rback/module/readall",
      // "/rback/feature/insert",
      // "/rback/feature/update",
      // "/rback/feature/delete",
      // "/rback/feature/read",

      "/api/v1/contract/download-samplefile/:siteId/:type/:contractType",
      "/api/v1/employeeupload/downloadEmployeeExcel/:siteid",
      '/employee-master/download-sample-format/:siteId',
      "/api/v1/induction/docdashboard",
      "/api/v1/induction/docdetails",
      "/api/v1/induction/getAllRenewDocList",
      "/api/v1/driver/upcoming_trip",
      "/api/v1/drivers/:driverid",
      "/api/v1/employee_trips/:employeetripid",
      "/api/v1/trips/:trip_id/accept_trip_request",
      "/api/v1/drivers/:driver_id/change_vehicle",
      "/api/v1/trips/:trip_id/trip_routes/completed",
      "/api/v1/employee_trips/:employee_trip_id/exception",
      "/api/v1/drivers/:driver_id/driver_request",
      "/api/v1/drivers/:driver_id/vehicle_info_one",
      "/api/v1/drivers/:driverId/update_current_location_v1",
      "/api/v1/employee-master/getLatLngFromAddress",
      "/api/v1/employees/:userId/update_user_status",
      "/api/v1/driver/updateProfPic",
      "/api/v1/drivers/:driverId/last_trip_request",
      "/api/v1/driver/offduty/:driverId",
      "/api/v1/drivers/:driverId/on_duty",
      "/api/v1/driver/call_operator",
      "/api/v1/drivers/:id/update_current_location",
      "/api/v1/drivers/:driverId/heart_beat",
      "/api/v1/trips/:tripId/summary",
      "/api/v2/trips/:tripId/summary",
      "/api/v3/trips/:tripId/summary",
      "/api/v1/trips/:tripId/trip_routes/driver_arrived",
      "/api/v1/trips/:tripId/trip_routes/on_board",
      "/api/v1/drivers/:userId/trip_history",
      "/api/v1/employees/:userId/upcoming_trip",
      "/api/v1/employees/:userId/upcoming_trips",
      "/api/v1/employees/:userId/trip_history",
      "/api/v1/trips/:tripId/eta",
      "/api/v2/trips/:tripId/eta",
      "/api/v3/trips/:tripId/eta",
      "/api/v1/trip_routes/:tripRouteId/employee_no_show/lat/:lat/lng/:lng/request_date/:requestDate",
      "/api/v1/trip_route_exceptions/:id/resolve",
      "/api/v1/employees/:employeeid/call_operator",
      "/api/v1/employees/:employeeid/last_completed_trip",
      "/api/v1/getcutofftime/:sitename",
      "/api/v2/drivers/:id/off_duty_web",
      "/api/v1/business_associate/add",
      "/api/v1/drivers",
      "/api/v1/module-features",
      "/api/v1/gps/list",
      "/api/v1/appVersion"

    ]

    let url = false;
    for (let i=0; i<skipArray.length; i++) {
        let skipUrl = skipArray[i];

        let pattern = new UrlPattern(skipUrl);
        
        if (pattern.match(reqUrl)) {
            url = true;
            break;
        }
    }

    //skip token validation if this url find in skipArray array
    if (url) {
      next();
      return false;
    }

    
    //check valid uid
    //check valid siteid
    //check valid featuretext
    //find roleId
    //check user have access on that site
    //check that feature have assigned to role and user have access on that feature

    const { featuretext, siteid, uid } = req.headers;
    
    let user = await baseModel.read(`select * from users where email = '${uid}'`);
    if(user.length == 0){
      throw { msg : 'Invalid uid'}
    }
    req.headers={
      ...req.headers,
      "userid": user[0].id
    };

    let roleDriver = await baseModel.read(`select * from role_types where id = ${user[0].role} and role_name = "driver" and status = 1`);
    let roleEmployee = await baseModel.read(`select * from role_types where id = ${user[0].role} and role_name = "employee" and status = 1`);
    
    if(roleDriver.length > 0){
      next()
      return;
    }

    if(roleEmployee.length>0){

      if(featuretext == "" || featuretext == undefined || featuretext == null){
        throw {msg : 'Invalid featuretext'};
      }
      
      if(siteid == "" || siteid == undefined || siteid == null){
          throw {msg : 'Invalid siteid'};
      }

      let site = await baseModel.read('select * from sites where id = '+siteid);
      if(site.length == 0){
        throw { msg : 'Invalid siteid'}
      }
      if(site[0].active == 0){
        throw { msg : 'This site has deactivated'}
      }

      let feature = await baseModel.read(`select * from main_modules_features where check_string = '${featuretext}' and (isdeleted is null or isdeleted <> 1)`);
      if(feature.length == 0){
        throw { msg : 'Invalid featuretext'}
      }
      if(feature.status == 0){
        throw { msg : 'This Feature text is deactivated'}
      }

      let employee = await baseModel.read(`select * from employees where id = ${user[0].entity_id} and active = 1`);
      if(employee.length == 0){
        throw { msg : `User is deactivated`}
      }
      if(employee[0].site_id != siteid){
        throw { msg : `User not have access on '${site[0].name}' site`}
      }
      let employeeSiteRole = await baseModel.read(`select * from employee_site_role where site_id = ${employee[0].site_id}`);
      if(employeeSiteRole.length==0){
        throw { msg : "Employee site role not defined" }
      }
      let roleId=employeeSiteRole[0].role_id;

      let featureRole = await baseModel.read(`select * from role_modules where role_id = ${roleId} and feature_id = ${feature[0].id} and status = 1`);
      if(featureRole.length == 0){
        throw { msg : `User not have acces on '${feature[0].name}' Feature`}
      }

      let roles = await baseModel.read(`select * from role_types where id = ${roleId} and status = 1`);
      if(roles.length == 0){
        throw { msg : `Role is deactivated`}
      }
      let role = roles[0];
  
      req.headers={
        ...req.headers,
        "role-rank":role.rank,
        "role-id":roleId,
        "role-name": role.role_name
      };

      next()

    }else if(roleDriver.length>0){
      //driver check
      next();
    }else{

      if(featuretext == "" || featuretext == undefined || featuretext == null){
        throw {msg : 'Invalid featuretext'};
      }
      
      if(siteid == "" || siteid == undefined || siteid == null){
          throw {msg : 'Invalid siteid'};
      }

      let site = await baseModel.read('select * from sites where id = '+siteid);
      if(site.length == 0){
        throw { msg : 'Invalid siteid'}
      }
      if(site[0].active == 0){
        throw { msg : 'This site has deactivated'}
      }

      let feature = await baseModel.read(`select * from main_modules_features where check_string = '${featuretext}'`);
      if(feature.length == 0){
        throw { msg : 'Invalid featuretext'}
      }
      if(feature.status == 0){
        throw { msg : 'This Feature text is deactivated'}
      }

      let userSites = await baseModel.read(`select * from users_sites where user_id = ${user[0].id} and site_id = ${siteid}`);
      if(userSites.length == 0){
        throw { msg : `User not have access on '${site[0].name}' site`}
      }
      let roleId=userSites[0].role_id;

      let roleData = await baseModel.read(`select * from role_types where id = ${roleId} and status = 1`);
      if(roleData.length == 0){
        throw { msg : `Role is deactivated`}
      }
      let role = roleData[0];
  
      let featureRole = await baseModel.read(`select * from role_modules where role_id = ${roleId} and feature_id = ${feature[0].id} and status = 1`);
      if(featureRole.length == 0){
        throw { msg : `User not have acces on '${feature[0].name}' Feature`}
      }

      req.headers={
        ...req.headers,
        "role-rank":role.rank,
        "role-id":roleId,
        "role-name": role.role_name,
      };

      next()
    }

   
    // helper.makeResponse(res, 200, true, {}, [], "User have Access");
  } catch (e) {
    console.log(e);
    helper.makeResponse(res, 401, false, {error : e.msg == undefined ? null : e.msg}, e.msg == undefined ? null : ["Access Denied"],"Access Denied");
  }

};

let user_site_list = async(site_object) => {
  //loop starts here for site object starts here
  if(site_object)
  {
    for (const site_details_row in site_object) 
    {
      //getting site configurator value starts here
      let site_id = site_object[site_details_row].site_id;
      let query = "select * from configurators where (site_settings ='yes' or request_type in ('change_time_check_in', 'change_time_check_out', 'ss_route_generation_cut_off_time')) and site_id ='"+site_object[site_details_row].site_id+"'";
      console.log(query);    
      //getting site configurator value end here
      let site_setting_configurator = await baseModel.read(query);
      site_object[site_details_row].configurator = await formating_site_setting_confirguator(site_setting_configurator);
      //site_object[site_details_row].configurator = await baseModel.read(query);
    
    }
  }
  return site_object;
  //loop end here for site object end here  
}
//formating the site setting configurator starts here
let formating_site_setting_confirguator = async(site_setting_configurator_object) => {
  let singel_site_setting_array = {};
  let formate_array_out = [];
  //making singel array of the the object starts here
  if(site_setting_configurator_object.length>0)
  {
    for (const site_setting_configurator_row in site_setting_configurator_object) 
    {
      singel_site_setting_array[site_setting_configurator_object[site_setting_configurator_row].request_type] = site_setting_configurator_object[site_setting_configurator_row].value;
    }
    //creating the formate of the configurator starts here
    let fomrate_array = {
      sms_notification:{
        pick_up:{
          "ss_sms_pickup_driver_assigned":singel_site_setting_array.ss_sms_pickup_driver_assigned,
          "ss_sms_pickup_trip_start":singel_site_setting_array.ss_sms_pickup_trip_start,
          "ss_sms_pickup_i_am_here":singel_site_setting_array.ss_sms_pickup_i_am_here,
          "ss_sms_pickup_dropped":singel_site_setting_array.ss_sms_pickup_dropped
        },
        drop:{
          "ss_sms_drop_driver_assigned":singel_site_setting_array.ss_sms_drop_driver_assigned,
          "ss_sms_drop_trip_start":singel_site_setting_array.ss_sms_drop_trip_start,
          "ss_sms_drop_i_am_here":singel_site_setting_array.ss_sms_drop_i_am_here,
          "ss_sms_drop_dropped":singel_site_setting_array.ss_sms_drop_dropped
        }
      },	
      email_new_employee:
      {
        "ss_email_new_employee":singel_site_setting_array.ss_email_new_employee
      },
      call_masking:
      {
        "ss_call_masking_all_call_options":singel_site_setting_array.ss_call_masking_all_call_options
      },
      google_maps:{
        "ss_google_maps_routing_maps":singel_site_setting_array.ss_google_maps_routing_maps,
        "ss_google_maps_trip_board_maps":singel_site_setting_array.ss_google_maps_trip_board_maps
      },		
      driver_vehicles_trip_allowane:
      {
        "ss_allow_non_compliant_vehicle_driver":singel_site_setting_array.ss_allow_non_compliant_vehicle_driver,
        "ss_allow_non_registered_vehicles":singel_site_setting_array.ss_allow_non_registered_vehicles
      },			
      alert_non_compliance_non_registered_vehicles:{
        "ss_non_register_and_non_compliance_alert":singel_site_setting_array.ss_non_register_and_non_compliance_alert,
        "ss_non_register_and_non_compliance_shift":singel_site_setting_array.ss_non_register_and_non_compliance_shift,
        "ss_non_register_and_non_compliance_role_list":singel_site_setting_array.ss_non_register_and_non_compliance_role_list
      },
      route_changes:{
        "ss_route_changes":singel_site_setting_array.ss_route_changes
      },  
      navigation:{
        "ss_driver_app_navigation":singel_site_setting_array.ss_driver_app_navigation,
        "ss_employee_app_navigation":singel_site_setting_array.ss_employee_app_navigation
      },  
      driver_nodal_checkin:{
        "ss_driver_app_nodal_check_in":singel_site_setting_array.ss_driver_app_nodal_check_in
      },  
      external_id:{
        "ss_show_external_id":singel_site_setting_array.ss_show_external_id
      },  
      route_km_and_time:{
        "ss_show_total_distance_and_time":singel_site_setting_array.ss_show_total_distance_and_time
      },  
      route_upload:{
        "ss_route_upload":singel_site_setting_array.ss_route_upload,
        "ss_route_external_id":singel_site_setting_array.ss_route_external_id,
        "ss_route_employee_id":singel_site_setting_array.ss_route_employee_id,
        "ss_route_employee_name":singel_site_setting_array.ss_route_employee_name,
        "ss_route_contact_number":singel_site_setting_array.ss_route_contact_number,
        "ss_route_gender":singel_site_setting_array.ss_route_gender,
        "ss_route_trip_type":singel_site_setting_array.ss_route_trip_type,
        "ss_route_time":singel_site_setting_array.ss_route_time,
        "ss_route_area":singel_site_setting_array.ss_route_area,
        "ss_route_landmark":singel_site_setting_array.ss_route_landmark,
        "ss_route_estimate_time":singel_site_setting_array.ss_route_estimate_time,
        "ss_route_guard":singel_site_setting_array.ss_route_guard,
        "ss_route_vehicle_number":singel_site_setting_array.ss_route_vehicle_number,
        "ss_route_number_of_employee":singel_site_setting_array.ss_route_number_of_employee,
        "ss_route_type_of_vehicle":singel_site_setting_array.ss_route_type_of_vehicle,
      },
      eta_type:{
        "ss_dynamic_eta":singel_site_setting_array.ss_dynamic_eta,
        "ss_dynamic_eta_refresh_time":singel_site_setting_array.ss_dynamic_eta_refresh_time
      },
      employee_panic:{
        "ss_resolve_employee_panic":singel_site_setting_array.ss_resolve_employee_panic
      },
      constraints:{
        "ss_guard":singel_site_setting_array.ss_guard,
        "ss_distance":singel_site_setting_array.ss_distance,
        "ss_time":singel_site_setting_array.ss_time
      },		
      route_generation_cutoff:{
        "ss_route_generation_cut_off_time":singel_site_setting_array.ss_route_generation_cut_off_time,
        "change_time_check_in":singel_site_setting_array.change_time_check_in,
        "change_time_check_out":singel_site_setting_array.change_time_check_out
      },	
      trip_start_time:{
        "ss_driver_start_trip_time":singel_site_setting_array.ss_driver_start_trip_time
      }
    };
    //creating the formate of the configurator end here
    // formate_array_out.push(fomrate_array);
    return fomrate_array;
  }
  return {};
  //making singel array of the the object starts here
  
}
//formating the site setting configurator end here


exports.authenticateCommonService = async (req,res,next) => {
  try{
    //for temporary check for old operator check
    if(process.env.IS_HEADER_SKIP == 1 || !req.headers["auth-token"]){
      next();
      return true;
    }


    let reqUrl1 = req.originalUrl.split("?");
    reqUrl1=reqUrl1[0].split(".");
    let reqUrl = reqUrl1[0];
    console.log("reqUrl "+reqUrl);

    let patternETAAPI = new UrlPattern("/api/v1/trips/:tripId/eta");
    let patternTripBoardAPI = new UrlPattern("/tripBoardList");
    let patternLoggingAPI = new UrlPattern("/log/insert");

    let password = "";
    if(patternETAAPI.match(reqUrl)){
      password="cFK42C]!>,~=8Bf'";
    }else if(patternTripBoardAPI.match(reqUrl)){
      password=".^GP23fUM2js?KhF";
    }else if(patternLoggingAPI.match(reqUrl)){
      password='qt&ZK*a[!,BM"6ET';
    }
    
    let authToken = req.headers["auth-token"];

    //check password
    let is_correct = bcrypt.compareSync(password, authToken); // true/false
    if (!is_correct) {
      helper.makeResponse(res, 401, false, {}, 
        {errors : ['Invalid auth-token']},
        'Invalid auth-token'
        );
      return;
    }

    next()
  }catch(err){
    console.log(err)
    helper.makeResponse(res, 401, false, {}, 
      {errors : ['Something went wrong']},
      'Something went wrong'
      );
    return;
  }
}