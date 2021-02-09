const base_url = process.env.BASE_URL_ROUTING;
const uat_url = process.env.UAT_URL;

//------------Authentication API URL's -------------------------------------------//
const signin = uat_url + '/api/v1/auth/sign_in';
const validateToken = uat_url + '/api/v1/auth/validate_token?';
const signout = uat_url + '/api/v1/auth/sign_out?';

//------------EOF Authentication API URL's -------------------------------------------//

//----------------------Routing Roastering API--------------------------------------//

const createConstraint = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/constraint/insert';
const updateConstraint = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/constraint/update';
const getAllContraints = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/constraint/getall';
const getAllContraintsForSite = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/constraint/getall/site/';
const getContraintById = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/constraint/get/';

const getroasterlist = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/roasterlist';
const addVehicles = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/addvehicle';
const createZones = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/createZones';
const deleteZones = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/delete_zone/';

const getAllGuards = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + `:8002/api/v1/getAllGuards?`;
const getContractListByCustId = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + `:8002/api/v1/getContractListByCustId?`;
const getVehicleData = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + `:8002/api/v1/getVehicleData?`;
const updateEmployeeRoutes = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + `:8002/api/v1/updateEmployeeRoutes`;
const checkConstraintsForAction = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + `:8002/api/v1/checkConstraintsForAction`;
const getConstraintsForSite = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + `:8002/api/v1/getConstraintsForSite?`;
const routesTat = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + `:8002/api/v1/routesTat`;


const getAllEmployees = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + `:8002/api/v1/get_all_employees`

const assignVehicleToTrips = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/assignVehicleToTrip';

const assignExternalVehicleToTrips = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/assignExternalVehicleToTrip';

const addGuardInTrips = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/addGuardInTrip';
const sendallocatedVehicle = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/sendallocatedVehicles';
const customTrip = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/customTrip';
const appVersion = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/appVersion';


const reallocationDriverToTripsUrl = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + `:8002/api/v1/reallocationDriverToTrip`;

const changeTripTypeWithReallocationInternalDriverToTripUrl = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + `:8002/api/v1/changeTripTypeWithReallocationInternalDriverToTrip`;



const reallocationExternalDriverToTripsUrl = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + `:8002/api/v1/reallocationExternalDriverToTrip`

const routeFilter = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/routeFilter';

const notify_driver_list = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/notify-driver-list';


const driver_app_notification = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/driver-app-notification';


const driver_sms_notification = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/driver-sms-notification';


//----------------------EOF Routing Roastering API--------------------------------------//


// const getroasterlist = base_url + ':8002/api/v1/roasterlist';
// const addVehicles = base_url + ':8002/api/v1/addvehicle';
// const createZones = base_url + ':8002/api/v1/createZones';
// const deleteZones = base_url + ':8002/api/v1/delete_zone/';

// const getAllGuards = base_url + `:8002/api/v1/getAllGuards?`;
// const getContractListByCustId = base_url + `:8002/api/v1/getContractListByCustId?`;
// const getVehicleData = base_url + `:8002/api/v1/getVehicleData?`;
// const updateEmployeeRoutes = base_url + `:8002/api/v1/updateEmployeeRoutes`;
// const checkConstraintsForAction = base_url + `:8002/api/v1/checkConstraintsForAction`;
// const getConstraintsForSite = base_url + `:8002/api/v1/getConstraintsForSite?`;
// const routesTat = base_url + `:8002/api/v1/routesTat`;

// const allocateVehicles = base_url + `:8002/api/v1/allocateVehicles`;
// const boundAllocateVahicleAndGenerateRoutes = base_url + `:8002/api/v1/boundAllocateVahicleAndGenerateRoutes`;
// const generateRoutes = base_url + `:8002/api/v1/generateRoutes`;

// const gpsVehicleLocationURL = base_url + `:8002/api/v1/gpsVehicleLocation`
// const adhocEmployeeTrip = base_url + `:8002/api/v1/adhoc_employee_route`
// const getAllEmployees = base_url + `:8002/api/v1/get_all_employees`
// const getRosterEmpDetails = base_url + `:8002/api/v1/getRosterEmpDetails`

