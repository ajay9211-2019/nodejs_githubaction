const chai = require('chai');
const request = require('request');
const assert = chai.assert;

const expect = require('chai').expect;
const requestUrl = require('../utils/constants')

describe('Activate Deactivate Shift Unit Testing', ()=>{
    it('should return error if there are upcoming trips for that shift', (done) =>{
        //this.timeout(15000)
        request.get({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/shifts/active/620"
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if shift id is invalid', (done) =>{
        request.get({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/shifts/active/6200"
        }, (err, res) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return response if proper shift id is passed and no upcoming trips are present', (done) =>{
        request.get({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/shifts/active/619"
        }, (err, res) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
})