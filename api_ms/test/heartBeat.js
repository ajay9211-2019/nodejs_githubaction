//const server    = require("../entrypoint");
const chai      = require("chai");
const chaiHttp  = require("chai-http");
process.env.NODE_ENV = 'test';

const { expect } = chai;
chai.use(chaiHttp);

describe("/GET driver heart beats details api", () => {
    it("It should get data given correct details.", done => {
        chai
        .request("http://localhost:4002/api/v1")
        .post("/drivers/94480/heart_beat?lat=37.421997&lng=-122.084")
        .set('Content-Type', 'application/json')
        .set('uid', 'asdfafg@sdf.com')
        .set('access_token', 'fGq7nRaAiPuA_faLC6pW_g')
        .set('client', 'SYE-vyxMzKpqsCJ2a3l2OA')
        .end((err, res) => {      
            console.log("res : ", res);  
            expect(res).to.have.status(200);            
            expect(res.body.message).to.equal('success');
            done();      
        });
    });
});