// const reallocationDriverToTripsUrl = base_url + `:8002/api/v1/reallocationDriverToTrip`
// const removeGuardFromTrip = base_url + `:8002/api/v1/removeguard`;
// const deleteConstraints = base_url + ':8002/api/v1/constraint/deleteConstraint/';
// const getAllCategory = base_url + ':8002/api/v1/categoryList'
// const uploadEmployeeSchedule = base_url + ':8002/api/v1/employeeupload/upload-employee-shedule/'
// const isDownloadableEmployeeExcel = base_url + ':8002/api/v1/employeeupload/is-downloadable-employee-excel/'

// const empLandmarkZoneUrl = base_url + ':8002/api/v1/getEmpLandmarkZonesList';
// const postConfigRatorCutoffUrl = base_url + ':8002/api/v1/postConfigRatorCutoff';
// const getConfigRatorCutoffUrl = base_url + ':8002/api/v1/getConfigRatorCutoff';

// const copyExistingRoutes = base_url + ':8002/api/v1/copyexistingroutes';

// const routeFilter = base_url + ':8002/api/v1/routeFilter';




//----------------------EOF Routing Roastering API--------------------------------------//


//-----------------------------Induction API URL's ------------------------------//

const getAllBaList = process.env.BASE_URL_INDUCTION_MS + ':8001/api/v1/getBAlist';
const getDashboardTatList = process.env.BASE_URL_INDUCTION_MS + ':8001/api/v1/getDashboardTatList';
const getDetails = process.env.BASE_URL_INDUCTION_MS + ':8001/api/v1/getDetails';
const saveDetails = process.env.BASE_URL_INDUCTION_MS + ':8001/api/v1/saveDetails';
const dashboardFilter = process.env.BASE_URL_INDUCTION_MS + ':8001/api/v1/dashboardFilter';

const getAllSiteList = process.env.BASE_URL_INDUCTION_MS + ':8001/api/v1/getAllSiteList';
const getDocDetails = process.env.BASE_URL_INDUCTION_MS + `:8001/api/v1/induction/docdetails`;
const docdashboard = process.env.BASE_URL_INDUCTION_MS + `:8001/api/v1/induction/docdashboard`;
const getAllRenewDocList = process.env.BASE_URL_INDUCTION_MS + `:8001/api/v1/induction/getAllRenewDocList`;
const addRenewalRequest = process.env.BASE_URL_INDUCTION_MS + `:8001/api/v1/induction/addRenewalRequest`;

const getBgcAgencyList = process.env.BASE_URL_INDUCTION_MS + `:8001/api/v1/getBgcAgencyList`
const searchVehicles = process.env.BASE_URL_INDUCTION_MS + `:8001/api/v1/searchVehicles`
const updateBlacklistStatus = process.env.BASE_URL_INDUCTION_MS + `:8001/api/v1/updateBlacklistStatus`
const activeInactiveResourceStatus = process.env.BASE_URL_INDUCTION_MS + `:8001/api/v1/activeInactiveResourceStatus`

// const getAllSiteList = base_url + ':8001/api/v1/getAllSiteList';
// const getDocDetails = base_url + `:8001/api/v1/induction/docdetails`;
// const docdashboard = base_url + `:8001/api/v1/induction/docdashboard`;
// const getAllRenewDocList = base_url + `:8001/api/v1/induction/getAllRenewDocList`;
// const addRenewalRequest = base_url + `:8001/api/v1/induction/addRenewalRequest`;

// const getBgcAgencyList = base_url + `:8001/api/v1/getBgcAgencyList`
// const searchVehicles = base_url + `:8001/api/v1/searchVehicles`


//--------------------------EOF Induction API URL's ------------------------------//


//-----------------------------Compliance API------------------------------------//


const getdriverchecklist = process.env.BASE_URL_COMPLIANCE_MS + ':8000/api/v1/compliance/driverchecklist';
const driverchecklist = process.env.BASE_URL_COMPLIANCE_MS + ':8000/api/v1/compliance/driverchecklist';
const getvehiclechecklist = process.env.BASE_URL_COMPLIANCE_MS + ':8000/api/v1/compliance/vehiclechecklist';
const vehiclechecklist = process.env.BASE_URL_COMPLIANCE_MS + ':8000/api/v1/compliance/vehiclechecklist';

//--------------------------EOF Compliance API------------------------------------//


