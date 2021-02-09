const chai = require('chai');
const request = require('request');
const assert = chai.assert;

const expect = require('chai').expect;

describe('Sites Add API Unit Testing', ()=>{
    it('should return error if name is repeated', (done) =>{
        //this.timeout(15000)
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/sites/add",
            json : true,
            body : {
                "name":"Test site",
                "latitude":19.1854,
                "longitude":"72.8585",
                "employeeCompanyId":93,
                "address1":"Malad, East",
                "phone1":"919776478892",
                "pin":400078,
                "state":"MAHARASHTRA",
                "city":"Mumbai",
                "partyBusinessArea":"Mumbai",
                "panNo":"BFEXB4433T",
                "gstinNo":"36ARVPS3698F1ZF",
                "partyContactName":"ABC",
                "partyAddress1":"Malad",
                "partyPin":400089,
                "partyCity":"Mumbai",
                "partyState":"MAHARASHTRA",
                "partyPhone1":"919898779989",
                "partyPanNo":"BCDFG8898E",
                "partyGstinNo":"27AAPFU0939F1ZV",
                "sez":"sez",
                "lutDate":"2020-05-11",
                "lutNo":"1213",
                "partyName":"Wework",
                "adminEmailId":"abc@gmail.com"
            }         
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if PAN is in wrong format', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/sites/add",
            json : true,
            body : {
                "name":"Test site",
                "latitude":19.1854,
                "longitude":"72.8585",
                "employeeCompanyId":93,
                "address1":"Malad, East",
                "phone1":"919776478892",
                "pin":400078,
                "state":"MAHARASHTRA",
                "city":"Mumbai",
                "partyBusinessArea":"Mumbai",
                "panNo":"BFEXB4433TT",
                "gstinNo":"36ARVPS3698F1ZF",
                "partyContactName":"ABC",
                "partyAddress1":"Malad",
                "partyPin":400089,
                "partyCity":"Mumbai",
                "partyState":"MAHARASHTRA",
                "partyPhone1":"919898779989",
                "partyPanNo":"BCDFG8898E",
                "partyGstinNo":"27AAPFU0939F1ZV",
                "sez":"sez",
                "lutDate":"2020-05-11",
                "lutNo":"1213",
                "partyName":"Wework",
                "adminEmailId":"abc@gmail.com"
            }         
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if partyPANNo is in wrong format', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/sites/add",
            json : true,
            body : {
                "name":"Test site",
                "latitude":19.1854,
                "longitude":"72.8585",
                "employeeCompanyId":93,
                "address1":"Malad, East",
                "phone1":"919776478892",
                "pin":400078,
                "state":"MAHARASHTRA",
                "city":"Mumbai",
                "partyBusinessArea":"Mumbai",
                "panNo":"BFEXB4433T",
                "gstinNo":"36ARVPS3698F1ZF",
                "partyContactName":"ABC",
                "partyAddress1":"Malad",
                "partyPin":400089,
                "partyCity":"Mumbai",
                "partyState":"MAHARASHTRA",
                "partyPhone1":"919898779989",
                "partyPanNo":"BCDFG8898EE",
                "partyGstinNo":"27AAPFU0939F1ZV",
                "sez":"sez",
                "lutDate":"2020-05-11",
                "lutNo":"1213",
                "partyName":"Wework",
                "adminEmailId":"abc@gmail.com"
            }    
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if GSTIN is in wrong format', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/sites/add",
            json : true,
            body : {
                "name":"Test site",
                "latitude":19.1854,
                "longitude":"72.8585",
                "employeeCompanyId":93,
                "address1":"Malad, East",
                "phone1":"919776478892",
                "pin":400078,
                "state":"MAHARASHTRA",
                "city":"Mumbai",
                "partyBusinessArea":"Mumbai",
                "panNo":"BFEXB4433T",
                "gstinNo":"36ARVPS3698F1ZFF",
                "partyContactName":"ABC",
                "partyAddress1":"Malad",
                "partyPin":400089,
                "partyCity":"Mumbai",
                "partyState":"MAHARASHTRA",
                "partyPhone1":"919898779989",
                "partyPanNo":"BCDFG8898E",
                "partyGstinNo":"27AAPFU0939F1ZV",
                "sez":"sez",
                "lutDate":"2020-05-11",
                "lutNo":"1213",
                "partyName":"Wework",
                "adminEmailId":"abc@gmail.com"
            }      
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if partyGSTIN is in wrong format', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/sites/add",
            json : true,
            body : {
                "name":"Test site",
                "latitude":19.1854,
                "longitude":"72.8585",
                "employeeCompanyId":93,
                "address1":"Malad, East",
                "phone1":"919776478892",
                "pin":400078,
                "state":"MAHARASHTRA",
                "city":"Mumbai",
                "partyBusinessArea":"Mumbai",
                "panNo":"BFEXB4433T",
                "gstinNo":"36ARVPS3698F1ZF",
                "partyContactName":"ABC",
                "partyAddress1":"Malad",
                "partyPin":400089,
                "partyCity":"Mumbai",
                "partyState":"MAHARASHTRA",
                "partyPhone1":"919898779989",
                "partyPanNo":"BCDFG8898E",
                "partyGstinNo":"27AAPFU0939F1ZVV",
                "sez":"sez",
                "lutDate":"2020-05-11",
                "lutNo":"1213",
                "partyName":"Wework",
                "adminEmailId":"abc@gmail.com"
            }    
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if phone is in wrong format', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/sites/add",
            json : true,
            body : {
                "name":"Test site",
                "latitude":19.1854,
                "longitude":"72.8585",
                "employeeCompanyId":93,
                "address1":"Malad, East",
                "phone1":"9776478892",
                "pin":400078,
                "state":"MAHARASHTRA",
                "city":"Mumbai",
                "partyBusinessArea":"Mumbai",
                "panNo":"BFEXB4433T",
                "gstinNo":"36ARVPS3698F1ZF",
                "partyContactName":"ABC",
                "partyAddress1":"Malad",
                "partyPin":400089,
                "partyCity":"Mumbai",
                "partyState":"MAHARASHTRA",
                "partyPhone1":"919898779989",
                "partyPanNo":"BCDFG8898E",
                "partyGstinNo":"27AAPFU0939F1ZV",
                "sez":"sez",
                "lutDate":"2020-05-11",
                "lutNo":"1213",
                "partyName":"Wework",
                "adminEmailId":"abc@gmail.com"
            }
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if party phone number is in wrong format', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/sites/add",
            json : true,
            body : {
                "name":"Test site",
                "latitude":19.1854,
                "longitude":"72.8585",
                "employeeCompanyId":93,
                "address1":"Malad, East",
                "phone1":"919776478892",
                "pin":400078,
                "state":"MAHARASHTRA",
                "city":"Mumbai",
                "partyBusinessArea":"Mumbai",
                "panNo":"BFEXB4433T",
                "gstinNo":"36ARVPS3698F1ZF",
                "partyContactName":"ABC",
                "partyAddress1":"Malad",
                "partyPin":400089,
                "partyCity":"Mumbai",
                "partyState":"MAHARASHTRA",
                "partyPhone1":"9898779989",
                "partyPanNo":"BCDFG8898E",
                "partyGstinNo":"27AAPFU0939F1ZV",
                "sez":"sez",
                "lutDate":"2020-05-11",
                "lutNo":"1213",
                "partyName":"Wework",
                "adminEmailId":"abc@gmail.com"
            }  
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if site name has special characters or numbers', (done) =>{ 
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/sites/add",
            json : true,
            body : {
                "name":"Test-site",
                "latitude":19.1854,
                "longitude":"72.8585",
                "employeeCompanyId":93,
                "address1":"Malad, East",
                "phone1":"919776478892",
                "pin":400078,
                "state":"MAHARASHTRA",
                "city":"Mumbai",
                "partyBusinessArea":"Mumbai",
                "panNo":"BFEXB4433T",
                "gstinNo":"36ARVPS3698F1ZF",
                "partyContactName":"ABC",
                "partyAddress1":"Malad",
                "partyPin":400089,
                "partyCity":"Mumbai",
                "partyState":"MAHARASHTRA",
                "partyPhone1":"919898779989",
                "partyPanNo":"BCDFG8898E",
                "partyGstinNo":"27AAPFU0939F1ZV",
                "sez":"sez",
                "lutDate":"2020-05-11",
                "lutNo":"1213",
                "partyName":"Wework",
                "adminEmailId":"abc@gmail.com"
            }
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if email format is wrong', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/sites/add",
            json : true,
            body : {
                "name":"Test site",
                "latitude":19.1854,
                "longitude":"72.8585",
                "employeeCompanyId":93,
                "address1":"Malad, East",
                "phone1":"919776478892",
                "pin":400078,
                "state":"MAHARASHTRA",
                "city":"Mumbai",
                "partyBusinessArea":"Mumbai",
                "panNo":"BFEXB4433T",
                "gstinNo":"36ARVPS3698F1ZF",
                "partyContactName":"ABC",
                "partyAddress1":"Malad",
                "partyPin":400089,
                "partyCity":"Mumbai",
                "partyState":"MAHARASHTRA",
                "partyPhone1":"919898779989",
                "partyPanNo":"BCDFG8898E",
                "partyGstinNo":"27AAPFU0939F1ZV",
                "sez":"sez",
                "lutDate":"2020-05-11",
                "lutNo":"1213",
                "partyName":"Wework",
                "adminEmailId":"abc"
            }
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return response if proper request is given', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/sites/add",
            json : true,
            body : {
                "name":"Test site",
                "latitude":19.1854,
                "longitude":"72.8585",
                "employeeCompanyId":93,
                "address1":"Malad, East",
                "phone1":"919776478892",
                "pin":400078,
                "state":"MAHARASHTRA",
                "city":"Mumbai",
                "partyBusinessArea":"Mumbai",
                "panNo":"BFEXB4433T",
                "gstinNo":"36ARVPS3698F1ZF",
                "partyContactName":"ABC",
                "partyAddress1":"Malad",
                "partyPin":400089,
                "partyCity":"Mumbai",
                "partyState":"MAHARASHTRA",
                "partyPhone1":"919898779989",
                "partyPanNo":"BCDFG8898E",
                "partyGstinNo":"27AAPFU0939F1ZV",
                "sez":"sez",
                "lutDate":"2020-05-11",
                "lutNo":"1213",
                "partyName":"Wework",
                "adminEmailId":"abc@gmail.com"
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