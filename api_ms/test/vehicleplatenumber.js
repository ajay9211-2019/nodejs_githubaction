const chai = require('chai');
const request = require('request');
const assert = chai.assert;

const expect = require('chai').expect;

describe('Check vehicle plate number API Unit Testing', ()=>{
    it('should return error if id is absent', (done) =>{
        //this.timeout(15000)
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/vehicles/validate-plate-number",
            json : true,
            body : {
                "plate_number":"DGJHGFR13456111111"
            }         
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(307, res.statusCode)
            done()
        })
    })
    it('should return error if plate number is absent in request body', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/vehicles/validate-plate-number",
            json : true,
            body : {
                "id":"1075"
            }         
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(307, res.statusCode)
            done()
        })
    })
    it('should return response if plate number is repeated', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/vehicles/validate-plate-number",
            json : true,
            body : {
                "id":"-1",
                "plate_number":"DGJHGFR13456"
            }    
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(307, res.statusCode)
            done()
        })
    })
    it('should return response if plate number is unique', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/vehicles/validate-plate-number",
            json : true,
            body : {
                "id":"1075",
                "plate_number":"DGJHGFR13456111111"
            }      
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(307, res.statusCode)
            done()
        })
    })
})

describe('Get vehicle model API Unit Testing', ()=>{
    it('should return response', (done) =>{
        //this.timeout(15000)
        request.get({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/vehicles/models",
            json : true   
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
})