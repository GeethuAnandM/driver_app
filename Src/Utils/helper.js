import moment from "moment";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";
import { tripTypes } from "../Constant/constant";
import { tripStore } from "../Store/AuthStore/TripStore";
import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
import { showMessage } from "react-native-flash-message";
//import Geolocation from "react-native-geolocation-service";
import BackgroundTimer from "react-native-background-timer";
import * as SVG from "../Assets/SVG";

import VersionCheck from 'react-native-version-check';
import { apiGet, clearUserData, getAuthData, getItem, removeItem, setItem } from "../Services/apiCalls";
import { authStore } from "../Store/AuthStore/AuthStore";
import DeviceInfo from 'react-native-device-info';
import { imageStore } from "../Store/AuthStore/ImageStore";
import { expenseStore } from "../Store/AuthStore/ExpenseStore";
import DocumentPicker from 'react-native-document-picker';
import ImageCropPicker from "react-native-image-crop-picker";
import Geolocation from "react-native-geolocation-service";
import { checkForUpdate, UpdateFlow } from 'react-native-in-app-updates';
//import BackgroundGeolocation from 'react-native-background-geolocation';
// import { HeadlessJsTaskService, AsyncStorage } from "react-native"; // Import necessary modules
import {
  getDeviceStatus,
  getTripDetails,
  postLocationData,
  postBackgroundLocation,
  postGcm,
} from "../Services/Actions/TripActions";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { GET_TRIP_BY_TRIP_ID } from "../Services/urls";
import { gpsStore } from "../Store/AuthStore/GpsStore";
import {logCustomEvent} from '../Utils/analytics';
import { verifyDoc } from "./docFormatCheck";
import { getValidated, signOut } from "../Services/Actions/AuthActions";
import * as yup from "yup";
import { EXPENSE_VALIDATION_STRING, PASS_PHONE, VALIDATE_TYPE } from "./validator";
import { trackImageCapture } from "./MixpanelService";
// import { verifyDoc } from "./docFormatCheck";
export const formatedDate = (dateTime, type) => {
  if (dateTime !== null) {
    var date = moment(dateTime).format("DD-MM-YYYY");
    var time = moment(dateTime).format("hh:mmA");
    switch (type) {
      case "date":
        return `${date}`;
      case "time":
        return `${time}`;
      default:
        return `${date} ${time}`;
    }
  } else return "-";
};

export const isNotNull = (string) => {
  if (string === null || string === undefined) {
    return "-";
  } else {
    return string;
  }
};
export const isValidInput = (input, type) => {
  if (type === "expenseBill") {
    console.log("e",input);
    // const regex = /^\d+(\.\d+)?$/;
    // return regex.test(input);
   
    if (input) {
      // This regex allows up to 6 digits before the decimal point and up to 2 digits after
      const regex = /^\d{1,6}(\.\d{0,2})?$/;
  
      if (regex.test(input)) {
        if (input.includes(".")) {
          const decimalPartLength = input.split('.')[1]?.length || 0;
          
          if (decimalPartLength <= 2) {
            return { isValid: true, message: "Input is valid." };
          } else {
            return { isValid: false, message: "Allows only 2 decimal places." };
          }
        } else {
          return { isValid: true, message: "Input is valid." };
        }
      } else {
        return { isValid: false, message: "Allows only up to 6 digits and maximum 2 decimal points"  };
       
    } 
  }else {
      return { isValid: false, message: "Input is empty or undefined." };
    }
  
    
  } else {
    // Regular expression to match only digits
    const regex = /^[0-9]+$/;
    return regex.test(input);
  }
};
export const getCurrentDateTime = () => {
  return moment().format("YYYY-MM-DD HH:mm:ss");
};

export const inputValidation = (input,type) => {
  if(type=="expenseBill"){
    const { isValid, message } = isValidInput(input, type);
     return { isValid: isValid, message: message };
  }
  else{
    if (isValidInput(input)) {
      // Input is valid, proceed with further processing
      console.log(">>>vlaid")
      return true;
    } else {
      // Invalid input, display error message or take appropriate action
      console.log(">>>>>invalid")
      return false;
    }
  }
 
};

