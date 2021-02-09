const chai = require('chai');
const request = require('request');
const assert = chai.assert;

const expect = require('chai').expect;
const requestUrl = require('../utils/constants')

describe('Duplicate Employee email id check Unit Testing', ()=>{
    it('should return error if emailId is not present in request body', (done) =>{
        //this.timeout(15000)
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/employee/emailId",
            json : true,
            body : {
            }         
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if employee email id is not unique', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/employee/emailId",
            json : true,
            body : {
                "emailId":"dmart2@gmail.com"
            }         
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return response if employee email id is unique', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/employee/emailId",
            json : true,
            body : {
                "emailId":"dmart200000000000000000@gmail.com"
            }         
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return response if employee email id is unique and id is given in request body', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/employee/emailId",
            json : true,
            body : {
                "id" : "7934",
                "emailId":"dmart200000000000000000@gmail.com"
            }         
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if employee email id is not unique and id is given in request body', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/employee/emailId",
            json : true,
            body : {
                "id" : "7934",
                "emailId":"dmart2@gmail.com"
            }         
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
})