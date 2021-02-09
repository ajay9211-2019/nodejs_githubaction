"use strict";

const router = express.Router();
const userController = require("../controllers/userController");
const authenticate = require("../controllers/authenticate");
// const rback = require("../controllers/");
const constraintsController = require("../controllers/constraintsController");
const middleware = require("../middleware/middleware");
const CONST = require('../utils/constants');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({
	uploadDir: './files'
});

//takes whole path
let multipartMiddlewareSac = multipart({
	uploadDir: appRoot + '/files'
});

// use middleware 
router.use(middleware.user);
router.use(middleware.validateTokenNodeJs);
router.use(authenticate.authenticateAccess);
router.use(authenticate.authenticateCommonService);

// compliace api ms

router.get('/', (req, res) => {
	res.json({
		'test': 'true'
	});
});

router.get(
	"/is-downloadable-employee-excel/:site_id",
	userController.isDownloadableEmployeeExcel
);

router.get("/compliance/driverchecklist/:resourceid", userController.getdriverchecklist);
router.get("/compliance/vehiclechecklist/:resourceid", userController.getvehiclechecklist);
router.get("/compliance/auditdashboard", userController.getDriverVehicleAuditDetails);

router.get('/compliance/getLocation', userController.getCallCompliancAPI);
router.get('/renewalDocument/stats', userController.getCallCompliancAPI);

router.get('/renewalDocument/list', userController.getCallCompliancAPI);

router.get('/compliance/updateDriverComplianceStatus', userController.getCallCompliancAPI);


router.post('/compliance/auditlisting', userController.postCallCompliancAPI);

router.post("/getDetails", userController.getDetails);

router.post("/saveDetails", userController.saveDetails);

//force complete trip
router.post("/completeThePendingTrip", userController.completeThePendingTrip);

/* download sample contract file */
router.get("/contract/download-samplefile/:siteId/:type/:contractType", userController.downloadSampleContractfile);

router.post('/getDirections', userController.getDirections);
router.get('/tripReport/:accessToken/:siteId/:fromDate/:toDate', userController.downloadTripReport);
router.get('/employeeLogReport/:accessToken/:siteId/:fromDate/:toDate', userController.downloadEmployeeLogReport);
router.get('/OTAReport/:accessToken/:siteId/:fromDate/:toDate', userController.downloadOTAReport);
router.get('/OTDReport/:accessToken/:siteId/:fromDate/:toDate', userController.downloadOTDReport);
router.get('/dailyShiftWiseOccupency/:accessToken/:siteId/:fromDate/:toDate', userController.downloadDailyShiftWiseOccupency);
router.get('/driverOffDutyNotificationReport/:accessToken/:siteId/:fromDate/:toDate', userController.downloadDriverOffDutyNotificationReport);
router.get('/vehicleDeployment/:accessToken/:siteId/:fromDate/:toDate', userController.vehicleDeploymentExcel);
router.get('/noShowAndCancellations/:accessToken/:siteId/:fromDate/:toDate', userController.noShowAndCancellationsExcel);
router.get('/vehicleDownload/:accessToken/:siteId', userController.vehicleDownloadExcel);
router.get('/report/drivers', userController.driverExcelReport);
router.get('/report/customers', userController.CustomerExcelReport);
router.get('/report/ba', userController.BAExcelReport);
router.get('/report/sites', userController.SiteExcelReport);
router.get("/zones/:siteId", userController.getZonesBySite);
router.post("/categoryList", userController.getAllCategory);
router.get('/employeeupload/downloadEmployeeExcel/:site_id', userController.downloadEmployeeExcel);
router.get("/induction/docdashboard", userController.docdashboard);

router.post("/induction/docdetails", userController.getDocDetails);

//router.post("/induction/docdashboard", userController.docdashboard);

router.post("/induction/getAllRenewDocList", userController.getAllRenewDocList);

router.post("/induction/addRenewalRequest", multipartMiddleware, userController.addRenewalRequest);


router.post("/getAllSiteList", userController.getAllSiteList);

