//WITHOUT GATEWAY 
//BASE URL production
// export const API_BASE_URL = "http://iam.itac.cogniphi.com";
// export const API_BASE_URL2 = "http://itac.cogniphi.com";
// export const ITAC_Bata_API = "http://itac.cogniphi.com:11038";
// export const ITAC_Bata_API2 = "http://itac.cogniphi.com:11039";
// export const ITAC_PACKET_DATA="http://3.108.230.88";
// BASE URL qa
// export const API_BASE_URL = "http://13.233.229.160:8080";
// export const API_BASE_URL2 = "http://13.233.175.113";
// export const ITAC_Bata_API = "http://13.233.175.113:11038";
// export const ITAC_Bata_API2 = "http://13.233.175.113:11039";
//export const ITAC_PACKET_DATA="http://13.233.175.113";
//FULL URL without gateway
//export const getAuthApiUrl = (endpoint) => API_BASE_URL + endpoint;
//export const getAuthApiUrl2 = (endpoint) => API_BASE_URL2 + endpoint;
// export const getITACUrl = (endpoint) => ITAC_Bata_API + endpoint;
// export const getITACUrl2 = (endpoint) => ITAC_Bata_API2 + endpoint;

//GATEWAY
//BASE URL production
// export const API_BASE_URL2 = "http://43.204.11.101:8081/gateway";
//  export const ITAC_PACKET_DATA="http://3.108.230.88";

//BASE URL QA
export const API_BASE_URL2 = "http://13.233.175.113:8081/gateway";
export const ITAC_PACKET_DATA="http://13.233.175.113";

//BASE URL DEV
// export const API_BASE_URL2 = "http://52.66.95.69:8081/gateway";
// export const ITAC_PACKET_DATA="http://52.66.95.69";

//FullUrl with gateway 

export const getApiUrl2 = (endpoint) => API_BASE_URL2 + endpoint;
export const getPacketApiUrl=(endpoint) => ITAC_PACKET_DATA + endpoint;





export const LOGIN_FCM = getApiUrl2("/api/update-fcm");
export const LOGOUT_FCM= getApiUrl2("/api/remove-driver-fcm");
export const GET_USER_ID = getApiUrl2("/api/get/user-id");
export const VERIFY_USER = getApiUrl2("/api/execute-forgot-password");
export const UPDATE_PASS = getApiUrl2("/api/update-password");
export const GET_USER_DETAIL = getApiUrl2("/api/user-detail");
export const POST_GCM_DETAILS=getApiUrl2("/saveGcmDetails");
export const UPDATE_TRIP_STATUS = getApiUrl2("/trips/update-status");
//permit
//export const GET_PERMITS_DETAILS = getPermitUrl(":11018/api/users/");

export const GET_PERMITS_DETAILS = getApiUrl2("/api/users/");//q
export const GET_OTP= getApiUrl2("/driver/trip/otp");//q
export const POST_OTP_VALIDATED= getApiUrl2("/driver/trip/otpvalidation");//q
export const POST_FEEDBACK= getApiUrl2("/rating/feedback");//q
export const UPLOAD_SIGNATURE=getApiUrl2("/api/upload-image")//q
export const POST_SIGNATURE=getApiUrl2("/driver/trip/signature")//q
export const GET_DEVICE_STATUS=getApiUrl2("/location/vehicle-location")
//export const POST_LOCATION_DATA=getApiUrl2("")
export const POST_LOCATION_DATA=getPacketApiUrl(":11028")
//http://{{itac_qa}}:11019/location/vehicle-location
export const POST_UUID=getApiUrl2("/api/save-uuid")//q

export const GET_RECENT_TRIP=getApiUrl2("/trips/driver-trips")//q
export const CHECK_MANDATORY_VALIDATION=getApiUrl2("/validator/validate")//q
export const GET_TRIP_DETAILS_BY_ID = getApiUrl2(
  "/trips/list-trips/"
);
export const GET_TRACK_VEHICLE = getApiUrl2(
  "/tracking/vehicle-track"
);
export const GET_TRACK = getApiUrl2("/tracking/getTrack");

