let moment = require("moment");
const request = require("request");
const webApiTokenModel = require(appRoot + "/models/webApiTokenModel");
const uat_url = process.env.UAT_URL;
var bcrypt = require("bcryptjs");
const helper = require("../helpers/commonHelper");
const baseModel = require("../models/baseModel");
var UrlPattern = require('url-pattern');

exports.user = function(req, res, next) {
  // console.log(`Logged  ${req.url}  ${req.method} -- ${new Date()}`)
  let incomming =
    moment().format("YYYY-MM-DD HH:mm:ss") +
    " incoming request uri(method : " +
    req.method +
    ") :" +
    req.ip.split(":")[3] +
    ":" +
    req.socket.localPort +
    req.originalUrl;
    
  console.log("************** API Request Details ***************")
  console.log("API : ",incomming);
  console.log("Headers : ",req.headers);
  console.log("Body : ",req.body);
  console.log("Query : ",req.query);
  console.log("Params : ",req.params);
  console.log("**************************************************");

  next();
};

exports.validateToken = async function(req, res, next) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Expose-Headers", "*");

  let reqUrl = req.originalUrl;

  //if web api token present in header than check valid token if token is valid than skip all validatation.
  // if( req.headers['web-api-token'] ){
  //     let webApiToken =  await webApiTokenModel.validateApiToken(req.headers['web-api-token']);
  //     console.log( webApiToken );
  //     if( webApiToken.length > 0 ){
  //        next();
  //         return false;
  //     }
  // }

  // console.log( "web-api-token=========>", req.headers['web-api-token'] );

  let skipUrls = ["/signin", "/validateToken", "/signout", "/auth/signin","/download-file","/api/v1/contract/download-samplefile","/api/v1/tripReport","/api/v1/employeeLogReport","/api/v1/OTAReport","/api/v1/OTDReport","/api/v1/dailyShiftWiseOccupency","/api/v1/employeeupload/downloadEmployeeExcel","/api/v1/driverOffDutyNotificationReport","/api/v1/induction/getAllRenewDocList"];

  let url = skipUrls.find(function(val, index) {
    return reqUrl.indexOf(val) != -1;
  });

  //skip token validation if this url find in skipUrls array
  if (url) {
    next();
    return false;
  }

  // console.log('Request Token Check')

  // const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  console.log(
    uat_url +
      "/api/v1/auth/validate_token?uid=" +
      uid +
      "&access-token=" +
      access_token +
      "&client=" +
      client
  );

  //validate token
  var options = {
    url:
      uat_url +
      "/api/v1/auth/validate_token?uid=" +
      uid +
      "&access-token=" +
      access_token +
      "&client=" +
      client,
    method: "GET"
  };

  request(options, (error, response, body) => {
    // console.log(error,response)
    var tempRes = JSON.parse(body);

    let template = {
      data: {},
      errors: {},
      message: "",
      status: false
    };

    res.set("Status", response.headers.status);
    res.set("status_code", response.headers.status);

    console.log("Token validation : ", tempRes.success, tempRes.errors);

    if (tempRes.success === false) {
      var err = {
        errors: tempRes.errors
      };
      template.errors = err;

      res.send(template);
    } else {
      next();
    }
  });
};

exports.validateTokenNodeJs = async function(req, res, next) {
  try {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Expose-Headers", "*");

    req.headers={
      ...req.headers,
      "role-rank":0,
      "role-id":0,
      "role-name": "NA",
      "userid": 0
    };

    //for temporary check for old operator check
    if(process.env.IS_HEADER_SKIP == 1 || req.headers["auth-token"]){
      next();
      return true;
    }

    let reqUrl1 = req.originalUrl.split("?");
    reqUrl1=reqUrl1[0].split(".");
    let reqUrl = reqUrl1[0];

    let skipArrayUidAccessTokenClient = [
        '/isReportsDownloadable/:accessToken/:siteId/:fromDate/:toDate',
        '/signin',
        '/validateToken',
        '/signout',
        '/auth/signin',
        '/auth/sign_out',
        '/induction/getAllRenewDocList',
        '/download-file/:fileName',
        '/user/reset-password',
        '/user/update-password',
        '/api/v1/contract/download-samplefile/:siteId/:type/:contractType',
        '/employee-master/download-sample-format/:siteId',
        '/api/v1/employeeupload/downloadEmployeeExcel/:siteId',
        '/api/v1/induction/getAllRenewDocList',
        "/api/v1/getcutofftime/:sitename",
        "/api/v1/module-features",
        "/api/v1/trips/:tripId/eta",
        "/api/v2/trips/:tripId/eta",
        "/api/v3/trips/:tripId/eta",
    ]

    let url = false;
    for (let i=0; i<skipArrayUidAccessTokenClient.length; i++) {
        let skipUrl = skipArrayUidAccessTokenClient[i];

        let pattern = new UrlPattern(skipUrl);        

        if (pattern.match(reqUrl)) {
            url = true;
            break;
        }
    }

    //skip token validation if this url find in skipUrls array
    if (url) {
      next();
      return false;
    }

    // console.log('Request Token Check')

    // const reqBody = req.body;
    const uid = req.headers.uid;
    const access_token = req.headers.access_token;
    const client = req.headers.client;
    if(uid == "" || uid == undefined || uid == null){
        helper.makeResponse(res, 401, false, {}, ['Invalid uid'], "Invalid login credentials");
        return;
    }
    if(access_token == "" || access_token == undefined || access_token == null){
      helper.makeResponse(res, 401, false, {}, ['Invalid access_token'], "Invalid login credentials");
      return;
    }
    if(client == "" || client == undefined || client == null){
        helper.makeResponse(res, 401, false, {}, ['Invalid client'], "Invalid login credentials");
        return;
    }
    /* 
    {
        "data": {},
        "errors": {
            "errors": [
                "Invalid login credentials"
            ]
        },
        "message": "",
        "status": false
    }
    */

    let user = await baseModel.read(`
      select * from users 
      where 
      email = '${uid}'
    `);
    // console.log(user)
    if (user.length == 0) {
      helper.makeResponse(res, 401, false, {}, ['error in users'], "Invalid login credentials");
      return;
    }
    user = user[0];

    req.headers={
      ...req.headers,
      "userid": user.id
    };

    // console.log(user.tokens);
    let tokens = JSON.parse(user.tokens);

    let tokenObj = tokens[client];
    if (tokenObj == undefined) {
      helper.makeResponse(res, 401, false, {}, ['error in tokens'], "Invalid login credentials");
      return;
    }

    let is_correct = bcrypt.compareSync(access_token, tokenObj.token); // true/false
    // console.log(is_correct);
    if (!is_correct) {
      helper.makeResponse(res, 401, false, {}, ['errors in token validation'], "Invalid login credentials");
      return;
    }

    let expiry = tokenObj.expiry;

    let now = moment().add(330, "minutes");
    // console.log(moment.unix(expiry).format('YYYY-MM-DD HH:mm:ss'))
    if (!moment.unix(expiry).isAfter(now)) {
      helper.makeResponse(
        res,
        200,
        false,
        {},
        ['error in time expired'],
        "Login Access Expired. Please login again."
      );
      return;
    }

    next();
  } catch (exception) {
    console.log(exception);
    helper.makeResponse(res, 401, false, {}, [], "Something Went Wrong");
  }
};


