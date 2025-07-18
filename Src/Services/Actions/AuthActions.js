// import headers from "../../Constants/headers";
import jwt_decode from "jwt-decode";
import moment from "moment";
import { Alert } from "react-native";
import { authStore } from "../../Store/AuthStore/AuthStore";
import { imageStore } from "../../Store/AuthStore/ImageStore";
import { loaderStore } from "../../Store/AuthStore/LoaderStore";
import {
  getLocation,
  showError,
  showSuccess,
  toFix,
  trackImageLocation,
} from "../../Utils/helper";
import { validateEmail, validatePhone } from "../../Utils/validator";
import {
  apiGet,
  apiPost,
  apiPut,
  getAuthData,
  getItem,
  setAuthData,
  setItem,
  setUSER_CRED,
} from "../apiCalls";
import {
  GETDRIVERS,
  GETDRIVERS_BY_DRIVER_ID,
  GET_CURRENCY_BY_ORG_ID,
  GET_NOTIFICATIONS,
  GET_TRIPS_BY_DRIVERID,
  GET_USER_DETAIL,
  GET_VALIDATED,
  LOGIN_FCM,
  LOGOUT_FCM,
  MARK_AS_READ,
  MARK_NOTE_AS_READ,
  TOTAL_DISTANCE,
  UPDATE_LICENCE,
  UPDATE_PASS,
  UPDATE_USER_INFO,
  UPLOAD_IMAGE,
  VERIFY_USER,
} from "../urls";
import { getExpenseByDriverID, getExpenseTypes } from "./ExpenseAction";
import { tripStore } from "../../Store/AuthStore/TripStore";
import { showMessage } from "react-native-flash-message";
import { setUserProperties, trackLogin } from "../../Utils/MixpanelService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Geolocation from "react-native-geolocation-service";
export async function signIn(username, password, checked) {
  try {
    var body = {};
    var Fcm = await getItem("FCM");

    if (validatePhone(username)) {
      body = {
        password: password.trim(),
        fcm_id: Fcm?.registerToken,
        mobile: username?.trim(),
      };
    } else if (validateEmail(username)) {
      body = {
        user_name: username.trim(),
        password: password.trim(),
        fcm_id: Fcm?.registerToken,
      };
    }
    await setItem("password", body.password);

    // console.log("body for login", body);
    const userLoginRes = await apiPost(LOGIN_FCM, body, {
      "Content-Type": "application/json",
    });
    console.log("userLoginRes", userLoginRes);
    //if the user checked on the remember me  the credentils will store in to asyncstorage
    if (checked) {
      setUSER_CRED({ username: username, password: password });
      //setUSER_CRED {"password": "Geethu@1234", "username": "geethuanand@ii2mail.com"}
    } else {
      setUSER_CRED({});
    }


     //loaderStore.setLoader(false);
    return newOnUserAuthenticated(userLoginRes);
  } catch (error) {
    console.log("🚀 ~ file: AuthActions.js:73 ~ signIn ~ error:", error);

    //showError(error?.data?.message);
    showError("Invalid credentials");
    loaderStore.setIsLoading(false);

    
    return error;
  }
}
const newOnUserAuthenticated = async (userData) => {
  try {
    const userDetail = await apiGet(
      `${GETDRIVERS_BY_DRIVER_ID}${userData.driver_id}`
    );
   


    const userDetails = {
      ...userData,
      userDetail: userDetail,
    };
    console.log("userDetail", userDetail);
    await setAuthData(userDetails);
    trackLogin(userDetails.userDetail.userId, userDetails.userDetail.email);

        setUserProperties(userDetails.userDetail.userId,userDetails.userDetail.email,userDetails.userDetail.firstName,userDetails.userDetail.orgName);
    await getExpenseTypes();
    await getExpenseByDriverID(userDetails.driver_id);
    return userDetail;
  } catch (error) {
    loaderStore.setIsLoading(false);
    console.log(JSON.stringify(error), "ERROR----onUserAuthenticated");
    const errorMessage = error?.data?.message || error?.message || "Something went wrong";
    console.log("error,", error);
    showError(errorMessage);
    return error;
  }


  // catch (error) {
  //   loaderStore.setIsLoading(false);
  //   console.log(JSON.stringify(error), "ERROR----onUserAuthenticated");
  //   if (error.message) {
  //     console.log("error,",error)
  //     showError(error?.data?.message);
  //   } else {
  //     showError(error?.msg);
  //   }
  //   return error;
  // }
};
function getFormData(object) {
  const formData = new FormData();
  Object.keys(object).forEach((key) => formData.append(key, object[key]));
  return formData;
}
export async function verifyUser(userData) {
  try {
    const userSignUpRes = await apiPost(VERIFY_USER, userData);
    console.log("userlogins in verifyuser", userData);
    if (userSignUpRes?.otp) {
      authStore.setOtp(userSignUpRes);
    }
    loaderStore.setIsLoading(false);
    showSuccess("OTP Sent");
    console.log(">>>>>>>>>>otp", userSignUpRes);
  } catch (error) {
    console.log(error?.data?.message, "ERROR----verifyUser");
    showError("user not found");
    loaderStore.setIsLoading(false);
    // showError("Error while sending OTP");
    if (error.data.code == 400) {
      showError(error?.data?.message);

      // Alert.alert("User not found");
    } else {
    }
    return Promise.reject(error);
  }
}
export async function signOut(driverId) {
  try {
    var body = {
      driverId: driverId,
    };
    console.log("logout api calling");
    const response = await apiPost(LOGOUT_FCM, body);
    console.log("response from deltefcm", response);
    return response;
  } catch (error) {
    console.log("🚀 ~signOut ", error);
  }
}
export async function getNotification() {
  try {
    var Userid = authStore.driverData.userId;
    var orgId = authStore.driverData.orgId;

    // var Userid = 439;
    // var orgId = 1;
    console.log(`${GET_NOTIFICATIONS}${Userid}/${orgId}`);
    const notify = await apiGet(`${GET_NOTIFICATIONS}${Userid}/${orgId}`);

    if (notify.code !== 500) {
      authStore.setNotification(notify);

      return notify;
      // console.log("if console")
    } else {
      authStore.setNotification([]);
      return [];
    }
  } catch (error) {
    authStore.setNotification([]);
    // console.log("notification Error-->>>", error);
  }
}