//--------------------------EOF Compliance API------------------------------------//


//------------------------------Registration API URL's---------------------------//
const createDriver = uat_url + '/api/v2/drivers';
const createVehicle = uat_url + '/api/v2/vehicles';
const validateLicence = uat_url + '/api/v2/drivers/validate_licence_number?';
const validatePlateNo = uat_url + '/api/v2/vehicles/validate_plate_number?';
const getVehicleModelData = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/vehicles_get_vehicle_model_data';
const getAllDriverList = uat_url + '/api/v2/drivers';

//--------------------------EOF Registration API URL's---------------------------//

const tripBoardList = process.env.BASE_URL_TRIPS_DAHSBOARD_MS + `:8004/api/v1/tripBoardList`;
const removeVehicleFromTrip = process.env.BASE_URL_TRIPS_DAHSBOARD_MS + `:8004/api/v1/remove-trip-vehicle`;
const completeThePendingTrip = process.env.BASE_URL_TRIPS_DAHSBOARD_MS + `:8004/api/v1/completeThePendingTrip`
const cancelTrip = process.env.BASE_URL_TRIPS_DAHSBOARD_MS + `:8004/api/v1/cancelTrip`;
//====================================== Route Allocation APIs ======================================================/
const allocateVehicles = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + `:8002/api/v1/allocateVehicles`;
const boundAllocateVahicleAndGenerateRoutes = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + `:8002/api/v1/boundAllocateVahicleAndGenerateRoutes`;
const getAutoAllocateVehicleGuards = process.env.BASE_URL_TRIPS_DAHSBOARD_MS + `:8004/api/v1/autoAllocationList`;
const autoAllocationFinal = process.env.BASE_URL_TRIPS_DAHSBOARD_MS + `:8004/api/v1/autoAllocationFinal`;
const generateRoutes = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + `:8002/api/v1/generateRoutes`;

const routesFinalize = process.env.BASE_URL_TRIPS_DAHSBOARD_MS + `:8004/api/v1/routesFinalize`;

const routesAuthFinalize = process.env.BASE_URL_TRIPS_DAHSBOARD_MS + `:8004/api/v1/routesAuthenticate`;

const approveNcRoutes = process.env.BASE_URL_TRIPS_DAHSBOARD_MS + `:8004/api/v1/approveNonCompliantRoutes`;



const downloadDoc = process.env.BASE_URL_API_MS + `:4002/download-file/`;
const gpsVehicleLocationURL = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + `:8002/api/v1/gpsVehicleLocation`

const adhocEmployeeTrip = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + `:8002/api/v1/adhoc_employee_route`
const getRosterEmpDetails = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + `:8002/api/v1/getRosterEmpDetails`
const saveEmployeePanicMessage = process.env.BASE_URL_TRIPS_DAHSBOARD_MS + `:8004/api/v1/save-panic-response`
const sendDriverPanicSMS = process.env.BASE_URL_TRIPS_DAHSBOARD_MS + `:8004/api/v1/sendDriverPanicSMS`

const addRemarkInTripForDriverPanic = process.env.BASE_URL_TRIPS_DAHSBOARD_MS + `:8004/api/v1/addRemarkInTripForDriverPanic`



//-------------------------EOF trips dashboard API----------------------------------//


//-----------------------------Contract ms API--------------------------------------//

const downloadSampleContractfile = process.env.BASE_URL_BASE_URL_CONTRACT_MS + `:8003/api/v1/contract/download-samplefile/`;
const uploadContract = process.env.BASE_URL_BASE_URL_CONTRACT_MS + `:8003/api/v1/contract/upload`;
const uploadBAContract = process.env.BASE_URL_BASE_URL_CONTRACT_MS + `:8003/api/v1/bacontract/upload`;
const getZonesBySite = process.env.BASE_URL_BASE_URL_CONTRACT_MS + `:8003/api/v1/zones/`;

//--------------------------EOF Contract ms API--------------------------------------//

//-------------------------Employee Upload -----------------------------------//

const downloadSampleEmployeeUploadfile = process.env.BASE_URL_MASTER_MS + `:8008/api/v1/employee-master/download-sample-format/`;
const employeeUploadfile = process.env.BASE_URL_MASTER_MS + `:8008/api/v1/employee-master/upload-employee`;