export const tripStatusFilter = (status) => {
  let filters = tripTypes;

  switch (status) {
    case filters[0]:
      return tripStore.TripList;
    case filters[1]:
      return tripStore.notStarted;
    case filters[2]:
      return tripStore.inProgress;
    case filters[3]:
      return tripStore.completed;
    case filters[4]:
      return tripStore.cancelled;
    default:
      break;
  }
};

export const ExpTypeFilter = (arr) => {
  let filters = ["Vehicle", "Trip", "General"];
  var Vehicle = arr.filter((ele) => ele.subType === filters[0]);
  var Trip = arr.filter((ele) => ele.subType === filters[1]);
  var General = arr.filter((ele) => ele.subType === filters[2]);
  expenseStore.setExpenseTypes({ Vehicle, Trip, General });
};

export const check_PERMISSIONS_STATUS = async (permission) => {
  try {
    check(permission).then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          break;
        case RESULTS.DENIED:
          request_PERMISSIONS(permission);

          break;
        case RESULTS.LIMITED:
          break;
        case RESULTS.GRANTED:
          break;
        case RESULTS.BLOCKED:
          break;
      }
    });
  } catch (err) {
    console.warn(err);
  }
};

export const request_PERMISSIONS = async (permission) => {
  try {
    request(permission).then((result) => {});
  } catch (err) {
    console.warn(err);
  }
};

export const getFuel = (value) => {
  switch (value) {
    case "low":
      return 1;
    case "medium":
      return 2;
    case "high":
      return 3;
    default:
      return 0;
  }
};

export const getString = (value) => {
  if (value == null) {
    return "";
  } else if (value == undefined) {
    return "";
  } else {
    return value.trim();
  }
};

export const Dname = (fname, mName, Lname) => {
  if (fname !== "" && mName !== "" && Lname !== "") {
    return fname + " " + mName + " " + Lname;
  } else if (fname !== "" && Lname !== "") {
    return fname + " " + Lname;
  }
};

export const getNumber = (value) => {
  if (value == null) {
    return 0;
  } else if (value == undefined) {
    return 0;
  } else if (value == "") {
    return 0;
  } else {
    return parseInt(value);
  }
};

export const getFloat = (value) => {
  if (value == null) {
    return 0;
  } else if (value == undefined) {
    return 0;
  } else if (value == "NaN") {
    return 0;
  } else if (value == NaN) {
    return 0;
  } else {
    return parseFloat(value);
  }
};

export const toFix = (value) => {
  if (value !== null && value !== undefined) return value.toFixed(1);
  else return 0;
};

export const dateFormate = (date) => {
  if (date == "") {
    return moment().format("YYYY-MM-DD HH:mm:ss");
  } else {
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
  }
};

export const canStartTrip = (startDate) => {
  
  
  
  return (
  
   

    moment.utc(startDate).local().format("DD-MM-YYYY") ==
    moment.utc().local().format("DD-MM-YYYY")
  );
};

export const formatedDateTime = (dateTime, type) => {
  if (dateTime === null) {
    return "-";
  } else {
    var date = moment.utc(dateTime).local().format("DD-MM-YYYY");
    var time = moment.utc(dateTime).local().format("hh:mmA");
    switch (type) {
      case "date":
        return `${date}`;
      case "time":
        return `${time}`;
      default:
        return `${date} ${time}`;
    }
  }
};

export const formatedActualDateTime = (dateTime, type) => {
  var date = moment(dateTime).format("DD-MM-YYYY");
  //console.log("date",date);
  var time = moment(dateTime).format("hh:mmA");
  switch (type) {
    case "date":
      return `${date}`;
    case "time":
      return `${time}`;
    default:
      return `${date} ${time}`;
  }
};

