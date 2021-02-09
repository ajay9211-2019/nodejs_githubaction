"use strict";

var userModel = require(appRoot + "/models/userModel");

var apiMiddleware = require(appRoot + "/middleware/middleware");

const _ = require(`lodash`);

const request = require("request");

const CONST = require("../utils/constants");
const base_url = process.env.BASE_URL_ROUTING;
const uat_url = process.env.UAT_URL;



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

exports.autoApprovalToNewRequest = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;
  const access_token = req.headers.access_token;
  const client = req.headers.client;

  var options1 = {
    url: `${process.env.BASE_URL_COMPLIANCE_MS}:8000/api/v1/autoApprovalToNewRequest`,
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