//-------------------------Employee Upload -----------------------------------//

//const generateCall = base_url + `:8007/api/v1/call-generate-operator`
//const generateCallDriverAndEmployee = base_url + `:8007/api/v1/call-generate-driver-employee`


//----------------------Calling API------------------------------------------------//

const generateCall = process.env.BASE_URL_MASTER_MS + `:8008/api/v1/call-generate-operator`
const generateCallDriverAndEmployee = process.env.BASE_URL_MASTER_MS + `:8008/api/v1/call-generate-driver-employee`



//-------------------EOF Calling API------------------------------------------------//

//--------------------------Report API ----------------------------------------------//

//const isReportsDownloadableExcelUrl = process.env.BASE_URL_REPORT_MS + ':8005/api/v1/isReportsDownloadable';
const downloadTripReportExcel = process.env.BASE_URL_BASE_URL_REPORT_MS + ':8005/api/v1/tripReport'
const getDirection = process.env.BASE_URL_BASE_URL_REPORT_MS + ':8005/api/v1/getDirections';

//------------------------EOF Report API ----------------------------------------------//
const driverUpcomingTrip = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/driver/upcoming_trip';

//----------------------Roaster Download --------------------------------//
const downloadRoasterfile = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + `:8002/api/v1/roaster-download`;
//---------------------EOF Roaster Download -----------------------------------//

exports.createConstraint = createConstraint;
exports.updateConstraint = updateConstraint;
exports.getAllContraints = getAllContraints;

exports.assignExternalVehicleToTrips = assignExternalVehicleToTrips;


exports.downloadRoasterfile = downloadRoasterfile;

exports.downloadSampleEmployeeUploadfile = downloadSampleEmployeeUploadfile;
exports.employeeUploadfile = employeeUploadfile;

const removeGuardFromTrip = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + `:8002/api/v1/removeguard`;
const getLatLngByTripId = process.env.BASE_URL_TRIPS_DAHSBOARD_MS + `:8004/api/v1/get-lat-lng-by-tripid`
const deleteConstraints = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/constraint/deleteConstraint/';
const getAllCategory = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/categoryList'
const updateTripLatLng = process.env.BASE_URL_TRIPS_DAHSBOARD_MS + ':8004/api/v1/update-trip-lat-lng'
const uploadEmployeeSchedule = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/upload-employee-shedule'
const isDownloadableEmployeeExcel = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/employeeupload/is-downloadable-employee-excel/'
const getVehiclelatlong = process.env.BASE_URL_TRIPS_DAHSBOARD_MS + ':8004/api/v1/getVehiclelatlong';
const copyExistingRoutes = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/copyexistingroutes';
const isReportsDownloadableExcelUrl = process.env.BASE_URL_BASE_URL_REPORT_MS + ':8005/api/v1/isReportsDownloadable';
const empLandmarkZoneUrl = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/getEmpLandmarkZonesList';

const postConfigRatorCutoffUrl = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/postConfigRatorCutoff';
const getConfigRatorCutoffUrl = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/getConfigRatorCutoff';
// const driverUpcomingTrip = base_url + ':8002/api/v1/driver/upcoming_trip';

//master
const activateDeActiveSite = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/site/active-inactive/';
const activateDeActiveCustomer = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/customer-status/';
const getSiteBySiteId = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/site/';
const activeInactiveEmployee = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/employee/active-inactive/';
const getEmployeeDetailsById = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/employee/';
const getEmployeeDetailsList = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/employees';

const getSetupScheduleList = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/get-setup-schedule-list';
const updateSchedule = process.env.BASE_URL_MASTER_MS + ":8008/api/v1/employee/update-schedule";
const copySchedule = process.env.BASE_URL_MASTER_MS + ":8008/api/v1/employee/copy-schedule";

const checkSiteNameExits = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/sites/checkIsSiteNameExits';
const getSiteListWithPegination = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/sites/getSiteListWithPegination';

const billing_zone_list = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/employee-master/billing-zone-list';

const getLatLngFromAddress = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/employee-master/getLatLngFromAddress';

const addEditShifts = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/shifts/addEditShift';

const checkBAEmailDuplication = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/business_associate/check-email';
const checkBAPhoneDuplication = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/business_associate/check-phone';

