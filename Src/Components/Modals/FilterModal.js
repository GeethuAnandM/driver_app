import { useTheme } from "@react-navigation/native";
import moment from "moment";
import React, { useState } from "react";
import { Alert, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import Icon from "react-native-vector-icons/Entypo";
import { Button, Gradient_Button } from "../Button/Button";
import CommonHeader from "../CommonHeader/CommonHeader";
import DatePicker from "../DateTimePicker/DatePicker";
import Text_Custom from "../Text_Custom";

const FilterModal = ({
  setModalVisible,
  modalVisible,
  filterModalTypes,
  resetFilter,
}) => {
  const { colors, dark } = useTheme();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [TripType, setTripType] = useState(3);
  const [Performance, setPerformance] = useState(3);
  const [isApplied, setisApplied] = useState(false);
  const onApply = () => {
    if (dateFrom !== "" && dateTo == "") {
      Alert.alert("To date required");
    } else if (dateFrom == "" && dateTo !== "") {
      Alert.alert("From date required");
    } else if (
      TripType === 3 &&
      Performance === 3 &&
      dateFrom === "" &&
      dateTo === ""
    ) {
      Alert.alert("Select one of the filter");
    } else {
      setModalVisible(!modalVisible);
      filterModalTypes({ TripType, Performance, dateFrom, dateTo });
    }
    // setisApplied(true);
    // filterModalTypes({ TripType, Performance, dateFrom, dateTo });

    // setModalVisible(!modalVisible);
  };
  const isFilterApplyed = () => {
    if (TripType == 3 && Performance == 3 && dateFrom == "" && dateTo == "") {
      return true;
    }
    return false;
  };
  const onReset = () => {
    setisApplied(false);
    setDateFrom("");
    setDateTo("");
    setTripType(3);
    setPerformance(3);
    resetFilter();
    // setModalVisible(!modalVisible);
  };
  const onClose = () => {
    if (isFilterApplyed()) {
      setDateFrom("");
      setDateTo("");
      setTripType(3);
      setPerformance(3);
      setModalVisible(false);
    } else {
      setModalVisible(false);
    }
  };

  const isDate = (date) => {
    if (date !== "") {
      return moment(date).format("DD-MM-YYYY");
    } else {
      return "";
    }
  };
  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      // alignItems: "center",

      backgroundColor: dark ? "#000001d9" : "#ffffffd9",
    },
    modalView: {
      margin: 20,
      backgroundColor: colors.SecondaryBackground,
      borderRadius: 20,
      paddingTop: moderateScale(15),

      paddingBottom: moderateScale(25),
      paddingHorizontal: moderateScale(20),
      // alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 90,
    },
    inActive: {
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderBottomColor: colors.border,
      borderColor: colors.border,
    },
    activeButton: {
      width: "30%",
      borderRadius: 5,
      borderColor: colors.gradientStart,
      borderWidth: 1,
      backgroundColor: colors.SecondaryBackground,
    },
    inActiveButton: {
      width: "30%",
      borderRadius: 5,
      borderColor: colors.border,
      borderWidth: 1,
      backgroundColor: colors.SecondaryBackground,
    },
    active: {
      color: colors.gradientStart,
    },
    headingDate: {
      fontSize: scale(12),
      color: colors.placeholder,
      fontFamily: "NunitoSans-Bold",
      marginBottom: 10,
    },
    heading: {
      fontSize: scale(16),
      fontFamily: "NunitoSans-Bold",
    },
    containerStyles: {
      marginVertical: moderateScale(10),
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
    },
  });

  return (
    <Modal
      statusBarTranslucent={true}
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <CommonHeader
            title="Filters"
            RightIcon={
              <TouchableOpacity
                style={styles.FilterBtn}
                onPress={() => {
                  onClose();
                }}
              >
                <Icon name="cross" size={20} color={colors.text} />
              </TouchableOpacity>
            }
          />
          <View style={styles.containerStyles}>
            <Text_Custom text={"Performance"} style={styles.heading} />
            <View
              style={{
                marginVertical: moderateScale(15),
                flexDirection: "row",
                // justifyContent: "space-between",
              }}
            >
              <Button
                buttonStyles={[
                  Performance == 0
                    ? styles.activeButton
                    : styles.inActiveButton,
                  { marginRight: moderateScale(15) },
                ]}
                titleStyles={
                  Performance == 0 ? styles.active : { color: colors.text }
                }
                text={"Delay"}
                onPress={() => {
                  if (Performance === 0) setPerformance(3);
                  else setPerformance(0);
                }}
              />
              <Button
                buttonStyles={
                  Performance == 1 ? styles.activeButton : styles.inActiveButton
                }
                titleStyles={
                  Performance == 1 ? styles.active : { color: colors.text }
                }
                text={"On Time"}
                onPress={() => {
                  if (Performance === 1) setPerformance(3);
                  else setPerformance(1);
                }}
              />
            </View>
          </View>
          <View style={styles.containerStyles}>
            <Text_Custom text={"Trip Type"} style={styles.heading} />
            <View
              style={{
                marginVertical: moderateScale(15),
                flexDirection: "row",
                // justifyContent: "space-between",
              }}
            >
              <Button
                buttonStyles={[
                  TripType == 0 ? styles.activeButton : styles.inActiveButton,
                  { marginRight: moderateScale(15) },
                ]}
                titleStyles={
                  TripType == 0 ? styles.active : { color: colors.text }
                }
                text={"One Way"}
                onPress={() => {
                  if (TripType === 0) setTripType(3);
                  else setTripType(0);
                }}
              />
              <Button
                buttonStyles={
                  TripType == 1 ? styles.activeButton : styles.inActiveButton
                }
                titleStyles={
                  TripType == 1 ? styles.active : { color: colors.text }
                }
                text={"Round"}
                onPress={() => {
                  if (TripType === 1) setTripType(3);
                  else setTripType(1);
                }}
              />
            </View>
          </View>
          <View>
            <Text_Custom text={"Date Range"} style={styles.heading} />
            <View
              style={{
                marginVertical: moderateScale(15),
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "48%" }}>
                <Text_Custom text={"From"} style={styles.headingDate} />
                <DatePicker
                  date={isDate(dateFrom)}
                  placeholder={"Select Date"}
                  setDate={setDateFrom}
                  conatinerStyles={[styles.inActive, { width: "100%" }]}
                />
              </View>
              <View style={{ width: "48%" }}>
                {dateFrom !== "" && (
                  <>
                    <Text_Custom text={"To"} style={styles.headingDate} />

                    <DatePicker
                      date={isDate(dateTo)}
                      placeholder={"Select Date"}
                      setDate={setDateTo}
                      type={"date"}
                      minDate={dateFrom !== "" ? dateFrom : null}
                      conatinerStyles={[styles.inActive, { width: "100%" }]}
                    />
                  </>
                )}
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Button
              buttonStyles={{
                width: "45%",
                backgroundColor: colors.SecondaryBackground,
                borderWidth: 1,
                borderColor: colors.text,
              }}
              titleStyles={{ color: colors.text }}
              text={"Reset"}
              onPress={() => onReset()}
            />
            <Gradient_Button
              buttonStyles={{
                width: "45%",
              }}
              text={"Apply"}
              onPress={() => onApply()}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({});
