const chai = require('chai');
const request = require('request');
const assert = chai.assert;

const expect = require('chai').expect;
let headers = {
    uid: 'deekshith.kgr95@gmail.com',
    access_token: 'a6tCfF5T7HVIdx8Czd6I7w',
    client: 'osUe4ObG0a1QvZ4R9-t6yg'
}
let timeout = 15000;
/* 
header uid should be correct
Invalid emailId
duplicate email
fname empty
fname should have only alphabates
if mname is not empty then should have only alphabates
lname empty
lname valid only want alphabates
phone should be numeric
phone should be 10 digit
site_role_list empty
site_role_list => roleId invalid
site_role_list => site_id invalid

response success:true
*/
describe('user module : /user/add', () => {
    it('header uid should be correct', (done) => {
        // this.timeout(15000)
        let headerss = { ...headers };
        headerss.uid = 'deekshith11.kgr95@gmail.com';
        request.post({
            headers: headerss,
            url: "http://localhost:4002/user/add",
            json: true,
            body: {
                email: 'sachinupawar27@gmail.com',
                f_name: 'sachin',
                m_name: 'pawar',
                l_name: 'ba',
                role: 12,
                phone: 8425986055,
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 1, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode,body)
            assert.equal(200, res.statusCode);
            assert.equal(body.status, false)
            assert.isArray(body.errors.errors, "error should be in array")
            assert.equal(body.errors.errors[0], "Invalid login credentials")
            done()
        })
    }).timeout(timeout)

    it('email id invalid', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/user/add",
            json: true,
            body: {
                email: 'sachinupawar27',
                f_name: 'sachin',
                m_name: 'pawar',
                l_name: 'ba',
                role: 12,
                phone: 8425986055,
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 1, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Invalid Email")
            done()
        })
    }).timeout(timeout)

    it('duplicate email', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/user/add",
            json: true,
            body: {
                email: 'sachinupawar27@gmail.com',
                f_name: 'sachin',
                m_name: 'pawar',
                l_name: 'ba',
                role: 12,
                phone: 8425986055,
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 1, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Email Id already exist")
            done()
        })
    }).timeout(timeout)

    it('fname empty', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/user/add",
            json: true,
            body: {
                email: 'sachinupawar277@gmail.com',
                f_name: '',
                m_name: 'pawar',
                l_name: 'ba',
                role: 12,
                phone: 8425986055,
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 1, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "First Name can not be empty")
            done()
        })
    }).timeout(timeout)

    it('fname should have only alphabates', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/user/add",
            json: true,
            body: {
                email: 'sachinupawar277@gmail.com',
                f_name: 'Sachin@123',
                m_name: 'pawar',
                l_name: 'ba',
                role: 12,
                phone: 8425986055,
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 1, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Invalid First Name")
            done()
        })
    }).timeout(timeout)

    it('if mname is not empty then should have only alphabates', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/user/add",
            json: true,
            body: {
                email: 'sachinupawar277@gmail.com',
                f_name: 'Sachin',
                m_name: 'pawar@123',
                l_name: 'ba',
                role: 12,
                phone: 8425986055,
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 1, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Invalid Middle Name")
            done()
        })
    }).timeout(timeout)

    it('lname empty', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/user/add",
            json: true,
            body: {
                email: 'sachinupawar277@gmail.com',
                f_name: 'sachin',
                m_name: 'pawar',
                l_name: '',
                role: 12,
                phone: 8425986055,
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 1, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Last Name can not be empty")
            done()
        })
    }).timeout(timeout)

    it('lname should have only alphabates', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/user/add",
            json: true,
            body: {
                email: 'sachinupawar277@gmail.com',
                f_name: 'Sachin',
                m_name: 'pawar',
                l_name: 'ba@',
                role: 12,
                phone: 8425986055,
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 1, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Invalid Last Name")
            done()
        })
    }).timeout(timeout)

    it('phone should be numeric', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/user/add",
            json: true,
            body: {
                email: 'sachinupawar277@gmail.com',
                f_name: 'Sachin',
                m_name: 'pawar',
                l_name: 'ba',
                role: 12,
                phone: 'a8425986055',
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 1, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Invalid phone number")
            done()
        })
    }).timeout(timeout)

    it('phone should be 10 digit', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/user/add",
            json: true,
            body: {
                email: 'sachinupawar277@gmail.com',
                f_name: 'Sachin',
                m_name: 'pawar',
                l_name: 'ba',
                role: 12,
                phone: '842598',
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 1, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Phone number length must be 10 digit")
            done()
        })
    }).timeout(timeout)

    it('site_role_list empty', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/user/add",
            json: true,
            body: {
                email: 'sachinupawar277@gmail.com',
                f_name: 'Sachin',
                m_name: 'pawar',
                l_name: 'ba',
                role: 12,
                phone: '8425984444',
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: []
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Site and role list not found")
            done()
        })
    }).timeout(timeout)

    it('default site and role select', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/user/add",
            json: true,
            body: {
                email: 'sachinupawar277@gmail.com',
                f_name: 'Sachin',
                m_name: 'pawar',
                l_name: 'ba',
                role: 12,
                phone: '8425984444',
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 1, false], [137, 12, false]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Please select single default site")
            done()
        })
    }).timeout(timeout)

    it('site_role_list => roleId invalid', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/user/add",
            json: true,
            body: {
                email: 'sachinupawar277@gmail.com',
                f_name: 'Sachin',
                m_name: 'pawar',
                l_name: 'ba',
                role: 12,
                phone: '8425989999',
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 111, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "111 is Invalid role_id")
            done()
        })
    }).timeout(timeout)

    it('site_role_list => siteId invalid', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/user/add",
            json: true,
            body: {
                email: 'sachinupawar277@gmail.com',
                f_name: 'Sachin',
                m_name: 'pawar',
                l_name: 'ba',
                role: 12,
                phone: '8425989999',
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[13611, 1, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "13611 is Invalid site_id")
            done()
        })
    }).timeout(timeout)
})

