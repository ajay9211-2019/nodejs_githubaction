"use strict";

var userModel = require("../models/userModel");

var apiMiddleware = require("../middleware/middleware");

const _ = require(`lodash`);
const request = require("request");
const CONST = require("../utils/constants");
const base_url = process.env.BASE_URL_ROUTING;
const uat_url = process.env.UAT_URL;
let moment = require('moment');
let fs = require('fs');
const AWS = require('aws-sdk');
var http = require('http');
var randomstring = require("randomstring");
const helper = require("../helpers/commonHelper");
const FUNC = require('../utils/functions')

exports.signin = async (req, res) => {
  try {
    console.log("sign in req.body => ", req);

    var options = {
      url: CONST.signin,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      form: {
        username: req.body.username,
        password: req.body.password,
        app: req.body.app
      },
      method: "POST"
    };

    function callback(error, response, body) {
      //console.log(response.headers);
      var tempRes = JSON.parse(body);
      let template = {
        data: {},
        errors: {},
        message: "",
        status: false
      };

      if (response.headers.status && response.headers.status != "200 OK") {
        var err = {
          errors: tempRes.errors
        };
        template.errors = err;
        template.status = false;
      } else {
        // console.log( tempRes );
        if (tempRes["errors"] && tempRes["errors"].length) {
          template.status = false;
        } else {
          template.status = true;
        }

        template.data = tempRes;
      }
      //console.log( template);
      if (
        !response.headers["status"] &&
        response.headers["uid"] &&
        response.headers["access-token"] &&
        response.headers["client"]
      ) {
        response.headers["status"] = "200 OK";
      } else if (!response.headers["status"]) {
        response.headers["status"] = "401 Unauthorized";
      }
      res.set("Status", response.headers.status);
      res.set("status_code", 200);
      res.set("client", response.headers.client);
      res.set("uid", response.headers.uid);
      res.set("access_token", response.headers["access-token"]);
      res.send(template);
    }
    request(options, callback);
    return false;
  } catch (e) {
    console.log(e);
    res.set("status_code", 500);
    res.json({
      success: false,
      message: "error",
      data: null,
      errors: ["something went wrong"]
    });
  }
};

exports.validateToken = async (req, res) => {
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  var options = {
    url:
      CONST.validateToken +
      "uid=" +
      uid +
      "&access-token=" +
      access_token +
      "&client=" +
      client,
    method: "GET"
  };

  function callback(error, response, body) {
    var tempRes = JSON.parse(body);
    let template = {
      data: {},
      errors: {},
      message: "",
      status: false
    };

    res.set("Status", response.headers.status);
    res.set("status_code", response.headers.status);

    if (body.success === false) {
      var err = {
        errors: tempRes.errors
      };
      template.errors = err;
    } else {
      template.status = true;
      template.data = tempRes;
    }
    res.send(template);
  }
  request(options, callback);
  return false;
};

exports.validateTokenNodeJs = async function (req, res, next) {
  try {
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

    let skipUrls = ["/signin", "/validateToken", "/signout", "/auth/signin"];

    let url = skipUrls.find(function (val, index) {
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
      helper.makeResponse(res, 200, false, {}, [], "Invalid login credentials");
      return;
    }
    user = user[0];
    // console.log(user.tokens);
    let tokens = JSON.parse(user.tokens);

    let tokenObj = tokens[client];
    if (tokenObj == undefined) {
      helper.makeResponse(res, 200, false, {}, [], "Invalid login credentials");
      return;
    }

    let is_correct = bcrypt.compareSync(access_token, tokenObj.token); // true/false
    // console.log(is_correct);
    if (!is_correct) {
      helper.makeResponse(res, 200, false, {}, [], "Invalid login credentials");
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
        [],
        "Login Access Expired. Please login again."
      );
      return;
    }

    helper.makeResponse(
      res,
      200,
      true,
      {},
      [],
      "Headers are valid"
    );
  } catch (exception) {
    console.log(exception);
    helper.makeResponse(res, 200, false, {}, [], "Something Went Wrong");
  }
};