export async function updatePassword(userData) {
  try {
    const userSignUpRes = await apiPost(UPDATE_PASS, userData);
    console.log(">>>>>>>>>>otp", userSignUpRes);
    showSuccess("Password updated successfully.");
    // Alert.alert(userSignUpRes.message);
    return userSignUpRes;
  } catch (error) {
    console.log(error, "ERROR----updatePassword");
    showError("Failed to update password!");
    // Alert.alert(error.message);
    return Promise.reject(error);
  }
}
export async function getDrivers() {
  try {
    //loaderStore.setIsLoading(true);
    var currency = {
      currency: "₹",
      currencyId: 1,
      currencyName: "Rupee",
    };
    const userData = await getAuthData();
    const userid = userData.driver_id;
    const driverData = await apiGet(`${GETDRIVERS}${userid}`);
    const get_currency_by_org_id = await apiGet(
      `${GET_CURRENCY_BY_ORG_ID}${driverData.orgId}`
    );

    if (get_currency_by_org_id.status) {
      currency.currency = get_currency_by_org_id.data.jsonData.currencySymbol;
      currency.currencyId = get_currency_by_org_id.data.jsonData.id;
      currency.currencyName = get_currency_by_org_id.data.jsonData.name;
    } else {
    }
    let newdriverData = {};
    if (driverData.image == "" || driverData.image == null) {
      newdriverData = {
        ...driverData,
        ...currency,
        image:
          "https://itac-qa-files.s3.ap-south-1.amazonaws.com/451-4517876_default-profile-hd-png-download1661066441293.png",
      };
      authStore.setDriverData(newdriverData);

       getTotalDistance(driverData.driverId);
      loaderStore.setIsLoading(!true);

      return newdriverData;
    } else {
      loaderStore.setIsLoading(!true);
      imageStore.setLicenceImage(driverData?.licensePath);
      authStore.setDriverData({ ...driverData, ...currency });
       getTotalDistance(driverData?.driverId);

      return { ...driverData, ...currency };
    }
  } catch (error) {
    console.log(error.data, "ERROR----getDrivers");
    showError("Unable to get driver details!");
  }
}


export async function uploadImageURL(imageData, docsType) {
  try {
   
    // Extracting properties from imageData
    const { path, lat, long, screen } = imageData; 


    let userData = await AsyncStorage.getItem("authData");
    let userId = null;
    
    if (userData) {
      userData = JSON.parse(userData);
      userId = userData?.user_id || null;
    }
    const tripId=tripStore.selectedTrip.tripId;
   

    let fileName = docsType !== "allType" ? path.split("/").pop() : null;


    const formData = new FormData();
    formData.append("file", {
      name: docsType === "allType" ? imageData[0].name : fileName,
      type: docsType === "allType" ? imageData[0].type : "image/*",
      uri: docsType === "allType" ? imageData[0].uri : path,
    });
    
    formData.append("tripId",tripId|| "");
    formData.append("userId", userId || "");
    formData.append("driverId", userData?.userDetail?.driverId || "");
    formData.append("orgId", userData?.userDetail?.orgId || "");
    formData.append("source", "DMA");
    formData.append("timeStamp", Date.now());
    formData.append("screen",screen || "");
    formData.append("lat", lat||"NA");
    formData.append("long", long||"NA");

    formData.append(
      "fileName",
      `${tripStore.selectedTrip?.tripId || ""}_${userId || ""}_${screen|| "NA"}_${Date.now()}`
    );

    const uploadedUrl = await fetch(UPLOAD_IMAGE, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
       // console.log("Upload response:", data);
        if (data.message?.res?.status === 400) {
          showError("Something went wrong while uploading");
        }
        return data;
      });

    console.log("Uploaded URL:", uploadedUrl);
    return uploadedUrl;
    
  } catch (error) {
    console.error("ERROR in uploadImageURL:", error);
    showError("Something went wrong while uploading");
    return Promise.reject(error);
  }
}


