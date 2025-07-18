import {
  Alert,
  Linking,
  Platform,
  Dimensions,
  PermissionsAndroid,
  ToastAndroid,
} from "react-native";
//import Geolocation from "@react-native-community/geolocation";
import Geolocation from "react-native-geolocation-service";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";
import ReactNativeForegroundService from "@supersami/rn-foreground-service";
import React, { useEffect, useRef, useState } from "react";
import DeviceInfo from 'react-native-device-info';
import { postLocationData } from "../Services/Actions/TripActions";
import { getItem, setItem } from "../Services/apiCalls";
import AsyncStorage from '@react-native-async-storage/async-storage';

let lastQueueItem = null;
let lastWatchId = null;
export const requestLocationPermission = async () => {

  if (Platform.OS === "ios") {

  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        //@ts-ignore
        {
          title: "Location Access Required",
          message: "This App needs to Access your location",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        var locationEnabled = await locationEnabler();
        console.log("locationEnabled", locationEnabled)
        if (locationEnabled) {
          console.log("in if")
          var backgroundEnabled = await getBackgroundLocationPermissions();
          if (backgroundEnabled) {
            return true;
          }

        }
        else {
          loactionOffModal();
        }



      } else {
        _openAppSetting();
      }
    } catch (err) {
      console.warn(err);
    }
  }
};

export const locationEnabler = async () => {
  console.log("from location enabler");

  if (Platform.OS === "android") {
    try {
      const res = await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        fastInterval: 5000,
        interval: 5000,
      });
      console.log("res from location enabler", res);
      return true;
      // The user has accepted to enable the location services
      // data can be :
      //  - "already-enabled" if the location services has been already enabled
      //  - "enabled" if user has clicked on OK button in the popup
    } catch (err) {
      console.log("err from location enabler", err);
      return false;
      // The user has not accepted to enable the location services or something went wrong during the process
      // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
      // codes :
      //  - ERR00 : The user has clicked on Cancel button in the popup
      //  - ERR01 : If the Settings change are unavailable
      //  - ERR02 : If the popup has failed to open
      //  - ERR03 : Internal error
    }
  }

  return false;
};

export const _openAppSetting = () => {
  Alert.alert(
    "Location Permission",
    "Please allow app to access your location",
    [
      {
        text: "Setting",
        onPress: () => Linking.openSettings(),
      },
      {
        text: "cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
    ]
  );
};

export const loactionOffModal = () => {
  Alert.alert("Location Permission", "Please turn on location services", [
    {
      text: "Ok",
      onPress: () => {
        loactionEnabler(
          () => { },
          () => { }
        );
      },
    },
    {
      text: "Cancel",
      onPress: () => { },
    },
  ]);
};

export const getBackgroundLocationPermissions = async (

) => {
  console.log("getBackgroundLocationPermissions")
  const isAndroid10OrHigher = Platform.Version >= 29;
  if (isAndroid10OrHigher) {
    // Logic for background location on Android 10 and above
    const backgroundgranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      // PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Background Location Permission",
        message:
          "The app needs the permission to run in the background to track the user’s location.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    if (backgroundgranted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("backgroundgranted", backgroundgranted)
      ToastAndroid.show(
        "Background Location Permission granted",
        ToastAndroid.SHORT
      );
      return true;
    } else {
      Alert.alert("", "Please allow to Background Location Permission");
    }
  } else {
    // Logic for foreground location on older Android versions
    const backgroundgranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Background Location Permission",
        message:
          "The app needs the permission to run in the background to track the user’s location .",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    if (backgroundgranted === PermissionsAndroid.RESULTS.GRANTED) {
      ToastAndroid.show(
        "Background Location Permission granted",
        ToastAndroid.SHORT
      );
      return true;
    } else {
      Alert.alert("", "Please allow to Background Location Permission");
    }
  }
};

