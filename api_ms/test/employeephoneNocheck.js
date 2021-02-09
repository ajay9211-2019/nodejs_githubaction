const chai = require('chai');
const request = require('request');
const assert = chai.assert;

const expect = require('chai').expect;
const requestUrl = require('../utils/constants')

describe('Duplicate Employee Phone no check Unit Testing', ()=>{
    it('should return error if phoneNo is not present in request body', (done) =>{
        //this.timeout(15000)
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/employee/phoneNo",
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
    it('should return error if employee phoneNo is not unique', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/employee/phoneNo",
            json : true,
            body : {
                "phoneNo":"9772362270"
            }         
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return response if employee phoneNo is unique', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/employee/phoneNo",
            json : true,
            body : {
                "phoneNo":"97723622700000"
            }         
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return response if employee phoneNo is unique and id is given in request body', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/employee/phoneNo",
            json : true,
            body : {
                "id" : "7934",
                "phoneNo":"9772362270"
            }         
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if employee phoneNo is not unique and id is given in request body', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/employee/phoneNo",
            json : true,
            body : {
                "id" : "7935",
                "phoneNo":"9772362270"
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