export async function updateLicanceData(data) {
  try {
    const userData = await getAuthData();
    var formatedDate = moment(data.licenceExpDate).format("YYYY-MM-DD");
    const userid = userData.userDetail.userId;
    var imageLicance = imageStore.licenceImage;
    var body = {
      licenseExpirationDate: data.licenceExpDate,
      licenseNumber: data.licenceNo,
      licensePath: data.image,
      userId: userid,
    };
    const uplodedUrl = await apiPost(UPDATE_LICENCE, body);
    showSuccess("License details updated");
    getDrivers();
    return true;
    // authStore.setDriverData(filterDriver[0]);
  } catch (error) {
    console.log(error, "ERROR----updateLicanceData");
    showError("Something went wrong while updating licance.");
    // if (error.message) {
    //   Alert.alert(error.message);
    // } else {
    //   Alert.alert(error?.msg);
    // }
    return Promise.reject(error);
  }
}
export async function updateUserInfo(data) {
  try {
    console.log("data>>>>>.",data)
    console.log("datapicture>>>>>.",data)
    var uploadImageUrl = await uploadImageURL(data.image);
   
    // var uploadImageUrl = await uplodeXHR(data.picture);
    var body = {
      firstName: data?.FirstName?.trim(),
      image: uploadImageUrl?.message,
      lastName: data?.LastName?.trim(),
      middleName: data?.MiddleName?.trim(),
      userId: authStore?.driverData?.userId,
    };
    var userInfoRes = await apiPost(UPDATE_USER_INFO, body);
    showSuccess("User Details Updated");
    getDrivers();
    return userInfoRes;
  } catch (error) {
    console.log(error, "ERROR----updateUserInfo");
    showError("Something went wrong while updating user details");
    // if (error.message) {
    //   Alert.alert(error.message);
    // } else {
    //   Alert.alert(error?.msg);
    // }
    return Promise.reject(error);
  }
}
export async function getTotalDistance(driverId) {
  try {
    var dId = authStore.driverData.driverId;
    var distance = await apiGet(`${TOTAL_DISTANCE}${dId}`);
    if (distance.status) {
      authStore.setTotalDistance(distance.data.jsonData);
    }
  } catch (error) {}
}
export async function getDriverDataDistance(id) {
  try {
    var did = authStore.driverData.driverId;
    var apiData = await apiGet(`${GET_TRIPS_BY_DRIVERID}${id}`);
    var distanceData = apiData?.map((ele) => ele.distance);
    var Distance = distanceData?.filter(function (el) {
      return el != null;
    });
    var sumData = Distance?.reduce((partialSum, a) => partialSum + a, 0);

    authStore.setTotalDistance(toFix(sumData));
  } catch (error) {
    console.log("error ------> getDriverDataDistance", error);
  }
}
export async function markAsRead(id) {
  try {
    console.log("markAsRead");
    const response = await apiPut(MARK_AS_READ + id);
  } catch (error) {
    console.log("🚀 ~ file: AuthActions.js:348 ~ markAsRead ~ error", error);
  }
}
export async function markNoteAsRead(tripId) {
  try {
    console.log("markNOteAsRead");
    
    const userData = await AsyncStorage.getItem("authData");
    const parsedUserData = JSON.parse(userData || "{}");
    const userId = parsedUserData?.user_id || null;

    const url =await apiPut(`${MARK_NOTE_AS_READ}${userId}/${tripId}`);

  } catch (error) {
    console.log("🚀 ~ file: AuthActions.js:348 ~ markAsRead ~ error", error);
  }
}
export async function getValidated(type, data) {
  try {
    var body = {
      validationType: type,
      validationData: data,
    };
    console.log("body for vlsidation", body);

    var res = await apiPost(GET_VALIDATED, body);
    //var message="";

    return res.message;
  } catch (error) {
    console.log("error ------> getValidated", error);
  }
}