/*
userId should be in number format
userId should be valid
header uid should be correct
Invalid emailId
duplicate email
fname empty
fname valid only want alphabates
mname empty and alphabate wise valid
lname empty
lname valid only want alphabates
phone should be numeric
phone length should be 10 or greater
site_role_list empty
default site and role select
site_role_list => roleId invalid
site_role_list => site_id invalid

response success:true
*/
//update user test
describe('user module : /user/update', () => {
    let updateUrl='user/update'
    let userId=11092;

    it('header uid should be correct', (done) => {
        // this.timeout(15000)
        let headerss = { ...headers };
        headerss.uid = 'deekshith11.kgr95@gmail.com';
        request.post({
            headers: headerss,
            url: "http://localhost:4002/"+updateUrl,
            json: true,
            body: {
                email: 'sachinupawar27@gmail.com',
                f_name: 'sachin',
                m_name: 'pawar',
                l_name: 'ba',
                role: 12,
                phone: 8425986055,
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 1, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode,body)
            assert.equal(200, res.statusCode);
            assert.equal(body.status, false)
            assert.isArray(body.errors.errors, "error should be in array")
            assert.equal(body.errors.errors[0], "Invalid login credentials")
            done()
        })
    }).timeout(timeout)

    it('user id must be numeric', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/"+updateUrl,
            json: true,
            body: {
                id:'fdsds',
                email: 'sachinupawar27',
                f_name: 'sachin',
                m_name: 'pawar',
                l_name: 'ba',
                role: 12,
                phone: 8425986055,
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 1, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Invalid id")
            done()
        })
    }).timeout(timeout)

    it('user id invalid', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/"+updateUrl,
            json: true,
            body: {
                id:11111,
                email: 'sachinupawar27',
                f_name: 'sachin',
                m_name: 'pawar',
                l_name: 'ba',
                role: 12,
                phone: 8425986055,
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 1, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Invalid id")
            done()
        })
    }).timeout(timeout)


    it('email id invalid', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/"+updateUrl,
            json: true,
            body: {
                id:11092,
                email: 'sachinupawar27',
                f_name: 'sachin',
                m_name: 'pawar',
                l_name: 'ba',
                role: 12,
                phone: 8425986055,
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 1, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Invalid Email")
            done()
        })
    }).timeout(timeout)

    it('duplicate email', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/"+updateUrl,
            json: true,
            body: {
                id:11092,
                email: 'sachinupawar27@gmail.com',
                f_name: 'sachin',
                m_name: 'pawar',
                l_name: 'ba',
                role: 12,
                phone: 8425986055,
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 1, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Email Id already exist")
            done()
        })
    }).timeout(timeout)

    it('fname empty', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/"+updateUrl,
            json: true,
            body: {
                id:11092,
                email: 'sachinupawar277@gmail.com',
                f_name: '',
                m_name: 'pawar',
                l_name: 'ba',
                role: 12,
                phone: 8425986055,
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 1, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "First Name can not be empty")
            done()
        })
    }).timeout(timeout)

    it('fname should have only alphabates', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/"+updateUrl,
            json: true,
            body: {
                id:11092,
                email: 'sachinupawar277@gmail.com',
                f_name: 'Sachin@123',
                m_name: 'pawar',
                l_name: 'ba',
                role: 12,
                phone: 8425986055,
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 1, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Invalid First Name")
            done()
        })
    }).timeout(timeout)

    it('if mname is not empty then should have only alphabates', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/"+updateUrl,
            json: true,
            body: {
                id:11092,
                email: 'sachinupawar277@gmail.com',
                f_name: 'Sachin',
                m_name: 'pawar@123',
                l_name: 'ba',
                role: 12,
                phone: 8425986055,
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 1, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Invalid Middle Name")
            done()
        })
    }).timeout(timeout)

    it('lname empty', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/"+updateUrl,
            json: true,
            body: {
                id:11092,
                email: 'sachinupawar277@gmail.com',
                f_name: 'sachin',
                m_name: 'pawar',
                l_name: '',
                role: 12,
                phone: 8425986055,
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 1, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Last Name can not be empty")
            done()
        })
    }).timeout(timeout)

    it('lname should have only alphabates', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/"+updateUrl,
            json: true,
            body: {
                id:11092,
                email: 'sachinupawar277@gmail.com',
                f_name: 'Sachin',
                m_name: 'pawar',
                l_name: 'ba@',
                role: 12,
                phone: 8425986055,
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 1, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Invalid Last Name")
            done()
        })
    }).timeout(timeout)

    it('phone should be numeric', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/"+updateUrl,
            json: true,
            body: {
                id:11092,
                email: 'sachinupawar277@gmail.com',
                f_name: 'Sachin',
                m_name: 'pawar',
                l_name: 'ba',
                role: 12,
                phone: 'a8425986055',
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 1, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Invalid phone number")
            done()
        })
    }).timeout(timeout)

    it('phone should be 10 digit', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/"+updateUrl,
            json: true,
            body: {
                id:11092,
                email: 'sachinupawar277@gmail.com',
                f_name: 'Sachin',
                m_name: 'pawar',
                l_name: 'ba',
                role: 12,
                phone: '842598',
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 1, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Phone number length must be 10 digit")
            done()
        })
    }).timeout(timeout)

    it('site_role_list empty', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/"+updateUrl,
            json: true,
            body: {
                id:11092,
                email: 'sachinupawar277@gmail.com',
                f_name: 'Sachin',
                m_name: 'pawar',
                l_name: 'ba',
                role: 12,
                phone: '8425984444',
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: []
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Site and role list not found")
            done()
        })
    }).timeout(timeout)

    it('default site and role select', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/"+updateUrl,
            json: true,
            body: {
                id:11092,
                email: 'sachinupawar277@gmail.com',
                f_name: 'Sachin',
                m_name: 'pawar',
                l_name: 'ba',
                role: 12,
                phone: '8425984444',
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 1, false], [137, 12, false]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Please select single default site")
            done()
        })
    }).timeout(timeout)

    it('site_role_list => roleId invalid', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/"+updateUrl,
            json: true,
            body: {
                id:11092,
                email: 'sachinupawar277@gmail.com',
                f_name: 'Sachin',
                m_name: 'pawar',
                l_name: 'ba',
                role: 12,
                phone: '8425989999',
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[136, 111, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "111 is Invalid role_id")
            done()
        })
    }).timeout(timeout)

    it('site_role_list => siteId invalid', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/"+updateUrl,
            json: true,
            body: {
                id:11092,
                email: 'sachinupawar277@gmail.com',
                f_name: 'Sachin',
                m_name: 'pawar',
                l_name: 'ba',
                role: 12,
                phone: '8425989999',
                process_code: 'abc',
                site_id: 138,
                company_id: 95,
                legal_name: 'aa',
                pan: '212qwqewep',
                tan: '2121wawsa1',
                business_type: 'BA',
                service_tax_no: 123456789012345,
                hq_address: 'abc',
                avatar_content_type: 'image/jpeg',
                avatar_file_size: 100,
                site_role_list: [[13611, 1, false], [137, 12, true]]
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode, body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "13611 is Invalid site_id")
            done()
        })
    }).timeout(timeout)
})

