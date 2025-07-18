import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation, useTheme } from "@react-navigation/native";
import { loaderStore } from "../Store/AuthStore/LoaderStore";
import { Logout, showError } from "../Utils/helper";
import { imageStore } from "../Store/AuthStore/ImageStore";
import { tripStore } from "../Store/AuthStore/TripStore";
// import { getCurrentScreenName } from "../Utils/navigationHelper"; // Import the helper function
// import { useNavigationContainerRef } from "@react-navigation/native";
export async function getHeaders() {
  let userDatas = await AsyncStorage.getItem("authData");
  // let userDatas = authStore.userData.authToken.access_token;
  if (userDatas) {
    userDatas = JSON.parse(userDatas);
    return {
      authorization: `Bearer ${userDatas}`,
    };
  }
  return {};
}
export async function apiReq(endPoint, data, method, headers = {}, requestOptions = {}) {
  return new Promise(async (res, rej) => {
    loaderStore.setIsLoading(true);
    let userData = await AsyncStorage.getItem("authData");
     let tripId=tripStore.selectedTrip.tripId;
    let userId = null;
	let orgId=null;
  if (userData) {
      //console.log(">>>>>>>>>>>>userdat")
      userData = JSON.parse(userData);
      userId = userData?.user_id || null;
      orgId=userData?.userDetail?.orgId ||"";
    }
  
    // Add headers
    headers = {
      ...headers,
      userId: userId || "",
      source: "DMA",
     page: imageStore.currentScreen.name|| "",
     orgId:orgId||"",
     tripId: tripId ||""
     
   
    };
      // console.log(">>>>>>>>>>>>headers",headers)
    if (method === "get" || method === "delete") {
      data = {
        ...requestOptions,
        ...data,
        headers,
      };
    }
   
    axios[method](endPoint, data, { headers })
      .then((result) => {
        const { data } = result;
        
        loaderStore.setIsLoading(false);

        loaderStore.setIsLoading(false);
        
        return res(data);
      })
      .catch(async (error) => {
        console.log( `error in api rew:endpoint${endPoint} is >>>>>>>> ${error}`)
        console.log(`error in api req:endpoint ${endPoint} >>>>>>>> ${error}`);
        loaderStore.setIsLoading(false);
        if (error && error.response && error.response.status === 401) {
          loaderStore.setIsLoading(false);
          console.log("ERROR STATUS 401");
          return rej({
            ...error.response.data,
            msg: error.response.data?.message || "Network Error",
            message: error.response.data?.message || "Network Error",
          });
        } else if (error && error.response && error.response) {
          var msg = "User does not have any active organization";
          console.log("msg elseif");
          if (
            error?.response?.data?.code === 400 &&
            error?.response?.data?.message === msg
          ) {
            console.log("mag from 2nd if");
            loaderStore.setIsLoading(false);
            showError(error.response.data.message);
            await Logout();
            return null;
          }
          console.log("mag from out of is");
          return rej({
            ...error.response,
            data: {
              ...error.response.data,
              msg: error.response?.data?.message || "Network Error",
              message: error.response?.data?.message || "Network Error",
            },
            msg: error.response?.data || "Network Error",
            message: error.response?.data || "Network Error",
          });
        } else {
          loaderStore.setIsLoading(false);
          console.log("ERROR STATUS LEVEL ELSE", error.response);
          return rej({
            message: "Network Error",
            msg: "Network Error",
            data: error.response.data,
          });
        }
       
      });
  });
}

export function apiPost(endPoint, data, headers = {}) {
  return apiReq(endPoint, data, "post", headers);
}
export function apiDelete(endPoint, data, headers = {}) {
  return apiReq(endPoint, data, "delete", headers);
}
export function apiGet(endPoint, data, headers = {}, requestOptions) {
  return apiReq(endPoint, data, "get", headers, requestOptions);
}
export function apiPut(endPoint, data, headers = {}) {
  return apiReq(endPoint, data, "put", headers);
}
export function setItem(key, data) {
  data = JSON.stringify(data);
  return AsyncStorage.setItem(key, data);
}
export function getItem(key) {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(key).then((data) => {
      resolve(JSON.parse(data));
    });
  });
}
export function removeItem(key) {
  return AsyncStorage.removeItem(key);
}
export function clearAsyncStorate(key) {
  return AsyncStorage.clear();
}
////// USER_CREDANTIALS
export async function getUSER_CRED() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem("userCredential").then((data) => {
      resolve(JSON.parse(data));
    });
  });
}
export function setUSER_CRED(data) {
  data = JSON.stringify(data);
  return AsyncStorage.setItem("userCredential", data);
}
///////// AUTH_DATA
export async function getAuthData() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem("authData").then((data) => {
      resolve(JSON.parse(data));
    });
  });
}
export function setAuthData(data) {
  data = JSON.stringify(data);
  return AsyncStorage.setItem("authData", data);
}
///////// USER_DATA
export async function getUserData() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem("userData").then((data) => {
      resolve(JSON.parse(data));
    });
  });
}
export function setUserData(data) {
  data = JSON.stringify(data);
  return AsyncStorage.setItem("userData", data);
}
export async function clearUserData() {
  console.log("data clear");
  AsyncStorage.removeItem("authData");
  return AsyncStorage.removeItem("userData");
}