exports.signout = async (req, res) => {
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url:
      CONST.signout +
      "uid=" +
      uid +
      "&access-token=" +
      access_token +
      "&client=" +
      client,
    method: "DELETE"
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};
exports.getAllBaList = async (req, res) => {
  //console.log(req.headers);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.getAllBaList,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client
    },
    method: "POST"
  };

  function callback1(error, response, body) {

    res.status(response.statusCode);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.getDashboardTatList = async (req, res) => {
  try {
    const uid = req.headers.uid;
    const access_token = req.headers.access_token;
    const client = req.headers.client;

    var options1 = {
      url: CONST.getDashboardTatList,
      headers: {
        uid: uid,
        access_token: access_token,
        client: client
      },
      method: "POST"
    };

    function callback1(error, response, body) {
      console.log(body);

      //console.log(response.headers);
      //var tempRes = JSON.parse(body);
      console.log("response.headers :" + JSON.stringify(response));
      // if (!_.isEmpty(response.headers)) {
      //   res.set("Status", response.headers.status_code);
      //   res.set("status_code", response.headers.status_code);
      // }

      res.send(body);
    }
    request(options1, callback1);
    return false;
  } catch (e) {
    return e;
  }
};

exports.getDetails = async (req, res) => {
  try {
    const reqBody = req.body.user;

    const uid = req.headers.uid;
    const access_token = req.headers.access_token;
    const client = req.headers.client;
    var options1 = {
      url: CONST.getDetails,
      headers: {
        uid: uid,
        access_token: access_token,
        client: client,
        "Content-Type": "application/json"
      },
      body: req.body,
      method: "POST",
      json: true
    };

    function callback1(error, response, body) {
      // console.log(error);
      // console.log(body);
      console.log(response.headers);
      //var tempRes = JSON.parse(body);

      res.set("Status", response.headers.status_code);
      res.set("status_code", response.headers.status_code);

      res.send(body);
    }
    //console.log(options1);
    request(options1, callback1);
    return false;
  } catch (e) {
    return e;
  }
};

exports.saveDetails = async (req, res) => {
  const reqBody = req.body;
  //console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.saveDetails,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    console.log(response);
    //res.set('Status',response.headers.status_code);
    //res.set('status_code',response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.dashboardFilter = async (req, res) => {
  const reqBody = req.body;
  //console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.dashboardFilter,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.getdriverchecklist = async (req, res) => {
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.getdriverchecklist + "/" + req.params.resourceid,

    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    method: "GET"
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.driverchecklist = async (req, res) => {
  const reqBody = req.body;
  //console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.driverchecklist,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.getvehiclechecklist = async (req, res) => {
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.getvehiclechecklist + "/" + req.params.resourceid,

    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    method: "GET"
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.vehiclechecklist = async (req, res) => {
  const reqBody = req.body;
  //console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.vehiclechecklist,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.createDriver = async (req, res) => {
  const reqBody = req.body;
  var options = {
    url: CONST.createDriver,
    headers: {
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback(error, response, body) {
    //console.log(response.headers);
    console.log(body);

    res.set("Status", response.headers.Status);
    res.set("status_code", response.headers.Status);

    res.send(body);
  }
  request(options, callback);
  return false;
};

exports.createVehicle = async (req, res) => {
  const reqBody = req.body;
  console.log(req.body);
  var options = {
    url: CONST.createVehicle,
    headers: {
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback(error, response, body) {
    //console.log(response.headers);
    console.log(body);

    res.set("Status", response.headers.Status);
    res.set("status_code", response.headers.Status);

    res.send(body);
  }
  request(options, callback);
  return false;
};

exports.validateLicence = async (req, res) => {
  const reqBody = req.body;
  console.log(req.query);

  if (_.isEmpty(req.query)) {
    res.json({
      success: false,
      message: "request body required",
      data: null,
      errors: ["please provide Licence number to validate"]
    });
  }

  var options = {
    url: CONST.validateLicence + "licence_number=" + req.query.licence_number,
    headers: {
      "Content-Type": "application/json"
    },
    method: "GET"
  };

  function callback(error, response, body) {
    //console.log(response.headers);
    console.log(body);
    if (!_.isEmpty(response.headers)) {
      res.set("Status", response.headers.status);
      res.set("status_code", response.headers.status);
    }
    res.send(body);
  }
  request(options, callback);
  return false;
};

exports.validatePlateNo = async (req, res) => {
  const reqBody = req.body;
  console.log(req.query);

  if (_.isEmpty(req.query)) {
    res.json({
      success: false,
      message: "request body required",
      data: null,
      errors: ["please provide Plate number to validate"]
    });
  }

  var options = {
    url: CONST.validatePlateNo + "plate_number=" + req.query.plate_number,
    headers: {
      "Content-Type": "application/json"
    },
    method: "GET"
  };

  function callback(error, response, body) {
    console.log(response.headers);
    console.log(body);

    res.set("Status", response.headers.status);
    res.set("status_code", response.headers.status);

    res.send(body);
  }
  request(options, callback);
  return false;
};

exports.getAllDriverList = async (req, res) => {
  var options = {
    url: CONST.getAllDriverList,
    headers: {
      "Content-Type": "application/json"
    },
    method: "GET"
  };

  function callback(error, response, body) {
    //console.log(response.headers);
    //console.log(body);
    if (!_.isEmpty(response.headers)) {
      res.set("Status", response.headers.status);
      res.set("status_code", response.headers.status);
    }

    res.send(body);
  }
  request(options, callback);
  return false;
};

exports.getroasterlist = async (req, res) => {
  const reqBody = req.body;
  console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  console.log(uid, access_token, client)

  var options1 = {
    url: CONST.getroasterlist,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    console.log(error);
    console.log(body);
    console.log(response);
    if (!_.isEmpty(response.headers.status_code)) {
      res.set("Status", response.headers.status_code);
      res.set("status_code", response.headers.status_code);
    }

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.addVehicles = async (req, res) => {
  const reqBody = req.body;
  //console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.addVehicles,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);

    res.send(body);
  }
  request(options1, callback1);
};

exports.createZones = async (req, res) => {
  const reqBody = req.body;
  //console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.createZones,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    //  console.log(error);
    //  console.log(body);
    //  console.log(response);
    res.set("Status", response.headers.status_code);
    //res.set('status_code',response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.deleteZones = async (req, res) => {
  const reqBody = req.body;
  //console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.deleteZones + req.params.zone_id,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    //  console.log(error);
    //  console.log(body);
    //  console.log(response);
    res.set("Status", response.headers.status_code);
    //res.set('status_code',response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.getAllSiteList = async (req, res) => {
  const reqBody = req.body;
  //console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.getAllSiteList,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    //  console.log(error);
    //  console.log(body);
    console.log(response);
    //res.set("Status", response.headers.status_code);
    //res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.getAllCompaniesList = async (req, res) => {
  const reqBody = req.body;
  //console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.getAllCompaniesList,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    //  console.log(error);
    //  console.log(body);
    //  console.log(response);
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.getAllGuards = async (req, res) => {
  //console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url:
      CONST.getAllGuards +
      `shiftId=${req.query.shiftId}&siteId=${req.query.siteId}`,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    method: "GET"
  };

  function callback1(error, response, body) {
    //  console.log(error);
    //  console.log(body);
    //  console.log(response);
    //res.set('Status',response.headers.status_code);
    //res.set('status_code',response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};
exports.getContractListByCustId = async (req, res) => {
  //console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url:
      CONST.getContractListByCustId +
      `custId=${req.query.custId}&siteId=${req.query.siteId}&custType=${req.query.custType}`,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    method: "GET"
  };

  function callback1(error, response, body) {
    //  console.log(error);
    //  console.log(body);
    //  console.log(response);
    res.status(response.statusCode);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.getVehicleData = async (req, res) => {
  let reqBody = req.body;
  console.log("getVehicleData=>", reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const featuretext = req.headers.featuretext;
  const siteid = req.headers.siteid;
  console.log(CONST.getVehicleData +
    `shiftId=${req.query.shiftId}&siteId=${req.query.siteId}`);

  var options1 = {
    url:
      CONST.getVehicleData +
      `shiftId=${req.query.shiftId}&siteId=${req.query.siteId}`,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      featuretext: featuretext,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    // console.log(error);
    // console.log(body);
    // console.log(response);
    res.set('Status', response.headers.status_code);
    res.set('status_code', response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.generateRoutes = async (req, res) => {
  //console.log(reqBody);
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.generateRoutes,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    //  console.log(error);
    //  console.log(body);
    //  console.log(response);
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.updateEmployeeRoutes = async (req, res) => {
  //console.log(reqBody);
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.updateEmployeeRoutes,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "PATCH",
    json: true
  };

  function callback1(error, response, body) {
    //  console.log(error);
    //  console.log(body);
    //  console.log(response);
    //res.set('Status', response.headers.status_code);
    //res.set('status_code', response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.checkConstraintsForAction = async (req, res) => {
  //console.log(reqBody);
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const featuretext = req.headers.featuretext;
  const siteid = req.headers.siteid;

  var options1 = {
    url: CONST.checkConstraintsForAction,
    headers: {
      uid: uid,
      "Content-Type": "application/json",
      access_token,
      client,
      siteid,
      featuretext
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    //  console.log(error);
    //  console.log(body);
    //  console.log(response);
    //res.set('Status', response.headers.status_code);
    //res.set('status_code', response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.getConstraintsForSite = async (req, res) => {
  //console.log(reqBody);
  // const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.getConstraintsForSite + `site_id=${req.query.site_id}`,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    // body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    //  console.log(error);
    //  console.log(body);
    //  console.log(response);
    //res.set('Status', response.headers.status_code);
    //res.set('status_code', response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.routesTat = async (req, res) => {
  //console.log(reqBody);
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.routesTat,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    //  console.log(error);
    //  console.log(body);
    //  console.log(response);
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.tripBoardList = async (req, res) => {
  //console.log(reqBody);
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.tripBoardList,
    headers: {
      uid,
      access_token,
      client
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.completeThePendingTrip = async (req, res) => {
  //console.log(reqBody);
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.completeThePendingTrip,
    headers: req.headers,
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.getAutoAllocateVehicleGuards = async (req, res) => {
  const reqBody = req.body;
  console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.getAutoAllocateVehicleGuards,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.allocateRoute = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  //console.log(reqBody);
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.sendallocatedVehicle,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    //  console.log(error);
    //  console.log(body);
    //  console.log(response);
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;

};

exports.customTrips = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  //console.log(reqBody);
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.customTrip,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    //  console.log(error);
    //  console.log(body);
    //  console.log(response);
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;

};

exports.addGuardInTrip = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  const reqBody = req.body;
  //console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.addGuardInTrips,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "PATCH",
    json: true
  };

  function callback1(error, response, body) {
    //  console.log(error);
    //  console.log(body);
    //  console.log(response);
    res.set("Status", response.headers.status_code);
    //res.set('status_code',response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};
exports.assignVehicleToTrip = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  const reqBody = req.body;
  //console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.assignVehicleToTrips,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "PATCH",
    json: true
  };

  function callback1(error, response, body) {
    //  console.log(error);
    //  console.log(body);
    //  console.log(response);
    //res.set('Status', response.headers.status_code);
    //res.set('status_code',response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};


exports.assignExternalVehicleToTrip = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  const reqBody = req.body;
  //console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.assignExternalVehicleToTrips,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      featuretext: req.headers.featuretext,
      siteid: req.headers.siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "PATCH",
    json: true
  };

  function callback1(error, response, body) {
    //  console.log(error);
    //  console.log(body);
    //  console.log(response);
    //res.set('Status', response.headers.status_code);
    //res.set('status_code',response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};
exports.autoallocateRoutes = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  const reqBody = req.body;
  //console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  //res.send(uid);
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

  function callback(error, response, body) {
    var tempRes = JSON.parse(body);

    let template = {
      data: {},
      errors: {},
      message: "",
      status: false
    };
    res.set("Status", response.headers.status);
    res.set("status_code", response.headers.status);

    if (tempRes.success === false) {
      var err = {
        errors: tempRes.errors
      };
      template.errors = err;

      res.send(template);
      return false;
    } else {
      var options1 = {
        url: process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ":8002/api/v1/allocateVehicles",
        headers: {
          uid: uid,
          "Content-Type": "application/json"
        },
        body: reqBody,
        method: "POST",
        json: true
      };

      function callback1(error, response, body) {
        //  console.log(error);
        //  console.log(body);
        //  console.log(response);
        //res.set("Status", response.headers.status_code);
        //res.set("status_code", response.headers.status_code);

        res.send(body);
        //res.set('status_code',response.headers.status_code);

        // res.send(body);
      }
      request(options1, callback1);
      return false;
    }
  }
  request(options, callback);
  return false;
};

exports.getDocDetails = async (req, res) => {
  const reqBody = req.body;
  console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.getDocDetails,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    //  console.log(error);
    //  console.log(body);
    //  console.log(response);
    //res.set("Status", response.headers.status_code);
    //res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.docdashboard = async (req, res) => {
  const reqBody = req.body;
  console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.docdashboard,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    //body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    //  console.log(error);
    //  console.log(body);
    //  console.log(response);
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.getappVersion = async (req, res) => {
  const reqBody = req.body;
  console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.appVersion,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    //body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    //  console.log(error);
    //  console.log(body);
    //  console.log(response);
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.routesFinalize = async (req, res) => {
  const reqBody = req.body;
  //console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.routesFinalize,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    //res.set("Status", response.headers.status_code);
    //res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};


exports.routesAuthenticateFinalize = async (req, res) => {
  const reqBody = req.body;
  //console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.routesAuthFinalize,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      featuretext: req.headers.featuretext,
      siteid: req.headers.siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.getAllRenewDocList = async (req, res) => {
  const reqBody = req.body;
  console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.getAllRenewDocList,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.addRenewalRequest = async (req, res) => {
  const reqBody = req.body;
  console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  let filesPaths = [];
  let deletePaths = [];
  for (let documentId of Object.keys(req.files)) {

    let filePath = `${req.files[documentId].path}`
    let splitText = filePath.split("/")
    let fileName = splitText[splitText.length - 1];
    const path = CONST.downloadDoc + "" + fileName;

    deletePaths.push(filePath);
    filesPaths.push([documentId, path]);
  }

  reqBody.deletePaths = deletePaths;
  reqBody.filesPaths = filesPaths;

  var options1 = {
    url: CONST.addRenewalRequest,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  async function callback1(error, response, body) {
    // console.log(body)

    if (body.data) {
      let deletePaths = body.data.deletePaths;
      for (let i = 0; i < deletePaths.length; i++) {
        await deleteBackendCreatedFile(deletePaths[i])
      }

      delete body.data.deletePaths;

    }
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);



    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.updateBlacklistStatus = async (req, res) => {
  const reqBody = req.body;
  //console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.updateBlacklistStatus,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client
    },
    body: reqBody,
    method: "POST",
    json: true
  };
  console.log("url", CONST.updateBlacklistStatus);

  function callback1(error, response, body) {
    console.log(response);
    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.activeInactiveResourceStatus = async (req, res) => {
  const reqBody = req.body;
  //console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.activeInactiveResourceStatus,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client
    },
    body: reqBody,
    method: "POST",
    json: true
  };
  console.log("url", CONST.updateBlacklistStatus);

  function callback1(error, response, body) {
    console.log(response);
    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.allocateVehicles = async (req, res) => {
  const reqBody = req.body;
  console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.allocateVehicles,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    //  console.log(error);
    //  console.log(body);
    //  console.log(response);
    //res.set("Status", response.headers.status_code);
    //res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.boundAllocateVahicleAndGenerateRoutes = async (req, res) => {
  const reqBody = req.body;
  console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.boundAllocateVahicleAndGenerateRoutes,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    //  console.log(error);
    //  console.log(body);
    //  console.log(response);
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.downloadSampleContractfile = async (req, res) => {
  const reqBody = req.body;
  const siteId = req.params.siteId;
  const type = req.params.type;
  const contractType = req.params.contractType;
  console.log(req.params);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  // var options1 = {
  //   url:
  //     CONST.downloadSampleContractfile +
  //     siteId +
  //     "/" +
  //     type +
  //     "/" +
  //     contractType,
  //   headers: {
  //     uid: uid,
  //     "Content-Type": "application/json"
  //   },
  //   // body: reqBody,
  //   method: "GET",
  //   json: true
  // };

  // function callback1(error, response, body) {
  //   //  console.log(error);
  //   //  console.log("===============",body);
  //   //  console.log("===============",response);
  //   /* res.set("Status", response.headers.status_code);
  //   res.set("status_code", response.headers.status_code); */

  //   let data="";
  //   response.on('data', function(chunk) {
  //     data += chunk;
  //   });

  //   // do something with data
  //   res.writeHead(200, response.headers);
  //   // res.write(body);
  //   res.end(data,'binary');

  //   response.on('end', function() {

  //   });



  //   // res.send(body);
  // }

  let actualPath = "files/contract_sample_" + randomstring.generate(10) + ".xlsx";

  // request(options1, callback1);
  await downloadFileFromOtherServer(req, CONST.downloadSampleContractfile +
    siteId +
    "/" +
    type +
    "/" +
    contractType, actualPath);

  const file = `${appRoot}/${actualPath}`;
  res.download(file, actualPath, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

  return false;
};

exports.downloadEmployeeUploadFile = async (req, res) => {
  const reqBody = req.body;
  const siteId = req.params.siteId;

  let actualPath = appRoot + "/files/employee_upload_sample_" + randomstring.generate(10) + ".xlsx";

  // request(options1, callback1);
  await downloadFileFromOtherServer(req, CONST.downloadSampleEmployeeUploadfile +
    siteId, actualPath);

  const file = actualPath;
  res.download(file, actualPath, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

  return false;
};


exports.downloadTripReport = async (req, res) => {
  let accessToken = req.params.accessToken;
  let siteId = req.params.siteId;
  let fromDate = req.params.fromDate;
  let toDate = req.params.toDate;

  let fileName = "trip_report_" + randomstring.generate(10) + ".xlsx";
  let actualPath = "files/" + fileName;

  // request(options1, callback1);
  await downloadFileFromOtherServer(req, CONST.tripReport +
    accessToken +
    "/" +
    siteId +
    "/" +
    fromDate +
    "/" +
    toDate, actualPath);

  const file = `${appRoot}/${actualPath}`;
  res.download(file, fileName, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

  return false;
};

exports.downloadEmployeeLogReport = async (req, res) => {
  let accessToken = req.params.accessToken;
  let siteId = req.params.siteId;
  let fromDate = req.params.fromDate;
  let toDate = req.params.toDate;


  let fileName = "employee_log_report_" + randomstring.generate(10) + ".xlsx";
  let actualPath = "files/" + fileName;

  // request(options1, callback1);
  await downloadFileFromOtherServer(req, CONST.employeeLogReport +
    accessToken +
    "/" +
    siteId +
    "/" +
    fromDate +
    "/" +
    toDate, actualPath);

  const file = `${appRoot}/${actualPath}`;
  res.download(file, fileName, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

  return false;
};

exports.downloadOTAReport = async (req, res) => {
  let accessToken = req.params.accessToken;
  let siteId = req.params.siteId;
  let fromDate = req.params.fromDate;
  let toDate = req.params.toDate;

  let fileName = "ota_report_" + randomstring.generate(10) + ".xlsx";
  let actualPath = "files/" + fileName;

  // request(options1, callback1);
  await downloadFileFromOtherServer(req, CONST.OTAReport +
    accessToken +
    "/" +
    siteId +
    "/" +
    fromDate +
    "/" +
    toDate, actualPath);

  const file = `${appRoot}/${actualPath}`;
  res.download(file, fileName, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

  return false;
};

exports.downloadOTDReport = async (req, res) => {
  let accessToken = req.params.accessToken;
  let siteId = req.params.siteId;
  let fromDate = req.params.fromDate;
  let toDate = req.params.toDate;

  let fileName = "otd_report_" + randomstring.generate(10) + ".xlsx";
  let actualPath = "files/" + fileName;

  // request(options1, callback1);
  await downloadFileFromOtherServer(req, CONST.OTDReport +
    accessToken +
    "/" +
    siteId +
    "/" +
    fromDate +
    "/" +
    toDate, actualPath);

  const file = `${appRoot}/${actualPath}`;
  res.download(file, fileName, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

  return false;
};

exports.downloadDailyShiftWiseOccupency = async (req, res) => {
  let accessToken = req.params.accessToken;
  let siteId = req.params.siteId;
  let fromDate = req.params.fromDate;
  let toDate = req.params.toDate;

  let fileName = "daily_shift_wise_occupency_report_" + randomstring.generate(10) + ".xlsx";
  let actualPath = "files/" + fileName;

  // request(options1, callback1);
  await downloadFileFromOtherServer(req, CONST.dailyShiftWiseOccupency +
    accessToken +
    "/" +
    siteId +
    "/" +
    fromDate +
    "/" +
    toDate, actualPath);

  const file = `${appRoot}/${actualPath}`;
  res.download(file, fileName, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

  return false;
};

exports.downloadDriverOffDutyNotificationReport = async (req, res) => {
  let accessToken = req.params.accessToken;
  let siteId = req.params.siteId;
  let fromDate = req.params.fromDate;
  let toDate = req.params.toDate;

  let fileName = "driver_off_duty_notification_report" + randomstring.generate(10) + ".xlsx";
  let actualPath = "files/" + fileName;

  // request(options1, callback1);
  await downloadFileFromOtherServer(req, CONST.driverOffDutyNotificationReport +
    accessToken +
    "/" +
    siteId +
    "/" +
    fromDate +
    "/" +
    toDate, actualPath);

  const file = `${appRoot}/${actualPath}`;
  res.download(file, fileName, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

  return false;
};

let cb = (resolve, reject, isSuccess, error) => {
  if (isSuccess) {
    resolve({ success: isSuccess })
  } else {
    reject({ success: isSuccess, error: error })
  }
}

var downloadFileFromOtherServer = function (req, url, dest) {
  return new Promise((resolve, reject) => {
    var file = fs.createWriteStream(dest);
    const { uid, access_token, client, featuretext, siteid } = req.headers;

    let headersData = {};
    if (uid && access_token && client && featuretext && siteid) {
      headersData = { uid, access_token, client, featuretext, siteid };
    }

    var request = http.get(url, { headers: headersData }, function (response) {
      response.pipe(file);
      file.on('finish', function () {
        file.close(() => {
          cb(resolve, reject, true, null)
        });  // close() is async, call cb after close completes.
      });
    }).on('error', function (err) { // Handle errors
      fs.unlink(dest, () => { }); // Delete the file async. (But we don't check the result)
      if (cb) cb(resolve, reject, false, err.message);
    });
  })
};

exports.downloadFile = (req, res) => {
  let fileName = req.params.fileName
  const file = `${appRoot}/files/${fileName}`;
  res.download(file); // Set disposition and send it.
};

exports.uploadContract = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Expose-Headers", "*");

  const reqBody = req.body;
  console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  let filePath = `${req.files.contract_file.path}`
  let splitText = filePath.split("/")
  let fileName = splitText[splitText.length - 1];
  const path = CONST.downloadDoc + "" + fileName;

  var options1 = {
    url: CONST.uploadContract,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      'Content-Type': 'application/json'
    },
    body: {
      site_id: reqBody.site_id,
      billing_cycle: reqBody.billing_cycle,
      contract_type: reqBody.contract_type,
      contract_file: path,
      unique_identification: reqBody.unique_identification,
      customer_id: reqBody.customer_id,
      ba_id: reqBody.ba_id,
      deletePath: filePath
    },
    method: "POST",
    json: true
  };

  async function callback1(error, response, body) {
    res.status(response.statusCode);

    await deleteBackendCreatedFile(body.data.deletePath)

    delete body.data.deletePath
    res.send(body);
  }
  request(options1, callback1);
  return false;
};

let deleteBackendCreatedFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log("api_ms : File not deleted", err);
        reject(err);
      } else {
        console.log("api_ms : Backend File deleted");
        resolve({
          success: true
        })
      }
    });
  })
}

exports.uploadBAContract = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Expose-Headers", "*");
  const reqBody = req.body;
  console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  let filePath = `${req.files.contract_file.path}`
  let splitText = filePath.split("/")
  let fileName = splitText[splitText.length - 1];
  const path = CONST.downloadDoc + "" + fileName;

  var options1 = {
    url: CONST.uploadBAContract,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      'Content-Type': 'application/json'
    },
    body: {
      site_id: reqBody.site_id,
      billing_cycle: reqBody.billing_cycle,
      contract_type: reqBody.contract_type,
      contract_file: path,
      unique_identification: reqBody.unique_identification,
      customer_id: reqBody.customer_id,
      ba_id: reqBody.ba_id,
      deletePath: filePath
    },
    method: "POST",
    json: true
  };

  async function callback1(error, response, body) {
    res.status(response.statusCode);

    await deleteBackendCreatedFile(body.data.deletePath)

    delete body.data.deletePath
    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.getZonesBySite = async (req, res) => {
  const reqBody = req.body;
  const siteId = req.params.siteId;
  console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.getZonesBySite + siteId,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    // body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    //  console.log(error);
    //  console.log(body);
    //  console.log(response);
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.gpsVehicleLocation = async (req, res) => {
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.gpsVehicleLocationURL,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    // body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.autoAllocationFinal = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.autoAllocationFinal,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      featuretext: req.headers.featuretext,
      siteid: req.headers.siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.adhocEmployeeTrip = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.adhocEmployeeTrip,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.getAllEmployees = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.getAllEmployees,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  // console.log(options1)

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.getBgcAgencyList = async (req, res) => {
  const reqBody = req.body;
  //console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.getBgcAgencyList,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };
};

exports.removeVehicleFromTrip = async (req, res) => {
  const reqBody = req.body;
  console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.removeVehicleFromTrip,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.searchVehicles = async (req, res) => {
  const reqBody = req.body;
  //console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const featuretext = req.headers.featuretext;
  const siteid = req.headers.siteid;

  var options1 = {
    url: CONST.searchVehicles,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      siteid: siteid,
      featuretext: featuretext,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.getRosterEmpDetails = async (req, res) => {
  const reqBody = req.body;
  //console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.getRosterEmpDetails,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.generateCall = async (req, res) => {
  const reqBody = req.body;
  //console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  console.log(CONST.generateCall)
  var options1 = {
    url: CONST.generateCall,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.saveEmployeePanicMessage = async (req, res) => {
  const reqBody = req.body;
  console.log("saveEmployeePanicMessage ", reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.saveEmployeePanicMessage,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.reallocationDriverToTrips = async (req, res) => {
  const reqBody = req.body;
  console.log("reallocationDriverToTrips ", reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;

  var options1 = {
    url: CONST.reallocationDriverToTripsUrl,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      siteid: siteid,
      featuretext: featuretext,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    // res.set("Status", response.headers.status_code);
    // res.set("status_code", response.headers.status_code);

    console.log(response);
    console.log(error);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.reallocationExternalDriverToTrips = async (req, res) => {
  const reqBody = req.body;
  console.log("reallocationExternalDriverToTrips ", reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;

  var options1 = {
    url: CONST.reallocationExternalDriverToTripsUrl,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      siteid: siteid,
      featuretext: featuretext,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.generateCallDriverAndEmployee = async (req, res) => {
  const reqBody = req.body;
  console.log("generateCallDriverAndEmployee ", reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.generateCallDriverAndEmployee,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};
exports.sendDriverPanicSMS = async (req, res) => {
  const reqBody = req.body;
  console.log("sendDriverPanicSMS ", reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.sendDriverPanicSMS,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};
exports.addRemarkInTripForDriverPanic = async (req, res) => {
  const reqBody = req.body;
  console.log("addRemarkInTripForDriverPanic ", reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.addRemarkInTripForDriverPanic,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.removeGuardFromTrip = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.removeGuardFromTrip,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.getLatLngByTripId = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.getLatLngByTripId + "/" + req.params.trip_id,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: {},
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.getAllCategory = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.getAllCategory,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    //res.set("Status", response.headers.status_code);
    //res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.updateTripLatLng = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.updateTripLatLng,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.downloadEmployeeExcel = async (req, res) => {
  let siteId = req.params.site_id;

  let fileName = "employee_shift_schedule_" + randomstring.generate(10) + ".xlsx";
  let actualPath = "files/" + fileName;

  // request(options1, callback1);
  await downloadFileFromOtherServer(req, CONST.downloadEmployeeSchedule +
    siteId, actualPath);

  const file = `${appRoot}/${actualPath}`;
  res.download(file, fileName, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

  return false;
};

exports.uploadEmployeeSchedule = async (req, res) => {
  const reqBody = req.body;
  console.log(reqBody);
  const uid = req.headers.uid;

  let filePath = `${req.files.excelPath.path}`
  let splitText = filePath.split("/")
  let fileName = splitText[splitText.length - 1];
  const path = CONST.downloadDoc + "" + fileName;
  reqBody.excelPath = path;
  reqBody.deletePath = filePath

  var options1 = {
    url: CONST.uploadEmployeeSchedule,
    headers: {
      uid: uid,
      'Content-Type': 'application/json'
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  async function callback1(error, response, body) {
    res.status(response.statusCode);

    await deleteBackendCreatedFile(body.data.deletePath)

    delete body.data.deletePath
    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.isDownloadableEmployeeExcel = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.isDownloadableEmployeeExcel + `${req.params.site_id}`,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.getVehiclelatlong = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.getVehiclelatlong,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.copyExistingRoutes = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.copyExistingRoutes,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.isReportsDownloadableExcel = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url:
      CONST.isReportsDownloadableExcelUrl +
      `/${req.params.accessToken}` +
      `/${req.params.siteId}` +
      `/${req.params.fromDate}` +
      `/${req.params.toDate}`,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.empLandmarkZoneList = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.empLandmarkZoneUrl,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.postConfigRatorCutoff = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  const options1 = {
    url: CONST.postConfigRatorCutoffUrl,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.getConfigRatorCutoff = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.getConfigRatorCutoffUrl + `/${req.params.site_id}`,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};



exports.getDirections = async (req, res) => {


  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;


  const options1 = {
    url: CONST.getDirections,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.getDriverVehicleAuditDetails = async (req, res) => {
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: `${process.env.BASE_URL_COMPLIANCE_MS}:8000/api/v1/compliance/auditdashboard`,

    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    method: "GET"
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.getCallCompliancAPI = async (req, res) => {
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  //console.log(  );

  var options1 = {
    url: `${process.env.BASE_URL_COMPLIANCE_MS}:8000${req.originalUrl}`,

    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    method: "GET"
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.postCallCompliancAPI = async (req, res) => {

  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  const options1 = {

    url: `${process.env.BASE_URL_COMPLIANCE_MS}:8000${req.originalUrl}`,


    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,

    method: "POST",

    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.notify_driver_list = async (req, res) => {


  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;


  const options1 = {
    url: CONST.notify_driver_list,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.driver_app_notification = async (req, res) => {


  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;


  const options1 = {
    url: CONST.driver_app_notification,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.driver_sms_notification = async (req, res) => {


  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;


  const options1 = {
    url: CONST.driver_sms_notification,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.routeFilter = async (req, res) => {


  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;


  const options1 = {
    url: CONST.routeFilter,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.checkSiteNameExits = async (req, res) => {

  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;


  const options1 = {
    url: CONST.checkSiteNameExits,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    // res.set("Status", response.headers.status_code);
    // res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;
}

exports.getSiteListWithPegination = async (req, res) => {

  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;


  const options1 = {
    url: CONST.getSiteListWithPegination,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    //res.set("Status", response.headers.status_code);
    //res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;

}

exports.billing_zone_list = async (req, res) => {

  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid


  const options1 = {
    url: CONST.billing_zone_list,
    headers: {
      uid: uid,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    //res.set("Status", response.headers.status_code);
    //res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;

}

exports.addEditShifts = async (req, res) => {

  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid


  const options1 = {
    url: CONST.addEditShifts,
    headers: {
      uid: uid,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    //res.set("Status", response.headers.status_code);
    //res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;

}

exports.updateBAstatus = async (req, res) => {

  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid


  const options1 = {
    url: CONST.updateBAstatus,
    headers: {
      uid: uid,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    //res.set("Status", response.headers.status_code);
    //res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;

}

exports.getBaList = async (req, res) => {

  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid


  const options1 = {
    url: CONST.getBaList,
    headers: {
      uid: uid,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    //res.set("Status", response.headers.status_code);
    //res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;

}

exports.getDriverByDriverId = async (req, res) => {

  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid


  const options1 = {
    url: process.env.BASE_URL_MASTER_MS + ':8008/api/v1/drivers/' + req.params.driver_id,
    headers: {
      uid: uid,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    //res.set("Status", response.headers.status_code);
    //res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;

}

exports.driverChangeVehicle = async (req, res) => {

  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid


  const options1 = {
    url: process.env.BASE_URL_MASTER_MS + ':8008/api/v1/drivers/' + req.params.driver_id + '/change_vehicle',
    headers: {
      uid: uid,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    //res.set("status", response.headers.status);
    //res.set("status_code", response.headers.status_code);

    //console.log(body);

    if (body.success === false) {
      res.status(422);
      //res.set("status", response.headers.status);    
      res.send(body);

    } else {
      res.set("status", response.headers.status);
      res.send(body);
    }
  }

  request(options1, callback1);
  return false;

}

exports.pairVehicle = async (req, res) => {

  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid


  const options1 = {
    url: process.env.BASE_URL_MASTER_MS + ':8008/api/v1/drivers/' + req.params.driver_id + '/vehicle_info_one',
    headers: {
      uid: uid,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    //res.set("Status", response.headers.status_code);
    //res.set("status_code", response.headers.status_code);
    if (body.success === false) {
      res.status(422);
      //res.set("status", response.headers.status);    
      res.send(body);

    } else {
      res.set("status", response.headers.status);
      res.send(body);
    }
  }

  request(options1, callback1);
  return false;

}

exports.driverUpcomingTrips = async (req, res) => {

  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid


  const options1 = {
    url: process.env.BASE_URL_MASTER_MS + ':8008/api/v1/drivers/' + req.params.driver_id + '/upcoming_trip',
    headers: {
      uid: uid,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(errors, response, body) {
    try {

      //res.set("Status", response.headers.status_code);
      //res.set("status_code", response.headers.status_code);
      if (body.success === false) {
        if (errors) {
          if (Array.isArray(errors.errors)) {
            if (errors.errors[0] == "No active trip found.")
              res.status(404)
            else
              res.status(422);
            //res.set("status", response.headers.status);  
          }
        } else {
          res.status(422);
        }
        res.send(body);

      } else {
        res.set("status", response.headers.status);
        res.send(body);
      }

    } catch (err) {
      res.status(422);
      res.send(body);
    }
  }

  request(options1, callback1);
  return false;

}

exports.employeeFullTrip = async (req, res) => {

  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid


  const options1 = {
    url: process.env.BASE_URL_MASTER_MS + ':8008/api/v1/employee_trips/' + req.params.employee_trip_id,
    headers: {
      uid: uid,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    //res.set("Status", response.headers.status_code);
    //res.set("status_code", response.headers.status_code);
    if (body.success === false) {
      res.status(422);
      //res.set("status", response.headers.status);    
      res.send(body);

    } else {
      res.set("status", response.headers.status);
      res.send(body);
    }
  }

  request(options1, callback1);
  return false;

}

exports.vehicleMasterList = async (req, res) => {

  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;
  //?page_no='+req.query.page_no+'&record_per_page='+req.query.record_per_page

  const options1 = {
    url: process.env.BASE_URL_MASTER_MS + ':8008/api/v1/vehicles/list',
    headers: {
      uid: uid,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {

    console.log(response);
    //res.set("Status", response.headers.status_code);
    //res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;
}

exports.getSetupScheduleList = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.getSetupScheduleList,
    headers: {
      uid: uid,
      client: client,
      access_token: access_token,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};


exports.vehicleMasterFilter = async (req, res) => {


  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;


  const options1 = {
    url: process.env.BASE_URL_MASTER_MS + ':8008/api/v1/vehicles/filter',
    headers: {
      uid: uid,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    //res.set("Status", response.headers.status_code);
    //res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;

}

exports.getDetailsById = async (req, res) => {

  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid


  const options1 = {
    url: CONST.getDetailsById,
    headers: {
      uid: uid,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    //res.set("Status", response.headers.status_code);
    //res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;

}

exports.getLatLngFromAddress = async (req, res) => {

  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid


  const options1 = {
    url: CONST.getLatLngFromAddress,
    headers: {
      uid: uid,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    //res.set("Status", response.headers.status_code);
    //res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;

}



exports.driverUpcomingTrip = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.driverUpcomingTrip,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.activateDeActiveCustomer = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.activateDeActiveCustomer + req.params.customerId,
    headers: {
      uid: uid,
      "Content-Type": "application/json",
      access_token: access_token,
      client: client
    },
    body: reqBody,
    method: "DELETE",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.activateDeActiveSite = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.activateDeActiveSite + req.params.siteId,
    headers: {
      uid: uid,
      "Content-Type": "application/json",
      access_token: access_token,
      client: client
    },
    body: reqBody,
    method: "DELETE",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.getSiteDetailsById = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.getSiteBySiteId + req.params.siteId,
    headers: {
      uid: uid,
      "Content-Type": "application/json",
      access_token: access_token,
      client: client
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.addSites = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.addSites,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  async function callback1(error, response, body) {

    if (body.success == true) {
      //reset SuperAdmin roles module and features
      userModel.assignAllSiteAndAccessToSuperAdmin(req);

      // assign new site with role to users roles who have roles(is_all_sites_access == 1) 
      userModel.assignNewSiteToAllSiteAccessibleRoles(body.data.id, req);
    }
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.updateSites = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.updateSites,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "PATCH",
    json: true
  };

  async function callback1(error, response, body) {

    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.duplicateEmployeeIdCheck = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.duplicateEmployeeIdCheck,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.getCutOffTime = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.getCutOffTime + '/' + req.params.site_name,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.activeInactiveEmployee = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.activeInactiveEmployee + req.params.id,
    headers: {
      uid: uid,
      client: client,
      access_token: access_token,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "DELETE",
    json: true
  };
  function callback1(error, response, body) {

    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};



exports.getEmployeeDetailsList = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const featuretext = req.headers.featuretext;
  const siteid = req.headers.siteid;
  console.log(CONST.getEmployeeDetailsList)
  var options1 = {
    url: CONST.getEmployeeDetailsList,
    headers: {
      uid: uid,
      client: client,
      access_token: access_token,
      featuretext: featuretext,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.getSetupScheduleList = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.getSetupScheduleList,
    headers: {
      uid: uid,
      client: client,
      access_token: access_token,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.checkBAEmailDuplication = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.checkBAEmailDuplication,
    headers: {
      uid: uid,
      client: client,
      access_token: access_token,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.checkBAPhoneDuplication = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.checkBAPhoneDuplication,
    headers: {
      uid: uid,
      client: client,
      access_token: access_token,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.editVehicleType = async (req, res) => {

  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;


  const options1 = {
    url: CONST.editVehicleType,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.filterRequestList = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.filterRequestList,
    headers: {
      uid: uid,
      client: client,
      access_token: access_token,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.getEmployeeDetailsById = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.getEmployeeDetailsById + req.params.id,
    headers: {
      uid: uid,
      client: client,
      access_token: access_token,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);

    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.activateDeactivateShift = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.activateDeactivateShift + "/" + req.params.shiftId,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.addVehiclesMaster = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const vehicleFileData = req.files || {};

  let formData = {
    ...reqBody
  };

  if (vehicleFileData["insurance_doc"]) formData['insurance_doc'] = fs.createReadStream(vehicleFileData["insurance_doc"].path)
  if (vehicleFileData["rc_book_doc"]) formData['rc_book_doc'] = fs.createReadStream(vehicleFileData["rc_book_doc"].path)
  if (vehicleFileData["puc_doc"]) formData['puc_doc'] = fs.createReadStream(vehicleFileData["puc_doc"].path)
  if (vehicleFileData["commercial_permit_doc"]) formData['commercial_permit_doc'] = fs.createReadStream(vehicleFileData["commercial_permit_doc"].path)
  if (vehicleFileData["road_tax_doc"]) formData['road_tax_doc'] = fs.createReadStream(vehicleFileData["road_tax_doc"].path)
  if (vehicleFileData["fitness_doc"]) formData['fitness_doc'] = fs.createReadStream(vehicleFileData["fitness_doc"].path)
  if (vehicleFileData["vehicle_picture_doc"]) formData['vehicle_picture_doc'] = fs.createReadStream(vehicleFileData["vehicle_picture_doc"].path)
  if (vehicleFileData["km_doc_upload"]) formData['km_doc_upload'] = fs.createReadStream(vehicleFileData["km_doc_upload"].path)

  let isFileDataHave = false;
  if (vehicleFileData["insurance_doc"] ||
    vehicleFileData["rc_book_doc"] ||
    vehicleFileData["puc_doc"] ||
    vehicleFileData["commercial_permit_doc"] ||
    vehicleFileData["road_tax_doc"] ||
    vehicleFileData["fitness_doc"] ||
    vehicleFileData["vehicle_picture_doc"] ||
    vehicleFileData["km_doc_upload"]) {
    isFileDataHave = true
  }

  let strUrl  = CONST.addVehiclesMaster;
  
  if( req.originalUrl == '/api/v1/vehicles/draft' ){
    
    strUrl =`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/vehicles/draft`;
  }
  var options1 = {
    url: strUrl,
    headers: {
      uid: uid,
      client: client,
      access_token: access_token,
      "Content-Type": "application/json"
    },
    method: "POST"
  };
  if (isFileDataHave) {
    options1.formData = formData;
  } else {
    options1.body = reqBody;
    options1.json = true;
  }

  console.log("formData : ", formData)

  async function callback1(err, response, body) {

    if (vehicleFileData['insurance_doc']) { await deleteBackendCreatedFile(vehicleFileData['insurance_doc'].path) }
    if (vehicleFileData['rc_book_doc']) { await deleteBackendCreatedFile(vehicleFileData['rc_book_doc'].path) }
    if (vehicleFileData['puc_doc']) { await deleteBackendCreatedFile(vehicleFileData['puc_doc'].path) }
    if (vehicleFileData['commercial_permit_doc']) { await deleteBackendCreatedFile(vehicleFileData['commercial_permit_doc'].path) }
    if (vehicleFileData['road_tax_doc']) { await deleteBackendCreatedFile(vehicleFileData['road_tax_doc'].path) }
    if (vehicleFileData['fitness_doc']) { await deleteBackendCreatedFile(vehicleFileData['fitness_doc'].path) }
    if (vehicleFileData['vehicle_picture_doc']) { await deleteBackendCreatedFile(vehicleFileData['vehicle_picture_doc'].path) }
    if (vehicleFileData['km_doc_upload']) { await deleteBackendCreatedFile(vehicleFileData['km_doc_upload'].path) }

    if (err) {
      res.status(422);
      res.send({
        "success": false,
        "data": {},
        "errors": { err },
        "message": "Something went wrong"
      });
    } else {
      res.status(response.statusCode);
      res.send(body);
    }
  }

  request(options1, callback1);
  return false;
};

exports.findDraftVehicleById = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.findDraftVehicleById + "/" + req.params.id,
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.goOnDuty = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.goOnDuty + req.params.driverId + "/on_duty",
    headers: {
      uid: uid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.requestStateChange = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;
  console.log(CONST.requestStateChange)
  var options1 = {
    url: CONST.requestStateChange,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      siteid: siteid,
      featuretext: featuretext,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};
exports.requestHeartBeat = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;
  console.log(CONST.requestStateChange)
  var options1 = {
    url: process.env.BASE_URL_LOCATION_SERVICES + "/api/v1/drivers/" + req.params.driverId + "/heart_beat?lat=" + req.query.lat + "&lng=" + req.
      query.lng,
    headers: {
      uid: uid,
      "access-token": access_token,
      client: client,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    try {
      res.set("Status", response.headers.status_code);
      res.set("status_code", response.headers.status_code);
      res.send(body);
    }
    catch (e) {
      res.set("Status", 200);
      res.set("status_code", 200);
      res.json({
        success: false,
        message: "Something went worng",
        data: null,
        errors: ["Something went worng"]
      });
    }
  }

  request(options1, callback1);
  return false;
};

exports.vehicleOkNow = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;
  console.log(CONST.vehicleOkNow + req.params.driverId + "/vehicle_ok_now")
  var options1 = {
    url: CONST.vehicleOkNow + req.params.driverId + "/vehicle_ok_now",
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      siteid: siteid,
      featuretext: featuretext,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.requestTripSummary = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  //const siteid = req.headers.siteid;
  //const featuretext = req.headers.featuretext;
  var options1 = {
    url: process.env.BASE_URL_LOCATION_SERVICES + "/api/v3/trips/" + req.params.tripId + "/summary",
    headers: {
      uid: uid,
      "access-token": access_token,
      client: client,
      "Content-Type": "application/json"
    },
    qs: req.query,
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    try {
      res.set("Status", response.headers.status_code);
      res.set("status_code", response.headers.status_code);
      res.send(body);
    }
    catch (e) {
      console.log("e : ", e);
      console.log("response : ", response);
      console.log("error : ", error);
      res.set("Status", 200);
      res.set("status_code", 200);
      res.json({
        success: false,
        message: "Something went worng",
        data: null,
        errors: ["Something went worng"]
      });
    }
  }

  request(options1, callback1);
  return false;
};

exports.uploadEmployees = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const employeeFileData = req.files || {};

  let formData = {
    ...reqBody
  };
  if (employeeFileData["employee_upload"]) formData['employee_upload'] = fs.createReadStream(employeeFileData["employee_upload"].path)

  var options1 = {
    url: CONST.employeeUploadfile,
    headers: {
      uid: uid,
      client: client,
      access_token: access_token,
      "Content-Type": "application/json"
    },
    method: "POST"
  };
  if (employeeFileData["employee_upload"]) {
    options1.formData = formData;
  } else {
    options1.body = reqBody;
    options1.json = true;
  }

  async function callback1(err, response, body) {

    if (employeeFileData["employee_upload"]) { await deleteBackendCreatedFile(employeeFileData["employee_upload"].path) }

    if (err) {
      res.status(200);
      res.send({
        "success": false,
        "data": {},
        "errors": { err },
        "message": "Something went wrong"
      });
    } else {
      res.status(response.statusCode);
      res.send(body);
    }
  }

  request(options1, callback1);
  return false;
};

exports.updateCurrentLocationV1 = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;
  var options1 = {
    url: CONST.updateCurrentLocationV1 + req.params.driverId + "/update_current_location",
    qs: req.query,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      siteid: siteid,
      featuretext: featuretext,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.getEmployeeDetailsByIdV1 = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;
  var options1 = {
    url: CONST.getEmployeeDetailsByIdV1 + req.params.userid,
    qs: req.query,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      siteid: siteid,
      featuretext: featuretext,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.verifyEmail = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;
  var options1 = {
    url: CONST.verifyEmail,
    qs: req.query,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      siteid: siteid,
      featuretext: featuretext,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.requestETA = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: process.env.BASE_URL_MASTER_MS + ":8008/api/v1/trips/" + req.params.tripId + "/eta",
    headers: {
      uid: uid,
      "access-token": access_token,
      client: client,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    if (error) {
      res.status(404);
      res.send({ error: "Something Went wrong" });
    } else {
      res.status(response.statusCode);
      res.send(body);
      console.log(JSON.stringify(body, undefined, 4));
    }
  }

  request(options1, callback1);
  return false;
};

exports.startTrip = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;
  var options1 = {
    url: CONST.startTrip + req.params.id + "/start",
    qs: req.query,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      siteid: siteid,
      featuretext: featuretext,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.employeeRate = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;
  var options1 = {
    url: CONST.employeeRate + req.params.id + "/rate",
    qs: req.query,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      siteid: siteid,
      featuretext: featuretext,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.employeeTripDismiss = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;
  var options1 = {
    url: CONST.employeeTripDismiss + req.params.id + "/dismiss_trip",
    qs: req.query,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      siteid: siteid,
      featuretext: featuretext,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.updateEmployeeSiteRole = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;
  console.log(CONST.updateEmployeeSiteRole)
  var options1 = {
    url: CONST.updateEmployeeSiteRole,
    qs: req.query,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      siteid: siteid,
      featuretext: featuretext,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.getEmployeeSiteRole = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;
  var options1 = {
    url: CONST.getEmployeeSiteRole,
    qs: req.query,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      siteid: siteid,
      featuretext: featuretext,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.employeeOnBoard = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;
  var options1 = {
    url: CONST.employeeOnBoard + req.params.id + "/employee_on_board",
    qs: req.query,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      siteid: siteid,
      featuretext: featuretext,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.employeeSatisfactionExcel = async (req, res) => {
  const reqBody = req.body;
  const siteId = req.params.siteId;
  let { fromDate, toDate } = req.params;

  let actualPath = appRoot + "/files/Employee Satisfaction " + randomstring.generate(10) + ".xlsx";

  // request(options1, callback1);
  await downloadFileFromOtherServer(req, CONST.employeeSatisfaction + fromDate + "/" + toDate, actualPath);

  const file = actualPath;
  res.download(file, actualPath, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

  return false;
};
exports.vehicleDeploymentExcel = async (req, res) => {
  const reqBody = req.body;
  const siteId = req.params.siteId;
  let { accessToken, fromDate, toDate } = req.params;

  let actualPath = appRoot + "/files/Vehicle Deployment " + randomstring.generate(10) + ".xlsx";

  // request(options1, callback1);
  await downloadFileFromOtherServer(req, CONST.vehicleDeployment + accessToken + "/" + siteId + "/" + fromDate + "/" + toDate, actualPath);

  const file = actualPath;
  res.download(file, actualPath, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

  return false;
};
exports.noShowAndCancellationsExcel = async (req, res) => {
  const reqBody = req.body;
  const siteId = req.params.siteId;
  let { accessToken, fromDate, toDate } = req.params;

  let actualPath = appRoot + "/files/No Show And Cancellations " + randomstring.generate(10) + ".xlsx";

  // request(options1, callback1);
  await downloadFileFromOtherServer(req, CONST.noShowAndCancellations + accessToken + "/" + siteId + "/" + fromDate + "/" + toDate, actualPath);

  const file = actualPath;
  res.download(file, actualPath, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

  return false;
};
exports.otdSummaryExcel = async (req, res) => {
  const reqBody = req.body;
  const siteId = req.params.siteId;
  let { accessToken, fromDate, toDate } = req.params;

  let actualPath = appRoot + "/files/OTD Summary " + randomstring.generate(10) + ".xlsx";

  // request(options1, callback1);
  await downloadFileFromOtherServer(req, CONST.otdSummary + fromDate + "/" + toDate, actualPath);

  const file = actualPath;
  res.download(file, actualPath, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

  return false;
};

exports.driverActivities = async (req, res) => {
  const reqBody = req.body;
  const siteId = req.params.siteId;
  let { fromDate, toDate } = req.params;

  let actualPath = appRoot + "/files/Driver Activity " + randomstring.generate(10) + ".xlsx";

  // request(options1, callback1);
  await downloadFileFromOtherServer(req, CONST.driverActivities, actualPath);

  const file = actualPath;
  res.download(file, actualPath, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

  return false;
};

exports.shiftWiseNoShow = async (req, res) => {
  const reqBody = req.body;
  const siteId = req.params.siteId;
  let { fromDate, toDate } = req.params;

  let actualPath = appRoot + "/files/Shift Wise Not Show " + randomstring.generate(10) + ".xlsx";

  // request(options1, callback1);
  await downloadFileFromOtherServer(req, CONST.shiftWiseNoShow + fromDate + "/" + toDate, actualPath);

  const file = actualPath;
  res.download(file, actualPath, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

  return false;
};

exports.driverActiveDeactive = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;
  console.log(CONST.requestStateChange)
  var options1 = {
    url: CONST.driverActiveDeactive + req.params.id + "/active_driver",
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      siteid: siteid,
      featuretext: featuretext,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.driverBlacklisted = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;
  console.log(CONST.requestStateChange)
  var options1 = {
    url: CONST.driverBlacklisted + req.params.id + "/blacklist_driver",
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      siteid: siteid,
      featuretext: featuretext,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.vehicleActiveDeactive = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;
  console.log(CONST.requestStateChange)
  var options1 = {
    url: CONST.vehicleActiveDeactive + req.params.id + "/active_vehicle",
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      siteid: siteid,
      featuretext: featuretext,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.getEmployeeOnBoard = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;
  var options1 = {
    //trips/:tripId/trip_routes/on_board/:lat/:lng/:requestDate
    url: CONST.getEmployeeOnBoard + req.params.tripId + "/trip_routes/on_board?lat=" + req.query.lat + "&lng=" + req.query.lng + "&request_date=" + req.query.request_date,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      siteid: siteid,
      featuretext: featuretext,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.newTripRequest = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;
  var options1 = {
    ///trip_type/:tripType/new_date/:newDate/schedule_date/:scheduleDate
    url: CONST.newTripRequest + "trip_type=" + req.query.trip_type + "&new_date=" + req.query.new_date + "&shift=true&schedule_date=" + req.query.schedule_date,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      siteid: siteid,
      featuretext: featuretext,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.acceptTripRequest = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  console.log("Check here ");
  var options1 = {
    url: process.env.BASE_URL_MASTER_MS + ":8008/api/v1/trips/" + req.params.trip_id + "/accept_trip_request/" + req.query.request_date,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    try {
      // res.set("Status", response.headers.status_code);
      // res.set("status_code", response.headers.status_code);
      // res.send(body);

      if (body.success === false) {
        res.status(422);
        //res.set("status", response.headers.status);    
        res.send(body);

      } else {
        res.set("status", response.headers.status);
        res.send(body);
      }
    }
    catch (e) {
      res.status(422);
      res.json({
        "success": false,
        "message": "Something went worng",
        "data": null,
        "errors": ["Something went worng"]
      });
    }
  }

  request(options1, callback1);
  return false;
};


exports.tripRoutesCompleted = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  console.log("coming here wrsjhkf")
  var options1 = {
    url: process.env.BASE_URL_MASTER_MS + ":8008/api/v1/trips/" + req.params.trip_id + "/trip_routes/completed/" + req.query.lat + "/" + req.query.lng + "/" + req.query.request_date,

    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    try {
      res.set("Status", response.headers.status_code);
      res.set("status_code", response.headers.status_code);
      res.send(body);
    }
    catch (e) {
      res.status(422);
      res.json({
        "success": false,
        "message": "Something went worng",
        "data": null,
        "errors": ["Something went worng"]
      });
    }
  }

  request(options1, callback1);
  return false;
};

exports.driverRequest = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: process.env.BASE_URL_MASTER_MS + ":8008/api/v1/drivers/" + req.params.driver_id + "/driver_request",

    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    try {
      res.set("Status", response.headers.status_code);
      res.set("status_code", response.headers.status_code);
      res.send(body);
    }
    catch (e) {
      res.status(422);
      res.json({
        "success": false,
        "message": "Something went worng",
        "data": null,
        "errors": ["Something went worng"]
      });
    }
  }

  request(options1, callback1);
  return false;
};


exports.employeeException = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;

  var options1 = {
    url: process.env.BASE_URL_MASTER_MS + ":8008/api/v1/employee_trips/" + req.params.employee_trip_id + "/exception",

    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      featuretext: featuretext,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    try {
      res.set("Status", response.headers.status_code);
      res.set("status_code", response.headers.status_code);
      res.send(body);
    }
    catch (e) {
      res.status(422);
      res.json({
        "success": false,
        "message": "Something went worng",
        "data": null,
        "errors": ["Something went worng"]
      });
    }
  }

  request(options1, callback1);
  return false;
};

exports.changeTripRequest = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;
  var options1 = {
    url: CONST.changeTripRequest + req.params.employeeTripId,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      siteid: siteid,
      featuretext: featuretext,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "PATCH",
    json: true
  };
  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.generateCallByOperator = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;
  var options1 = {
    url: CONST.generateCallByOperator + req.params.driver_id + "/call_operator",
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      siteid: siteid,
      featuretext: featuretext,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};
exports.requestDriverArrived = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  //const siteid = req.headers.siteid;
  //const featuretext = req.headers.featuretext;
  console.log("requestStateChange:", CONST.requestStateChange)
  let redirect_url = CONST.requestDriverArrived + req.url;
  console.log("redirect_url:", redirect_url);
  var options1 = {
    url: redirect_url,
    headers: {
      uid: uid,
      "access_token": access_token,
      client: client,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    try {
      res.status(response.statusCode);
      res.send(body);
    }
    catch (e) {
      console.log(e);
      res.status(422);
      res.json({
        success: false,
        message: "Something went worng",
        data: null,
        errors: ["Something went worng"]
      });
    }
  }

  request(options1, callback1);
  return false;
};


exports.postRequestRedirect = async (req, res) => {

  console.log("url", `${process.env.BASE_URL_MASTER_MS}:8008${req.originalUrl}`);

  let options = {

    url: `${process.env.BASE_URL_MASTER_MS}:8008${req.originalUrl}`,
    headers: {
      "uid": req.headers.uid,
      "access_token": req.headers.access_token,
      "client": req.headers.client,
      "Content-Type": "application/json",
      "siteid": !req.headers.siteid ? '' : req.headers.siteid
    },
    body: req.body,

    method: "POST",

    json: true
  };

  request(options, function (error, response, body) {
    if (error) {
      return res.status(500).send(body);
    }
    return res.status(response.statusCode).send(body);
  });

};

exports.requestUpdateUserStatus = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  //const siteid = req.headers.siteid;
  //const featuretext = req.headers.featuretext;
  console.log("requestStateChange:", CONST.requestStateChange)
  let redirect_url = CONST.requestUpdateUserStatus + req.url;
  console.log("redirect_url:", redirect_url);
  var options1 = {
    url: redirect_url,
    headers: {
      uid: uid,
      "access_token": access_token,
      client: client,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    try {
      res.status(response.statusCode);
      res.send(body);
    }
    catch (e) {
      console.log(e);
      res.status(422);
      res.json({
        success: false,
        message: "Something went worng",
        data: null,
        errors: ["Something went worng"]
      });
    }
  }

  request(options1, callback1);
  return false;
};

exports.vehicleBrokeDown = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;

  let redirect_url = CONST.vehicleBrokeDown + req.params.vehicleId + "/vehicle_broke_down";
  var options1 = {
    url: redirect_url,
    headers: {
      uid: uid,
      "access_token": access_token,
      client: client,
      "Content-Type": "application/json",
      siteid: siteid,
      featuretext: featuretext
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    try {
      res.status(response.statusCode);
      res.send(body);
    }
    catch (e) {
      console.log(e);
      res.status(422);
      res.json({
        success: false,
        message: "Something went worng",
        data: null,
        errors: ["Something went worng"]
      });
    }
  }

  request(options1, callback1);
  return false;
};

exports.tripRated = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  //const siteid = req.headers.siteid;
  //const featuretext = req.headers.featuretext;
  let redirect_url = CONST.tripRated + req.params.employeeTripId + "/trip_rated";
  var options1 = {
    url: redirect_url,
    headers: {
      uid: uid,
      "access_token": access_token,
      client: client,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    try {
      res.status(response.statusCode);
      res.send(body);
    }
    catch (e) {
      console.log(e);
      res.status(422);
      res.json({
        success: false,
        message: "Something went worng",
        data: null,
        errors: ["Something went worng"]
      });
    }
  }

  request(options1, callback1);
  return false;
};


exports.addBA = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.addBA,
    headers: {
      uid: uid,
      client: client,
      access_token: access_token,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    try {
      res.status(response.statusCode);
      res.send(body);
    }
    catch (e) {
      console.log(e);
      res.status(422);
      res.json({
        success: false,
        message: "Something went worng",
        data: null,
        errors: ["Something went worng"]
      });
    }
  }

  request(options1, callback1);
  return false;
};

exports.duplicateEmployeeEmail = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.duplicateEmployeeEmail,
    headers: {
      uid: uid,
      client: client,
      access_token: access_token,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    try {
      res.status(response.statusCode);
      res.send(body);
    }
    catch (e) {
      console.log(e);
      res.status(422);
      res.json({
        success: false,
        message: "Something went worng",
        data: null,
        errors: ["Something went worng"]
      });
    }
  }

  request(options1, callback1);
  return false;
};

exports.duplicateEmployeePhone = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.duplicateEmployeePhone,
    headers: {
      uid: uid,
      client: client,
      access_token: access_token,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    try {
      res.status(response.statusCode);
      res.send(body);
    }
    catch (e) {
      console.log(e);
      res.status(422);
      res.json({
        success: false,
        message: "Something went worng",
        data: null,
        errors: ["Something went worng"]
      });
    }
  }

  request(options1, callback1);
  return false;
};

exports.driverListing = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.driverListing + req.params.pageNo + "/" + req.params.recordsPerPage,
    headers: {
      uid: uid,
      client: client,
      access_token: access_token,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    try {
      res.status(response.statusCode);
      res.send(body);
    }
    catch (e) {
      console.log(e);
      res.status(422);
      res.json({
        success: false,
        message: "Something went worng",
        data: null,
        errors: ["Something went worng"]
      });
    }
  }

  request(options1, callback1);
  return false;
};

exports.updateProfPic = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.updateProfPic,
    headers: {
      uid: uid,
      client: client,
      access_token: access_token,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    try {
      res.status(response.statusCode);
      res.send(body);
    }
    catch (e) {
      console.log(e);
      res.status(422);
      res.json({
        success: false,
        message: "Something went worng",
        data: null,
        errors: ["Something went worng"]
      });
    }
  }

  request(options1, callback1);
  return false;
};

exports.validatePlateNumber = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.validatePlateNumber,
    headers: {
      uid: uid,
      client: client,
      access_token: access_token,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    try {
      res.status(response.statusCode);
      res.send(body);
    }
    catch (e) {
      console.log(e);
      res.status(422);
      res.json({
        success: false,
        message: "Something went worng",
        data: null,
        errors: ["Something went worng"]
      });
    }
  }

  request(options1, callback1);
  return false;
};

exports.validateLicenseNumber = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.validateLicenseNumber,
    headers: {
      uid: uid,
      client: client,
      access_token: access_token,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    try {
      res.status(response.statusCode);
      res.send(body);
    }
    catch (e) {
      console.log(e);
      res.status(422);
      res.json({
        success: false,
        message: "Something went worng",
        data: null,
        errors: ["Something went worng"]
      });
    }
  }

  request(options1, callback1);
  return false;
};


exports.getRequestRedirect = async (req, res) => {

  console.log("url", `${process.env.BASE_URL_MASTER_MS}:8008${req.originalUrl}`);

  let options = {

    url: `${process.env.BASE_URL_MASTER_MS}:8008${req.originalUrl}`,
    headers: {
      uid: req.headers.uid,
      access_token: req.headers.access_token,
      client: req.headers.client,
      "Content-Type": "application/json",
      siteid: req.headers.siteid,
      featuretext: req.headers.featuretext
    },
    body: req.body,

    method: "GET",

    json: true
  };

  request(options, function (error, response, body) {
    if (error) {
      return res.status(500).send(body);
    }
    return res.status(response.statusCode).send(body);
  });

};

exports.patchRequestRedirect = async (req, res) => {

  console.log("url", `${process.env.BASE_URL_MASTER_MS}:8008${req.originalUrl}`);

  let options = {

    url: `${process.env.BASE_URL_MASTER_MS}:8008${req.originalUrl}`,
    headers: {
      "uid": req.headers.uid,
      "access_token": req.headers.access_token,
      "client": req.headers.client,
      "Content-Type": "application/json",
      "siteid": req.headers.siteid
    },
    body: req.body,

    method: "PATCH",

    json: true
  };

  request(options, function (error, response, body) {
    if (error) {
      return res.status(500).send(body);
    }
    return res.status(response.statusCode).send(body);
  });

};



exports.downloadReportExcelCommon = async (req, res) => {
  // let siteId = req.params.site_id;

  console.log(req.path);

  let path = req.path;
  path = `/${path}'/g`;
  path = path.replace(/\//g, "_");

  let currentYear = new Date().getFullYear();


  let fileName = currentYear + path + randomstring.generate(10) + ".xlsx";
  let actualPath = "files/" + fileName;

  console.log("fileName", fileName);

  //request(options1, callback1);

  let url = `${process.env.BASE_URL_BASE_URL_REPORT_MS}:8005${req.originalUrl}`;

  await downloadFileFromOtherServer(req, url, actualPath);

  const file = `${appRoot}/${actualPath}`;
  res.download(file, fileName, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

}

exports.masterPostRequest = async (req, res) => {
  const reqBody = req.body;
  console.log("request body : ", req.body);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const siteid = req.headers.siteid;
  const featuretext = req.headers.featuretext;
  console.log("requestStateChange:", CONST.requestStateChange)
  let redirect_url = CONST.masterPostRequest + req.url;
  console.log("redirect_url:", redirect_url);
  var options1 = {
    url: redirect_url,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      "Content-Type": "application/json",
      siteid: siteid,
      featuretext: featuretext
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    try {
      res.status(response.statusCode);
      res.send(body);
    }
    catch (e) {
      console.log(e);
      res.status(422);
      res.json({
        success: false,
        message: "Something went worng",
        data: null,
        errors: ["Something went worng"]
      });
    }
  }

  request(options1, callback1);
  return false;
};


exports.driverPostRequestRedirect = async (req, res) => {

  // console.log("url", `${process.env.BASE_URL_MASTER_MS}:8008/api/v1/driver/add`);

  let reqBody = req.body;
  let driverFileData = req.files;

  let formData = {
    ...reqBody
  };

  if (req.body['registration_steps'] == 'Step_1') {
    if (driverFileData && driverFileData["profile_picture"]) {
      formData['profile_picture'] = await fs.createReadStream(driverFileData["profile_picture"].path);
    }
  }

  if (req.body['registration_steps'] == 'Step_3') {

    if (req.files && driverFileData["driving_registration_form_doc"]) {
      formData['driving_registration_form_doc'] = await fs.createReadStream(driverFileData["driving_registration_form_doc"].path);
    }
    if (req.files && driverFileData["driving_license_doc"]) {
      formData['driving_license_doc'] = await fs.createReadStream(driverFileData["driving_license_doc"].path);
    }
    if (req.files && driverFileData["id_proof_doc"]) {
      formData['id_proof_doc'] = await fs.createReadStream(driverFileData["id_proof_doc"].path);
    }
    if (req.files && driverFileData["bgc_doc"]) {
      formData['bgc_doc'] = await fs.createReadStream(driverFileData["bgc_doc"].path);
    }
    if (req.files && driverFileData["medically_certified_doc"]) {
      formData['medically_certified_doc'] = await fs.createReadStream(driverFileData["medically_certified_doc"].path);
    }
    if (req.files && driverFileData["sexual_policy_doc"]) {
      formData['sexual_policy_doc'] = await fs.createReadStream(driverFileData["sexual_policy_doc"].path);
    }
    if (req.files && driverFileData["police_verification_vailidty_doc"]) {
      formData['police_verification_vailidty_doc'] = await fs.createReadStream(driverFileData["police_verification_vailidty_doc"].path);
    }
    if (req.files && driverFileData["other_doc"]) {
      formData['other_doc'] = await fs.createReadStream(driverFileData["other_doc"].path);
    }

  }
  console.log( "req.originalUrl",req.originalUrl );
  let addDriverUrl;

  if( req.originalUrl == '/api/v1/drivers/draft' ){
    addDriverUrl = '';
     addDriverUrl =`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/drivers/draft`;
  }else{
    addDriverUrl = '';
     addDriverUrl = `${process.env.BASE_URL_MASTER_MS}:8008/api/v1/driver/add`;
  }

  req.params['id'] = parseInt( req.params['id'] );
  if( req.params['id'] ) {
    addDriverUrl = '';
    addDriverUrl = `${process.env.BASE_URL_MASTER_MS}:8008/api/v1/driver/add/${req.params['id']}`;
  }

  //console.log("addDriverUrl",addDriverUrl);

  let options = {
    url: addDriverUrl,
    headers: {
      "uid": req.headers.uid,
      "access_token": req.headers.access_token,
      "client": req.headers.client,
      "Content-Type": "application/json",
      "siteid": !req.headers.siteid ? '' : req.headers.siteid
    },
    method: "POST"
  };

  if (req.body['registration_steps'] == 'Step_2') {
    options['body'] = req.body;
    options['json'] = true;

  } else {
    options['formData'] = formData;
  }




  console.log(options);


  async function callback(err, response, body) {

    if (req.body['registration_steps'] == 'Step_1') {
      if (req.files && driverFileData['profile_picture']) {
        deleteBackendCreatedFile(driverFileData['profile_picture'].path);
      }
    }

    if (req.body['registration_steps'] == 'Step_3') {

      if (req.files && driverFileData['driving_registration_form_doc']) {
        deleteBackendCreatedFile(driverFileData['driving_registration_form_doc'].path);
      }
      if (req.files && driverFileData['driving_license_doc']) {
        deleteBackendCreatedFile(driverFileData['driving_license_doc'].path);
      }
      if (req.files && driverFileData['id_proof_doc']) {
        deleteBackendCreatedFile(driverFileData['id_proof_doc'].path);
      }
      if (req.files && driverFileData['bgc_doc']) {
        deleteBackendCreatedFile(driverFileData['bgc_doc'].path)
      }
      if (req.files && driverFileData['medically_certified_doc']) {
        deleteBackendCreatedFile(driverFileData['medically_certified_doc'].path)
      }
      if (req.files && driverFileData['sexual_policy_doc']) {
        deleteBackendCreatedFile(driverFileData['sexual_policy_doc'].path)
      }
      if (req.files && driverFileData['police_verification_vailidty_doc']) {
        deleteBackendCreatedFile(driverFileData['police_verification_vailidty_doc'].path)
      }
      if (req.files && driverFileData['other_doc']) {
        deleteBackendCreatedFile(driverFileData['other_doc'].path)
      }

    }
    if (err) {
      res.status(422);
      return res.send({
        "success": false,
        "data": {},
        "errors": { err },
        "message": "Something went wrong"
      });
    } else {
      return res.status(response.statusCode).send(body);
    }
  }

  return request(options, callback);

}


exports.updateSchedule = async (req, res) => {

  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const featuretext = req.headers.featuretext;
  const siteid = req.headers.siteid;

  const options1 = {
    url: CONST.updateSchedule,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      featuretext: featuretext,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.copySchedule = async (req, res) => {

  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const featuretext = req.headers.featuretext;
  const siteid = req.headers.siteid;

  const options1 = {
    url: CONST.copySchedule,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      featuretext: featuretext,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;

};


exports.updateSchedule = async (req, res) => {

  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const featuretext = req.headers.featuretext;
  const siteid = req.headers.siteid;

  const options1 = {
    url: CONST.updateSchedule,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      featuretext: featuretext,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.copySchedule = async (req, res) => {

  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const featuretext = req.headers.featuretext;
  const siteid = req.headers.siteid;

  const options1 = {
    url: CONST.copySchedule,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      featuretext: featuretext,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.deleteRequestRedirect = async (req, res) => {

  console.log("url", `${process.env.BASE_URL_MASTER_MS}:8008${req.originalUrl}`);

  let options = {

    url: `${process.env.BASE_URL_MASTER_MS}:8008${req.originalUrl}`,
    headers: {
      uid: req.headers.uid,
      access_token: req.headers.access_token,
      client: req.headers.client,
      "Content-Type": "application/json",
      siteid: req.headers.siteid,
      featuretext: req.headers.featuretext
    },
    body: req.body,

    method: "DELETE",

    json: true
  };

  request(options, function (error, response, body) {
    if (error) {
      return res.status(500).send(body);
    }
    return res.status(response.statusCode).send(body);
  });

};


exports.moduleFeatures = async (req, res) => {
  const reqBody = req.body;

  let actualPath = appRoot + "/files/Module Features " + randomstring.generate(10) + ".xlsx";

  // request(options1, callback1);
  await downloadFileFromOtherServer(req, CONST.moduleFeatures, actualPath);

  const file = actualPath;
  res.download(file, actualPath, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

  return false;
};

exports.updateVehicle = async (req, res) => {

  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const featuretext = req.headers.featuretext;
  const siteid = req.headers.siteid;

  const options1 = {
    url: CONST.updateVehicle + "/" + req.params.id,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      featuretext: featuretext,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "PATCH",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.getVehicleModelData = async (req, res) => {

  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const featuretext = req.headers.featuretext;
  const siteid = req.headers.siteid;

  const options1 = {
    url: CONST.getVehicleModelData,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      featuretext: featuretext,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
};

exports.OTASummaryReport = async (req, res) => {
  let accessToken = req.params.accessToken;
  let siteId = req.params.siteId;
  let fromDate = req.params.fromDate;
  let toDate = req.params.toDate;

  let fileName = "OTA Summary Report" + randomstring.generate(10) + ".xlsx";
  let actualPath = "files/" + fileName;

  // request(options1, callback1);
  await downloadFileFromOtherServer(req, CONST.OTASummaryReport +
    accessToken +
    "/" +
    siteId +
    "/" +
    fromDate +
    "/" +
    toDate, actualPath);

  const file = `${actualPath}`;
  res.download(file, fileName, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

  return false;
};

exports.shiftFleetUtilizationReport = async (req, res) => {
  let accessToken = req.params.accessToken;
  let siteId = req.params.siteId;
  let fromDate = req.params.fromDate;
  let toDate = req.params.toDate;

  let fileName = "Shift Fleet Utilization Report" + randomstring.generate(10) + ".xlsx";
  let actualPath = appRoot + "/files/" + fileName;

  // request(options1, callback1);
  await downloadFileFromOtherServer(req, CONST.shiftFleetUtilizationReport +
    accessToken +
    "/" +
    siteId +
    "/" +
    fromDate +
    "/" +
    toDate, actualPath);

  const file = `${actualPath}`;
  res.download(file, fileName, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

  return false;
};

exports.downloadRoasterFile = async (req, res) => {
  //const reqBody = req.body;
  const siteId = req.query.siteId;
  const requestDate = req.query.requestDate;

  console.log("siteId --- " + siteId);
  console.log("requestDate --- " + requestDate);

  let actualPath = appRoot + "/files/roaster_" + randomstring.generate(10) + ".xlsx";

  // request(options1, callback1);
  await downloadFileFromOtherServer(req, process.env.BASE_URL_ROASTERING_ROUTING_API_MS + `:8002/api/v1/roaster-download?siteId=` + req.query.siteId + `&requestDate=` + req.query.requestDate, actualPath);

  const file = actualPath;
  res.download(file, actualPath, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

  return false;
};

exports.downloadRoutesFile = async (req, res) => {
  //const reqBody = req.body;
  const siteId = req.query.siteId;
  const shiftId = req.query.shiftId;
  const shiftType = req.query.shiftType;
  const requestDate = req.query.requestDate;

  console.log("siteId --- " + siteId);
  console.log("shiftId --- " + shiftId);
  console.log("shiftType --- " + shiftType);
  console.log("requestDate --- " + requestDate);

  let actualPath = appRoot + "/files/routes_" + randomstring.generate(10) + ".xlsx";

  // request(options1, callback1);
  await downloadFileFromOtherServer(req, process.env.BASE_URL_ROASTERING_ROUTING_API_MS + `:8002/api/v1/routes-download?siteId=` + req.query.siteId + `&requestDate=` + req.query.requestDate + `&shiftId=` + req.query.shiftId + `&shiftType=` + req.query.shiftType, actualPath);

  const file = actualPath;
  res.download(file, actualPath, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

  return false;
};
exports.vehicleDownloadExcel = async (req, res) => {
  const reqBody = req.body;
  const siteId = req.params.siteId;
  let { accessToken } = req.params;

  let actualPath = appRoot + "/files/vehicle Download Excel " + randomstring.generate(10) + ".xlsx";

  // request(options1, callback1);
  await downloadFileFromOtherServer(req, CONST.vehicleDownload + accessToken + "/" + siteId, actualPath);

  const file = actualPath;
  res.download(file, actualPath, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

  return false;
};

exports.driverExcelReport = async (req, res) => {
  const reqBody = req.body;


  let actualPath = appRoot + "/files/driver_excel_" + randomstring.generate(10) + ".xlsx";

  // request(options1, callback1);
  await downloadFileFromOtherServer(req, process.env.BASE_URL_BASE_URL_REPORT_MS + `:8005/api/v1/report/drivers`, actualPath);

  const file = actualPath;
  res.download(file, actualPath, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

  return false;
};

exports.CustomerExcelReport = async (req, res) => {
  const reqBody = req.body;


  let actualPath = appRoot + "/files/customer_excel_" + randomstring.generate(10) + ".xlsx";

  // request(options1, callback1);
  await downloadFileFromOtherServer(req, process.env.BASE_URL_BASE_URL_REPORT_MS + `:8005/api/v1/report/customer_master`, actualPath)
    .catch(err => {
      console.log({ err });
    })

  const file = actualPath;
  res.download(file, actualPath, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

  return false;
};

exports.BAExcelReport = async (req, res) => {
  const reqBody = req.body;


  let actualPath = appRoot + "/files/ba_excel_" + randomstring.generate(10) + ".xlsx";

  // request(options1, callback1);
  await downloadFileFromOtherServer(req, process.env.BASE_URL_BASE_URL_REPORT_MS + `:8005/api/v1/report/ba_master`, actualPath)
    .catch(err => {
      console.log({ err });
    })

  const file = actualPath;
  res.download(file, actualPath, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

  return false;
};

exports.SiteExcelReport = async (req, res) => {
  const reqBody = req.body;


  let actualPath = appRoot + "/files/sites_excel_" + randomstring.generate(10) + ".xlsx";

  // request(options1, callback1);
  await downloadFileFromOtherServer(req, process.env.BASE_URL_BASE_URL_REPORT_MS + `:8005/api/v1/report/site_master`, actualPath)
    .catch(err => {
      console.log({ err });
    })

  const file = actualPath;
  res.download(file, actualPath, function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
      deleteBackendCreatedFile(actualPath)
    }
  });

  return false;
};

exports.downloadRouteUploadFile = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const featuretext = req.headers.featuretext;
  const siteid = req.headers.siteid;

  const options1 = {
    url: CONST.downloadRouteUploadFile,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      featuretext: featuretext,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "GET",
    json: true,
    encoding: null
  };

  function callback1(error, response, body) {
    if (error) {
      console.log(error);
      res.status(200);
      res.send({
        success: false,
        data: {},
        errors: [],
        message: "Something Went wrong",
      });
      return;
    }
    if (response.headers["content-type"] == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {

      res.status(response.statusCode);
      res.set({
        'Cache-Control': response.headers["cache-control"],
        'Content-Type': response.headers["content-type"],
        'Content-Length': response.headers["content-length"],
        'Content-Disposition': response.headers["content-disposition"],
      });
      res.send(body);

      return;
    } else {

      res.set({
        'Cache-Control': response.headers["cache-control"],
        'Content-Type': response.headers["content-type"],
        'Content-Length': response.headers["content-length"],
        'Content-Disposition': response.headers["content-disposition"],
      });

      res.status(response.statusCode);
      res.send(body);
      return;
    }
  }

  request(options1, callback1);
  return false;
}

exports.uploadRoutes = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const featuretext = req.headers.featuretext;
  const siteid = req.headers.siteid;
  const fileData = req.files || {};
  console.log("fileData : ", fileData, reqBody);
  let formData = {
    ...reqBody
  };
  let isFileDataHave = false;

  if (!req.files || !req.files.uploadRoutesExcel || _.isEmpty(req.files.uploadRoutesExcel.originalFilename)) {

    res.status(200);
    res.send({
      success: false,
      data: {},
      errors: [],
      message: "uploadRoutesExcel can not be blank",
    });

    return;
  }

  if (fileData["uploadRoutesExcel"]) formData['uploadRoutesExcel'] = fs.createReadStream(fileData["uploadRoutesExcel"].path)
  if (fileData["uploadRoutesExcel"]) isFileDataHave = true;

  formData['originalFilename'] = fileData.uploadRoutesExcel.originalFilename;

  const options1 = {
    url: CONST.routeUpload,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      featuretext: featuretext,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    method: "POST",
    encoding: null //for take response in buffer type
  };

  if (isFileDataHave) {
    options1.formData = formData;
  } else {
    options1.body = reqBody;
    options1.json = true;
  }

  async function callback1(error, response, body) {

    if (fileData["uploadRoutesExcel"]) { await deleteBackendCreatedFile(fileData["uploadRoutesExcel"].path) }

    if (error) {
      console.log(error);
      res.status(200);
      res.send({
        success: false,
        data: {},
        errors: [],
        message: "Something Went wrong",
      });
      return;
    }
    if (response.headers["content-type"] == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {

      res.status(response.statusCode);
      res.set({
        'Cache-Control': response.headers["cache-control"],
        'Content-Type': response.headers["content-type"],
        'Content-Length': response.headers["content-type"],
        'Content-Disposition': response.headers["content-disposition"],
      });
      res.send(body);

      return;
    } else {
      res.set({
        'Cache-Control': response.headers["cache-control"],
        'Content-Type': response.headers["content-type"],
        'Content-Length': response.headers["content-length"],
        'Content-Disposition': response.headers["content-disposition"],
      });

      res.status(response.statusCode);
      res.send(body);
      return;
    }
  }

  request(options1, callback1);
  return false;
}

exports.getRoutesUploadedList = async (req, res) => {

  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const featuretext = req.headers.featuretext;
  const siteid = req.headers.siteid;
  console.log(CONST.getRoutesUploadedList)
  const options1 = {
    url: CONST.getRoutesUploadedList,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      featuretext: featuretext,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    console.log(error, "-------", response, "-------", body)
    res.status(response.statusCode);
    res.send(body);
  }

  request(options1, callback1);
  return false;
}

exports.downloadRouteUploadedFile = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const featuretext = req.headers.featuretext;
  const siteid = req.headers.siteid;

  const options1 = {
    url: CONST.downloadRouteUploadedFile + req.params.id,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      featuretext: featuretext,
      siteid: siteid,
      "Content-Type": "application/json"
    },
    method: "GET",
    json: true,
    encoding: null
  };

  function callback1(error, response, body) {
    if (error) {
      console.log(error);
      res.status(200);
      res.send({
        success: false,
        data: {},
        errors: [],
        message: "Something Went wrong",
      });
      return;
    }
    if (response.headers["content-type"] == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {

      res.status(response.statusCode);
      res.set({
        'Cache-Control': response.headers["cache-control"],
        'Content-Type': response.headers["content-type"],
        'Content-Length': response.headers["content-length"],
        'Content-Disposition': response.headers["content-disposition"],
      });
      res.send(body);

      return;
    } else {

      res.set({
        'Cache-Control': response.headers["cache-control"],
        'Content-Type': response.headers["content-type"],
        'Content-Length': response.headers["content-length"],
        'Content-Disposition': response.headers["content-disposition"],
      });

      res.status(response.statusCode);
      res.send(body);
      return;
    }
  }

  request(options1, callback1);
  return false;
}

exports.approveNonCompliantRoutes = async (req, res) => {
  const reqBody = req.body;
  //console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.approveNcRoutes,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      featuretext: req.headers.featuretext,
      siteid: req.headers.siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.logging = async (req, res) => {
  var options1 = {
    url: process.env.log_insert_url,
    headers: {
      ...req.headers,
      "Content-Type": "application/json"
    },
    body: req.body,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};

exports.downloadSingleDocument = async (req, res) => {
  try {
    let resource_id = req.body.resource_id;
    let document_url = req.body.document_url;
    let resource_type = req.body.resource_type;
    let doc_name = req.body.doc_name;
    if (!resource_id) {
      throw { msg: "resource_id required" }
    }
    if (!document_url) {
      throw { msg: "document_url required" }
    }
    if (!resource_type) {
      throw { msg: "resource_type required" }
    }
    if (!doc_name) {
      throw { msg: "doc_name required" }
    }
    //getting document name from document url starts here
    let splitted_document_url = document_url.split("?");
    let extension = document_url.match(/\.([^\./\?]+)($|\?)/)[1];
    let fileName_Index = document_url.lastIndexOf("/") + 1;
    let fetch_fileName = document_url.substr(fileName_Index).replace(/[\#\?].*$/, '');

    //getting document name from document url end here
    //let fileName = "id_proof.png";
    let fileName = resource_type + "_" + doc_name + "." + extension;
    //AWS download file code starts here
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_accessKeyId,
      secretAccessKey: process.env.AWS_secretAccessKey,
      region: process.env.AWS_region
    });
    let bucketname = process.env.AWS_s3bucket_renewal_document;
    let keyfile = fetch_fileName;
    var params = { Bucket: bucketname, Key: keyfile, Expires: 3600, ResponseContentDisposition: `attachment; filename=${fileName}` };
    var url = s3.getSignedUrl('getObject', params);
    console.log("AWS provided : ", url);
    let response_data = { "download_url": url };
    helper.makeResponse(res, 200, true, response_data, [], "Download URL");
    //AWS download file code starts here
  }
  catch (e) {
    console.log("download single document : ", e);
    helper.makeResponse(res, 200, false, {}, [], (e.msg != undefined) ? e.msg : "Something Went Wrong");
    if ((e.msg != undefined)) {
      FUNC.logSave(req, req.body, {}, req.headers, "api_ms", "Download single document user error occurred", "FATAL", "api", e)
    }
  }

};

exports.driverDocumentDownload = async (req, res) => {
  console.log("within download@@@@@");
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const featuretext = req.headers.featuretext;

  var options1 = {
    url: CONST.driverDocumentDownload + req.params.id + "/download_document",
    headers: {
      uid: uid,
      "Content-Type": "application/json",
      featuretext: featuretext
    },
    body: reqBody,
    method: "GET",
    json: true,
    encoding: null //for take response in buffer type
  };

  function callback1(error, response, body) {
    // res.set("Status", response.headers.status_code);
    // res.set("status_code", response.headers.status_code);
    console.log("response @@@@", response);

    // handling error
    if (error) {
      console.log(error);
      res.status(200);
      res.send({
        success: false,
        data: {},
        errors: [],
        message: "Something Went wrong",
      });
      return;
    } else {
      res.status(response.statusCode);
      res.set({
        'Cache-Control': response.headers["cache-control"],
        'Content-Type': response.headers["content-type"],
        'Content-Length': response.headers["content-length"],
        'Content-Disposition': response.headers["content-disposition"],
      });
      res.send(body);
    }
  }
  request(options1, callback1);
  return false;
}

exports.vehicleDocumentDownload = async (req, res) => {
  console.log("within download@@@@@");
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;
  const featuretext = req.headers.featuretext;

  var options1 = {
    url: CONST.vehicleDocumentDownload + req.params.id + "/download_document",
    headers: {
      uid: uid,
      "Content-Type": "application/json",
      featuretext: featuretext
    },
    body: reqBody,
    method: "GET",
    json: true,
    encoding: null //for take response in buffer type
  };

  function callback1(error, response, body) {
    // res.set("Status", response.headers.status_code);
    // res.set("status_code", response.headers.status_code);
    console.log("response @@@@", response);

    // handling error
    if (error) {
      console.log(error);
      res.status(200);
      res.send({
        success: false,
        data: {},
        errors: [],
        message: "Something Went wrong",
      });
      return;
    } else {
      res.status(response.statusCode);
      res.set({
        'Cache-Control': response.headers["cache-control"],
        'Content-Type': response.headers["content-type"],
        'Content-Length': response.headers["content-length"],
        'Content-Disposition': response.headers["content-disposition"],
      });
      res.send(body);
    }
  }
  request(options1, callback1);
  return false;
}

exports.getAppVersion = async (req, res) => {
  var options1 = {
    url: CONST.appVersion1 + "?appName=" + req.query.appName,
    headers: {
      ...req.headers,
      "Content-Type": "application/json"
    },
    body: req.body,
    method: "GET",
    json: true
  };

  function callback1(error, response, body) {
    res.set("Status", response.headers.status_code);
    res.set("status_code", response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};
exports.changeTripTypeWithReallocationInternalDriverToTrip = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  const reqBody = req.body;
  //console.log(reqBody);
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: CONST.changeTripTypeWithReallocationInternalDriverToTripUrl,
    headers: {
      uid: uid,
      access_token: access_token,
      client: client,
      featuretext: req.headers.featuretext,
      siteid: req.headers.siteid,
      "Content-Type": "application/json"
    },
    body: reqBody,
    method: "POST",
    json: true
  };

  function callback1(error, response, body) {
    //  console.log(error);
    //  console.log(body);
    //  console.log(response);
    //res.set('Status', response.headers.status_code);
    //res.set('status_code',response.headers.status_code);

    res.send(body);
  }
  request(options1, callback1);
  return false;
};


exports.cancelTrip = async (req, res) => {
  try {
    const reqBody = req.body.user;

    const uid = req.headers.uid;
    const access_token = req.headers.access_token;
    const client = req.headers.client;
    var options1 = {
      url: CONST.cancelTrip,
      headers: {
        uid: uid,
        access_token: access_token,
        client: client,
        "Content-Type": "application/json"
      },
      body: req.body,
      method: "POST",
      json: true
    };

    function callback1(error, response, body) {
      // console.log(error);
      // console.log(body);
      console.log(response.headers);
      //var tempRes = JSON.parse(body);

      res.set("Status", response.headers.status_code);
      res.set("status_code", response.headers.status_code);

      res.send(body);
    }
    //console.log(options1);
    request(options1, callback1);
    return false;
  } catch (e) {
    return e;
  }
};