//upload employee schedule
router.post("/upload-employee-shedule", multipartMiddleware, userController.uploadEmployeeSchedule);
router.get('/driver/upcoming_trip', userController.driverUpcomingTrip);
router.post(
	"/call-generate-driver-employee",
	userController.generateCallDriverAndEmployee
);

//send driver panic sms
router.post("/sendDriverPanicSMS", userController.sendDriverPanicSMS);

router.delete('/customer-status/:customerId', userController.deleteRequestRedirect);

router.get('/customers', userController.getRequestRedirect);

router.get('/validate_customer/:customer_name', userController.getRequestRedirect);

router.get('/states', userController.getRequestRedirect);

router.get('/cities', userController.getRequestRedirect);

router.get('/customerDetails/:id', userController.getRequestRedirect);

/*router.post('/add_customers',function( req, res ){
	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/add_customers`);
});*/
router.post('/add_customers', multipartMiddleware, userController.masterPostRequest);
/*router.post('/update_customers',function( req, res ){
	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/update_customers`);
});*/
router.post('/update_customers', multipartMiddleware, userController.masterPostRequest);

// router.get( '/customers' , customer.getCustomers );
// router.get( '/validate_customer/:customer_name', customer.validateCustomerName);
// router.get( '/states' , customer.getStates );
// router.get( '/cities' , customer.getCities );

/* router.post('/business_associate/add',(req, res) => {
	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/business_associate/add`);
}) */
router.post('/business_associate/add', userController.addBA);

router.post('/business_associate/check-email', userController.checkBAEmailDuplication);
router.post('/business_associate/check-phone', userController.checkBAPhoneDuplication);

router.post('/BA/updateStatus', userController.updateBAstatus);
router.post('/BA/list', userController.getBaList);
router.post('/BA/detailsById', userController.getDetailsById);


router.get('/drivers/:driver_id', userController.getDriverByDriverId);


router.get('/employee_trips/:employee_trip_id', userController.employeeFullTrip);

// function (req, res) {
// 	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/employee_trips/${req.params.employee_trip_id}`);
// })

// router.get('/trips/:trip_id/accept_trip_request/:request_date', function (req, res) {
// 	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/trips/${req.params.trip_id}/accept_trip_request/${req.params.request_date}`);

// })

router.get("/trips/:trip_id/accept_trip_request", userController.acceptTripRequest);

router.post('/drivers/:driver_id/change_vehicle', userController.driverChangeVehicle);


router.post("/trips/:trip_id/trip_routes/completed", userController.tripRoutesCompleted);



router.post("/employee_trips/:employee_trip_id/exception", userController.employeeException);

router.post("/drivers/:driver_id/driver_request", userController.driverRequest);

router.post('/drivers/:driver_id/vehicle_info_one', userController.pairVehicle);

router.get('/drivers/:driver_id/upcoming_trip', userController.driverUpcomingTrips)


router.get('/vehicles/list', userController.vehicleMasterList);

// function (req, res) {
// 	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/vehicles/list?page_no=${req.query.page_no}&record_per_page=${req.query.record_per_page}`);
// })

router.post('/vehicles/filter', userController.vehicleMasterFilter);

// function (req, res) {
// 	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/vehicles/filter`);
// })

router.get('/drivers/:driverId/vehicle_ok_now', userController.vehicleOkNow);
router.post('/drivers/:driverId/update_current_location', userController.updateCurrentLocationV1);

router.delete('/employee/active-inactive/:id', userController.activeInactiveEmployee);
router.get('/employee/:id', userController.getEmployeeDetailsById);
router.get('/employees/:userid', userController.getEmployeeDetailsByIdV1);
router.post('/employees', userController.getEmployeeDetailsList);

router.post('/get-setup-schedule-list', userController.getSetupScheduleList);
router.post('/employee/update-schedule', userController.updateSchedule);
router.post('/employee/copy-schedule', userController.copySchedule);

//------------employee master API-----------------//
router.get('/getLineManagers', userController.getRequestRedirect);

router.get('/getBusStopList', userController.getRequestRedirect);

router.post('/employee-master/billing-zone-list', userController.billing_zone_list);