const filterRequestList = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/request-list';
const addVehiclesMaster = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/vehicles';
const updateVehicle = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/vehicles';
const findDraftVehicleById = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/vehicles';

const editVehicleType = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/update-vehicle-type';

const goOnDuty = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/drivers/';
const requestStateChange = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/request-approve-decline';
const vehicleOkNow = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/drivers/';
const updateCurrentLocationV1 = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/drivers/';
const getEmployeeDetailsByIdV1 = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/employees/';
const verifyEmail = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/verify_email';
const startTrip = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/trips/';
const employeeRate = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/employee_trips/';
const employeeTripDismiss = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/employee_trips/';
const updateEmployeeSiteRole = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/employee/employee-site-role-update';
const getEmployeeSiteRole = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/employee/employee-site-role-list';
const employeeOnBoard = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/employee_trips/';
const employeeSatisfaction = process.env.BASE_URL_BASE_URL_REPORT_MS + ":8005/api/v1/employeeSatisfaction/";
const vehicleDeployment = process.env.BASE_URL_BASE_URL_REPORT_MS + ":8005/api/v1/vehicleDeployment/";
const noShowAndCancellations = process.env.BASE_URL_BASE_URL_REPORT_MS + ":8005/api/v1/noShowAndCancellations/";
const otdSummary = process.env.BASE_URL_BASE_URL_REPORT_MS + ":8005/api/v1/otdSummary/"
const driverActivities = process.env.BASE_URL_BASE_URL_REPORT_MS + ":8005/api/v1/driverActivity"
const shiftWiseNoShow = process.env.BASE_URL_BASE_URL_REPORT_MS + ":8005/api/v1/shiftWiseNoShow/"
const moduleFeatures = process.env.BASE_URL_BASE_URL_REPORT_MS + ":8005/api/v1/report/module-features"
const driverActiveDeactive = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/drivers/';
const driverBlacklisted = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/drivers/';
const vehicleActiveDeactive = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/vehicles/';
const getEmployeeOnBoard = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/trips/';
const newTripRequest = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/employee_trips?'
const changeTripRequest = process.env.BASE_URL_MASTER_MS + ":8008/api/v1/employee_trips/"
//const changeTripRequest = "http://localhost:8008/api/v1/employee_trips/"
const generateCallByOperator = process.env.BASE_URL_MASTER_MS + ":8008/api/v1/driver/"
const requestDriverArrived = process.env.BASE_URL_MASTER_MS + ":8008/api/v1";
const requestUpdateUserStatus = process.env.BASE_URL_MASTER_MS + ":8008/api/v1";
const vehicleBrokeDown = process.env.BASE_URL_MASTER_MS + ":8008/api/v1/vehicles/";
const tripRated = process.env.BASE_URL_MASTER_MS + ":8008/api/v1/employee_trips/";
const addBA = process.env.BASE_URL_MASTER_MS + ":8008/api/v1/business_associate/add";
const duplicateEmployeeEmail = process.env.BASE_URL_MASTER_MS + ":8008/api/v1/employee/emailId";
const duplicateEmployeePhone = process.env.BASE_URL_MASTER_MS + ":8008/api/v1/employee/phoneNo";
const driverListing = process.env.BASE_URL_MASTER_MS + ":8008/api/v1/driver/listing/";
const updateProfPic = process.env.BASE_URL_MASTER_MS + ":8008/api/v1/driver/updateProfPic";
const validatePlateNumber = process.env.BASE_URL_MASTER_MS + ":8008/api/v1/vehicles/validate-plate-number";
const validateLicenceNumber = process.env.BASE_URL_MASTER_MS + ":8008/api/v1/drivers/validate-license-number";
const masterPostRequest = process.env.BASE_URL_MASTER_MS + ":8008/api/v1";
const vehicleDownload = process.env.BASE_URL_BASE_URL_REPORT_MS + ":8005/api/v1/vehicleDownload/";
const downloadRouteUploadFile = process.env.BASE_URL_MASTER_MS + ":8008/api/v1/download-sample-upload-routes";
const downloadRouteUploadedFile = process.env.BASE_URL_MASTER_MS + ":8008/api/v1/download-routes-uploaded-file/";
const routeUpload = process.env.BASE_URL_MASTER_MS + ":8008/api/v1/upload-routes";
const getRoutesUploadedList = process.env.BASE_URL_MASTER_MS + ":8008/api/v1/get-routes-uploaded-list";


