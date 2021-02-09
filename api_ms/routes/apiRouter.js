"use strict";

const router = express.Router();
const userController = require("../controllers/userController");
const authenticate = require("../controllers/authenticate");
const constraintsController = require("../controllers/constraintsController");
const roleController = require("../controllers/roleController");

const middleware = require("../middleware/middleware");
let user = require('../controllers/user')

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({
  uploadDir: './files'
});
console.log("******* appRoot path : ", appRoot)
var multipartMiddlewareFullPath = multipart({
  uploadDir: appRoot + '/files'
});


const moduleController = require('../controllers/rbackModule');
const featureController = require('../controllers/rbackFeature');
//------------------------Reports Api -------------------------//
router.get(
  "/isReportsDownloadable/:accessToken/:siteId/:fromDate/:toDate",
  userController.isReportsDownloadableExcel
);

//-----------------------EOF Reports Api -------------------------//

router.use(middleware.user);
router.use(middleware.validateTokenNodeJs);
router.use(authenticate.authenticateAccess);
router.use(authenticate.authenticateCommonService);

//------------------------ Auth API-------------------------------//

router.post("/signin", userController.signin);

router.post("/validateToken", userController.validateTokenNodeJs);

router.post("/signout", userController.signout);

// node auth apis
router.post("/auth/signin", authenticate.signin);
router.delete("/auth/sign_out", authenticate.signout);
router.post("/auth/check-module-access", authenticate.getAccessListByUserName);

//------------------------EOF Auth API ----------------------------//

//-----------------------Induction API ----------------------------//
router.post("/induction/getAllBaList", userController.getAllBaList);

router.post(
  "/induction/getDashboardTatList",
  userController.getDashboardTatList
);

router.post("/induction/getDetails", userController.getDetails);

router.post("/induction/saveDetails", userController.saveDetails);

router.post("/induction/dashboardFilter", userController.dashboardFilter);

router.post("/induction/docdetails", userController.getDocDetails);

router.post("/induction/docdashboard", userController.docdashboard);

router.post("/induction/getAllRenewDocList", userController.getAllRenewDocList);

router.post("/induction/addRenewalRequest", multipartMiddleware, userController.addRenewalRequest);

router.post("/induction/updateBlacklistStatus", userController.updateBlacklistStatus);

router.post("/induction/activeInactiveResourceStatus", userController.activeInactiveResourceStatus);

//-----------------------EOF Induction API-------------------------//

//-----------------------Compliance API---------------------------//

router.post("/compliance/getdriverchecklist", userController.getdriverchecklist);

router.post("/compliance/getvehiclechecklist", userController.getvehiclechecklist);

router.post("/compliance/driverchecklist", userController.driverchecklist);
router.post("/compliance/vehiclechecklist", userController.vehiclechecklist);

//----------------------EOF Compliance API------------------------//

//----------------------Registration API---------------------------//

router.post("/create/driver", userController.createDriver);

router.post("/create/vehicle", userController.createVehicle);

router.get("/validate_licence_number", userController.validateLicence);

router.get("/validate_plate_number", userController.validatePlateNo);

router.get("/get_vehicle_model_data", userController.getVehicleModelData);

router.get("/driverList", userController.getAllDriverList);

//-------------------EOF Registration API------------------------//

//----------------------Routes and Roastering API---------------------------//
router.post("/createZones", userController.createZones);

router.get("/delete_zone/:zone_id", userController.deleteZones);

router.post("/getAllsCompaniesList", userController.getAllCompaniesList);

router.post("/roasterlist", userController.getroasterlist);

//AddVehicles during roastering

router.post("/addvehicle", userController.addVehicles);

//get all vehicle
router.post(`/getVehicleData`, userController.getVehicleData);

//get all guards
router.get("/getAllGuards", userController.getAllGuards);

//get all contracts
router.get("/getContractListByCustId", userController.getContractListByCustId);

//get routes
router.post("/generateRoutes", userController.generateRoutes);
router.post("/updateEmployeeRoutes", userController.updateEmployeeRoutes);
router.post(
  "/checkConstraintsForAction",
  userController.checkConstraintsForAction
);
router.get("/getConstraintsForSite", userController.getConstraintsForSite);
router.patch("/addGuardInTrip", userController.addGuardInTrip);
router.patch("/assignVehicleToTrip", userController.assignVehicleToTrip);
router.patch("/assignExternalVehicleToTrip", userController.assignExternalVehicleToTrip);
router.post('/changeTripTypeWithReallocationInternalDriverToTrip', userController.changeTripTypeWithReallocationInternalDriverToTrip);
router.post('/cancelTrip', userController.cancelTrip);
router.post("/routesTat", userController.routesTat);