router.post('/employee-master/getLatLngFromAddress', userController.getLatLngFromAddress)

// (req, res) => {
// 	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/employee-master/getLatLngFromAddress`);
// });

/* router.post('/employee/emailId', (req, res) => {
	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/employee/emailId`);
})
router.post('/employee/phoneNo', (req, res) => {
	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/employee/phoneNo`);
}) */

router.post('/employee/emailId', userController.duplicateEmployeeEmail);
router.post('/employee/phoneNo', userController.duplicateEmployeePhone);

/*router.post('/employee/add_employee',function( req, res ){
	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/employee/add_employee`);
});*/
router.post('/employee/add_employee', multipartMiddleware, userController.masterPostRequest);
/*router.post('/employee/update_employee',function( req, res ){
	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/employee/update_employee`);
});*/
router.post('/employee/update_employee', multipartMiddleware, userController.masterPostRequest);
/*router.get('/employee/active_shifts/:check?',function( req, res ){
	res.redirect(`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/employee/active_shifts/${req.params.check}`);
});*/
router.get('/employee/active_shifts/:check?', userController.getRequestRedirect);
/*router.post('/employee/list_by_filter',function( req, res ){
	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/employee/list_by_filter`);
});*/
router.post('/employee/list_by_filter', multipartMiddleware, userController.masterPostRequest);

/*router.post('/employees/:userId/update_user_status',function( req, res ){
	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1${req.url}`);
});*/
router.post('/employees/:userId/update_user_status', userController.requestUpdateUserStatus);

/*router.get('/shifts/shifts_details/:shiftId?',function( req, res ){
	res.redirect(`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/shifts/shifts_details/${req.params.shiftId}`);
});*/
router.get('/shifts/shifts_details/:shiftId?', userController.getRequestRedirect);
/*router.get('/masters/shifts',function( req, res ){
	res.redirect(`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/masters/shifts`);
});*/
router.get('/masters/shifts', userController.getRequestRedirect);

router.post('/shifts/addEditShift', userController.addEditShifts);

// (req, res) => {
// 	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/shifts/addEditShift`);
// })
//------------EOF employee master api-----------------//


//Notification API
router.get('/employee/reinvite/:id', userController.getRequestRedirect);

router.post('/sendSms', userController.postRequestRedirect);

router.post('/sendMail', userController.postRequestRedirect);

//Guard API END POINT
router.post('/guard/add', userController.postRequestRedirect);

router.patch('/guard/update/:guardId', userController.patchRequestRedirect);

router.get('/guard/:id', userController.getRequestRedirect);

router.get('/guards', userController.getRequestRedirect);

/* ------- Trip Request APIs Start ------ */
router.post('/request-list', userController.postRequestRedirect);

router.post('/request-approve-decline', userController.requestStateChange)
/* ------- Trip Request APIs End ------ */

// check Vehicle plate number
/* router.post('/vehicles/validate-plate-number', (req, res) => {
	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/vehicles/validate-plate-number`)
})

// check driver license number
router.post('/drivers/validate-license-number', (req, res) => {
	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/drivers/validate-license-number`)
}) */
router.post('/vehicles/validate-plate-number', userController.validatePlateNumber);
router.post('/drivers/validate-license-number', userController.validateLicenseNumber);

router.get('/getcutofftime/:site_name', userController.getCutOffTime);

router.post("/contract/upload", multipartMiddleware, userController.uploadContract);
router.get("/download-file/:fileName", userController.downloadFile);
router.post("/bacontract/upload", multipartMiddleware, userController.uploadBAContract);
router.get('/vehicles/models', userController.getRequestRedirect);

router.post('/drivers/:id?', multipartMiddleware, userController.driverPostRequestRedirect);
router.patch('/drivers/:id', multipartMiddleware, userController.driverPostRequestRedirect);

/* router.post('/driver/updateProfPic',( req, res ) => {
	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/driver/updateProfPic`);
}) */
router.post('/driver/updateProfPic', userController.updateProfPic);