const updateBAstatus = process.env.BASE_URL_MASTER_MS + ":8008/api/v1/BA/updateStatus";
const getBaList = process.env.BASE_URL_MASTER_MS + ":8008/api/v1/BA/list";
const getDetailsById = process.env.BASE_URL_MASTER_MS + ":8008/api/v1/BA/detailsById";
const appVersion1 = process.env.BASE_URL_MASTER_MS + ":8008/api/v1/appVersion"

exports.updateBAstatus = updateBAstatus;
exports.getBaList = getBaList;
exports.getDetailsById = getDetailsById;

exports.createConstraint = createConstraint;
exports.updateConstraint = updateConstraint;
exports.getAllContraints = getAllContraints;

exports.addEditShifts = addEditShifts;

exports.getAllContraintsForSite = getAllContraintsForSite;
exports.getContraintById = getContraintById;
exports.signin = signin;
exports.validateToken = validateToken;
exports.signout = signout;
exports.getAllBaList = getAllBaList;
exports.getDashboardTatList = getDashboardTatList;
exports.getDetails = getDetails;
exports.saveDetails = saveDetails;
exports.dashboardFilter = dashboardFilter;
exports.getdriverchecklist = getdriverchecklist;
exports.driverchecklist = driverchecklist;
exports.getvehiclechecklist = getvehiclechecklist;
exports.vehiclechecklist = vehiclechecklist;
exports.createDriver = createDriver;
exports.createVehicle = createVehicle;
exports.validateLicence = validateLicence;
exports.validatePlateNo = validatePlateNo;
exports.getAllDriverList = getAllDriverList;
exports.getroasterlist = getroasterlist;
exports.addVehicles = addVehicles;
exports.createZones = createZones;
exports.deleteZones = deleteZones;
exports.getAllSiteList = getAllSiteList;
exports.getAllGuards = getAllGuards;
exports.getContractListByCustId = getContractListByCustId;
exports.getVehicleData = getVehicleData;
exports.generateRoutes = generateRoutes;
exports.updateEmployeeRoutes = updateEmployeeRoutes;
exports.getConstraintsForSite = getConstraintsForSite;
exports.checkConstraintsForAction = checkConstraintsForAction;
exports.routesTat = routesTat;
exports.tripBoardList = tripBoardList;
exports.completeThePendingTrip = completeThePendingTrip;
exports.cancelTrip = cancelTrip;
exports.getAutoAllocateVehicleGuards = getAutoAllocateVehicleGuards;
exports.allocateVehicles = allocateVehicles;
exports.boundAllocateVahicleAndGenerateRoutes = boundAllocateVahicleAndGenerateRoutes;
exports.getDocDetails = getDocDetails;
exports.docdashboard = docdashboard;
exports.routesFinalize = routesFinalize;
exports.routesAuthFinalize = routesAuthFinalize;
exports.getAllRenewDocList = getAllRenewDocList;
exports.addRenewalRequest = addRenewalRequest;
exports.updateBlacklistStatus = updateBlacklistStatus;
exports.activeInactiveResourceStatus = activeInactiveResourceStatus;
exports.downloadSampleContractfile = downloadSampleContractfile;
exports.uploadContract = uploadContract;
exports.downloadDoc = downloadDoc;
exports.uploadBAContract = uploadBAContract;
exports.getZonesBySite = getZonesBySite;
exports.gpsVehicleLocationURL = gpsVehicleLocationURL;
exports.autoAllocationFinal = autoAllocationFinal;
exports.adhocEmployeeTrip = adhocEmployeeTrip;
exports.getAllEmployees = getAllEmployees;
exports.getBgcAgencyList = getBgcAgencyList;
exports.removeVehicleFromTrip = removeVehicleFromTrip;
exports.searchVehicles = searchVehicles;
exports.getRosterEmpDetails = getRosterEmpDetails;
exports.generateCall = generateCall;
exports.saveEmployeePanicMessage = saveEmployeePanicMessage;
exports.reallocationDriverToTripsUrl = reallocationDriverToTripsUrl;
exports.reallocationExternalDriverToTripsUrl = reallocationExternalDriverToTripsUrl;
exports.changeTripTypeWithReallocationInternalDriverToTripUrl = changeTripTypeWithReallocationInternalDriverToTripUrl;
exports.generateCallDriverAndEmployee = generateCallDriverAndEmployee;
exports.addRemarkInTripForDriverPanic = addRemarkInTripForDriverPanic;
exports.sendDriverPanicSMS = sendDriverPanicSMS;
exports.removeGuardFromTrip = removeGuardFromTrip;
exports.getLatLngByTripId = getLatLngByTripId;
exports.deleteConstraints = deleteConstraints;
exports.getAllCategory = getAllCategory;
exports.updateTripLatLng = updateTripLatLng;
exports.uploadEmployeeSchedule = uploadEmployeeSchedule;
exports.isDownloadableEmployeeExcel = isDownloadableEmployeeExcel;
exports.getVehiclelatlong = getVehiclelatlong;
exports.copyExistingRoutes = copyExistingRoutes;
exports.isReportsDownloadableExcelUrl = isReportsDownloadableExcelUrl;
exports.empLandmarkZoneUrl = empLandmarkZoneUrl;
exports.assignVehicleToTrips = assignVehicleToTrips;
exports.addGuardInTrips = addGuardInTrips;
exports.sendallocatedVehicle = sendallocatedVehicle;
exports.customTrip = customTrip;
exports.appVersion = appVersion;

