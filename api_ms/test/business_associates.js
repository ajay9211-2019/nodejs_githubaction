const chai = require('chai');
const request = require('request');
const assert = chai.assert;

const expect = require('chai').expect;

describe('Add BA API Unit Testing', ()=>{
    it('should return error if companyName is missing', (done) =>{
        //this.timeout(15000)
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/business_associate/add",
            json : true,
            body : {
                "emailId": "HARIkrishna45@gmail.com",
                "baId": "19bdb13747ccd4921f1580bwe",
                "mobileNo": "7845645659",
                "panNo": "ECDPK6765Q",
                "contactPerson": "prakash",
                "cinNo": "",
                "landline": null,
                "addressLine1": "3A,PR layout",
                "addressLine2": "Indore",
                "pinCode": 870098,
                "contactPersonMobile": "7674837573",
                "approvedTill": "2019-10-04T00:00:00.000Z",
                "oldSapMasterCode": null,
                "newSapMasterCode": null,
                "baVerifiedOn": null,
                "city": "Achanta",
                "state": "Uttar Pradesh",
                "stateCode": "UP",
                "businessType":"Logistics",
                "hqAddress":"Mumbai",
                "bussinessAera": [
                    "Transportation",
                    "People Transportaion",
                    "Man Power"
                ],
                "isGst": 0,
                "docs": [
                    {
                        "docName": "Cancelled Cheque",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1566281139728_cancelled-cheque.png"
                    },
                    {
                        "docName": "CIN Number",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1566281172616_cin-number.png"
                    },
                    {
                        "docName": "Declaration",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568030722211_declaration.jpg"
                    },
                    {
                        "docName": "Company PAN",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1567681879581_company-pan.pdf"
                    },
                    {
                        "docName": "MSMED",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568031120626_msmed.jpg"
                    }
                ],
                "gstDocs": [
                    {
                        "state": "Assam",
                        "path": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568031154101_Assam_gst.jpg",
                        "docNumber": " Htsf",
                        "oldSapCode": "",
                        "newSapCode": ""
                    }
                ]
            }
                  
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if mobile number is missing in request body ', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/business_associate/add",
            json : true,
            body : {
                "emailId": "HARIkrishna45@gmail.com",
                "baId": "19bdb13747ccd4921f1580bwe",
                "companyName": "mlllllllllll",
                "panNo": "ECDPK6765Q",
                "contactPerson": "prakash",
                "cinNo": "",
                "landline": null,
                "addressLine1": "3A,PR layout",
                "addressLine2": "Indore",
                "pinCode": 870098,
                "contactPersonMobile": "7674837573",
                "approvedTill": "2019-10-04T00:00:00.000Z",
                "oldSapMasterCode": null,
                "newSapMasterCode": null,
                "baVerifiedOn": null,
                "city": "Achanta",
                "state": "Uttar Pradesh",
                "stateCode": "UP",
                "businessType":"Logistics",
                "hqAddress":"Mumbai",
                "bussinessAera": [
                    "Transportation",
                    "People Transportaion",
                    "Man Power"
                ],
                "isGst": 0,
                "docs": [
                    {
                        "docName": "Cancelled Cheque",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1566281139728_cancelled-cheque.png"
                    },
                    {
                        "docName": "CIN Number",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1566281172616_cin-number.png"
                    },
                    {
                        "docName": "Declaration",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568030722211_declaration.jpg"
                    },
                    {
                        "docName": "Company PAN",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1567681879581_company-pan.pdf"
                    },
                    {
                        "docName": "MSMED",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568031120626_msmed.jpg"
                    }
                ],
                "gstDocs": [
                    {
                        "state": "Assam",
                        "path": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568031154101_Assam_gst.jpg",
                        "docNumber": " Htsf",
                        "oldSapCode": "",
                        "newSapCode": ""
                    }
                ]
            }
                 
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if pan format is wrong', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/business_associate/add",
            json : true,
            body : {
                "emailId": "HARIkrishna45@gmail.com",
                "baId": "19bdb13747ccd4921f1580bwe",
                "mobileNo": "7845645659",
                "companyName": "mlllllllllll",
                "panNo": "ECDPK6765QW",
                "contactPerson": "prakash",
                "cinNo": "",
                "landline": null,
                "addressLine1": "3A,PR layout",
                "addressLine2": "Indore",
                "pinCode": 870098,
                "contactPersonMobile": "7674837573",
                "approvedTill": "2019-10-04T00:00:00.000Z",
                "oldSapMasterCode": null,
                "newSapMasterCode": null,
                "baVerifiedOn": null,
                "city": "Achanta",
                "state": "Uttar Pradesh",
                "stateCode": "UP",
                "businessType":"Logistics",
                "hqAddress":"Mumbai",
                "bussinessAera": [
                    "Transportation",
                    "People Transportaion",
                    "Man Power"
                ],
                "isGst": 0,
                "docs": [
                    {
                        "docName": "Cancelled Cheque",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1566281139728_cancelled-cheque.png"
                    },
                    {
                        "docName": "CIN Number",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1566281172616_cin-number.png"
                    },
                    {
                        "docName": "Declaration",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568030722211_declaration.jpg"
                    },
                    {
                        "docName": "Company PAN",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1567681879581_company-pan.pdf"
                    },
                    {
                        "docName": "MSMED",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568031120626_msmed.jpg"
                    }
                ],
                "gstDocs": [
                    {
                        "state": "Assam",
                        "path": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568031154101_Assam_gst.jpg",
                        "docNumber": " Htsf",
                        "oldSapCode": "",
                        "newSapCode": ""
                    }
                ]
            }               
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if email id is in wrong format', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/business_associate/add",
            json : true,
            body : {
                "emailId": "HARIkrishna45",
                "baId": "19bdb13747ccd4921f1580bwe",
                "mobileNo": "7845645659",
                "companyName": "mlllllllllll",
                "panNo": "ECDPK6765Q",
                "contactPerson": "prakash",
                "cinNo": "",
                "landline": null,
                "addressLine1": "3A,PR layout",
                "addressLine2": "Indore",
                "pinCode": 870098,
                "contactPersonMobile": "7674837573",
                "approvedTill": "2019-10-04T00:00:00.000Z",
                "oldSapMasterCode": null,
                "newSapMasterCode": null,
                "baVerifiedOn": null,
                "city": "Achanta",
                "state": "Uttar Pradesh",
                "stateCode": "UP",
                "businessType":"Logistics",
                "hqAddress":"Mumbai",
                "bussinessAera": [
                    "Transportation",
                    "People Transportaion",
                    "Man Power"
                ],
                "isGst": 0,
                "docs": [
                    {
                        "docName": "Cancelled Cheque",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1566281139728_cancelled-cheque.png"
                    },
                    {
                        "docName": "CIN Number",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1566281172616_cin-number.png"
                    },
                    {
                        "docName": "Declaration",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568030722211_declaration.jpg"
                    },
                    {
                        "docName": "Company PAN",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1567681879581_company-pan.pdf"
                    },
                    {
                        "docName": "MSMED",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568031120626_msmed.jpg"
                    }
                ],
                "gstDocs": [
                    {
                        "state": "Assam",
                        "path": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568031154101_Assam_gst.jpg",
                        "docNumber": " Htsf",
                        "oldSapCode": "",
                        "newSapCode": ""
                    }
                ]
            }
               
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if contact mobile phone is in wrong format', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/business_associate/add",
            json : true,
            body : {
                "emailId": "HARIkrishna45@gmail.com",
                "baId": "19bdb13747ccd4921f1580bwe",
                "mobileNo": "7845645659",
                "companyName": "mlllllllllll",
                "panNo": "ECDPK6765Q",
                "contactPerson": "prakash",
                "cinNo": "",
                "landline": null,
                "addressLine1": "3A,PR layout",
                "addressLine2": "Indore",
                "pinCode": 870098,
                "contactPersonMobile": "767483757999993",
                "approvedTill": "2019-10-04T00:00:00.000Z",
                "oldSapMasterCode": null,
                "newSapMasterCode": null,
                "baVerifiedOn": null,
                "city": "Achanta",
                "state": "Uttar Pradesh",
                "stateCode": "UP",
                "businessType":"Logistics",
                "hqAddress":"Mumbai",
                "bussinessAera": [
                    "Transportation",
                    "People Transportaion",
                    "Man Power"
                ],
                "isGst": 0,
                "docs": [
                    {
                        "docName": "Cancelled Cheque",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1566281139728_cancelled-cheque.png"
                    },
                    {
                        "docName": "CIN Number",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1566281172616_cin-number.png"
                    },
                    {
                        "docName": "Declaration",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568030722211_declaration.jpg"
                    },
                    {
                        "docName": "Company PAN",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1567681879581_company-pan.pdf"
                    },
                    {
                        "docName": "MSMED",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568031120626_msmed.jpg"
                    }
                ],
                "gstDocs": [
                    {
                        "state": "Assam",
                        "path": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568031154101_Assam_gst.jpg",
                        "docNumber": " Htsf",
                        "oldSapCode": "",
                        "newSapCode": ""
                    }
                ]
            }           
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if firstname has special characters', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/business_associate/add",
            json : true,
            body : {
                "emailId": "HARIkrishna45@gmail.com",
                "firstName":"rtcd---!@",
                "baId": "19bdb13747ccd4921f1580bwe",
                "mobileNo": "7845645659",
                "companyName": "mlllllllllll",
                "panNo": "ECDPK6765Q",
                "contactPerson": "prakash",
                "cinNo": "",
                "landline": null,
                "addressLine1": "3A,PR layout",
                "addressLine2": "Indore",
                "pinCode": 870098,
                "contactPersonMobile": "7674837573",
                "approvedTill": "2019-10-04T00:00:00.000Z",
                "oldSapMasterCode": null,
                "newSapMasterCode": null,
                "baVerifiedOn": null,
                "city": "Achanta",
                "state": "Uttar Pradesh",
                "stateCode": "UP",
                "businessType":"Logistics",
                "hqAddress":"Mumbai",
                "bussinessAera": [
                    "Transportation",
                    "People Transportaion",
                    "Man Power"
                ],
                "isGst": 0,
                "docs": [
                    {
                        "docName": "Cancelled Cheque",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1566281139728_cancelled-cheque.png"
                    },
                    {
                        "docName": "CIN Number",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1566281172616_cin-number.png"
                    },
                    {
                        "docName": "Declaration",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568030722211_declaration.jpg"
                    },
                    {
                        "docName": "Company PAN",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1567681879581_company-pan.pdf"
                    },
                    {
                        "docName": "MSMED",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568031120626_msmed.jpg"
                    }
                ],
                "gstDocs": [
                    {
                        "state": "Assam",
                        "path": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568031154101_Assam_gst.jpg",
                        "docNumber": " Htsf",
                        "oldSapCode": "",
                        "newSapCode": ""
                    }
                ]
            }            
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if middle name is having special characters', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/business_associate/add",
            json : true,
            body : {
                "emailId": "HARIkrishna45@gmail.com",
                "middleName": "ghdf%^7",
                "baId": "19bdb13747ccd4921f1580bwe",
                "mobileNo": "7845645659",
                "companyName": "mlllllllllll",
                "panNo": "ECDPK6765Q",
                "contactPerson": "prakash",
                "cinNo": "",
                "landline": null,
                "addressLine1": "3A,PR layout",
                "addressLine2": "Indore",
                "pinCode": 870098,
                "contactPersonMobile": "7674837573",
                "approvedTill": "2019-10-04T00:00:00.000Z",
                "oldSapMasterCode": null,
                "newSapMasterCode": null,
                "baVerifiedOn": null,
                "city": "Achanta",
                "state": "Uttar Pradesh",
                "stateCode": "UP",
                "businessType":"Logistics",
                "hqAddress":"Mumbai",
                "bussinessAera": [
                    "Transportation",
                    "People Transportaion",
                    "Man Power"
                ],
                "isGst": 0,
                "docs": [
                    {
                        "docName": "Cancelled Cheque",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1566281139728_cancelled-cheque.png"
                    },
                    {
                        "docName": "CIN Number",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1566281172616_cin-number.png"
                    },
                    {
                        "docName": "Declaration",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568030722211_declaration.jpg"
                    },
                    {
                        "docName": "Company PAN",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1567681879581_company-pan.pdf"
                    },
                    {
                        "docName": "MSMED",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568031120626_msmed.jpg"
                    }
                ],
                "gstDocs": [
                    {
                        "state": "Assam",
                        "path": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568031154101_Assam_gst.jpg",
                        "docNumber": " Htsf",
                        "oldSapCode": "",
                        "newSapCode": ""
                    }
                ]
            }
          
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return error if company name is repeated', (done) =>{ 
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/business_associate/add",
            json : true,
            body : {
                "emailId": "HARIkrishna45@gmail.com",
                "baId": "19bdb13747ccd4921f1580bwe",
                "mobileNo": "7845645659",
                "companyName": "mlll",
                "panNo": "ECDPK6765Q",
                "contactPerson": "prakash",
                "cinNo": "",
                "landline": null,
                "addressLine1": "3A,PR layout",
                "addressLine2": "Indore",
                "pinCode": 870098,
                "contactPersonMobile": "7674837573",
                "approvedTill": "2019-10-04T00:00:00.000Z",
                "oldSapMasterCode": null,
                "newSapMasterCode": null,
                "baVerifiedOn": null,
                "city": "Achanta",
                "state": "Uttar Pradesh",
                "stateCode": "UP",
                "businessType":"Logistics",
                "hqAddress":"Mumbai",
                "bussinessAera": [
                    "Transportation",
                    "People Transportaion",
                    "Man Power"
                ],
                "isGst": 0,
                "docs": [
                    {
                        "docName": "Cancelled Cheque",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1566281139728_cancelled-cheque.png"
                    },
                    {
                        "docName": "CIN Number",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1566281172616_cin-number.png"
                    },
                    {
                        "docName": "Declaration",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568030722211_declaration.jpg"
                    },
                    {
                        "docName": "Company PAN",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1567681879581_company-pan.pdf"
                    },
                    {
                        "docName": "MSMED",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568031120626_msmed.jpg"
                    }
                ],
                "gstDocs": [
                    {
                        "state": "Assam",
                        "path": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568031154101_Assam_gst.jpg",
                        "docNumber": " Htsf",
                        "oldSapCode": "",
                        "newSapCode": ""
                    }
                ]
            }
        
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return response if request body is perfect, if same baId then same record will be updated', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/business_associate/add",
            json : true,
            body : {
                "emailId": "HARIkrishna45@gmail.com",
                "baId": "19bdb13747ccd4921f1580bwe",
                "mobileNo": "7845645659",
                "companyName": "mlllllllllll",
                "panNo": "ECDPK6765Q",
                "contactPerson": "prakash",
                "cinNo": "",
                "landline": null,
                "addressLine1": "3A,PR layout",
                "addressLine2": "Indore",
                "pinCode": 870098,
                "contactPersonMobile": "7674837573",
                "approvedTill": "2019-10-04T00:00:00.000Z",
                "oldSapMasterCode": null,
                "newSapMasterCode": null,
                "baVerifiedOn": null,
                "city": "Achanta",
                "state": "Uttar Pradesh",
                "stateCode": "UP",
                "businessType":"Logistics",
                "hqAddress":"Mumbai",
                "bussinessAera": [
                    "Transportation",
                    "People Transportaion",
                    "Man Power"
                ],
                "isGst": 0,
                "docs": [
                    {
                        "docName": "Cancelled Cheque",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1566281139728_cancelled-cheque.png"
                    },
                    {
                        "docName": "CIN Number",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1566281172616_cin-number.png"
                    },
                    {
                        "docName": "Declaration",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568030722211_declaration.jpg"
                    },
                    {
                        "docName": "Company PAN",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1567681879581_company-pan.pdf"
                    },
                    {
                        "docName": "MSMED",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568031120626_msmed.jpg"
                    }
                ],
                "gstDocs": [
                    {
                        "state": "Assam",
                        "path": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568031154101_Assam_gst.jpg",
                        "docNumber": " Htsf",
                        "oldSapCode": "",
                        "newSapCode": ""
                    }
                ]
            }        
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return response if request body is perfect, if different baId then new record will be added', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/business_associate/add",
            json : true,
            body : {
                "emailId": "HARIkrishna45@gmail.com",
                "baId": "19bdb13747ccd4921f1580bwee",
                "mobileNo": "7845645659",
                "companyName": "mlllllllllll",
                "panNo": "ECDPK6765Q",
                "contactPerson": "prakash",
                "cinNo": "",
                "landline": null,
                "addressLine1": "3A,PR layout",
                "addressLine2": "Indore",
                "pinCode": 870098,
                "contactPersonMobile": "7674837573",
                "approvedTill": "2019-10-04T00:00:00.000Z",
                "oldSapMasterCode": null,
                "newSapMasterCode": null,
                "baVerifiedOn": null,
                "city": "Achanta",
                "state": "Uttar Pradesh",
                "stateCode": "UP",
                "businessType":"Logistics",
                "hqAddress":"Mumbai",
                "bussinessAera": [
                    "Transportation",
                    "People Transportaion",
                    "Man Power"
                ],
                "isGst": 0,
                "docs": [
                    {
                        "docName": "Cancelled Cheque",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1566281139728_cancelled-cheque.png"
                    },
                    {
                        "docName": "CIN Number",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1566281172616_cin-number.png"
                    },
                    {
                        "docName": "Declaration",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568030722211_declaration.jpg"
                    },
                    {
                        "docName": "Company PAN",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1567681879581_company-pan.pdf"
                    },
                    {
                        "docName": "MSMED",
                        "docPath": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568031120626_msmed.jpg"
                    }
                ],
                "gstDocs": [
                    {
                        "state": "Assam",
                        "path": "http://10.175.2.29:80/baDocs/19bdb13747ccd4921f1580bf14348acb_docs/19bdb13747ccd4921f1580bf14348acb_1568031154101_Assam_gst.jpg",
                        "docNumber": " Htsf",
                        "oldSapCode": "",
                        "newSapCode": ""
                    }
                ]
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