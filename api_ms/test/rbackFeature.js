const chai = require('chai');
const request = require('request');
const assert = chai.assert;

const expect = require('chai').expect;

describe('Rbac Feature API Unit Testing', ()=>{
    it('should return error if operation param value is wrong', (done) =>{
        //this.timeout(15000)
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/rback/feature/insert",
            json : true,
            body : {
                "operation":"insert1",
                "module_name":"Reports - Vendor Trip Distribution",
                "status":1,
                "check_string":"vendor_trip_dist"
            }          
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if module_name or status or check_string or feature_name is missing if operation is insert', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/rback/feature/insert",
            json : true,
            body : {
                "operation":"insert",
                "module_name":"Reports - Vendor Trip Distribution",
                "status":1,
                "check_string":"vendor_trp_dist_send_email"
            }         
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if feature_name or check_string is repeated in that module if operation is insert', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/rback/feature/insert",
            json : true,
            body : {
                "operation":"insert",
                "module_name":"Reports - Vendor Trip Distribution",
                "feature_name":"Vendor Trip Distribution - Send Email",
                "status":1,
                "check_string":"vendor_trp_dist_send_email"
            }       
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if module_name is wrong if operation is insert', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/rback/feature/insert",
            json : true,
            body : {
                "operation":"insert",
                "module_name":"Reports - Vendor Trip Distribution 2",
                "feature_name":"Vendor Trip Distribution - Send Email",
                "status":1,
                "check_string":"vendor_trp_dist_send_email"
            }       
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if id or update_fields or operation is missing if operation is update', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/rback/feature/update",
            json : true,
            body : {
                "operation": "update",
                "update_fields": {
                    "name": "Submit - Time Constraint"
                }
            }     
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if feature_id does not exist if operation is update', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/rback/feature/update",
            json : true,
            body : {
                "operation": "update",
                "id": 1008,
                "update_fields": {
                    "name": "Submit - Time Constraint"
                }
            }    
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if name or check_string is repeating if operation is update', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/rback/feature/update",
            json : true,
            body : {
                "operation": "update",
                "id": 8,
                "update_fields": {
                    "name": "Submit - Time Constraint",
                    "check_string":"finalize"
                }
            }  
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if feature name does not exist when operation is delete', (done) =>{ 
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/rback/feature/delete",
            json : true,
            body : {
                "operation": "delete",
                "name": "abc",
                "status":1
            }
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if name or status or operation is missing when operation is delete', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/rback/feature/delete",
            json : true,
            body : {
                "operation": "delete",
                "status":1
            }
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if module_name or operation is missing when operation is read', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/rback/feature/read",
            json : true,
            body : {
                "operation": "read"
            }
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return response operation is read with proper parameters', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/rback/feature/read",
            json : true,
            body : {
                "operation":"read",
                "module_name":"Routing"
            }
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return response operation is delete with proper parameters', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/rback/feature/delete",
            json : true,
            body : {
                "operation": "delete",
                "name": "Add Vehicle",
                "status":0
            }
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return response operation is update with proper parameters', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/rback/feature/update",
            json : true,
            body : {
                "operation": "update",
                "id": 8,
                "update_fields": {
                    "name": "Submit - Time Constraint"
                }
            }
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return response operation is insert with proper parameters', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/rback/feature/insert",
            json : true,
            body : {
                "operation":"insert",
                "module_name":"Reports - Vendor Trip Distribution",
                "feature_name":"Vendor Trip Distribution - Send Email 3",
                "status":1,
                "check_string":"vendor_trp_dist_send_email_3"
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