import { useNavigation, useTheme } from "@react-navigation/native";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import * as SVG from "../../Assets/SVG";
import React, { useEffect, useLayoutEffect, useState } from "react";

import Text_Custom from "../Text_Custom";
import { ToggleButton } from "../Button/Button";
import { triggerMobGps } from "../../Utils/helper";
import { imageStore } from "../../Store/AuthStore/ImageStore";
import { gpsStore } from "../../Store/AuthStore/GpsStore";
import { tripStore } from "../../Store/AuthStore/TripStore";
import { getItem, removeItem, setItem } from "../../Services/apiCalls";
import { logScreenView } from "../../Utils/analytics";
import { expenseStore } from "../../Store/AuthStore/ExpenseStore";
import messaging from "@react-native-firebase/messaging";
import { showMessage } from "react-native-flash-message";
const CommonHeader = ({
  goBack = false,
  moveTo,
  title = "Trip Listing",
  RightIcon,
  style,
  showToggle = false,
  // screen="",
  // props,
  fromEndSignature = false,
  screens = "",
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const handleToggle = () => {
    triggerMobGps(
      tripStore.selectedTrip.deviceId,
      tripStore.selectedTrip.vehicleId,
      tripStore.selectedTrip.tripId
    );
    // console.log(
    //   "gpsStore.GpsStopTracking.verified ",
    //   gpsStore.GpsStopTracking.verified
    // );
    //gpsStore.setStopGpsTracking("");
  };
  useEffect(() => {
    // Focus event listener to manage the FCM message listener
    const unsubscribeFocus = navigation.addListener("focus", () => {
      console.log("commonheader rendered:");
      storeinASync(); // Call your async storage function if needed

      // Set up FCM message listener when the screen is in focus
      const unsubscribeMessageListener = messaging().onMessage(
        async (remoteMessage) => {
          console.log(
            "Notification received from listener in COMMONHEADER!",
            remoteMessage
          );
          const { title, body } = remoteMessage.data;
          const match = body.match(/\/(\d+)/);
          const uuid = match ? match[1] : null;
          const status = body.split(" ").slice(-3, -2)[0]; // gets 'Completed' or 'Cancelled'
          // Check if the string ends with "from Web"
          const isFromWeb = body.endsWith("from Web");
          const isTripStatusChange =
    title === "Trip Status Change" &&
    (status === "Completed" || status === "Cancelled") &&
    isFromWeb;
          const isTripUnAssigned = title === "Trip Unassigned";
           console.log("isTripUnAssigned",isTripUnAssigned)
           if ((isTripStatusChange || isTripUnAssigned) && uuid === tripStore.selectedTrip?.uuid) {
            const alertMessage = isTripUnAssigned
              ? "You are unassigned from the trip."
              : `Your trip is ${status.toLowerCase()} by admin, so you are being redirected to the dashboard.`;

            Alert.alert(
              null,
              alertMessage,
              [
                {
                  text: "OK",
                  onPress: () => {
                   // navigation.navigate("Dashboard");
                  },
                },
              ],
              { cancelable: false }
            );
            await removeItem("previousTrip");
            removeItem("selectedTrip");
            imageStore.resetAllImage();
            removeItem("lastScreen");
            expenseStore.mendatoryExpense = [];
            expenseStore.newMendatoryExpense = [];
            expenseStore.ExpenseIsAdded = [];
            navigation.navigate("Dashboard");
          }
          // Trigger screen refresh
        }
      );

      // Clean up the FCM listener when the screen goes out of focus
      const unsubscribeBlur = navigation.addListener("blur", () => {
        unsubscribeMessageListener();
      });

      // Clean up the blur listener when the focus listener is removed
      return () => unsubscribeBlur();
    });

    // Clean up the focus listener on component unmount
    return () => unsubscribeFocus();
  }, [navigation]);

  const storeinASync = async () => {
    console.log("from commonheader");

    const currentStack = navigation.getState().routes;
    if (currentStack && currentStack.length) {
      logScreenView(currentStack[currentStack.length - 1].name);
    }
    console.log("in header", currentStack);
    await setItem("lastScreen", JSON.stringify(currentStack));
    await setItem("imageStore", imageStore);
    //await setItem("expenseStore",expenseStore);
  };
  // useEffect(() => {
  //   const storeinASync = async () => {
  //     console.log("from commonheader")
  //     //console.log("selectedTrip store in localbuffer : ", tripStore.selectedTrip)
  //     // if (tripStore.selectedTrip === null) {
  //     //   const selectedTrip = await getItem("selectedTrip");
  //     //   if (selectedTrip != null) {
  //     //     tripStore.selectedTrip = selectedTrip;
  //     //   }
  //     // }
  //     // else {
  //     //   await setItem("selectedTrip", tripStore.selectedTrip);
  //     //   console.log("imageStore from commonheader", imageStore)

  //     //   console.log("propertiesToStore", imageStore)

  //     //   await setItem("imageStore", imageStore)
  //     // }
  //     const currentStack = navigation.getState().routes;
  //     if (currentStack && currentStack.length) {
  //       logScreenView(currentStack[currentStack.length - 1].name)
  //     };
  //     console.log("in header", currentStack);
  //     await setItem("lastScreen", JSON.stringify(currentStack));
  //     await setItem("imageStore", imageStore);
  //   };
  //   storeinASync();
  // }, []);

  return (
    <View
      style={[
        {
          height: scale(45),
          backgroundColor: colors.SecondaryBackground,
          paddingHorizontal: moderateScale(20),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative", // Set position to relative
        },
        style,
      ]}
    >
      {goBack ? (
        <TouchableOpacity
          onPress={() => (moveTo ? moveTo() : navigation.goBack())}
          style={{
            width: "15%",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <View>
            <SVG.BackSVG />
          </View>
        </TouchableOpacity>
      ) : fromEndSignature ? (
        <TouchableOpacity
          onPress={() => navigation.navigate("NavigateTrip")}
          style={{
            width: "15%",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <View>
            <SVG.BackSVG />
          </View>
        </TouchableOpacity>
      ) : (
        <View
          style={{
            width: "15%",
            height: "100%",
            justifyContent: "center",
          }}
        />
      )}

      <View style={{ flex: 1, alignItems: "center" }}>
        <Text_Custom
          style={{ fontSize: scale(20), fontWeight: "700" }}
          text={title}
        />
      </View>

      {/* {gpsStore.GpsStopTracking.verified  && (
        <View style={{ width: "15%" }}>
          <ToggleButton
            isToggled={showToggle}
            onToggle={handleToggle}
            text="Use MobGps"
            disabled={showToggle}
          />
        </View>
      )} */}

      <View style={{ width: "15%" }}>{RightIcon && RightIcon}</View>
    </View>
  );
};

export default CommonHeader;

const styles = StyleSheet.create({});