export const dateFormateReminder = (date) => {
  if (date == "" || date === null) {
    return "-";
  } else {
    return moment(date).format("DD-MM-YYYY HH:mm A");
  }
};

export const statusBackground = (status) => {
  switch (status) {
    case tripTypes[1]:
      return "notStarted";
    case tripTypes[2]:
      return "inProgress";
    case tripTypes[3]:
      return "completed";
    case tripTypes[4]:
      return "cancel";
    default:
      return "SecondaryBackground";
  }
};

export const statusTextColor = (status) => {
  switch (status) {
    case tripTypes[1]:
      return "notStartedText";
    case tripTypes[2]:
      return "inProgressText";
    case tripTypes[3]:
      return "completedText";
    case tripTypes[4]:
      return "cancelText";
    default:
      return "SecondaryBackground";
  }
};
export const getAndroidVersion = () => {
  if (Platform.OS === 'android') {
    // Get the Android version
    var androidVersion = Platform.Version;
    console.log('Android OS Version:', androidVersion);
    return androidVersion;
  } else {
    console.log('version not found.');

  }
};
export const getAppVersion = () => {
  var appVersion = DeviceInfo.getVersion();
  console.log('appVersions:', appVersion);
  return appVersion;
};

export const updateGcmDetails = async () => {

  var token = await getAuthData();

console.log("token from ",token)

  let uuid = await AsyncStorage.getItem('deviceUUID');
  var osVersion = getAndroidVersion();

  var appVersion = getAppVersion();
 


  var deviceType = Platform.OS;
 

  var loginTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");


  var Fcm = await getItem("FCM");
  var gcm = Fcm?.registerToken;

  const requestData = {
    imei: uuid,
    gcm: gcm,
    type: "FCM",
    deviceType: deviceType,
    appVersion: appVersion,
    osVersion: String(osVersion),
    isSoftDelete: "0",
    mob: token.userDetail.phoneNumber,
    driverId:token.userDetail.driverId,
    loginTime: loginTime
  }


  var responseGcm = await postGcm(requestData)
  var setAppVersion=await setItem("appVersion", appVersion);

  //console.log("responseGcm from helper", responseGcm);
  return responseGcm;
};


export const getLocation = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("User Location:", latitude, longitude);
        resolve({ latitude, longitude }); // Return the location
      },
      (error) => {
        console.error(" Error getting location:", error);
        resolve({ latitude: "", longitude: "" }); // Return empty values on error
      }
    
    );
  });
};




////////LOCATION HELPER
export const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    /*Geolocation.getCurrentPosition(
      (position) => {
        const cords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          heading: position?.coords?.heading,
        };
        tripStore.setCurLocation(cords);
        resolve(cords);
      },
      (error) => {
        reject(error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );*/
  });

export const locationPermission = () =>
  new Promise(async (resolve, reject) => {
    /*if (Platform.OS === "ios") {
      try {
        const permissionStatus = await Geolocation.requestAuthorization(
          "whenInUse"
        );
        if (permissionStatus === "granted") {
          return resolve("granted");
        }
        reject("Permission not granted");
      } catch (error) {
        return reject(error);
      }
    }
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    )
      .then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          resolve("granted");
        }
        return reject("Location Permission denied");
      })
      .catch((error) => {
        console.log("Ask Location permission error: ", error);
        return reject(error);
      });*/
  });



export const logTime = (message) => {
  const currentTimestamp = new Date().toISOString(); // Includes milliseconds
  console.log(`[${currentTimestamp}] ${message}`);
};



/////Toast HELPER
const showError = (message) => {
  showMessage({
    message,
    type: "danger",
    icon: "danger",
  });
};

const showSuccess = (message) => {
  logCustomEvent(message);
  showMessage({
    message,
    type: "success",
    icon: "success",
  });
};

export { showError, showSuccess };

export const uniqueArray = (data, key) => {
  return [...new Map(data.map((item) => [item[key], item])).values()];
};