// Function to add data to the queue
const addToQueue = async (data) => {
  // queue is initialized as an empty array if gpsQueue doesn't exist.
  let queue = JSON.parse(await AsyncStorage.getItem("gpsQueue")) || [];
  console.log("from add que ", queue)
  //add location data to que
  queue.push(data);
  if (queue.length > 10000) {
    queue.shift(); // Remove oldest item if queue exceeds 10,000 items
  }
  console.log("setting que")
  await AsyncStorage.setItem("gpsQueue", JSON.stringify(queue));
};
export const getGpsPackets = async (

) => {
  /*const watchId = Geolocation.watchPosition(postLocationData, {

    enableHighAccuracy: false,
    distanceFilter: 100, // Update every 10 meters
    interval: 10000,
    fastestInterval: 2000,
    timeout: 2000,
  });*/

  //await setItem("watchId", watchId);
  console.log("from get \gps pacjket");
  ReactNativeForegroundService.add_task(
    () => {

      //const watchId = startWatchingPosition();
      sendQueueToServer();
      // return () => {
      //       console.log("from return")
      //       Geolocation.clearWatch(watchId);
      //     };

    },
    {
      delay: 10000,
      onLoop: true,
      taskId: "123",
      onError: (e) => {
        console.log("e", e);
      },
    }
  );
  ReactNativeForegroundService.start({
    id: 1244,
    title: "Foreground Service",
    message: "We are live World",
    icon: "ic_launcher",
    color: "#000000",
  })
    .then(() => {
      ToastAndroid.show("Background Service Started", ToastAndroid.SHORT);
    })
    .catch((error) => {
      console.error("error", error);
    });
};







export const startWatchingPosition = () => {

  console.log("from startWatchingPosition");

  // successCallbackfunction that will be called when the device's position is successfully updated.
  const successCallback = async (location) => {

    var locationData = await updatePosition(location);
    //console.log("locationData", locationData);

    console.log(`location with gps and watch queue at ${new Date()}`, locationData)

    ToastAndroid.show(`Location Updated at ${new Date()}`, ToastAndroid.SHORT);

    //postLocationData(locationData);

    // You can update your state or perform any other actions with the new position data here
  };
  const errorCallback = (error) => {
    console.log(`Error getting location with gps and watch queue : ${error.message} at ${new Date()}`);
    // Handle errors here
  };
  // successCallback is the first parameter and is required.
  if (lastWatchId !== null) {
    const watchId = Geolocation.watchPosition(successCallback, errorCallback, {
      enableHighAccuracy: false,
      distanceFilter: 10, // Update every 10 meters
      interval: 2000,
      fastestInterval: 2000,
      timeout: 2000,
    });
    console.log("watchid", watchId)
    //return watchId; 
    //Return the watchId so it can be used for clearing the watch later
  }
  else {

    Geolocation.getCurrentPosition(successCallback, errorCallback, {

      enableHighAccuracy: false,
      timeout: 15000,
      maximumAge: 10000
    });
  }

};
export const updatePosition = async (position) => {
  console.log("from updatePosition");

  const level = await DeviceInfo.getBatteryLevel();
  const uniqueId = await DeviceInfo.getUniqueId();

  let { coords, timestamp } = position;



  let data = {
    uuid: uniqueId,
    latitude: coords.latitude,
    longitude: coords.longitude,
    speed: coords.speed,
    altitude: coords.altitude,
    heading: coords.heading,
    batteryPercentage: (level * 100).toFixed(2),
    timestamp: timestamp,
  };
  await addToQueue(data);

  return data;
};
const sendQueueToServer = async () => {

  const queue = JSON.parse(await AsyncStorage.getItem("gpsQueue")) || [];
  console.log("queue", queue.length);
  if (queue?.length > 0) {
    console.log("queue?.length > 0")
    for (let i = 0; i < queue.length; i++) {
      let params = {
        uuid: queue?.[i].uuid,
        latitude: queue?.[i].latitude,
        longitude: queue?.[i].longitude,
        timestamp: queue?.[i].timestamp,
        speed: queue?.[i].speed,
        // driverId: 1695,
        batteryPercentage: queue?.[i].batteryPercentage,
      };
      try {
        await postLocationData(params)
          .then((response) => {
            lastQueueItem = queue[0];
            queue.shift();
            i--;
            console.log("que length afeter shift", queue.length)
            ToastAndroid.show(response.status.toString(), ToastAndroid.SHORT);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.error("Error sending data:", error);
        break; // Stop sending on network error
      }
    }

    await AsyncStorage.setItem("gpsQueue", JSON.stringify(queue));
  } else {
    console.log("QUEUE is 0", lastQueueItem);
    console.log("no cahnge in position")
    if (lastQueueItem !== null) {
      console.log("queue?.length < 0")
      let params = {
        uuid: lastQueueItem.uuid,
        latitude: lastQueueItem.latitude,
        longitude: lastQueueItem.longitude,
        timestamp: Date.now(),
        speed: lastQueueItem.speed,
        // driverId: 1695,
        batteryPercentage: lastQueueItem.batteryPercentage,
      };
      await postLocationData(params);
    }

  }
};