// configrator cutoff api 
exports.postConfigRatorCutoffUrl = postConfigRatorCutoffUrl;
exports.getConfigRatorCutoffUrl = getConfigRatorCutoffUrl;


// exports.driverUpcomingTrip = driverUpcomingTrip;

exports.routeFilter = routeFilter;

exports.notify_driver_list = notify_driver_list;
exports.driver_app_notification = driver_app_notification;
exports.driver_sms_notification = driver_sms_notification;

exports.downloadTripReportExcel = downloadTripReportExcel;
exports.getDirection = getDirection;

const tripReport = process.env.BASE_URL_BASE_URL_REPORT_MS + ':8005/api/v1/tripReport/';
const employeeLogReport = process.env.BASE_URL_BASE_URL_REPORT_MS + ':8005/api/v1/employeeLogReport/';
const OTAReport = process.env.BASE_URL_BASE_URL_REPORT_MS + ':8005/api/v1/OTAReport/';
const OTDReport = process.env.BASE_URL_BASE_URL_REPORT_MS + ':8005/api/v1/OTDReport/';
const OTASummaryReport = process.env.BASE_URL_BASE_URL_REPORT_MS + ':8005/api/v1//OTASummary/';
const shiftFleetUtilizationReport = process.env.BASE_URL_BASE_URL_REPORT_MS + ':8005/api/v1/shiftFleetUtilizationSummary/';
const dailyShiftWiseOccupency = process.env.BASE_URL_BASE_URL_REPORT_MS + ':8005/api/v1/dailyShiftWiseOccupency/';
const getDirections = process.env.BASE_URL_BASE_URL_REPORT_MS + ':8005/api/v1/getDirections';

exports.tripReport = tripReport;
exports.employeeLogReport = employeeLogReport;
exports.OTAReport = OTAReport;
exports.OTDReport = OTDReport;
exports.dailyShiftWiseOccupency = dailyShiftWiseOccupency;
exports.getDirections = getDirections;
exports.OTASummaryReport = OTASummaryReport;
exports.shiftFleetUtilizationReport = shiftFleetUtilizationReport;

const downloadEmployeeSchedule = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/employeeupload/downloadEmployeeExcel/'
exports.downloadEmployeeSchedule = downloadEmployeeSchedule;
exports.driverUpcomingTrip = driverUpcomingTrip;

const addSites = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/sites/add'
exports.addSites = addSites;

//master
exports.activateDeActiveCustomer = activateDeActiveCustomer;
exports.activateDeActiveSite = activateDeActiveSite;
exports.getSiteBySiteId = getSiteBySiteId;

exports.checkSiteNameExits = checkSiteNameExits;
exports.getSiteListWithPegination = getSiteListWithPegination;
exports.billing_zone_list = billing_zone_list;
exports.getLatLngFromAddress = getLatLngFromAddress;

const updateSites = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/sites/update'
exports.updateSites = updateSites;

