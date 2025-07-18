//BASE URL
export const API_BASE_URL = "http://iam.itac.cogniphi.com";
export const API_BASE_URL2 = "http://itac.cogniphi.com";
export const ITAC_Bata_API = "http://itac.cogniphi.com:11038";
// export const ITAC_Bata_API = "https://ad4a-103-15-67-130.ngrok-free.app";
export const ITAC_Bata_API2 = "http://itac.cogniphi.com:11039";
//FULL URL
export const getAuthApiUrl = (endpoint) => API_BASE_URL + endpoint;
export const getAuthApiUrl2 = (endpoint) => API_BASE_URL2 + endpoint;
export const getITACUrl = (endpoint) => ITAC_Bata_API + endpoint;
export const getITACUrl2 = (endpoint) => ITAC_Bata_API2 + endpoint;
/////////////// AUTH URLS
export const ACCESS_TOKEN = getAuthApiUrl(
  "/auth/realms/itac20/protocol/openid-connect/token"
);
export const LOGIN_FCM = getAuthApiUrl2(":11020/api/update-fcm");
export const GET_USER_ID = getAuthApiUrl2(":11020/api/get/user-id");
export const VERIFY_USER = getAuthApiUrl2(":11020/api/execute-forgot-password");
export const UPDATE_PASS = getAuthApiUrl2(":11020/api/update-password");
export const GET_USER_DETAIL = getAuthApiUrl2(":11020/api/user-detail");
export const UPDATE_TRIP_STATUS = getAuthApiUrl2(":11014/trips/update-status");
export const GET_TRIP_DETAILS_BY_ID = getAuthApiUrl2(
  ":11014/trips/list-trips/"
);
export const GET_TRACK_VEHICLE = getAuthApiUrl2(
  ":11013/tracking/vehicle-track"
);
export const GET_TRACK = getAuthApiUrl2(":11013/tracking/getTrack");

export const GET_TRIP_DETAILS_BY_DRIVER_ID = getAuthApiUrl2(
  ":11014/trips/driver-trips/"
);
export const GET_TRIPS_BY_DRIVERID = getAuthApiUrl2(
  ":11014/trips/driver-trips/"
);


//
export const GET_TRIP_BY_TRIP_ID = getAuthApiUrl2(":11014/trips/detail/");
export const GETDRIVERS = getAuthApiUrl2(":11022/api/detail/");
export const GETDRIVERS_BY_DRIVER_ID = getAuthApiUrl2(":11022/api/detail/");
export const UPLOAD_IMAGE = getAuthApiUrl2(":11018/api/upload");
export const UPDATE_LICENCE = getAuthApiUrl2(":11022/api/update-license");
export const UPDATE_USER_INFO = getAuthApiUrl2(":11020/api/update-user");
export const GET_NOTIFICATIONS = getAuthApiUrl2(
  ":11017/notifications/getMobileNotificationList/"
);
export const GET_CURRENCY_BY_ORG_ID = getITACUrl(
  "/api/Currency/GetDefaultCurrency?orgid="
);
////////////////ITAC_Bata_API
export const GET_CUSTOMER_BY_ID = getITACUrl(
  "/api/Customer/GetCustomerByID?customerid="
);
export const GET_TOTAL_BATA = getITACUrl(
  "/api/TripDriver/GetTotalBataByDriverID?driverid="
);
export const CREATE_TRIP = getITACUrl("/api/TripDriver/CreateTrip?source=app");
export const GET_ALL_EXPENSE_TYPE = getITACUrl2(
  "/api/IncomeExpenseType/GetAllExpenseType?source=mobile"
);
//////////////// EXPENSE
export const GET_EXPENSE_TYPES = getITACUrl2("/api/IncomeExpenseType/GetType");
export const DELETE_EXPENSE_BY_ID = getITACUrl2(
  "/api/Expense/DeleteExpenseByIdAsync?expenseid="
);
export const GET_EXPENSE_BY_TRIPID = getITACUrl2(
  "/api/Expense/GetExpensesByTripID?tripid="
);
export const GET_EXPENSE_BY_DRIVER_ID = getITACUrl2(
  "/api/Expense/GetExpensesByDriverID?driverid="
);
export const UPDATE_EXPENSE = getITACUrl2("/api/Expense/UpdateExpense");
export const CREATE_EXPENSE = getITACUrl2("/api/Expense/CreateExpense");
export const BATA_GET_TRIP_BY_TRIP_ID = getITACUrl(
  "/api/TripDriver/GetDriverTripByTripID?tripid="
);
export const GET_EXPENSE_BY_ID = getITACUrl2(
  "/api/Expense/GetExpenseByID?expenseid="
);
export const GET_EXPENSE_TYPE_BY_ID = getITACUrl2(
  "/api/IncomeExpenseType/GetTypeByID?typeid="
);
export const GET_ADV_AMOUNT_BY_T_ID = getITACUrl2(
  "/api/Expense/GetDriverAdvanceAmountByTripID?tripId="
);
export const CUSTOMER_AMOUNT = getITACUrl2(
  "/api/Income/GetAmountReceivedFromCustomerByTripID?tripid="
);
// //////////LOCTION
const API_KEY = "AIzaSyCHPaQI4Y4Lm9NZdSXXt3W4l_qqKAHM5x0";
export const GEO_CODING = `https://maps.googleapis.com/maps/api/geocode/json?key=${[
  API_KEY,
]}&latlng=`;
export const ADD_NOTE = getITACUrl("/api/TripNotes/CreateTripNotes");
export const GET_NOTE = getITACUrl(
  "/api/TripNotes/GetTripNotesByTripID?tripid="
);
export const TOTAL_DISTANCE = getITACUrl(
  "/api/TripDriver/GetTotalDistanceByDriverID?driverid="
);

export const MARK_AS_READ = getAuthApiUrl2(
  `:11017/notifications/read-notification/`
);
