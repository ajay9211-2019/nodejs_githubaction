const chai = require('chai');
const request = require('request');
const assert = chai.assert;

const expect = require('chai').expect;

describe('Sites Update API Unit Testing', ()=>{
    it('should return error if name is repeated', (done) =>{
        //this.timeout(15000)
        request.patch({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/sites/update",
            json : true,
            body : {
                "siteId":188,
                "name":"Test sitee",
                "latitude":19.1854,
                "longitude":"72.8585",
                "employeeCompanyId":93,
                "address":"",
                "phone":"",
                "branchName":"ABC",
                "siteCode":"1234",
                "contactName":"def",
                "address2":"mumbai",
                "address3":"mah",
                "phone2":"",
                "businessArea":"mum",
                "address1":"Malad, East",
                "phone1":"919776478892",
                "pin":400078,
                "state":"MAHARASHTRA",
                "city":"Mumbai",
                "partyBusinessArea":"Mumbai",
                "panNo":"BFEXB4433T",
                "gstinNo":"36ARVPS3698F1ZF",
                "costCentre":"costCentre",
                "profitCentre":"profitCentre",
                "glAccNo":"glAccNo",
                "partyCode":"partyCode",
                "partyContactName":"ABC",
                "partyAddress1":"Malad",
                "partyAddress2":"mum",
                "partyAddress3":"mah",
                "partyPhone2":"",
                "contactEmail":"",
                "active":"Yes",
                "proximityRadius":"",
                "sapControlNumber":"",
                "contact_phone":"",
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
                "adminEmailId":"abc@gmail.com",
                "adminName":"Shanti"
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
        request.patch({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/sites/update",
            json : true,
            body : {
                "siteId":188,
                "name":"Test sitee",
                "latitude":19.1854,
                "longitude":"72.8585",
                "employeeCompanyId":93,
                "address":"",
                "phone":"",
                "branchName":"ABC",
                "siteCode":"1234",
                "contactName":"def",
                "address2":"mumbai",
                "address3":"mah",
                "phone2":"",
                "businessArea":"mum",
                "address1":"Malad, East",
                "phone1":"919776478892",
                "pin":400078,
                "state":"MAHARASHTRA",
                "city":"Mumbai",
                "partyBusinessArea":"Mumbai",
                "panNo":"BFEXB4433TF",
                "gstinNo":"36ARVPS3698F1ZF",
                "costCentre":"costCentre",
                "profitCentre":"profitCentre",
                "glAccNo":"glAccNo",
                "partyCode":"partyCode",
                "partyContactName":"ABC",
                "partyAddress1":"Malad",
                "partyAddress2":"mum",
                "partyAddress3":"mah",
                "partyPhone2":"",
                "contactEmail":"",
                "active":"Yes",
                "proximityRadius":"",
                "sapControlNumber":"",
                "contact_phone":"",
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
                "adminEmailId":"abc@gmail.com",
                "adminName":"Shanti"
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
        request.patch({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/sites/update",
            json : true,
            body : {
                "siteId":188,
                "name":"Test sitee",
                "latitude":19.1854,
                "longitude":"72.8585",
                "employeeCompanyId":93,
                "address":"",
                "phone":"",
                "branchName":"ABC",
                "siteCode":"1234",
                "contactName":"def",
                "address2":"mumbai",
                "address3":"mah",
                "phone2":"",
                "businessArea":"mum",
                "address1":"Malad, East",
                "phone1":"919776478892",
                "pin":400078,
                "state":"MAHARASHTRA",
                "city":"Mumbai",
                "partyBusinessArea":"Mumbai",
                "panNo":"BFEXB4433T",
                "gstinNo":"36ARVPS3698F1ZF",
                "costCentre":"costCentre",
                "profitCentre":"profitCentre",
                "glAccNo":"glAccNo",
                "partyCode":"partyCode",
                "partyContactName":"ABC",
                "partyAddress1":"Malad",
                "partyAddress2":"mum",
                "partyAddress3":"mah",
                "partyPhone2":"",
                "contactEmail":"",
                "active":"Yes",
                "proximityRadius":"",
                "sapControlNumber":"",
                "contact_phone":"",
                "partyPin":400089,
                "partyCity":"Mumbai",
                "partyState":"MAHARASHTRA",
                "partyPhone1":"919898779989",
                "partyPanNo":"BCDFG8898E9",
                "partyGstinNo":"27AAPFU0939F1ZV",
                "sez":"sez",
                "lutDate":"2020-05-11",
                "lutNo":"1213",
                "partyName":"Wework",
                "adminEmailId":"abc@gmail.com",
                "adminName":"Shanti"
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
        request.patch({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/sites/update",
            json : true,
            body : {
                "siteId":188,
                "name":"Test sitee",
                "latitude":19.1854,
                "longitude":"72.8585",
                "employeeCompanyId":93,
                "address":"",
                "phone":"",
                "branchName":"ABC",
                "siteCode":"1234",
                "contactName":"def",
                "address2":"mumbai",
                "address3":"mah",
                "phone2":"",
                "businessArea":"mum",
                "address1":"Malad, East",
                "phone1":"919776478892",
                "pin":400078,
                "state":"MAHARASHTRA",
                "city":"Mumbai",
                "partyBusinessArea":"Mumbai",
                "panNo":"BFEXB4433T",
                "gstinNo":"36ARVPS3698F1ZFV",
                "costCentre":"costCentre",
                "profitCentre":"profitCentre",
                "glAccNo":"glAccNo",
                "partyCode":"partyCode",
                "partyContactName":"ABC",
                "partyAddress1":"Malad",
                "partyAddress2":"mum",
                "partyAddress3":"mah",
                "partyPhone2":"",
                "contactEmail":"",
                "active":"Yes",
                "proximityRadius":"",
                "sapControlNumber":"",
                "contact_phone":"",
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
                "adminEmailId":"abc@gmail.com",
                "adminName":"Shanti"
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
        request.patch({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/sites/update",
            json : true,
            body : {
               
                "siteId":188,
                "name":"Test sitee",
                "latitude":19.1854,
                "longitude":"72.8585",
                "employeeCompanyId":93,
                "address":"",
                "phone":"",
                "branchName":"ABC",
                "siteCode":"1234",
                "contactName":"def",
                "address2":"mumbai",
                "address3":"mah",
                "phone2":"",
                "businessArea":"mum",
                "address1":"Malad, East",
                "phone1":"919776478892",
                "pin":400078,
                "state":"MAHARASHTRA",
                "city":"Mumbai",
                "partyBusinessArea":"Mumbai",
                "panNo":"BFEXB4433T",
                "gstinNo":"36ARVPS3698F1ZF",
                "costCentre":"costCentre",
                "profitCentre":"profitCentre",
                "glAccNo":"glAccNo",
                "partyCode":"partyCode",
                "partyContactName":"ABC",
                "partyAddress1":"Malad",
                "partyAddress2":"mum",
                "partyAddress3":"mah",
                "partyPhone2":"",
                "contactEmail":"",
                "active":"Yes",
                "proximityRadius":"",
                "sapControlNumber":"",
                "contact_phone":"",
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
                "adminEmailId":"abc@gmail.com",
                "adminName":"Shanti"
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
        request.patch({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/sites/update",
            json : true,
            body : {  
                "siteId":188,
                "name":"Test sitee",
                "latitude":19.1854,
                "longitude":"72.8585",
                "employeeCompanyId":93,
                "address":"",
                "phone":"",
                "branchName":"ABC",
                "siteCode":"1234",
                "contactName":"def",
                "address2":"mumbai",
                "address3":"mah",
                "phone2":"",
                "businessArea":"mum",
                "address1":"Malad, East",
                "phone1":"919776478892",
                "pin":400078,
                "state":"MAHARASHTRA",
                "city":"Mumbai",
                "partyBusinessArea":"Mumbai",
                "panNo":"BFEXB4433T",
                "gstinNo":"36ARVPS3698F1ZF",
                "costCentre":"costCentre",
                "profitCentre":"profitCentre",
                "glAccNo":"glAccNo",
                "partyCode":"partyCode",
                "partyContactName":"ABC",
                "partyAddress1":"Malad",
                "partyAddress2":"mum",
                "partyAddress3":"mah",
                "partyPhone2":"",
                "contactEmail":"",
                "active":"Yes",
                "proximityRadius":"",
                "sapControlNumber":"",
                "contact_phone":"",
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
                "adminEmailId":"abc@gmail.com",
                "adminName":"Shanti"
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
        request.patch({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/sites/update",
            json : true,
            body : {
                
                "siteId":188,
                "name":"Test sitee",
                "latitude":19.1854,
                "longitude":"72.8585",
                "employeeCompanyId":93,
                "address":"",
                "phone":"",
                "branchName":"ABC",
                "siteCode":"1234",
                "contactName":"def",
                "address2":"mumbai",
                "address3":"mah",
                "phone2":"",
                "businessArea":"mum",
                "address1":"Malad, East",
                "phone1":"919776478892",
                "pin":400078,
                "state":"MAHARASHTRA",
                "city":"Mumbai",
                "partyBusinessArea":"Mumbai",
                "panNo":"BFEXB4433T",
                "gstinNo":"36ARVPS3698F1ZF",
                "costCentre":"costCentre",
                "profitCentre":"profitCentre",
                "glAccNo":"glAccNo",
                "partyCode":"partyCode",
                "partyContactName":"ABC",
                "partyAddress1":"Malad",
                "partyAddress2":"mum",
                "partyAddress3":"mah",
                "partyPhone2":"",
                "contactEmail":"",
                "active":"Yes",
                "proximityRadius":"",
                "sapControlNumber":"",
                "contact_phone":"",
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
                "adminEmailId":"abc@gmail.com",
                "adminName":"Shanti"
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
        request.patch({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/sites/update",
            json : true,
            body : {
                "siteId":188,
                "name":"Test--sitee",
                "latitude":19.1854,
                "longitude":"72.8585",
                "employeeCompanyId":93,
                "address":"",
                "phone":"",
                "branchName":"ABC",
                "siteCode":"1234",
                "contactName":"def",
                "address2":"mumbai",
                "address3":"mah",
                "phone2":"",
                "businessArea":"mum",
                "address1":"Malad, East",
                "phone1":"919776478892",
                "pin":400078,
                "state":"MAHARASHTRA",
                "city":"Mumbai",
                "partyBusinessArea":"Mumbai",
                "panNo":"BFEXB4433T",
                "gstinNo":"36ARVPS3698F1ZF",
                "costCentre":"costCentre",
                "profitCentre":"profitCentre",
                "glAccNo":"glAccNo",
                "partyCode":"partyCode",
                "partyContactName":"ABC",
                "partyAddress1":"Malad",
                "partyAddress2":"mum",
                "partyAddress3":"mah",
                "partyPhone2":"",
                "contactEmail":"",
                "active":"Yes",
                "proximityRadius":"",
                "sapControlNumber":"",
                "contact_phone":"",
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
                "adminEmailId":"abc@gmail.com",
                "adminName":"Shanti"
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
        request.patch({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/sites/update",
            json : true,
            body : {
                "siteId":188,
                "name":"Test sitee",
                "latitude":19.1854,
                "longitude":"72.8585",
                "employeeCompanyId":93,
                "address":"",
                "phone":"",
                "branchName":"ABC",
                "siteCode":"1234",
                "contactName":"def",
                "address2":"mumbai",
                "address3":"mah",
                "phone2":"",
                "businessArea":"mum",
                "address1":"Malad, East",
                "phone1":"919776478892",
                "pin":400078,
                "state":"MAHARASHTRA",
                "city":"Mumbai",
                "partyBusinessArea":"Mumbai",
                "panNo":"BFEXB4433T",
                "gstinNo":"36ARVPS3698F1ZF",
                "costCentre":"costCentre",
                "profitCentre":"profitCentre",
                "glAccNo":"glAccNo",
                "partyCode":"partyCode",
                "partyContactName":"ABC",
                "partyAddress1":"Malad",
                "partyAddress2":"mum",
                "partyAddress3":"mah",
                "partyPhone2":"",
                "contactEmail":"",
                "active":"Yes",
                "proximityRadius":"",
                "sapControlNumber":"",
                "contact_phone":"",
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
                "adminEmailId":"abc",
                "adminName":"Shanti"
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
        request.patch({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/sites/update",
            json : true,
            body : {
                "siteId":188,
                "name":"Test sitee",
                "latitude":19.1854,
                "longitude":"72.8585",
                "employeeCompanyId":93,
                "address":"",
                "phone":"",
                "branchName":"ABC",
                "siteCode":"1234",
                "contactName":"def",
                "address2":"mumbai",
                "address3":"mah",
                "phone2":"",
                "businessArea":"mum",
                "address1":"Malad, East",
                "phone1":"919776478892",
                "pin":400078,
                "state":"MAHARASHTRA",
                "city":"Mumbai",
                "partyBusinessArea":"Mumbai",
                "panNo":"BFEXB4433T",
                "gstinNo":"36ARVPS3698F1ZF",
                "costCentre":"costCentre",
                "profitCentre":"profitCentre",
                "glAccNo":"glAccNo",
                "partyCode":"partyCode",
                "partyContactName":"ABC",
                "partyAddress1":"Malad",
                "partyAddress2":"mum",
                "partyAddress3":"mah",
                "partyPhone2":"",
                "contactEmail":"",
                "active":"Yes",
                "proximityRadius":"",
                "sapControlNumber":"",
                "contact_phone":"",
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
                "adminEmailId":"abc@gmail.com",
                "adminName":"Shanti"
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