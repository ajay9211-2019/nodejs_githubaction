const chai = require('chai');
const request = require('request');
const assert = chai.assert;

const expect = require('chai').expect;
/* const { expect } = chai;
chai.use(chaiHttp); */

describe('Check driver license number API Unit Testing', ()=>{
    it('should return error if id is absent', (done) =>{
        //this.timeout(15000)
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/drivers/validate-license-number",
            json : true,
            body : {
                "license_number":"TEST004006"
            }      
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(307, res.statusCode)
            done()
        })
    })
    it('should return error if license number is absent in request body', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/drivers/validate-license-number",
            json : true,
            body : {
                "id":"1497"
            }   
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(307, res.statusCode)
            done()
        })
    })
    it('should return response if license number is repeated', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/drivers/validate-license-number",
            json : true,
            body : {
                "id":"-1",
                "license_number":"TEST004006"
            }  
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(307, res.statusCode)
            done()
        })
    })
    it('should return response if license number is unique', (done) =>{
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/drivers/validate-license-number",
            json : true,
            body : {
                "id":"1497",
                "license_number":"TEST004006"
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

describe('Upload driver profile picture API Unit Testing', ()=>{
    it('should return error if id is absent', (done) =>{
        //this.timeout(15000)
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/driver/updateProfPic",
            json : true,
            body : {
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

describe('driver off duty API Unit Testing', ()=>{
    it('should return error if id is wrong', (done) =>{
        //this.timeout(15000)
        request.get({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/driver/offduty/1080777777",
            json : true    
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return response if id is right and will change the status to off_duty', (done) =>{
        //this.timeout(15000)
        request.get({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/driver/offduty/10807",
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

describe('call operator from driver app API Unit Testing', ()=>{
    it('should return error if uid is wrong', (done) =>{
        //this.timeout(15000)
        request.post({
            headers : {"uid":"55089288881@gmail.com",
                "client":"1iaWgAscv7Vkm8L4SZZNmg",
                "access_token":"ht73BuYpnKvpTAueTs5rag"},
            url : "http://apiptsdemo.devmll.com/api/v1/driver/call_operator",
            json : true 
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(307, res.statusCode)
            done()
        })
    })
    it('should return error if drivers logistics company is empty', (done) =>{
        request.post({
            headers : {"uid":"5508928888@gmail.com",
                "client":"1iaWgAscv7Vkm8L4SZZNmg",
                "access_token":"ht73BuYpnKvpTAueTs5rag"},
            url : "http://apiptsdemo.devmll.com/api/v1/driver/call_operator",
            json : true 
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(307, res.statusCode)
            done()
        })
    })
    it('should return response if uid is correct and drivers logistics company is present', (done) =>{
        //this.timeout(15000)
        request.post({
            headers : {"uid":"5508928888@gmail.com",
                "client":"1iaWgAscv7Vkm8L4SZZNmg",
                "access_token":"ht73BuYpnKvpTAueTs5rag"},
            url : "http://apiptsdemo.devmll.com/api/v1/driver/call_operator",
            json : true    
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(307, res.statusCode)
            done()
        })
    })
})

describe('Upload driver profile picture API Unit Testing', ()=>{
    it('should return error if id is absent', (done) =>{
        //this.timeout(15000)
        request.post({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/driver/updateProfPic",
            json : true,
            body : {
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

describe('driver off duty API Unit Testing', ()=>{
    it('should return error if id is wrong', (done) =>{
        //this.timeout(15000)
        request.get({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/driver/offduty/133400",
            json : true    
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return response if id is right and will change the status to off_duty', (done) =>{
        //this.timeout(15000)
        request.get({
            headers : {"access_token":"fGq7nRaAiPuA_faLC6pW_g",
                "client":"SYE-vyxMzKpqsCJ2a3l2OA",
                "uid":"asdfafg@sdf.com"},
            url : "http://apiptsdemo.devmll.com/api/v1/driver/offduty/1334",
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

describe('trip details API for driver app Unit Testing', ()=>{
    it('should return error if tripid is wrong', (done) =>{
        //this.timeout(15000)
        request.get({
            headers : {"uid":"55089288881@gmail.com",
                "client":"1iaWgAscv7Vkm8L4SZZNmg",
                "access_token":"ht73BuYpnKvpTAueTs5rag"},
            url : "http://apiptsdemo.devmll.com/api/v1/trips/15530400000",
            json : true 
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode)
            done()
        })
    })
    it('should return response if tripid is correct', (done) =>{
        //this.timeout(15000)
        request.get({
            headers : {"uid":"5508928888@gmail.com",
                "client":"1iaWgAscv7Vkm8L4SZZNmg",
                "access_token":"ht73BuYpnKvpTAueTs5rag"},
            url : "http://apiptsdemo.devmll.com/api/v1/trips/155304",
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

describe('driver marks Employees on_board API Unit Testing', ()=>{
    it('should return error if tripid is wrong', (done) =>{
        //this.timeout(15000)
        request.post({
            headers : {"uid":"55089288881@gmail.com",
                "client":"1iaWgAscv7Vkm8L4SZZNmg",
                "access_token":"ht73BuYpnKvpTAueTs5rag"},
            url : "http://apiptsdemo.devmll.com/api/v1/trips/155310008/trip_routes/on_board/13.888888/72.6565656/1592463099",
            json : true,
            body : {
                "trip_routes": [
                    "5188"
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
    it('should return response if tripid is correct', (done) =>{
        //this.timeout(15000)
        request.post({
            headers : {"uid":"55089288881@gmail.com",
                "client":"1iaWgAscv7Vkm8L4SZZNmg",
                "access_token":"ht73BuYpnKvpTAueTs5rag"},
            url : "http://apiptsdemo.devmll.com/api/v1/trips/155318/trip_routes/on_board/13.888888/72.6565656/1592463099",
            json : true,
            body : {
                "trip_routes": [
                    "5188"
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

describe('driver trip history API for driver app Unit Testing', ()=>{
    it('should return error if userid is wrong', (done) =>{
        //this.timeout(15000)
        request.get({
            headers : {"uid":"55089288881@gmail.com",
                "client":"1iaWgAscv7Vkm8L4SZZNmg",
                "access_token":"ht73BuYpnKvpTAueTs5rag"},
            url : "http://apiptsdemo.devmll.com/api/v1/drivers/94350000/trip_history",
            json : true
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode);
            //assert.equal(body,"User Id Invalid");
            done();
        })
    })
    it('should return response if userId is correct', (done) =>{
        //this.timeout(15000)
        request.get({
            headers : {"uid":"55089288881@gmail.com",
                "client":"1iaWgAscv7Vkm8L4SZZNmg",
                "access_token":"ht73BuYpnKvpTAueTs5rag"},
            url : "http://apiptsdemo.devmll.com/api/v1/drivers/9435/trip_history",
            json : true
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode);
            //expect(res.body).to.be.an('array');
            done();
        })
    })
    it('should return response if there are no upcoming trips for driver is correct', (done) =>{
        //this.timeout(15000)
        request.get({
            headers : {"uid":"55089288881@gmail.com",
                "client":"1iaWgAscv7Vkm8L4SZZNmg",
                "access_token":"ht73BuYpnKvpTAueTs5rag"},
            url : "http://apiptsdemo.devmll.com/api/v1/drivers/10817/trip_history",
            json : true
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode);
            //assert.equal(body,"No upcoming trips found");
            done();
        })
    })
})

describe('setting up a new request from employee app', ()=>{
    it('should return error if uid is wrong', (done) =>{
        //this.timeout(15000)
        request.post({
            headers : {"uid":"dmart1811111@gmail.com",
                "client":"JicEMATpJH5t76ok_V1qKA",
                "access_token":"pPnIj-38P6hoO-dbcoRQRg"},
            url : "http://apiptsdemo.devmll.com/api/v1/employee_trips/trip_type/check_out/new_date/1592742600/schedule_date/21-06-2020",
            json : true
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(200, res.statusCode);
            //assert.equal(body,"User Id Invalid");
            done();
        })
    })
    it('should return response if all the request parameters are correct', (done) =>{
        //this.timeout(15000)
        request.post({
            headers : {"uid":"dmart181@gmail.com",
                "client":"JicEMATpJH5t76ok_V1qKA",
                "access_token":"pPnIj-38P6hoO-dbcoRQRg"},
            url : "http://apiptsdemo.devmll.com/api/v1/employee_trips/trip_type/check_out/new_date/1592742600/schedule_date/21-06-2020",
            json : true
        }, (err, res, body) => {
            if(err){
                return err;
            }
            assert.equal(307, res.statusCode);
            //assert.equal(body,"No upcoming trips found");
            done();
        })
    })
})

describe('changing trip time and date from employee app(Upcoming trips)', ()=>{
    it('should return error if uid is wrong', (done) =>{
        //this.timeout(15000)
        chai
        .request("http://apiptsdemo.devmll.com/api/v1")
        .patch("/employee_trips/1200923")
        // .field('myparam' , 'test')
        .set('content-type', 'application/x-www-form-urlencoded')
        .set('uid', 'dmart181111111@gmail.com')
        .set('access_token', 'pPnIj-38P6hoO-dbcoRQRg')
        .set('client', 'JicEMATpJH5t76ok_V1qKA')
        .send({reason: 'sick'})
        .send({new_date: '1593433500'})
        .end(function(error, res, body) {
            expect(res).to.have.status(200);
            expect(res.body.success).to.equals(false);
            //expect(res.body.data).to.be.an('array');        
            done();
        });
    })
    it('should return response if all the request parameters are correct', (done) =>{
        //this.timeout(15000)
        chai
        .request("http://apiptsdemo.devmll.com/api/v1")
        .patch("/employee_trips/1200923")
        // .field('myparam' , 'test')
        .set('content-type', 'application/x-www-form-urlencoded')
        .set('uid', 'dmart181@gmail.com')
        .set('access_token', 'pPnIj-38P6hoO-dbcoRQRg')
        .set('client', 'JicEMATpJH5t76ok_V1qKA')
        .send({reason: 'sick'})
        .send({new_date: '1593433500'})
        .end(function(error, res, body) {
            expect(res).to.have.status(200);
            expect(res.body.success).to.equals(true);
            //expect(res.body.data).to.be.an('array');        
            done();
        });
    })
})

describe("/GET trip ETA api", () => {
    it("It should get data given correct details.", done => {
        chai
        .request("http://apiptsdemo.devmll.com/api/v1")
        .get("/trips/155314/eta")
        .set('Content-Type', 'application/json')
        .set('uid', 'dmart181@gmail.com')
        .set('access_token', 'MZeSGOHEIs49XQzYDb2VxA')
        .set('client', '2Zd19v-l5yjfjZhYeiCprg')
        .end((err, res) => {      
            expect(res).to.have.status(200);            
            expect(res.body.message).to.equal('success');
            done();      
        });
    });
    it("It should get data error as invalid url hit.", done => {
        chai
        .request("http://apiptsdemo.devmll.com/api/v1")
        .get("/trips/155314//eta")
        .set('Content-Type', 'application/json')
        .set('uid', 'dmart181@gmail.com')
        .set('access_token', 'MZeSGOHEIs49XQzYDb2VxA')
        .set('client', '2Zd19v-l5yjfjZhYeiCprg')
        .end((err, res) => {      
            expect(res).to.have.status(404);            
            //expect(res.body.message).to.equal('success');
            done();      
        });
    });
});

describe("/GET Driver marks employee no show from employee app", () => {
    it("returns error as trip route id is not valid", done => {
        chai
        .request("http://apiptsdemo.devmll.com/api/v1")
        .get("/trip_routes/5193000000/employee_no_show/lat/19.2024373/lng/72.8578036/request_date/1592982966")
        .set('Content-Type', 'application/json')
        .set('uid', '9898767678@gmail.com')
        .set('access_token', 'AH_HNghCLGZsgWG-Qy0eQg')
        .set('client', 'tm8Ejl8W4KKP21jlwt203Q')
        .end((err, res) => {      
            expect(res).to.have.status(200);            
            //expect(res.body.message).to.equal('success');
            done();      
        });
    });
    it("returns error as latitude is not valid", done => {
        chai
        .request("http://apiptsdemo.devmll.com/api/v1")
        .get("/trip_routes/5193/employee_no_show/lat/A/lng/72.8578036/request_date/1592982966")
        .set('Content-Type', 'application/json')
        .set('uid', '9898767678@gmail.com')
        .set('access_token', 'AH_HNghCLGZsgWG-Qy0eQg')
        .set('client', 'tm8Ejl8W4KKP21jlwt203Q')
        .end((err, res) => {      
            expect(res).to.have.status(200);            
            //expect(res.body.message).to.equal('success');
            done();      
        });
    });
    it("returns error as longitude is not valid", done => {
        chai
        .request("http://apiptsdemo.devmll.com/api/v1")
        .get("/trip_routes/5193/employee_no_show/lat/19.2024373/lng/A/request_date/1592982966")
        .set('Content-Type', 'application/json')
        .set('uid', '9898767678@gmail.com')
        .set('access_token', 'AH_HNghCLGZsgWG-Qy0eQg')
        .set('client', 'tm8Ejl8W4KKP21jlwt203Q')
        .end((err, res) => {      
            expect(res).to.have.status(200);            
            //expect(res.body.message).to.equal('success');
            done();      
        });
    });
    it("returns error as request date is not passed is not valid", done => {
        chai
        .request("http://apiptsdemo.devmll.com/api/v1")
        .get("/trip_routes/5193/employee_no_show/lat/19.2024373/lng/72.8578036/request_date/")
        .set('Content-Type', 'application/json')
        .set('uid', '9898767678@gmail.com')
        .set('access_token', 'AH_HNghCLGZsgWG-Qy0eQg')
        .set('client', 'tm8Ejl8W4KKP21jlwt203Q')
        .end((err, res) => {      
            expect(res).to.have.status(404);            
            //expect(res.body.message).to.equal('success');
            done();      
        });
    });
    it("returns response as all the parameters are valid", done => {
        chai
        .request("http://apiptsdemo.devmll.com/api/v1")
        .get("/trip_routes/5193/employee_no_show/lat/19.2024373/lng/72.8578036/request_date/1592982966")
        .set('Content-Type', 'application/json')
        .set('uid', '9898767678@gmail.com')
        .set('access_token', 'AH_HNghCLGZsgWG-Qy0eQg')
        .set('client', 'tm8Ejl8W4KKP21jlwt203Q')
        .end((err, res) => {      
            expect(res).to.have.status(200);            
            //expect(res.body.message).to.equal('success');
            done();      
        });
    });
});

describe("/POST is_trip_rated API from employee app", () => {
    it("returns error if employee_trip_id is not valid", done => {
        chai
        .request("http://apiptsdemo.devmll.com/api/v1")
        .get("/employee_trips/12000000858/trip_rated")
        .set('content-type', 'application/x-www-form-urlencoded')
        .set('uid', 'dmart181111111@gmail.com')
        .set('access_token', 'pPnIj-38P6hoO-dbcoRQRg')
        .set('client', 'JicEMATpJH5t76ok_V1qKA')
        .end((err, res) => {      
            expect(res).to.have.status(307);            
            //expect(res.body.message).to.equal('success');
            done();      
        });
    });
    it("returns error if employee_trip_id is passed in url", done => {
        chai
        .request("http://apiptsdemo.devmll.com/api/v1")
        .get("/employee_trips/trip_rated")
        .set('content-type', 'application/x-www-form-urlencoded')
        .set('uid', 'dmart181111111@gmail.com')
        .set('access_token', 'pPnIj-38P6hoO-dbcoRQRg')
        .set('client', 'JicEMATpJH5t76ok_V1qKA')
        .end((err, res) => {      
            expect(res).to.have.status(404);            
            //expect(res.body.message).to.equal('success');
            done();      
        });
    });
    it("returns response if employee_trip_id is valid", done => {
        chai
        .request("http://apiptsdemo.devmll.com/api/v1")
        .get("/employee_trips/1200858/trip_rated")
        .set('content-type', 'application/x-www-form-urlencoded')
        .set('uid', 'dmart181111111@gmail.com')
        .set('access_token', 'pPnIj-38P6hoO-dbcoRQRg')
        .set('client', 'JicEMATpJH5t76ok_V1qKA')
        .end((err, res) => {      
            expect(res).to.have.status(307);            
            //expect(res.body.message).to.equal('success');
            done();      
        });
    });
});

describe("/GET driver listing API for operator portal", () => {
    it("returns error if pageNo is not entered", done => {
        chai
        .request("http://apiptsdemo.devmll.com/api/v1")
        .get("/driver/listing/10")
        .set('content-type', 'application/json')
        .set('uid', 'asdfafg@sdf.com')
        .set('access_token', 'ZCbLS3fTPiAYCuFUD0j7ug')
        .set('client', 'eS32XrpA9uQVR_Q6zPcP2Q')
        .set('featuretext', 'add_customer')
        .set('siteid', '138')
        .end((err, res) => {      
            expect(res).to.have.status(404);            
            //expect(res.body.message).to.equal('success');
            done();      
        });
    });
    it("returns response if proper request is provided", done => {
        chai
        .request("http://apiptsdemo.devmll.com/api/v1")
        .get("/driver/listing/1/10?filteration=true&filterBy=username&filterValue=8089907666")
        .set('content-type', 'application/json')
        .set('uid', 'asdfafg@sdf.com')
        .set('access_token', 'ZCbLS3fTPiAYCuFUD0j7ug')
        .set('client', 'eS32XrpA9uQVR_Q6zPcP2Q')
        .set('featuretext', 'add_customer')
        .set('siteid', '137')
        .end((err, res) => {      
            expect(res).to.have.status(200);            
            expect(res.body.success).to.equal('true');
            done();      
        });
    });
});