/*
userId should be in number format
userId should be valid

if all right response success:true
*/
//get user by id
describe('user module : /user/find/:id', () => {

    it('userId should be in number format', (done) => {
        // this.timeout(15000)
        request.get({
            headers: headers,
            url: "http://localhost:4002/user/find/ddd",
            json: true,
            body: {}
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode,body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Invalid id")
            done()
        })
    }).timeout(timeout)

    it('userId should be valid', (done) => {
        // this.timeout(15000)
        request.get({
            headers: headers,
            url: "http://localhost:4002/user/find/110922",
            json: true,
            body: {}
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode,body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Invalid id")
            done()
        })
    }).timeout(timeout)

    it('if all right response success:true', (done) => {
        // this.timeout(15000)
        request.get({
            headers: headers,
            url: "http://localhost:4002/user/find/11092",
            json: true,
            body: {}
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode,body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, true)
            assert.property(body.data, 'user')
            done()
        })
    }).timeout(timeout)
})

/*
response success:true
response data.roles should be array
*/
//get roles
describe('user module : /user/roles', () => {

    it('response data.roles should be array', (done) => {
        // this.timeout(15000)
        request.get({
            headers: headers,
            url: "http://localhost:4002/user/roles",
            json: true,
            body: {}
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode,body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, true)
            assert.isArray(body.data.roles, "Invalid roles key values")
            done()
        })
    }).timeout(timeout)
})