export const showBorder = (data, index) => {
  if (data.length - 1 === index) {
    return 0;
  } else {
    return 1;
  }
};

//////FILTER HELPER
export const FilterByDate = (data, startDate, endDate) => {
  var ed = moment(endDate).format("DD-MM-YYYY");
  var sd = moment(startDate).format("DD-MM-YYYY");
  const x = new Date(endDate);
  const y = new Date(startDate);
  var result = data.filter((d) => {
    var time = moment.utc(d.onwardStartTime).local().format("YYYY-MM-DD");
    const timeNow = new Date(time);
    return y <= timeNow && timeNow <= x;
  });
  if (startDate == "" && endDate == "") return data;
  return result;
};

export const checkIsRecurring = (cases) => {
  switch (cases) {
    case 0:
      return "One Way";
    case 1:
      return "Round";
    default:
      return null;
  }
};

export const checkPerformance = (cases) => {
  switch (cases) {
    case 1:
      return "On Time";
    case 0:
      return "Delay";
    default:
      return null;
  }
};

export const filterByisRecurring = (data = filterTabData, key, value) => {
  if (key == "category") {
    var List = data.filter((e) => e[key] == value);
    if (value !== null) {
      return List;
    } else {
      return data;
    }
  } else {
    var List = data.filter((e) => {
      var string = e[key];
      return string?.includes(value);
    });
    if (value !== null) {
      return List;
    } else {
      return data;
    }
  }
};

export const getPerformance = (performance) => {
  try {
    var noSpace = performance?.split(" ").join("");
    var isOnTime = noSpace.toLowerCase().includes("ontime");
    return isOnTime;
  } catch (e) {
    return true;
  }
};

export const Logout = async () => {
  // await removeItem("userData");
  console.log("from Logout in helper")
  await removeItem("authData");
  await removeItem("userData");
  await clearUserData();
  authStore.setLogin(false);
  authStore.resSetStore();
  imageStore.resetAllImage();
  tripStore.resetStore();
  tripStore.resetTrip();
  expenseStore.resetAllExpense();
};
export const logout = async () => {
  
 
  var driverId = authStore.driverData.driverId;
  var response= await signOut(driverId);
   await removeItem("authData");
   await removeItem("lastScreen"); 
   await clearUserData();
   // await removeItem("userData");
   authStore.setLogin(false);
   authStore.resSetStore();
   imageStore.resetAllImage();
   tripStore.resetStore();
   tripStore.resetTrip();
   expenseStore.resetAllExpense();
  
 };
export const currencySymbol = (value) => {
  switch (value) {
    case "INR":
      return "₹";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "KWD":
      return "د.ك";
    default:
      return "₹";
  }
};

export const sortByDate = (array, key = "insertedOn") => {
  try {
    var sortedDate = array.sort(function (a, b) {
      var c = new Date(a[key]);
      var d = new Date(b[key]);
      return d - c;
    });
    return sortedDate;
  } catch (e) {
    return array;
  }
};
export const filterArrayByDate = (
  arr = [],
  mode = "desc",
  dateKey = "createdAt"
) => {
  return arr.sort(function (a, b) {
    if (
      a != null &&
      b != null &&
      typeof a == "object" &&
      typeof b == "object" &&
      dateKey in a &&
      dateKey in b
    ) {
      if (mode == "desc") {
        return moment(a[dateKey]).isBefore(moment(b[dateKey]));
      } else {
        return moment(b[dateKey]).isBefore(moment(a[dateKey]));
      }
    } else {
      return false;
    }
  });
};
export const getAvgSpeed = () => {
  try {
    var d = getNumber(tripStore.actualTripTripRun);
    var t = getNumber(tripStore.totalTripRunTime);
    if (d === 0 || t === 0) return 0;
    return d / t;
  } catch (error) {}
};