export const GET_TRIP_DETAILS_BY_DRIVER_ID = getApiUrl2(
  "/trips/driver-trips/"
);
export const GET_TRIPS_BY_DRIVERID = getApiUrl2(
  "/trips/driver-trips/"
);
export const GET_TRIP_BY_TRIP_ID = getApiUrl2("/trips/detail/");

export const GETDRIVERS = getApiUrl2("/api/detail/");
export const GETDRIVERS_BY_DRIVER_ID = getApiUrl2("/api/detail/");
export const UPLOAD_IMAGE = getApiUrl2("/api/upload");
export const UPDATE_LICENCE = getApiUrl2("/api/update-license");
export const UPDATE_USER_INFO = getApiUrl2("/api/update-user");
export const GET_VALIDATED = getApiUrl2(
  "/api/validation-regex"
);


// export const GET_VALIDATED="http://52.66.95.69:11020/api/validation-regex"


export const GET_NOTIFICATIONS = getApiUrl2(
  "/notifications/getMobileNotificationList/"
);
export const GET_CURRENCY_BY_ORG_ID = getApiUrl2(
  "/api/Currency/GetDefaultCurrency?orgid="
);
////////////////ITAC_Bata_API
// export const GET_CUSTOMER_BY_ID = getApiUrl2(
//   "/api/Customer/GetCustomerByID?customerid="
// );

export const GET_CUSTOMER_BY_ID = getApiUrl2(
  "/trips/customer?tripId="
);
export const GET_TOTAL_BATA = getApiUrl2(
  "/api/TripDriver/GetTotalBataByDriverID?driverid="
);
export const CREATE_TRIP = getApiUrl2("/api/TripDriver/CreateTrip?source=app");
export const GET_ALL_EXPENSE_TYPE = getApiUrl2(
  "/api/IncomeExpenseType/GetAllExpenseType?source=mobile"
);
//////////////// EXPENSE
export const GET_EXPENSE_TYPES = getApiUrl2("/api/IncomeExpenseType/GetType");
export const DELETE_EXPENSE_BY_ID = getApiUrl2(
  "/api/Expense/DeleteExpenseByIdAsync?expenseid="
);
export const GET_EXPENSE_BY_TRIPID = getApiUrl2(
  "/api/Expense/GetExpensesByTripID?tripid="
);
export const GET_EXPENSE_BY_DRIVER_ID = getApiUrl2(
  "/api/Expense/GetExpensesByDriverID?driverid="
);
export const UPDATE_EXPENSE = getApiUrl2("/api/Expense/UpdateExpense");
export const CREATE_EXPENSE = getApiUrl2("/api/Expense/CreateExpense");
export const BATA_GET_TRIP_BY_TRIP_ID = getApiUrl2(
  "/api/TripDriver/GetDriverTripByTripID?tripid="
);
export const GET_EXPENSE_BY_ID = getApiUrl2(
  "/api/Expense/GetExpenseByID?expenseid="
);
export const GET_EXPENSE_TYPE_BY_ID = getApiUrl2(
  "/api/IncomeExpenseType/GetTypeByID?typeid="
);
export const GET_ADV_AMOUNT_BY_T_ID = getApiUrl2(
  "/api/Expense/GetDriverAdvanceAmountByTripID?tripId="
);
export const CUSTOMER_AMOUNT = getApiUrl2(
  "/api/Income/GetAmountReceivedFromCustomerByTripID?tripid="
);
// //////////LOCTION
const API_KEY = "AIzaSyCHPaQI4Y4Lm9NZdSXXt3W4l_qqKAHM5x0";
export const GEO_CODING = `https://maps.googleapis.com/maps/api/geocode/json?key=${[
  API_KEY,
]}&latlng=`;
export const ADD_NOTE = getApiUrl2("/api/TripNotes/CreateTripNotes");
export const GET_NOTE = getApiUrl2(
  "/api/TripNotes/GetTripNotesByTripID?tripid="
);
export const TOTAL_DISTANCE = getApiUrl2(
  "/api/TripDriver/GetTotalDistanceByDriverID?driverid="
);
export const MARK_AS_READ = getApiUrl2(
  `/notifications/read-notification/`
);
export const MARK_NOTE_AS_READ = getApiUrl2("/api/TripNotes/read-note/");


export const GET_ORG_LEVEL_SETTINGS = getApiUrl2("/api/get-org-level-settings/");