//----------------------EOF Routes and Roastering API-----------------------------------//

//----------------------Contraints API---------------------------//
// insert
router.post("/constraint/insert", constraintsController.createConstraint);
// udpate
router.post("/constraint/update", constraintsController.updateConstraint);
// get all
router.get("/constraint/getall", constraintsController.getAllContraints);
// get constraint for site
router.get(
  "/constraint/getall/site/:siteId",
  constraintsController.getAllContraintsForSite
);
// get constraint by id
router.get("/constraint/get/:id", constraintsController.getContraintById);
//----------------------EOF Contraints API---------------------------//

// ----------------------------trip dashboard begin-----------------------//

router.post("/tripBoardList", userController.tripBoardList);

router.post("/autoAllocationList", userController.getAutoAllocateVehicleGuards);

// ----------------------------trip dashboard end-----------------------//

//Allocate routes response
router.post("/allocateRoutes", userController.allocateRoute);

//Auto Allocate routes request
router.post("/autoallocateRoutes", userController.autoallocateRoutes);

//allocate vahicles
router.post("/allocateVehicles", userController.allocateVehicles);

/* binding allocateVahicle and generateRoutes */
router.post(
  "/boundAllocateVahicleAndGenerateRoutes",
  userController.boundAllocateVahicleAndGenerateRoutes
);
//routes finalize API
router.post("/routesFinalize", userController.routesFinalize);
router.post("/routesAuthenticate", userController.routesAuthenticateFinalize);
router.post("/approveNonCompliantRoutes", userController.approveNonCompliantRoutes);


/* download sample contract file */
router.get(
  "/download-samplefile/:siteId/:type",
  userController.downloadSampleContractfile
);

/* contract upload */
router.post("/contract/upload", multipartMiddlewareFullPath, userController.uploadContract);
router.get("/download-file/:fileName", userController.downloadFile);
router.post("/bacontract/upload", multipartMiddlewareFullPath, userController.uploadBAContract);

//employee upload
router.get("/employee-master/download-sample-format/:siteId", userController.downloadEmployeeUploadFile);
router.post("/employee-master/upload-employee", multipartMiddlewareFullPath, userController.uploadEmployees);


// gps vehicle tracking api
router.get(`/gpsVehicleLocation`, userController.gpsVehicleLocation);

//auto allocation final
router.post(`/autoAllocationFinal`, userController.autoAllocationFinal);

//adhoc employee trip generate
router.post(`/adhoc_employee_route`, userController.adhocEmployeeTrip);

router.post("/get_all_employees", userController.getAllEmployees);

router.post("/getBgcAgencyList", userController.getBgcAgencyList);

//remove driver from trip
router.post("/remove-trip-vehicle", userController.removeVehicleFromTrip);

//global vehicle search
router.post("/searchVehicles", userController.searchVehicles);

//Roster employee details
router.post("/getRosterEmpDetails", userController.getRosterEmpDetails);

/* calling ms */
router.post("/call-generate-operator", userController.generateCall);

//save panic response
router.post("/save-panic-response", userController.saveEmployeePanicMessage);

//reallocation driver to trip
router.post(
  "/reallocationDriverToTrip",
  userController.reallocationDriverToTrips
);


router.post(
  "/reallocationExternalDriverToTrip",
  userController.reallocationExternalDriverToTrips
);

router.post(
  "/call-generate-driver-employee",
  userController.generateCallDriverAndEmployee
);

//send driver panic sms
router.post("/sendDriverPanicSMS", userController.sendDriverPanicSMS);
//add remark in trip table on driver panic
router.post(
  "/addRemarkInTripForDriverPanic",
  userController.addRemarkInTripForDriverPanic
);

router.post("/removeGuardFromTrip", userController.removeGuardFromTrip);

//fetch live trip status
router.get("/get-lat-lng-by-tripid/:trip_id", userController.getLatLngByTripId);

// get constraint by id
router.get(
  "/constraint/deleteConstraint/:id",
  constraintsController.deleteConstraints
);

router.post("/categoryList", userController.getAllCategory);
//update trip lat lng
router.post("/update-trip-lat-lng", userController.updateTripLatLng);

router.post("/getVehiclelatlong", userController.getVehiclelatlong);

router.post("/copyexistingroutes", userController.copyExistingRoutes);

router.post("/customTrip", userController.customTrips);

router.get("/appVersion", userController.getappVersion);


//get employee landmark and zone list

router.post("/empLandmarkZonesList", userController.empLandmarkZoneList);