export const isImage = (url) => {
  console.log("url",url)
  if (url && url !== "") {
    const extension = url.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png'];
    const pdfExtension = 'pdf';
    const docExtensions = ['doc', 'docx'];
    const xlsExtensions = ['xls', 'xlsx'];

    if (imageExtensions.includes(extension)) {
      return { uri: url }; // Return the image URL
    } else if (pdfExtension === extension) {
      return require('../Assets/pdfIcon.png'); // Return the PDF symbol
    } else if (docExtensions.includes(extension)) {
      return require('../Assets/docIcon.png');// Return the DOC symbol
    } else if (xlsExtensions.includes(extension)) {
      return require('../Assets/excel_Icon.png'); // Return the XLS symbol
    } else {
      return require('../Assets/noImage.png'); // Return a placeholder image for other cases
    }
  } else {
    return require("../Assets/noImage.png"); // Return a placeholder if the URL is invalid
  }
};
export const AlertOpenSettings = async (error) => {
  if (error === "User did not grant camera permission.") {
    return Alert.alert(
      "Permission Denied",
      "Open setting to enable the permissions.",
      [
        {
          text: "Open Settings",
          style: "destructive",
          onPress: () => {
            if (Platform.OS === "ios") {
              Linking.openURL("app-settings:");
            } else {
              Linking.openSettings();
            }
          },
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ]
    );
  }
};

export const searchByFields = (arr, input, keyArr) => {
  const results = arr?.filter(function (p) {
    if (input?.length == 0) return false;
    if (keyArr?.length > 0) {
      var data = keyArr.map((ele) => p[ele]).join(" ");
      return data.match(new RegExp(input, "i"));
    }
    return Object.values(p).join(" ").match(new RegExp(input, "i"));
  });
  return results;
};


const openDeviceSettings = () => {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
};


export const uploadingDoc =async(fn)=>{

if(fn=="fileManager"){
  try {
    const { isValid, message } =await pickFromFiles();
    return { isValid: isValid, message: message };

  } catch (err) {
   console.log("err",err)
  }
}
else{

  try {
    const { isValid, message } = await fromCamera();
    return { isValid: isValid, message: message };

  } catch (err) {
   console.log("err",err)
  }
}

}

//using documentpickrlibrary select files form file manager
export const pickFromFiles =async ()=>{
try{
 
  
  const doc = await DocumentPicker.pick({
    type: [
      DocumentPicker.types.images,
      DocumentPicker.types.pdf,
      DocumentPicker.types.doc,
      DocumentPicker.types.docx,
      DocumentPicker.types.plainText,
      DocumentPicker.types.xlsx,
      DocumentPicker.types.xls,
    ],
  });
  const { isValid, message } = await verifyDoc(doc,"fileType");
  return { isValid: isValid, message: message };


  //const fileUri = res[0].uri;
 
}
catch(err)
{
  if (DocumentPicker.isCancel(err)) {
    console.log('User cancelled the picker');
  } else {
    throw err;
  }
}}
//using camera roll
export const fromCamera = async () => {
  try {
    console.log("from open camerafn in helper");
    
    const image = await ImageCropPicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      useFrontCamera: false,
    });
   

    const { isValid, message } = await verifyDoc(image, "cameraType");
    console.log("isValid, message", isValid, message);
    return { isValid, message };
    
  } catch (err) {
    AlertOpenSettings(err);
    console.log("IMAGE_PICKER_ERROR - ", err);
    return { isValid: false, message: err.message }; // Optional: Handle errors by returning a structured response
  }
};

//loginvalidation schema
export const loginValidationSchema = (isLoginPage) => 
  yup.object().shape({
    email: yup
      .string()
      .required("Email or Phone number is required")
      .test(
        "email",
        "Invalid email or phone number",
        async function (value) {
          const { createError } = this;
          try {
            // Check if the value is a phone number or email
        
            
            // Call your async validation function
            const emailValidationResult = await getValidated(VALIDATE_TYPE, value);
            console.log("emailValidationResult", emailValidationResult);
            
            // Check if the validation result is not an empty string (indicating an error)
            if (emailValidationResult !== "") {
              return createError({ message: emailValidationResult });
            }
            
            // Validation succeeded
            return true;
          } catch (error) {
            console.log("error", error);
            return createError({ message: "Something went wrong" });
          }
        }
      ),

    // Conditionally include password validation if `isLoginPage` is "fromLogin"
    ...(isLoginPage ==="fromLogin" && {
      
      password: yup
      .string()
      .required("Password is required")
     
    }),
  });