//configurators starts here
/*router.get('/configurators/general_settings',function( req, res ){
	res.redirect(`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/configurators/general_settings`);
});*/
router.get('/configurators/general_settings', userController.getRequestRedirect);
/*router.post('/configurators/update_general_settings',function( req, res ){
	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/configurators/update_general_settings`);
});*/
router.post('/configurators/update_general_settings', multipartMiddleware, userController.masterPostRequest);
/*router.get('/configurators/system_settings',function( req, res ){
	res.redirect(`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/configurators/system_settings`);
});*/
router.get('/configurators/system_settings', userController.getRequestRedirect);
/*router.post('/configurators/update_system_settings',function( req, res ){
	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/configurators/update_system_settings`);
});*/
router.post('/configurators/update_system_settings', multipartMiddleware, userController.masterPostRequest);
router.get('/configurators/site_settings', userController.getRequestRedirect);
router.post('/configurators/update_site_settings', multipartMiddleware, userController.masterPostRequest);
//configurators end here

//vehicle add
router.post('/vehicles', multipartMiddlewareSac, userController.addVehiclesMaster);
router.patch('/vehicles/:id', userController.updateVehicle);
router.put('/vehicles/:id', userController.updateVehicle);

router.get('/vehicles_get_vehicle_model_data', userController.getVehicleModelData);
//find draft vehicle
router.get('/vehicles/:id', userController.findDraftVehicleById);


router.get('/infodrivers/:id', userController.getRequestRedirect);

router.get('/drivers/:driverId/last_trip_request', userController.getRequestRedirect);
//driver offduty
router.get('/driver/offduty/:userId', userController.getRequestRedirect);

router.post('/drivers/:driverId/on_duty', userController.goOnDuty);

//call operator API
/* router.post('/driver/:driverId/call_operator', (req, res) => {
	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/driver/call_operator`);
}) */
router.post("/driver/:driverId/call_operator", userController.generateCallByOperator);

//trips API
router.get('/trips/:tripId', userController.getRequestRedirect);
//router.post('/drivers/:id/update_current_location', userController.postRequestRedirect );

router.get('/drivers/:id/report_to_duty', userController.getRequestRedirect);

router.post('/drivers/:driverId/heart_beat', userController.requestHeartBeat);
router.get('/trips/:tripId/summary', userController.requestTripSummary);

router.post('/trips/:tripId/change_status_request_assigned', userController.postRequestRedirect);

/*router.post('/trips/:tripId/trip_routes/driver_arrived',function( req, res ){
	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1${req.url}`);
});*/
router.post('/trips/:tripId/trip_routes/driver_arrived', userController.requestDriverArrived);

//marks employees onboard from driver app
/* router.post('/trips/:tripId/trip_routes/on_board/:lat/:lng/:requestDate', (req, res) => {
	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1${req.url}`);
}); */
router.post("/trips/:tripId/trip_routes/on_board", userController.getEmployeeOnBoard);

//Completed trips by driver
router.get('/drivers/:userId/trip_history', userController.getRequestRedirect);
//setting up a new request from employee app
/* router.post('/employee_trips/trip_type/:tripType/new_date/:newDate/schedule_date/:scheduleDate', (req, res) => {
	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1${req.url}`);
});  */
router.post("/employee_trips", userController.newTripRequest);


router.post('/trips/:trip_id/trip_routes/not_on_board', userController.postRequestRedirect);

router.post('/employee_trips/:employee_trip_id/cancel', userController.postRequestRedirect);


router.get('/employees/:userId/upcoming_trip', userController.getRequestRedirect);

router.get('/employees/:userId/upcoming_trips', userController.getRequestRedirect);

router.get('/employees/:userId/trip_history', userController.getRequestRedirect);
//changing trip request
/* router.patch('/employee_trips/:employeeTripId', (req, res) => {
	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1${req.url}`);
}); */
router.patch("/employee_trips/:employeeTripId", userController.changeTripRequest);

//Trip ETA API
router.get('/trips/:tripId/eta', userController.requestETA);

//mark Employee no show from driver app
router.get('/trip_routes/:tripRouteId/employee_no_show', userController.getRequestRedirect);
router.get('/verify_email', userController.verifyEmail);

