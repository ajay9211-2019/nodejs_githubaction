const chai = require('chai');
const request = require('request');
const assert = chai.assert;
// will run positive test cases

describe('RBAC CURD Test Cases',() => {
    it('Role CURD module should accept all operation as defined in document', (done) =>{
        //this.timeout(15000)
        request.post({
            headers : {"Content-Type":"application/json",
                uid:"mahindra_manager@qcmanager.com",
                access_token:"r8NKhe_KcznBpCE_Kv8pwg",
                client:"l0VovXrgI8bMCPPWXgJkbQ"},
            url : "localhost:4002/rback/role",
            json : true,
            body : {
                                
                    "operation" : "create",
                    "role_name" : "demoRoleType"
                   
            }          
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('Role CURD module should accept viewType from body param if select operation as view', (done) =>{
        //this.timeout(15000)
        request.post({
            headers : {"Content-Type":"application/json",
                uid:"mahindra_manager@qcmanager.com",
                access_token:"r8NKhe_KcznBpCE_Kv8pwg",
                client:"l0VovXrgI8bMCPPWXgJkbQ"},
            url : "localhost:4002/rback/role",
            json : true,
            body : {
                                
                "operation" : "view",
                "viewType": "role",
                                 
            }          
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('Role CURD module should accept viewType either role or role_module if select operation as view', (done) =>{
        //this.timeout(15000)
        request.post({
            headers : {"Content-Type":"application/json",
                uid:"mahindra_manager@qcmanager.com",
                access_token:"r8NKhe_KcznBpCE_Kv8pwg",
                client:"l0VovXrgI8bMCPPWXgJkbQ"},
            url : "localhost:4002/rback/role",
            json : true,
            body : {
                                
                "operation" : "view",
                "viewType": "role",
                                 
            }          
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('Role CURD module should accept role id from body param if select operation as view role by id', (done) =>{
        //this.timeout(15000)
        request.post({
            headers : {"Content-Type":"application/json",
                uid:"mahindra_manager@qcmanager.com",
                access_token:"r8NKhe_KcznBpCE_Kv8pwg",
                client:"l0VovXrgI8bMCPPWXgJkbQ"},
            url : "localhost:4002/rback/role",
            json : true,
            body : {
                                
                "operation" : "view",
                "viewType": "role",
                "role_id" : 30
                   
            }          
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('Role CURD module should accept updateRoles array from body param if select operation as update role', (done) =>{
        //this.timeout(15000)
        request.post({
            headers : {"Content-Type":"application/json",
                uid:"mahindra_manager@qcmanager.com",
                access_token:"r8NKhe_KcznBpCE_Kv8pwg",
                client:"l0VovXrgI8bMCPPWXgJkbQ"},
            url : "localhost:4002/rback/role",
            json : true,
            body : {
                                
                "operation" : "update",
                "updateRoles": [
                        {
                            "role_id": 30,
                            "role_name": "demoRoleType",
                            "status": 0
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
    it('Role CURD module should accept roleModuleArray array from body param if select operation as assign-module-to-role', (done) =>{
        //this.timeout(15000)
        request.post({
            headers : {"Content-Type":"application/json",
                uid:"mahindra_manager@qcmanager.com",
                access_token:"r8NKhe_KcznBpCE_Kv8pwg",
                client:"l0VovXrgI8bMCPPWXgJkbQ"},
            url : "localhost:4002/rback/role",
            json : true,
            body : {
                                
                "operation" : "assign-module-to-role",
                "roleModuleArray": [
                        {
                            "role_id": 31,
                            "module_id": 5,
                            "features": [
                                {
                                    "feature_id": 1,
                                    "status": 0
                                }
                            ]
                        },
                        {
                            "role_id": 30,
                            "module_id": 5,
                            "features": [
                                {
                                    "feature_id": 1,
                                    "status": 0
                                }
                            ]
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