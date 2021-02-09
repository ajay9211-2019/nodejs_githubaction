"use strict";

const _ = require(`lodash`);
const request = require('request');
const CONST = require('../utils/constants');

exports.createConstraint = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;

  var options1 = {
    url: CONST.createConstraint,
    headers: {
      'uid': uid,
      'Content-Type': 'application/json'
    },
    body: reqBody,
    method: "POST",
    json: true
  }

  function callback1(error, response, body) {
    res.set('Status', response.headers.status_code || response.headers.status);
    res.set('status_code', response.headers.status_code || response.headers.status);
    res.send(body);
  }

  request(options1, callback1);
  return false;

}

exports.updateConstraint = async (req, res) => {
  const reqBody = req.body;
  const uid = req.headers.uid;

  var options1 = {
    url: CONST.updateConstraint,
    headers: {
      'uid': uid,
      'Content-Type': 'application/json'
    },
    body: reqBody,
    method: "POST",
    json: true
  }

  function callback1(error, response, body) {
    res.set('Status', response.headers.status_code || response.headers.status);
    res.set('status_code', response.headers.status_code || response.headers.status);
    res.send(body);
  }
  request(options1, callback1);
  return false;

}

exports.getAllContraints = async (req, res) => {
  const uid = req.headers.uid;

  var options1 = {
    url: CONST.getAllContraints,
    headers: {
      'uid': uid,
      'Content-Type': 'application/json'
    },
    method: "GET",
    json: true
  }

  function callback1(error, response, body) {
    res.set('Status', response.headers.status_code || response.headers.status);
    res.set('status_code', response.headers.status_code || response.headers.status);

    res.send(body);
  }
  request(options1, callback1);
  return false;

}

exports.getAllContraintsForSite = async (req, res) => {

  const uid = req.headers.uid;

  var options1 = {
    url: CONST.getAllContraintsForSite + req.params.siteId,
    headers: {
      'uid': uid,
      'Content-Type': 'application/json'
    },
    method: "GET",
    json: true
  }

  function callback1(error, response, body) {
    res.set('Status', response.headers.status_code || response.headers.status);
    res.set('status_code', response.headers.status_code || response.headers.status);

    res.send(body);
  }
  request(options1, callback1);
  return false;

}

exports.getContraintById = async (req, res) => {

  const uid = req.headers.uid;

  var options1 = {
    url: CONST.getContraintById + req.params.id,
    headers: {
      'uid': uid,
      'Content-Type': 'application/json'
    },
    method: "GET",
    json: true
  }

  function callback1(error, response, body) {
    res.set('Status', response.headers.status_code || response.headers.status);
    res.set('status_code', response.headers.status_code || response.headers.status);

    res.send(body);
  }
  request(options1, callback1);
  return false;

}

exports.deleteConstraints = async (req, res) => {

  const uid = req.headers.uid;

  var options1 = {
    url: CONST.deleteConstraints + req.params.id,
    headers: {
      'uid': uid,
      'Content-Type': 'application/json'
    },
    method: "GET",
    json: true
  }

  function callback1(error, response, body) {
    res.set('Status', response.headers.status_code || response.headers.status);
    res.set('status_code', response.headers.status_code || response.headers.status);

    res.send(body);
  }
  request(options1, callback1);
  return false;

}