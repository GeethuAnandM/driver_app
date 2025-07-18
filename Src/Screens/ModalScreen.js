import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { Button, Gradient_Button } from "../Components/Button/Button";
import { addExpense } from "../Store/AuthStore/AddExpense";
import { useTheme } from "@react-navigation/native";
import { tripStore } from "../Store/AuthStore/TripStore";
import { expenseStore } from "../Store/AuthStore/ExpenseStore";
import { Formik } from "formik";
import { Dropdown } from "react-native-element-dropdown";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import * as yup from "yup";
import * as SVG from "../Assets/SVG";
import { CreateExpense } from "../Services/Actions/ExpenseAction";
import ImageCropPicker from "react-native-image-crop-picker";
import { uploadImageURL } from "../Services/Actions/AuthActions";
import Text_Custom from "../Components/Text_Custom/index";
import TextInput_custom from "../Components/TextInput_custom";
import { authStore } from "../Store/AuthStore/AuthStore";
import { AlertOpenSettings } from "../Utils/helper";
import { observer } from "mobx-react";
const ModalScreen = ({ navigation, ...props }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TripExpense openModalize={props?.route?.params?.index} />
    </View>
  );
};
const TripExpense = ({ type = "Trip", openModalize }) => {
  const [picture, setPicture] = useState("");
  const { colors, dark } = useTheme();
  const [ExpDropDownError, setExpDropDownError] = useState(false);
  const [TripDropDownError, setTripDropDownError] = useState(false);

  const tripIDList = tripStore.completed.map((exp, index) => ({
    label: `${exp.uuid} - ${exp.tripName}`,
    value: index,
    ...exp,
  }));

  const ExpTypeList = expenseStore.expenseTypes.map((exp) => ({
    label: exp.typeName,
    value: exp.typeId,
    ...exp,
  }));
  const tripName = () => {
    switch (openModalize) {
      case 0:
        return "Trip Expense";
      case 1:
        return "Vehicle Expense";
      case 2:
        return "Device Expense";
      case 3:
        return "General";
      default:
        return "Trip Expense";
    }
  };
  const addExpValidationSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    amount: yup
      .number()
      .positive()
      .typeError("Amount must be a number")

      .required("Amount is required")
      .test(
        "Is positive?",
        "ERROR: The number must be greater than 0!",
        (value) => value > 0
      ),
  });

  const addExpenseForTrip = async (value) => {
    if (value.expenseType === {}) {
      return setExpDropDownError(true);
    } else if (value.trip === {} && value.trip === undefined) {
      return setTripDropDownError(true);
    } else {
      await CreateExpense({ ...value, expTypeSelect: openModalize }).then(
        (res) => init()
      );
      addExpense.resetAllExpense();
    }
    // modalizeRef?.current?.close();
  };
  const openCamera = () => {
    try {
      ImageCropPicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        useFrontCamera: false,
      })
        .then(async (image) => {
          var img = await uploadImageURL(image.path).then((res) => {
            setPicture({ path: res.message });
            addExpense.setSelectedImage(res.message);
            return res;
          });
        })
        .catch((err) => {
          AlertOpenSettings(err);
          console.log(err);
        });
    } catch (error) {
      console.log("IMAGE_PICKER_ERROR - ", error);
    }
  };

  const RenderItem = (item, selectedId) => {
    return (
      <View
        style={{
          backgroundColor:
            item?.value == selectedId && colors.primaryBackground1,
          paddingVertical: moderateScale(15),
          paddingHorizontal: moderateScale(5),
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
        }}
      >
        <Text_Custom
          text={item?.label}
          style={{
            fontSize: scale(16),
          }}
        />
      </View>
    );
  };
  return (
    <View
      style={{
        margin: moderateScale(30),
      }}
    >
      <View style={styles.tripExpHeading}>
        <Text_Custom text={"Add Expense"} style={styles.addExpText} />
        <Text_Custom text={tripName()} style={styles.expTypetext} />
      </View>

      <Formik
        // enableReinitialize={true}
        validationSchema={addExpValidationSchema}
        initialValues={{ title: "", amount: "" }}
        onSubmit={(values) => {
          if (openModalize === 1 && authStore.driverData.vehicleId === null) {
            showError("No Vehicle assigned");
          } else {
            addExpenseForTrip({
              ...values,
              trip: addExpense.selectedTrip,
              expenseType: addExpense.selectedExpense,
              expImage: picture.path,
            });
          }
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
        }) => (
          <>
            <View style={{ marginTop: moderateScale(20) }}>
              {openModalize === 1 && (
                <>
                  <Text_Custom text="Vehicle Name" style={styles.IDinput} />
                  <TextInput_custom
                    editable={false}
                    textInputStyles={{ height: scale(40) }}
                    containerStyles={{
                      height: scale(40),
                    }}
                    value={
                      isNotNull(authStore?.driverData?.vehicleId) +
                      " / " +
                      isNotNull(authStore?.driverData?.vehicleName)
                    }
                  />
                </>
              )}

              {openModalize === 0 && (
                <>
                  <Text_Custom text="Trip ID & Name" style={styles.IDinput} />

                  <Dropdown
                    search={true}
                    style={[
                      styles.dropDownMain,
                      {
                        borderColor: TripDropDownError
                          ? colors.error
                          : colors.border,
                      },
                    ]}
                    inputSearchStyle={{
                      backgroundColor: colors.inputBackground,
                      color: colors.text,
                    }}
                    containerStyle={{
                      backgroundColor: colors.inputBackground,
                      borderRadius: 5,
                      borderColor: colors.cardBorder,
                      color: colors.text,
                    }}
                    selectedTextStyle={{
                      color: colors.text,
                    }}
                    data={tripIDList}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={"Select Trip"}
                    placeholderStyle={{
                      color: colors.placeholder,
                      fontSize: scale(14),
                      fontWeight: "500",
                    }}
                    value={addExpense.selectedTrip.value}
                    onChange={(item) => {
                      addExpense.setSelectedTrip(item);

                      setTripDropDownError(false);
                    }}
                    renderItem={(item) =>
                      RenderItem(item, addExpense.selectedTrip.value)
                    }
                  />
                  {TripDropDownError && (
                    <Text_Custom
                      text="Trip ID is required"
                      style={{
                        color: colors.error,
                        fontSize: scale(12),
                        textTransform: "capitalize",
                        marginTop: verticalScale(5),
                      }}
                    />
                  )}
                </>
              )}
            </View>
            <View
              style={{
                marginTop: moderateScale(20),
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text_Custom
                  text="Expense Type"
                  style={{
                    fontSize: scale(16),

                    // fontFamily: "NunitoSans",
                  }}
                />

                <Dropdown
                  style={[
                    styles.dropDownMain,
                    {
                      width: "50%",
                      borderColor: ExpDropDownError
                        ? colors.error
                        : colors.border,
                    },
                  ]}
                  containerStyle={styles.dropDownContainer}
                  selectedTextStyle={{
                    color: colors.text,
                  }}
                  data={ExpTypeList}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={"Select Expense"}
                  placeholderStyle={styles.dropDownPlacholder}
                  value={addExpense.selectedExpense.value}
                  onChange={(item) => {
                    addExpense.setSelectedExpense(item);
                    setExpDropDownError(false);
                  }}
                  renderItem={(item) =>
                    RenderItem(item, addExpense.selectedExpense.value)
                  }
                />
              </View>

              {ExpDropDownError && (
                <Text_Custom
                  text="Expense type is required"
                  style={{
                    color: colors.error,
                    fontSize: scale(12),
                    textTransform: "capitalize",
                    marginTop: verticalScale(5),
                  }}
                />
              )}
            </View>
            <View
              style={{
                marginTop: moderateScale(20),
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text_Custom
                text="Upload Document"
                style={{
                  fontSize: scale(16),
                  // fontFamily: "NunitoSans",
                }}
              />
              {!picture?.path ? (
                <TouchableOpacity
                  // onPress={() => props.navigation.navigate("AddBill")}
                  onPress={() => openCamera()}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    borderColor: colors.border,
                    borderRadius: 5,
                    borderWidth: 1,
                    paddingHorizontal: moderateScale(15),
                    paddingVertical: moderateScale(10),
                  }}
                >
                  <SVG.CameraSVg />
                  <Text_Custom
                    text="Capture"
                    style={{
                      color: colors.primary,
                      fontSize: scale(14),
                      fontFamily: "NunitoSans-Bold",
                      marginLeft: moderateScale(5),
                    }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  // onPress={() => props.navigation.navigate("AddBill")}
                  onPress={() => openCamera()}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    borderColor: colors.completedText,
                    borderRadius: 5,
                    borderWidth: 1,
                    paddingHorizontal: moderateScale(15),
                    paddingVertical: moderateScale(10),
                  }}
                >
                  <SVG.SuccesSVG />
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                marginTop: moderateScale(20),
                marginBottom: moderateScale(10),
              }}
            >
              <Text_Custom
                text="Title"
                style={{
                  fontSize: scale(16),
                  // fontFamily: "NunitoSans",
                  marginBottom: moderateScale(10),
                }}
              />
              <TextInput_custom
                textInputStyles={{ height: scale(40) }}
                containerStyles={{
                  height: scale(40),
                }}
                placeholder={"Enter Title"}
                ERROR_MSG={{
                  show: touched.title ? errors.title : "",
                  msg: touched.title ? errors.title : "",
                }}
                onBlur={handleBlur("title")}
                value={values.title}
                onChangeText={handleChange("title")}
              />
            </View>
            <View
              style={{
                marginVertical: moderateScale(10),
                marginBottom: moderateScale(25),
              }}
            >
              <Text_Custom
                text="Amount"
                style={{
                  fontSize: scale(16),
                  // fontFamily: "NunitoSans",
                  marginBottom: moderateScale(10),
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TextInput_custom
                  containerStyles={{
                    height: scale(40),
                    width: "75%",
                    marginBottom: 0,
                  }}
                  inputProps={{ keyboardType: "number-pad" }}
                  textInputStyles={{ height: scale(40) }}
                  placeholder={"Enter Amount"}
                  ERROR_MSG={{
                    show: touched.amount ? errors.amount : "",
                    msg: touched.amount ? errors.amount : "",
                  }}
                  onBlur={handleBlur("amount")}
                  value={values.amount}
                  onChangeText={handleChange("amount")}
                />
                <View
                  style={{
                    paddingHorizontal: moderateScale(20),
                    paddingVertical: moderateScale(9),
                    backgroundColor: colors.primary1,
                    borderRadius: 5,
                  }}
                >
                  <Text_Custom
                    text={authStore?.driverData?.currency}
                    style={{
                      color: "#fff",
                      fontSize: scale(16),
                      // fontFamily: "NunitoSans",
                    }}
                  />
                </View>
              </View>
            </View>
            <Gradient_Button
              text="Submit"
              disabled={authStore?.driverData?.vehicleId && openModalize === 1}
              onPress={() => {
                if (
                  addExpense.selectedTrip?.value === "" ||
                  addExpense.selectedTrip?.value === {} ||
                  addExpense.selectedTrip?.value === undefined
                ) {
                  setTripDropDownError(true);
                }
                if (
                  addExpense.selectedExpense?.value === "" ||
                  addExpense.selectedExpense?.value === {} ||
                  addExpense.selectedExpense?.value === undefined
                ) {
                  setExpDropDownError(true);
                } else {
                  handleSubmit();
                }
              }}
            />
          </>
        )}
      </Formik>
    </View>
  );
};
export default observer(ModalScreen);

const styles = StyleSheet.create({});
