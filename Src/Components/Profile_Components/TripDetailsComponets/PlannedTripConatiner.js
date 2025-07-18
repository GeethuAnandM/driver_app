import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { tripTypes } from "../../../Constant/constant";
import {
  canStartTrip,
  dateFormateReminder,
  formatedDate,
  formatedDateTime,
  showError,
} from "../../../Utils/helper";
import { Button } from "../../Button/Button";
import Text_Custom from "../../Text_Custom";

import { useNavigation, useTheme } from "@react-navigation/native";
import { observer } from "mobx-react";
import moment from "moment";
import { moderateScale, scale } from "react-native-size-matters";
import { ToFromIndicator } from "../../../Screens/TripScreens/TripDetailsScreen";
import { getNotes, updateTripStatus } from "../../../Services/Actions/TripActions";
import { getItem, removeItem, setItem } from "../../../Services/apiCalls";
import { expenseStore } from "../../../Store/AuthStore/ExpenseStore";
import { imageStore } from "../../../Store/AuthStore/ImageStore";
import { tripStore } from "../../../Store/AuthStore/TripStore";
import { requestLocationPermission } from "../../../Utils/gpsHelper";
import ReactNativeCallBack from "../../../Utils/gpsService";
import TripValuesConatiner from "./TripValuesConatiner";
const PlannedTripConatiner = () => {
  const [Loading, setLoading] = useState(false);
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const tripId = tripStore.selectedTrip.tripId;



  const styles = StyleSheet.create({
    detailCard: {
      backgroundColor: colors.SecondaryBackground,
      padding: moderateScale(10),
      borderRadius: scale(10),
      borderColor: colors.cardBorder,
      borderWidth: 1,
      marginBottom: moderateScale(15),
    },
    cardItems: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: moderateScale(8),
      alignItems: "center",
    },
    CustomerItems: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: moderateScale(10),
      alignItems: "center",
    },
    TripStart: {
      fontSize: scale(9.5),
      fontWeight: "700",
      color: colors.placeholder,
    },
    TripStartDate: {
      fontSize: scale(11),
      fontWeight: "700",
      marginTop: moderateScale(10),
      color: dark ? colors.primary1 : colors.text,
      textAlign: "left",
    },
    LocationText: {
      fontSize: scale(12),
      fontWeight: "700",
    },
    LocationContainer: {
      marginVertical: moderateScale(10),
    },
    tripToFrom: {
      flexDirection: "row",
    },
    tripTo: {
      width: "48%",
      // marginTop: moderateScale(15),
    },
    AddessToFrom: {
      fontSize: scale(12),
      fontWeight: "400",
      color: colors.placeholder,
    },
    tripDateContainer: {
      width: "49%",
      alignItems: "center",
      backgroundColor: !dark ? colors.lightBlue : colors.background,
      borderRadius: 7,
      paddingHorizontal: moderateScale(5),
      paddingVertical: moderateScale(10),
    },
    Actualtext: {
      color: colors.primary1,
      fontWeight: "700",
      fontSize: scale(12),
    },
    canStartTripConatiner: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: moderateScale(5),
    },
    addNoteButton: {
      width: "47%",
      backgroundColor: colors.SecondaryBackground,
      borderWidth: 1,
      borderColor: colors.text,
    },
    inProgressButtom: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: moderateScale(5),
    },
  });

  const onPressMoveTo = (screen) => {
    navigation.navigate(screen, {
      tripID: tripStore.selectedTrip?.tripId,
    });
  };

  const checkNote = async () => {
   
   
    const tripNotes = await getNotes(tripId);

    // :two: Extract the notes array or default to []
    const rawNotes = Array.isArray(tripNotes?.data?.jsonData)
    ? tripNotes.data.jsonData
    : [];

  // Filter only Trip Notes
  const notes = rawNotes.filter((n) => n.noteType === "Trip Note");

    console.log("notes in plannedTripComp################", notes);

    // :three: Safe operations on the array
    const hasNotes = notes.length > 0;
    const hasUnread = notes.some((n) => !n.isRead);

    // :four: Gate logic
    if (hasNotes && hasUnread) {
      showError("Please acknowledge all trip notes before starting the trip.");
      return false; 
    }
    return true;
  };

  return (
    <>
      <View>
        <Text
          style={{
            color: colors.primary1,
            fontWeight: "700",
            fontSize: scale(12),
          }}
        >
          {tripStore.selectedTrip.category === "Round"
            ? "Planned Onward (Date & Time)"
            : "Planned (Date & Time)"}
        </Text>
        <View style={[styles.CustomerItems]}>
          <View style={styles.tripDateContainer}>
            <Text_Custom
              text={"Trip Start (Date & Time)"}
              style={styles.TripStart}
            />
            <Text_Custom
              text={formatedDateTime(tripStore.selectedTrip?.onwardStartTime)}
              style={styles.TripStartDate}
            />
          </View>

          <View style={styles.tripDateContainer}>
            <Text_Custom
              text={"Trip End (Date & Time)"}
              style={styles.TripStart}
            />
            <Text_Custom
              text={formatedDateTime(tripStore.selectedTrip?.onwardEndTime)}
              style={styles.TripStartDate}
            />
          </View>
        </View>
        {tripStore.selectedTrip.category === "Round" && (
          <>
            <Text
              style={{
                color: colors.primary1,
                fontWeight: "700",
                fontSize: scale(12),
              }}
            >
              Planned Return (Date & Time)
            </Text>
            <View style={[styles.CustomerItems]}>
              <View style={styles.tripDateContainer}>
                <Text_Custom
                  text={"Trip Start (Date & Time)"}
                  style={styles.TripStart}
                />
                <Text_Custom
                  text={formatedDateTime(
                    tripStore.selectedTrip?.returnStartTime
                  )}
                  style={styles.TripStartDate}
                />
              </View>

              <View style={styles.tripDateContainer}>
                <Text_Custom
                  text={"Trip End (Date & Time)"}
                  style={styles.TripStart}
                />
                <Text_Custom
                  text={formatedDateTime(tripStore.selectedTrip?.returnEndTime)}
                  style={styles.TripStartDate}
                />
              </View>
            </View>
          </>
        )}
        {(tripStore.selectedTrip?.status === tripTypes[3] ||
          tripStore.selectedTrip?.status === tripTypes[2]) && (
          <>
            <Text style={styles.Actualtext}>
              {tripStore.selectedTrip.category === "Round"
                ? "Actual Onward (Date & Time)"
                : "Actual (Date & Time)"}
            </Text>
            <View style={[styles.CustomerItems]}>
              <View style={styles.tripDateContainer}>
                <Text_Custom
                  text={"Trip Start (Date & Time)"}
                  style={styles.TripStart}
                />
                <Text_Custom
                  text={formatedDate(
                    tripStore.selectedTrip?.onwardActualStartTime
                  )}
                  style={styles.TripStartDate}
                />
              </View>

              <View style={styles.tripDateContainer}>
                <Text_Custom
                  text={"Trip End (Date & Time)"}
                  style={styles.TripStart}
                />
                <Text_Custom
                  text={formatedDate(
                    tripStore.selectedTrip?.onwardActualEndTime
                  )}
                  style={styles.TripStartDate}
                />
              </View>
            </View>
          </>
        )}
        {(tripStore.selectedTrip?.status === tripTypes[3] ||
          tripStore.selectedTrip?.status === tripTypes[2]) &&
          tripStore.selectedTrip.category === "Round" && (
            <>
              <Text style={styles.Actualtext}>Actual Return (Date & Time)</Text>
              <View style={[styles.CustomerItems]}>
                <View style={styles.tripDateContainer}>
                  <Text_Custom
                    text={"Trip Start (Date & Time)"}
                    style={styles.TripStart}
                  />
                  <Text_Custom
                    text={formatedDateTime(
                      tripStore.selectedTrip?.returnActualStartTime
                    )}
                    style={styles.TripStartDate}
                  />
                </View>

                <View style={styles.tripDateContainer}>
                  <Text_Custom
                    text={"Trip End (Date & Time)"}
                    style={styles.TripStart}
                  />
                  <Text_Custom
                    text={dateFormateReminder(
                      tripStore.selectedTrip?.returnActualEndTime
                    )}
                    style={styles.TripStartDate}
                  />
                </View>
              </View>
            </>
          )}
        <View style={styles.LocationContainer}>
          <Text_Custom text={"Location"} style={styles.LocationText} />
          <>
            <ToFromIndicator vertical={true} />
            <View style={styles.tripToFrom}>
              <View style={styles.tripTo}>
                <Text_Custom
                  // numberOfLines={2}
                  text={"Start Base"}
                  style={styles.TripStartDate}
                />
                {typeof tripStore?.tripStartLoc === "string" && (
                  <Text_Custom
                    // numberOfLines={2}
                    text={tripStore?.tripStartLoc}
                    style={styles.TripStartDate}
                  />
                )}
                {/* <Text_Custom
                      text={"Pune H.O, Pune"}
                      style={styles.AddessToFrom}
                    /> */}
              </View>
              <View style={[styles.tripTo, { alignItems: "flex-end" }]}>
                <View>
                  <Text_Custom text={"End Base"} style={styles.TripStartDate} />
                  {typeof tripStore?.tripEndLoc === "string" && (
                    <Text_Custom
                      text={tripStore?.tripEndLoc}
                      style={styles.TripStartDate}
                    />
                  )}
                </View>
              </View>
            </View>
          </>

          <>
            <ToFromIndicator
              vertical={true}
              SCOLOR={null}
              ECOLOR={null}
              Sfill={colors.primary}
            />
            <View style={styles.tripToFrom}>
              <View style={styles.tripTo}>
                <Text_Custom
                  text={"Start Point"}
                  style={styles.TripStartDate}
                />
                {typeof tripStore?.tripStartLoc === "string" && (
                  <Text_Custom
                    text={tripStore?.loacationNames?.actualStartName}
                    style={styles.TripStartDate}
                  />
                )}
              </View>
              <View style={[styles.tripTo, { alignItems: "flex-end" }]}>
                <View>
                  <Text_Custom
                    text={"End Point"}
                    style={styles.TripStartDate}
                  />
                  {typeof tripStore?.tripEndLoc === "string" && (
                    <Text_Custom
                      text={tripStore?.loacationNames?.actualEndName}
                      style={styles.TripStartDate}
                    />
                  )}
                  {/* <Text_Custom
                        text={"Andheri H.O"}
                        style={styles.AddessToFrom}
                      /> */}
                </View>
              </View>
            </View>
          </>
        </View>

        <TripValuesConatiner />
        {canStartTrip(tripStore.selectedTrip?.onwardStartTime) ? (
          <>
            {tripStore.selectedTrip?.status === tripTypes[1] && (
              <>
                <View style={styles.canStartTripConatiner}>
                  <Button
                    buttonStyles={styles.addNoteButton}
                    titleStyles={{ color: colors.text }}
                    text={"Add Note"}
                    onPress={() => {
                      onPressMoveTo("AddNote");
                    }}
                  />
                  <Button
                    buttonStyles={{
                      width: "47%",
                    }}
                    text={"Start Trip"}
                    onPress={async () => {
                      const body = {
                        applyForRecurring: false,
                        status: tripTypes[2],
                        tripId: tripStore.selectedTrip.tripId,
                        isOnlyValidate: true,
                        actualStartTime: moment(new Date()).format(
                          "YYYY-MM-DD HH:mm:ss"
                        ),
                      };

                      const ok = await checkNote();
                      if (!ok) return;

                      await updateTripStatus(body)
                        .then(async (updateRes) => {
                          console.log("from start status");
                          setLoading(false);
                          if (
                            tripStore.selectedTrip?.vehicleId !== null &&
                            tripStore.selectedTrip?.vehicleId !== undefined
                          ) {
                            var previousTrip = await getItem("previousTrip");
                            console.log("previousTrip", previousTrip);
                            //console.log("selected rip form strt trip button?????????????????????????????",selectTrip)
                            console.log(
                              "previous trip??????????????????",
                              previousTrip
                            );
                            //remove previous trip iamges and docs if it is not properely ended from mob
                            if (
                              previousTrip != null &&
                              previousTrip.tripId !==
                                tripStore.selectedTrip?.tripId
                            ) {
                              console.log("previousTrip");
                              console.log(
                                "entring to this removing restingg????"
                              );
                              imageStore.resetAllImage();
                              removeItem("lastScreen");
                              expenseStore.mendatoryExpense = [];
                              expenseStore.newMendatoryExpense = [];
                              expenseStore.ExpenseIsAdded = [];
                              await setItem(
                                "previousTrip",
                                tripStore.selectedTrip
                              );
                            }
                            await setItem(
                              "previousTrip",
                              tripStore.selectedTrip
                            );

                            console.log("imageStore", imageStore);
                            tripStore.setTripStatus("status", tripTypes[1]);
                            var permissionGranted =
                              await requestLocationPermission();
                            if (permissionGranted) {
                              console.log("permissionGranted");

                              try {
                                //await getGpsPackets();
                                ReactNativeCallBack.startService(
                                  tripStore.selectedTrip.tripId,
                                  tripStore.selectedTrip.driverId,
                                  tripStore.selectedTrip.vehicleId,
                                  (response) => {
                                    console.log(
                                      `Created a new event with id ${response}`
                                    );
                                  }
                                );
                              } catch (err) {
                                console.log("err", err);
                              }
                            }
                            navigation.navigate("StartOdometer");
                          } else {
                            showError("Vehicle Required");
                          }
                        })
                        .catch((err) => {
                          setLoading(false);
                          console.log("err", err);
                        });
                    }}
                  />
                </View>
                <Button
                  onPress={() => {
                    onPressMoveTo("CancelTrip");
                  }}
                  text={"Cancel Trip"}
                  buttonStyles={{
                    backgroundColor: colors.error,
                    marginVertical: moderateScale(5),
                  }}
                />
              </>
            )}
          </>
        ) : (
          <>
            {tripStore.selectedTrip?.status === tripTypes[2] && (
              <Button
                onPress={() => {
                  onPressMoveTo("CancelTrip");
                }}
                text={"Cancel Trip"}
                buttonStyles={{
                  backgroundColor: colors.error,
                  marginVertical: moderateScale(5),
                }}
              />
            )}
          </>
        )}
        {tripStore.selectedTrip?.status === tripTypes[2] && (
          <>
            <View style={styles.inProgressButtom}>
              <Button
                buttonStyles={styles.addNoteButton}
                titleStyles={{ color: colors.text }}
                text={"Add Notes"}
                onPress={() => {
                  onPressMoveTo("AddNote");
                }}
              />
              <Button
                buttonStyles={{
                  width: "50%",
                }}
                text={"Start Navigation"}
                onPress={async () => {
                  const ok = await checkNote();
                  if (!ok) return;
                  var previousTrip = await getItem("previousTrip");

                  console.log("previous trip??????????????????", previousTrip);
                  //remove previous trip iamges and docs if it is not properely ended from mob
                  if (
                    previousTrip != null &&
                    previousTrip.tripId !== tripStore.selectedTrip?.tripId
                  ) {
                    imageStore.resetAllImage();
                    removeItem("lastScreen");
                    expenseStore.mendatoryExpense = [];
                    expenseStore.newMendatoryExpense = [];
                    expenseStore.ExpenseIsAdded = [];
                    await setItem("previousTrip", tripStore.selectedTrip);
                  }

                  await setItem("previousTrip", tripStore.selectedTrip);
                  var permissionGranted = await requestLocationPermission();

                  if (permissionGranted) {
                    console.log("permissionGranted");

                    try {
                      //await getGpsPackets();
                      ReactNativeCallBack.startService(
                        tripStore.selectedTrip.tripId,
                        tripStore.selectedTrip.driverId,
                        tripStore.selectedTrip.vehicleId,
                        (response) => {
                          console.log(
                            `Created a new event with id ${response}`
                          );
                        }
                      );
                    } catch (err) {
                      console.log("err", err);
                    }
                  }

                  onPressMoveTo("NavigateTrip");
                }}
              />
            </View>
          </>
        )}
      </View>
    </>
  );
};

export default observer(PlannedTripConatiner);