/*
pageNo should be number
pageSize should be number
response should be success : true
response data should be in array
*/
//user list
describe('user module : /user/list', () => {

    it('response should be success : true', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/user/list",
            json: true,
            body: { pageNo: 1, pageSize: 10 }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode,body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, true)
            done()
        })
    }).timeout(timeout)

    it('pageNo should be number', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/user/list",
            json: true,
            body: { pageNo: 'dddd', pageSize: 10 }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode,body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Invalid pageNo")
            done()
        })
    }).timeout(timeout)

    it('pageSize should be number', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/user/list",
            json: true,
            body: { pageNo: 1, pageSize: '10s' }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode,body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Invalid pageSize")
            done()
        })
    }).timeout(timeout)

    it('response data should be in array', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/user/list",
            json: true,
            body: { pageNo: 1, pageSize: 10 }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode,body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, true)
            assert.isArray(body.data.userList, "")
            done()
        })
    }).timeout(timeout)
})

/*
email should be valid
response should be success:true
response sould be data.token is not empty
*/
//reset password
describe('user module : /user/reset-password', () => {

    it('email should be valid', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/user/reset-password",
            json: true,
            body: {email:"sachinupawar57"}
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode,body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Email not exist")
            done()
        })
    }).timeout(timeout)

    it('response should be success:true', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/user/reset-password",
            json: true,
            body: {email:"sachinupawar57@gmail.com"}
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode,body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, true);
            done()
        })
    }).timeout(timeout)

    it('response token should not be empty', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/user/reset-password",
            json: true,
            body: {email:"sachinupawar57@gmail.com"}
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode,body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, true);
            assert.property(body.data, "token");
            done()
        })
    }).timeout(timeout)
})

/*
token should not be empty
token should be valid and not expired
password should not be empty
*/
//update password
describe('user module : /user/update-password', () => {

    it('token should not be empty', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/user/update-password",
            json: true,
            body: {
                token:"",
                // token1: "hxO0zk7PIaoHD3QHyrLhute05ADz0jC3U1JBr8yAJCRiFTQmrXRhgjjFlFiK33t1",
                password: "pass,123"
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode,body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Token should not be empty")
            done()
        })
    }).timeout(timeout)

    it('token should not be invalid', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/user/update-password",
            json: true,
            body: {
                token:"ddddd",
                // token1: "hxO0zk7PIaoHD3QHyrLhute05ADz0jC3U1JBr8yAJCRiFTQmrXRhgjjFlFiK33t1",
                password: "pass,123"
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode,body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Invalid token")
            done()
        })
    }).timeout(timeout)

    it('password should not be invalid', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/user/update-password",
            json: true,
            body: {
                token: "hxO0zk7PIaoHD3QHyrLhute05ADz0jC3U1JBr8yAJCRiFTQmrXRhgjjFlFiK33t1",
                password:""
                // password: "pass,123"
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode,body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, false)
            assert.equal(body.message, "Password should not be empty")
            done()
        })
    }).timeout(timeout)

    it('token & password correct then password should be update', (done) => {
        // this.timeout(15000)
        request.post({
            headers: headers,
            url: "http://localhost:4002/user/update-password",
            json: true,
            body: {
                token: "hxO0zk7PIaoHD3QHyrLhute05ADz0jC3U1JBr8yAJCRiFTQmrXRhgjjFlFiK33t1",
                password: "pass,123"
            }
        }, (err, res, body) => {
            if (err) {
                return err;
            }
            // console.log(res.statusCode,body)
            assert.equal(200, res.statusCode);
            assert.equal(body.success, true)
            done()
        })
    }).timeout(timeout)
})
