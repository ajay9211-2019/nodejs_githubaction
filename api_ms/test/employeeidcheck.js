const chai = require('chai');
const request = require('request');
const assert = chai.assert;

const expect = require('chai').expect;
const requestUrl = require('../utils/constants')

describe('Duplicate Employee id check Unit Testing', ()=>{
    it('should return error if empId is not present in request body', (done) =>{
        //this.timeout(15000)
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/employee/employee_id",
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
    it('should return error if employee id is not unique', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/employee/employee_id",
            json : true,
            body : {
                "empId":"DMART01"
            }         
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return response if employee id is unique', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/employee/employee_id",
            json : true,
            body : {
                "empId":"DMART01"
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