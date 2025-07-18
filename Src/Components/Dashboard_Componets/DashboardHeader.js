import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation, useTheme } from "@react-navigation/native";
import { observer } from "mobx-react";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import * as SVG from "../../Assets/SVG";
import { getTripList } from "../../Services/Actions/TripActions";
import { getAuthData } from "../../Services/apiCalls";
import { authStore } from "../../Store/AuthStore/AuthStore";
import Text_Custom from "../Text_Custom";
import { isImage } from "../../Utils/helper";
import { getDriverDataDistance } from "../../Services/Actions/AuthActions";
import { MotiView, AnimatePresence } from "moti";
import { Badge } from "react-native-paper";

const { width, height } = Dimensions.get("screen");

const DashboardHeader = () => {
  const { colors, dark } = useTheme();
  const Navigation = useNavigation();
  const [userData, setUserData] = useState({});
  const [loading, setloading] = useState(false);
  const styles = StyleSheet.create({
    headerContainer: {
      backgroundColor: colors.SecondaryBackground,
      paddingHorizontal: moderateScale(20),
      paddingVertical: moderateScale(10),
      paddingBottom: moderateScale(25),
    },
    profileSection: { flexDirection: "row", justifyContent: "space-between" },
    profileImage: { width: 45, height: 45, borderRadius: 7 },
    iconContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      // width: 70,
    },
    user: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      // width: "100%",
      // backgroundColor: "red",
      // marginTop: verticalScale(20),
      // borderWidth: 1,
      // alignContent: 'center',
    },
    userName: {
      fontSize: scale(24),
      // fontWeight: "600",
      fontFamily: "NunitoSans-Bold",
      // borderWidth: 1,
      width: scale(220),
      textTransform: "capitalize",
      // maxWidth: "90%",
      // backgroundColor: "red",
    },
    statusButton: {
      backgroundColor: "#34C654",
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(5),
      borderRadius: scale(5),
      // height: "50%",
      // borderWidth: 1,
    },
    statusButtonText: {
      fontSize: scale(14),
      // fontWeight: "700",
      color: "#fff",
      fontFamily: "NunitoSans-Bold",
    },
    tripId: {
      fontSize: scale(14),
      // fontWeight: "700",
      fontFamily: "NunitoSans-Bold",

      color: dark ? colors.text : "#A5A5A5",
      marginTop: verticalScale(5),
    },
  });
  const Fname =
    authStore.driverData?.firstName === undefined
      ? ""
      : authStore.driverData?.firstName;
  const Mname =
    authStore.driverData?.middleName === undefined ||
    authStore.driverData?.middleName === null ||
    authStore.driverData?.middleName === ""
      ? ""
      : ` ${authStore.driverData?.middleName}`;
  const Lname =
    authStore.driverData?.lastName === undefined ||
    authStore.driverData?.lastName === null ||
    authStore.driverData?.lastName === ""
      ? ""
      : ` ${authStore.driverData?.lastName}`;
  useEffect(() => {
    const init = async () => {
      setloading(true);
      var token = await getAuthData();

       //await getDriverDataDistance(token.driver_id);
      // loaderStore.setIsLoading(true);
      await getTripList();
      setTimeout(() => {
        setUserData(token);
      }, 2000);
    };
    init();
    setloading(false);
  }, []);

  const Skeleton = () => (
    <MotiView
      style={[styles.headerContainer, { height: "30%" }]}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
      }}
    />
  );

  return (
    <AnimatePresence exitBeforeEnter>
      <>
        <View style={styles.headerContainer}>
          <View style={styles.profileSection}>
            <Image
              source={isImage(authStore?.driverData?.image)}
              style={styles.profileImage}
            />
            <View style={styles.iconContainer}>
              <TouchableOpacity
                onPress={() => {
                  Navigation.navigate("Notification");
                }}
              >
                <SVG.NotificationBell showNotification={false} />

                {authStore?.notificationCount > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      top: -5,
                      right: -5,
                      width: 18,
                      height: 18,
                      backgroundColor: "#EF3131",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 20,
                    }}
                  >
                    <Text_Custom
                      style={{ fontSize: scale(8), color: "#fff" }}
                      text={
                        authStore?.notificationCount > 9
                          ? "9+"
                          : authStore?.notificationCount <= 0
                          ? ""
                          : authStore?.notificationCount
                      }
                    />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.user}>
            <MotiView
              from={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 0.5,
              }}
              transition={{
                // default settings for all style values
                type: "timing",
                duration: 1500,
                // set a custom transition for scale
                scale: {
                  type: "spring",
                  delay: 500,
                },
              }}
            >
              <Text_Custom
                text={`${Fname}${Mname}${Lname}`}
                style={styles.userName}
                numberOfLines={2}
              />
            </MotiView>

            <View style={styles.statusButton}>
              <Text style={styles.statusButtonText}>Online</Text>
            </View>
          </View>
          {authStore.driverData?.driverId && (
            <Text_Custom
              text={`#${authStore.driverData?.driverId}`}
              style={styles.tripId}
            />
          )}
        </View>
      </>
    </AnimatePresence>
  );
};
export default observer(DashboardHeader);