export const changePasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Your password is too short.")
   
    .test(
      "validate-password", 
      async function (value) {
        const { createError } = this;

        try {
        
          // Assuming validatePassword is an async method that validates and returns an error message (if any)
          var validationType="password";
          const passwordValidationResult = await getValidated(validationType,value);
          console.log("passwordValidationResult", passwordValidationResult);

          // If passwordValidationResult is not empty, create a validation error
          if (passwordValidationResult !== "") {
            return createError({ message: passwordValidationResult });
          }

          // If validation passes, return true
          return true;
        } catch (error) {
          // Catch unexpected errors in async call and show a default error message
          return createError({ message: "Password validation failed. Please try again." });
        }
      }
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});
export const expenseValidationSchema = yup.object().shape({
  title: yup
    .string()
    .max(30, "Title cannot exceed 30 characters!")
    .matches(/^[a-zA-Z0-9 ]*$/, EXPENSE_VALIDATION_STRING)
    .required("Title is required"),
    

  amount: yup
    .string()
    .trim()
    .required("Amount is required") // Move required first
    .test(
      "No decimals allowed",
      "Decimal values are not allowed!",
      (value) => {
        if (value === undefined || value === null) return false; // Ensure value exists
        return !value.includes('.'); // Proceed with validation
      }
    )
    .matches(/^\d+$/, "Invalid amount!") // Ensure only digits
    .test(
      "Is positive?",
      "ERROR: The number must be greater than 0!",
      (value) => {
        if (value === undefined || value === null) return false; // Ensure value exists
        return Number(value) > 0; // Check if positive
      }
    )
    .max(6, "Amount cannot exceed 6 digits") 
});
export async function getCompleteDeviceInfo() {
  console.log("getCompleteDeviceInfo");
  return {
    deviceId: DeviceInfo.getDeviceId(),
    brand: DeviceInfo.getBrand(),
    model: DeviceInfo.getModel(),
    manufacturer: await DeviceInfo.getManufacturer(),
    systemName: DeviceInfo.getSystemName(),
    systemVersion: DeviceInfo.getSystemVersion(),
    buildNumber: DeviceInfo.getBuildNumber(),
    appVersion: DeviceInfo.getVersion(),
    readableVersion: DeviceInfo.getReadableVersion(),
    isTablet: DeviceInfo.isTablet(),
    hasNotch: DeviceInfo.hasNotch(),
    isEmulator: await DeviceInfo.isEmulator(),
    totalMemory: await DeviceInfo.getTotalMemory(),
    batteryLevel: await DeviceInfo.getBatteryLevel(),
    isBatteryCharging: await DeviceInfo.isBatteryCharging(),
    totalDiskCapacity: await DeviceInfo.getTotalDiskCapacity(),
    freeDiskStorage: await DeviceInfo.getFreeDiskStorage(),
    carrier: await DeviceInfo.getCarrier(),
    ipAddress: await DeviceInfo.getIpAddress(),
    firstInstallTime: await DeviceInfo.getFirstInstallTime(),
    lastUpdateTime: await DeviceInfo.getLastUpdateTime(),
    installSource: await DeviceInfo.getInstallerPackageName()
  };
}

export async function mandateUpdate() {
  try {
   console.log("mandateUpdatelauncchhhhh>>>>>>>>>>>>>>>>>>>>")
    await checkForUpdate(UpdateFlow.IMMEDIATE);
  //  const data = await checkForUpdate(UpdateFlow.IMMEDIATE)

  } catch (e) {
    // Handle error
  }
}







