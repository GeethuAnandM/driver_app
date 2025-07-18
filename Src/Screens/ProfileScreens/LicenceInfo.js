import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { moderateScale, scale } from "react-native-size-matters";
import * as SVG from "../../Assets/SVG";
import { Button, Gradient_Button } from "../../Components/Button/Button";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import Container from "../../Components/Container/Container";
import DatePicker from "../../Components/DateTimePicker/DatePicker";
import Text_Custom from "../../Components/Text_Custom";
import { observer } from "mobx-react";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import ImageCropPicker from "react-native-image-crop-picker";
import PushNotification from "react-native-push-notification";
import Custom_Modalize from "../../Components/Modalize/Custom_Modalize";
import TextInput_custom from "../../Components/TextInput_custom";
import {
  updateLicanceData,
  uploadImageURL,
} from "../../Services/Actions/AuthActions";
import { getItem, setItem } from "../../Services/apiCalls";
import { authStore } from "../../Store/AuthStore/AuthStore";
import { imageStore } from "../../Store/AuthStore/ImageStore";
import {
  dateFormateReminder,
  formatedDateTime,
  isImage,
  showError,
  showSuccess,
} from "../../Utils/helper";
import { findDriver } from "../../Utils/validator";
const LicenceInfo = (props) => {
  const { colors } = useTheme();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [ERROR, setERROR] = useState({ show: false, msg: "" });
  const [Reminders, setReminders] = useState("");
  const [IsDriverFound, setIsDriverFound] = useState(findDriver());
  const [modalVisible, setModalVisible] = useState(false);
  const showPermissions = () => {
    // PushNotificationIOS.scheduleLocalNotification({
    //   alertBody: "Test Local Notification",
    //   fireDate: new Date(new Date().valueOf() + 2000).toISOString(),
    // });
    // PushNotificationIOS.checkPermissions((permissions) => {
    //   // setPermissions({permissions});
    // });
  };
  const styles = StyleSheet.create({
    main_container: {
      marginHorizontal: moderateScale(20),
      // paddingBottom: moderateScale(50),
      flex: 1,
    },
    heading: {
      fontFamily: "NunitoSans-Bold",
      fontSize: scale(20),
    },
    Sub_heading: {
      fontFamily: "NunitoSans-Regular",
      fontSize: scale(14),
      marginTop: moderateScale(5),
    },
    cameraViewFinder: {
      width: Dimensions.get("screen").width - 60,
      height: scale(200),
      borderWidth: 2,
      borderColor: colors.primary1,
      borderRadius: Platform.OS == "ios" ? 20 : 0,
      marginTop: moderateScale(40),
      marginBottom: moderateScale(20),
      justifyContent: "center",
      alignItems: "center",
    },
    successText: {
      marginHorizontal: moderateScale(10),
      marginVertical: moderateScale(20),
    },
    msgContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    nextBtn: {
      marginVertical: moderateScale(20),
    },
    nextText: { fontFamily: "NunitoSans-Bold", color: colors.primary1 },
    uplodeRetake: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      width: "100%",
    },
    retackBtn: {
      width: "42%",
      backgroundColor: colors.SecondaryBackground,
      borderWidth: 1,
      borderColor: colors.primary1,
      borderRadius: 5,
    },
    uplodeBtn: {
      width: "42%",
      borderRadius: 5,
    },
    finalImage: {
      width: "100%",
      height: "100%",
      borderRadius: Platform.OS == "ios" ? 20 : 0,
      resizeMode: "cover",
    },
    // uplodeBtn: {
    //   width: "35%",
    //   borderRadius: 5,
    // },
    textIconContainer: {
      flexDirection: "row",
      marginBottom: moderateScale(10),
      alignItems: "center",
    },
    text: {
      marginLeft: moderateScale(10),
      fontSize: scale(12),
      fontFamily: "NunitoSans-Bold",
    },
    textInputContainer: {
      marginBottom: moderateScale(10),
      width: "100%",
    },
  });
  useEffect(() => {
    // showPermissions();
    setIsDriverFound(findDriver());
    const init = async () => {
      var reminders = await getItem("reminders");
      if (reminders !== null && reminders !== undefined && reminders !== "") {
        setReminders(reminders);
      } else {
        setReminders("");
      }
    };
    init();
  }, []);
  const ScheduleNoti = (date) => {
    // PushNotification.cancelAllLocalNotifications();
    PushNotification.localNotificationSchedule({
      message: "License expiry reminder", // (required)
      date: date,
      allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
      title: "Reminder",
      channelId: "test",
    });
  };
  const AddReminder = async () => {
    if (date !== "") {
      setReminders(date);
      setDate("");
      await setItem("reminders", date);
      ScheduleNoti(date);
    } else {
      showError("Please Select Date & time.");
      // Alert.alert("Please Select Date & time.", "Try again.");
    }
  };
  const deleteReminder = (index1) => {
    Alert.alert("Confirm", "Are you sure you want to delete the reminder?", [
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setReminders("");
          setItem("reminders", "");
          showSuccess("Reminder Deleted Successfully");
          // let newarray = [];
          // if (index1 > -1) {
          //   Reminders.map((d, i) => {
          //     if (i != index1) {
          //       newarray.push(d);
          //     }
          //   });
          //   setReminders(newarray);
          //   setItem("reminders", newarray);
          // }
        },
      },
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
    ]);
  };
  const DriverDetails = () => {
    return (
      <View>
        <View
          style={{
            paddingVertical: moderateScale(20),
            height: 300,
            // width: "100%",
          }}
        >
          <Image
            source={isImage(authStore.driverData?.licensePath)}
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              height: "100%",
              borderRadius: 5,
            }}
          />
        </View>
        <View>
          <Text_Custom
            style={{
              fontSize: scale(16),
              fontFamily: "NunitoSans-Bold",
              marginBottom: moderateScale(15),
            }}
            text={"License Information"}
          />
          <View
            style={{
              borderRadius: 5,
              borderWidth: 1,
              borderColor: colors.cardBorder,
              backgroundColor: colors.SecondaryBackground,
              paddingHorizontal: moderateScale(10),
              marginBottom: moderateScale(15),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: moderateScale(15),
                borderBottomColor: colors.border,
                borderBottomWidth: 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text_Custom
                  style={{
                    fontFamily: "NunitoSans-Bold",
                  }}
                  text={"License Number"}
                />
              </View>
              <Text
                style={{
                  color: colors.primary,
                  fontFamily: "NunitoSans-Bold",
                }}
              >
                {authStore.driverData?.licenseNumber}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: moderateScale(15),
                borderBottomColor: colors.cardBorder,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text_Custom
                  style={{
                    fontFamily: "NunitoSans-Bold",
                  }}
                  text={"License Expiry Date"}
                />
              </View>
              <Text
                style={{
                  color: colors.primary,
                  fontFamily: "NunitoSans-Bold",
                }}
              >
                {formatedDateTime(
                  authStore.driverData?.licenseExpirationDate,
                  "date"
                )}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text_Custom
              style={{
                fontSize: scale(16),
                fontFamily: "NunitoSans-Bold",
              }}
              text={Reminders == "" ? "Set Reminder" : "Reminder"}
            />
          </View>
          {Reminders == "" && (
            <>
              <View
                style={{
                  marginBottom: moderateScale(15),
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: moderateScale(15),
                }}
              >
                <DatePicker
                  conatinerStyles={{ width: "100%" }}
                  date={
                    dateFormateReminder(date) === "-"
                      ? ""
                      : dateFormateReminder(date)
                  }
                  placeholder={"Select Date and Time"}
                  setDate={setDate}
                  type={"datetime"}
                  minDate={new Date()}
                />
                {/* <DatePicker
              date={time}
              placeholder={"Select Time"}
              setDate={setTime}
              type={"time"}
            /> */}
              </View>
              <Gradient_Button
                text="Save"
                onPress={() => {
                  AddReminder();
                }}
              />
            </>
          )}
        </View>
        <View>
          {Reminders !== "" && (
            <View
              style={{
                borderRadius: 5,
                borderWidth: 1,
                borderColor: colors.cardBorder,
                backgroundColor: colors.SecondaryBackground,
                paddingHorizontal: moderateScale(10),
                marginVertical: moderateScale(25),
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: moderateScale(15),
                  borderBottomColor: colors.border,
                  borderBottomWidth: 1,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text_Custom
                    style={{
                      fontFamily: "NunitoSans-Bold",
                    }}
                    text={dateFormateReminder(Reminders)}
                  />
                </View>
                <TouchableOpacity onPress={() => deleteReminder()}>
                  <SVG.DeleteSVG />
                </TouchableOpacity>
              </View>
            </View>
          )}
          {/* {Reminders.length > 0 && (
            <View style={{ height: "65%" }}>
              <FlatList
                data={Reminders}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  borderRadius: 5,
                  borderWidth: (Reminders.length > 0) & 1,
                  borderColor: colors.cardBorder,
                  backgroundColor: colors.SecondaryBackground,
                  paddingHorizontal: moderateScale(10),
                  marginVertical: moderateScale(25),
                }}
                renderItem={({ item, index }) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingVertical: moderateScale(15),
                        borderBottomColor: colors.border,
                        borderBottomWidth: 1,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text_Custom
                          style={{
                            fontFamily: "NunitoSans-Bold",
                          }}
                          text={dateFormateReminder(item)}
                        />
                      </View>
                      <TouchableOpacity onPress={() => deleteReminder(index)}>
                        <SVG.DeleteSVG />
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </View>
          )} */}
        </View>
      </View>
    );
  };
  return (
    <Container>
      <CommonHeader
        goBack={true}
        title={"License Information"}
        RightIcon={
          IsDriverFound && (
            <TouchableOpacity
              style={{ alignItems: "flex-end" }}
              onPress={() => props.navigation.navigate("EditDriverLicense")}
            >
              <SVG.LiceneceEdit />
            </TouchableOpacity>
          )
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: moderateScale(20),
          // marginVertical: moderateScale(20),
        }}
      >
        <DriverDetails />
      </ScrollView>
    </Container>
  );
};
export default observer(LicenceInfo);