router.post("/user/add", multipartMiddlewareFullPath, user.insertUser);
router.post("/user/update", multipartMiddleware, user.updateUser);
router.get("/user/find/:id", user.getUserById);
router.post("/user/roles", user.getRoles);
router.post("/user/list", user.getUserList);
router.post("/user/reset-password", user.resetPasswordRequest);
router.post("/user/update-password", user.update_changed_password);
router.post("/user/activateDeactivateUser", user.activateDeactivateUser);
router.get("/user/roles-all-site-access", user.getRolesOfAllSiteAccess);

//routing ms
//router.post('/roaster-routing/routes-filter', userController.routesFilter);

//router.get('/api/v1/tripReport/:accessToken/:siteId/:fromDate/:toDate', userController.downloadTripReportExcel);


//router.post('/api/v1/getDirections', userController.getDirection);

router.post('/postConfigRatorCutoff', userController.postConfigRatorCutoff);
router.get('/getConfigRatorCutoff/:site_id', userController.getConfigRatorCutoff);
router.post("/getAllSiteList", userController.getAllSiteList);

router.post("/api/v1/notify-driver-list", userController.notify_driver_list);
router.post("/api/v1/driver-app-notification", userController.driver_app_notification);
router.post("/api/v1/driver-sms-notification", userController.driver_sms_notification);
router.post("/api/v1/routeFilter", userController.routeFilter);


router.get('/driver/upcoming_trip', userController.driverUpcomingTrip);

//rback role api
router.post('/rback/role', roleController.roleTypeOperations);
router.post('/rback/role/getAllModuleAndFeatures', roleController.getAllModuleAndFeaturesList);

router.post('/rback/module/insert', moduleController.moduleOperations);
router.post('/rback/module/update', moduleController.moduleOperations);
router.post('/rback/module/delete', moduleController.moduleOperations);
router.post('/rback/module/read', moduleController.moduleOperations);
router.post('/rback/module/readall', moduleController.moduleOperations);

router.post('/rback/feature/insert', featureController.featureOperations);
router.post('/rback/feature/update', featureController.featureOperations);
router.post('/rback/feature/delete', featureController.featureOperations);
router.post('/rback/feature/read', featureController.featureOperations);


// router.delete('/customer-status/:customerId', userController.activateDeActiveCustomer);


//master ms API

// router.post('/sites/checkIsSiteNameExits', userController.checkSiteNameExits);
// router.post('/sites/checkIsSiteNameExits', function (req, res) {
//   res.redirect(307, `${process.env.BASE_URL_MASTER_MS}:8008/api/v1/sites/checkIsSiteNameExits`)
// });

router.post('/sites/checkIsSiteNameExits', userController.checkSiteNameExits);
router.post('/sites/siteListWithPegination', userController.getSiteListWithPegination);
// router.post('/sites/siteListWithPegination', function (req, res) {
//   res.redirect(307, `${process.env.BASE_URL_MASTER_MS}:8008/api/v1/sites/getSiteListWithPegination`)
// });
router.post('/sites/add', userController.addSites);
/* router.post('/sites/add', function (req, res) {
  res.redirect(307, `${process.env.BASE_URL_MASTER_MS}:8008/api/v1/sites/add`)
}); */
router.delete('/site/active-inactive/:siteId', userController.activateDeActiveSite);
// router.get('/site/:siteId', userController.getSiteDetailsById);
router.get('/api/v1/site/:siteId', userController.getRequestRedirect);
router.patch('/sites/update', userController.updateSites);
/* router.patch('/sites/update',  function (req, res) {
  res.redirect(307, `${process.env.BASE_URL_MASTER_MS}:8008/api/v1/sites/update`)
}); */

//Eof master ms API



router.post('/employees/employee_id', userController.duplicateEmployeeIdCheck);
router.get('/shifts/active/:shiftId', userController.activateDeactivateShift);
/* router.get('/shifts/active/:shiftId', (req, res) => {
  res.redirect(`${process.env.BASE_URL_MASTER_MS}:8008/api/v1/shifts/active/${req.params.shiftId}`)
});
 *//* router.post('/update-vehicle-type', (req, res) => {
 res.redirect(307, `${process.env.BASE_URL_ROASTERING_ROUTING_API_MS}:8002/api/v1/update-vehicle-type`)
}) */
router.post('/api/v2/drivers/:driver_id/vehicle_info', userController.postRequestRedirect);
router.post('/update-vehicle-type', userController.editVehicleType);
router.post('/api/v2/drivers/:id/update_current_location', userController.postRequestRedirect);
router.get('/api/v2/drivers/:id/off_duty_web', userController.getRequestRedirect);
router.get('/api/v2/drivers/:id/download_document', userController.driverDocumentDownload);
router.get('/api/v2/vehicles/:id/download_document', userController.vehicleDocumentDownload);

router.post('/log/insert', userController.logging)
module.exports = router;