const duplicateEmployeeIdCheck = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/employee/employee_id'
exports.duplicateEmployeeIdCheck = duplicateEmployeeIdCheck;
const activateDeactivateShift = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/shifts/active'
exports.activateDeactivateShift = activateDeactivateShift

exports.activeInactiveEmployee = activeInactiveEmployee;
exports.getEmployeeDetailsById = getEmployeeDetailsById;
exports.getEmployeeDetailsList = getEmployeeDetailsList;
exports.getSetupScheduleList = getSetupScheduleList;
exports.checkBAEmailDuplication = checkBAEmailDuplication;
exports.checkBAPhoneDuplication = checkBAPhoneDuplication;
exports.filterRequestList = filterRequestList;

const driverOffDutyNotificationReport = process.env.BASE_URL_BASE_URL_REPORT_MS + ':8005/api/v1/driverOffDutyNotificationReport/';
const getCutOffTime = process.env.BASE_URL_ROASTERING_ROUTING_API_MS + ':8002/api/v1/getcutofftime'

const driverDocumentDownload = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/drivers/';
exports.driverDocumentDownload = driverDocumentDownload;

const vehicleDocumentDownload = process.env.BASE_URL_MASTER_MS + ':8008/api/v1/vehicles/';
exports.vehicleDocumentDownload = vehicleDocumentDownload;

exports.getCutOffTime = getCutOffTime
exports.driverOffDutyNotificationReport = driverOffDutyNotificationReport;
exports.editVehicleType = editVehicleType
exports.addVehiclesMaster = addVehiclesMaster;
exports.findDraftVehicleById = findDraftVehicleById;
exports.goOnDuty = goOnDuty;
exports.requestStateChange = requestStateChange;
exports.vehicleOkNow = vehicleOkNow;
exports.updateCurrentLocationV1 = updateCurrentLocationV1;
exports.getEmployeeDetailsByIdV1 = getEmployeeDetailsByIdV1;
exports.verifyEmail = verifyEmail;
exports.startTrip = startTrip;
exports.employeeRate = employeeRate;
exports.employeeTripDismiss = employeeTripDismiss;
exports.getEmployeeSiteRole = getEmployeeSiteRole;
exports.updateEmployeeSiteRole = updateEmployeeSiteRole;
exports.employeeOnBoard = employeeOnBoard;

exports.employeeSatisfaction = employeeSatisfaction;
exports.vehicleDeployment = vehicleDeployment;
exports.noShowAndCancellations = noShowAndCancellations;
exports.otdSummary = otdSummary;

exports.driverActivities = driverActivities;
exports.shiftWiseNoShow = shiftWiseNoShow;
exports.moduleFeatures = moduleFeatures;
exports.driverActiveDeactive = driverActiveDeactive;
exports.driverBlacklisted = driverBlacklisted;
exports.vehicleActiveDeactive = vehicleActiveDeactive;
exports.getEmployeeOnBoard = getEmployeeOnBoard;
exports.newTripRequest = newTripRequest;
exports.changeTripRequest = changeTripRequest;
exports.generateCallByOperator = generateCallByOperator;
exports.requestDriverArrived = requestDriverArrived;
exports.requestUpdateUserStatus = requestUpdateUserStatus;
exports.vehicleBrokeDown = vehicleBrokeDown;
exports.tripRated = tripRated;
exports.addBA = addBA;
exports.duplicateEmployeeEmail = duplicateEmployeeEmail;
exports.duplicateEmployeePhone = duplicateEmployeePhone;
exports.driverListing = driverListing;
exports.updateProfPic = updateProfPic;
exports.validateLicenseNumber = validateLicenceNumber;
exports.validatePlateNumber = validatePlateNumber;
exports.masterPostRequest = masterPostRequest;

exports.copySchedule = copySchedule;
exports.updateSchedule = updateSchedule;
exports.updateVehicle = updateVehicle;
exports.getVehicleModelData = getVehicleModelData;
exports.vehicleDownload = vehicleDownload;
exports.downloadRouteUploadFile = downloadRouteUploadFile;
exports.downloadRouteUploadedFile = downloadRouteUploadedFile;
exports.routeUpload = routeUpload;
exports.getRoutesUploadedList = getRoutesUploadedList;
exports.approveNcRoutes = approveNcRoutes;
exports.appVersion1 = appVersion1;