router.get('/trip_route_exceptions/:id/resolve', userController.getRequestRedirect);

router.post('/employees/:employee_id/call_operator', userController.postRequestRedirect);

//is_trip_rated API
/* router.post('/employee_trips/:employeeTripId/trip_rated', (req, res) => {
	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1${req.url}`);
}); */
router.post('/employee_trips/:employeeTripId/trip_rated', userController.tripRated);

router.get('/trips/:id/start', userController.startTrip);
router.post('/employee_trips/:id/rate', userController.employeeRate);
router.get('/employee_trips/:id/dismiss_trip', userController.employeeTripDismiss);
router.post('/employee_trips/:id/employee_on_board', userController.employeeOnBoard)

router.post('/employee/employee-site-role-update', userController.updateEmployeeSiteRole);
router.post('/employee/employee-site-role-list', userController.getEmployeeSiteRole);

router.get('/employeeSatisfaction/:fromDate/:toDate', userController.employeeSatisfactionExcel);

router.get('/otdSummary/:fromDate/:toDate', userController.otdSummaryExcel);

router.get('/report/employee_no_show', userController.downloadReportExcelCommon);

router.get('/report/panic_alarms', userController.downloadReportExcelCommon);

router.get('/report/trip_wise_driver_exception', userController.downloadReportExcelCommon);

router.get('/driverActivity', userController.driverActivities);

router.get('/shiftWiseNoShow/:fromDate/:toDate', userController.shiftWiseNoShow);
router.get('/module-features', userController.moduleFeatures);

/* router.get('/driver/listing/:pageNo/:recordsPerPage', (req, res) => {
	res.redirect(`${process.env.BASE_URL_MASTER_MS}:8008/api/v1${req.url}`);
}) */
router.get('/driver/listing/:pageNo/:recordsPerPage', userController.driverListing);

router.get('/drivers/:id/blacklist_driver', userController.driverActiveDeactive);
router.get('/drivers/:id/active_driver', userController.driverBlacklisted);

/*router.post('/drivers/:driverId/edit',function( req, res ){
	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1${req.url}`);
});*/
router.post('/drivers/:driverId/edit', multipartMiddleware, userController.masterPostRequest);

/*router.post('/vehicles/:vehicleId/edit',function( req, res ){
	res.redirect(307,`${process.env.BASE_URL_MASTER_MS}:8008/api/v1${req.url}`);
});*/
router.post('/vehicles/:vehicleId/edit', multipartMiddleware, userController.masterPostRequest);

router.get('/vehicles/:id/active_vehicle', userController.vehicleActiveDeactive);


router.get('/employees/:employee_id/last_completed_trip', userController.getRequestRedirect);

router.get('/vehicles/:vehicleId/vehicle_broke_down', userController.vehicleBrokeDown)

router.post('/vehicles/:vehicleId/vehicle_ok', userController.postRequestRedirect);

router.get('/shiftFleetUtilizationSummary/:accessToken/:siteId/:fromDate/:toDate', userController.shiftFleetUtilizationReport);

router.get('/OTASummary/:accessToken/:siteId/:fromDate/:toDate', userController.OTASummaryReport);



//Roaster download
router.get("/roaster-download", userController.downloadRoasterFile);
router.get("/routes-download", userController.downloadRoutesFile);


router.post('/upload-routes', multipartMiddlewareSac, userController.uploadRoutes);
router.get('/download-sample-upload-routes', userController.downloadRouteUploadFile);
router.get('/download-routes-uploaded-file/:id', userController.downloadRouteUploadedFile);
router.post('/get-routes-uploaded-list', userController.getRoutesUploadedList);
router.get('/gps/list', userController.getRequestRedirect);
router.post('/download-single-document', userController.downloadSingleDocument);
router.get('/appVersion', userController.getAppVersion);


router.post('/drivers/draft/:id?', multipartMiddleware, userController.driverPostRequestRedirect);
router.post('/vehicles/draft/:id?', multipartMiddleware, userController.addVehiclesMaster);
module.exports = router;