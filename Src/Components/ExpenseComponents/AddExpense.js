import { useTheme } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import ImageCropPicker from "react-native-image-crop-picker";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import * as yup from "yup";
import * as SVG from "../../Assets/SVG";
import Text_Custom from "../../Components/Text_Custom";
import { uploadImageURL } from "../../Services/Actions/AuthActions";
import {
  CreateExpenseforTrip,
  getExpenseTypes,
  getOrgExpenseTypes,
} from "../../Services/Actions/ExpenseAction";
import { addExpense } from "../../Store/AuthStore/AddExpense";
import { authStore } from "../../Store/AuthStore/AuthStore";
import { tripStore } from "../../Store/AuthStore/TripStore";
import { AlertOpenSettings, expenseValidationSchema, showError, showSuccess, uploadingDoc } from "../../Utils/helper";
import { Gradient_Button } from "../Button/Button";
import TextInput_custom from "../TextInput_custom";
import { logCustomEvent } from "../../Utils/analytics";
import Custom_Modalize from "../Modalize/Custom_Modalize";
import DocumentPicker from 'react-native-document-picker';
import TextTicker from "react-native-text-ticker";
import { EXPENSE_VALIDATION_STRING } from "../../Utils/validator";
import { useRoute } from '@react-navigation/native';
const AddExpense = ({ closeAddExp }) => {
  let startTime = null;
  const [picture, setPicture] = useState("");
  const { colors, dark } = useTheme();
  const [ExpTypeList, setExpTypeList] = useState([]);
  const [ExpDropDownError, setExpDropDownError] = useState(false);
  const [CaptureError, setCaptureError] = useState(false);
  const modalizeRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const route = useRoute();
  
  let orgId = authStore?.driverData?.orgId;
  useEffect(() => {
    const init = async () => {
      await getExpenseTypes().then((res) => {
        //console.log("res",res)
        const ExpType = [];
        var data = res?.data?.jsonData?.filter(
          (item) => item?.isActive === "Active"
        );
        //var data = res?.data?.jsonData;
        data?.map((exp) =>
          ExpType.push({
            label: exp.typeName,
            value: exp.typeId,
            ...exp,
          })
        );

        setExpTypeList(
          ExpType?.filter(
            (ele) => ele.subType === "Trip" && ele.typeFlag === "Expense" && ele.orgId == orgId
          )
        );
      });
    };
    init();
  }, []);

 


  const styles = StyleSheet.create({
    tripDateContainer: {
      width: "49%",
      alignItems: "center",
      backgroundColor: !dark ? colors.lightBlue : colors.background,
      borderRadius: 7,
      padding: moderateScale(10),
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
    },
    CustomerItems: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: moderateScale(10),
      alignItems: "center",
    },
    LocationText: {
      fontSize: scale(12),
      fontWeight: "700",
    },
    LocationContainer: {
      marginVertical: moderateScale(10),
      // alignItems: "stretch",
    },
    tripToFrom: {
      flexDirection: "row",
      alignItems: "center",

      justifyContent: "space-between",
    },
    tripTo: {
      width: "45%",

      // marginTop: moderateScale(15),
    },
    DistanceAverageContainer: {
      alignItems: "flex-end",
      width: "30%",
    },
    text: {
      marginLeft: moderateScale(10),
      fontSize: scale(12),
      fontFamily: "NunitoSans-Bold",
    },
    textInputContainer: {
      marginVertical: moderateScale(10),
      marginBottom: moderateScale(20),
    },
  });
  var tripUuid = tripStore.selectedTrip.uuid;
  var tripName =
    tripStore.selectedTrip.uuid + " - " + tripStore.selectedTrip.tripName;



  const modalOpen = () => {
    try {
      console.log("openingngnn")
      modalizeRef.current?.open();
    } catch (error) {
      console.log("xp ", error);
    }
  };
  const getImageUrl = async (message, type) => {
    modalizeRef.current?.close();
    setUploading(true);
    if(picture.path!==""){
      setPicture("");
    }
    console.log("uplpd true>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",message)
    // Determine the correct argument for uploadImageURL based on the type
    const uploadType = type === "handleFilePicker" ? "allType" : "";
    
    const img = await uploadImageURL(message, uploadType).then((res) => {
      console.log("res from S3", res);

      setPicture({ path: res.message });
  
      setCaptureError(false);
      setUploading(false);

      return res;
    });
    showSuccess("Expense document uploaded successfully")
  };

  const handleFilePicker = async () => {
    try {
      console.log("handlefielPicker")
      const { isValid, message } = await uploadingDoc("fileManager");
      if (isValid) {
        await getImageUrl({ ...message, screen: "AddExpense" }, "handleFilePicker");

        
        
      }
      

    } catch (err) {
      console.log("err", err)
    }
  };

  const openCamera = async () => {
    try {
      const { isValid, message } = await uploadingDoc("camera");
      console.log("isvalid", isValid)
      if (isValid) {
        console.log("isvlaid")
        await getImageUrl({...message,screen:"AddExpense"});
        
      }
    } catch (error) {
      console.log("openCamera  - ", error);
    }
  };




  const addExpenseForTrip = async (value) => {
    console.log("from expense  submit")
    if (value.expenseType == {}) {
      return setExpDropDownError(true);
    } else {
      const exp = {
        amount: parseInt(value.amount),
        title: value.title,
        picture,

        ...value,
      };
      //console.log("from addexpense fro trip",exp)

      await CreateExpenseforTrip(exp, "tripScreen").then((res) => {
        console.log("res  from addexpense", res)
        if (res.status) {
          closeAddExp();
          showSuccess(res.message);


          const endTime = new Date().getTime();
          console.log("endtime", endTime)
          const timeTaken = endTime - startTime;
          console.log("timetaken", timeTaken)
          const timeTakenSeconds = Math.floor(timeTaken / 1000);
          // console.log("timeTaken for start tripin seconds  ", timeTakenSeconds);

          const eventParams = {
            timeTakenSeconds: timeTakenSeconds

          };

          logCustomEvent(`Ex_${tripUuid}_${timeTakenSeconds}`);
          // Alert.alert(res.message);
        } else {
          // Alert.alert("Something went wrong!");
        }
      });
      addExpense.resetAllExpense();
    }
    // modalizeRef?.current?.close();
  };

  return (
    <View
      style={{
        margin: moderateScale(30),
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* <TouchableOpacity onPress={closeAddExp} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
  <SVG.BackSVG />
</TouchableOpacity> */}


        <Text_Custom
          text={"Add Expense"}
          style={{ fontSize: scale(20), fontFamily: "NunitoSans-Bold" }}
        />
        <Text_Custom
          text={"Trip Expense"}
          style={{
            color: colors.primary,
            fontSize: scale(14),
            fontFamily: "NunitoSans-Bold",
          }}
        />
      </View>

      <Formik

        // enableReinitialize={true}
        validationSchema={expenseValidationSchema}
        initialValues={{ title: "", amount: "" }}
        onSubmit={(values) => {


          addExpenseForTrip({
            ...values,
            trip: tripStore.selectedTrip,
            expenseType: addExpense.selectedExpense,
            expImage: addExpense.selectedImage,
          });

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
              <Text_Custom
                text="Trip ID & Name"
                style={{
                  fontSize: scale(16),
                  marginBottom: moderateScale(10),
                  // fontFamily: "NunitoSans",
                }}
              />
              <TextInput_custom
                textInputStyles={{ height: scale(40) }}
                containerStyles={{
                  height: scale(40),
                }}
                placeholder={"Enter Title"}
                value={tripName}
                editable={false}
              />
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
                    {
                      height: scale(40),
                      width: scale(160),
                      justifyContent: "center",
                      fontSize: scale(14),
                      borderColor: ExpDropDownError
                        ? colors.error
                        : colors.border,
                      backgroundColor: colors.inputBackground,
                      borderRadius: scale(5),
                      borderWidth: 1,
                      color: colors.text,
                      paddingHorizontal: moderateScale(10),
                      color: colors.text,
                    },
                  ]}
                  containerStyle={{
                    backgroundColor: colors.inputBackground,
                    borderRadius: 5,
                    borderBottomWidth: 1,
                    borderColor: colors.cardBorder,
                    color: colors.text,
                  }}
                  selectedTextStyle={{
                    color: colors.text,
                  }}
                  data={ExpTypeList}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={"Select Expense"}
                  placeholderStyle={{
                    color: colors.placeholder,
                    fontSize: scale(14),
                    fontWeight: "500",
                  }}
                  // searchPlaceholder="Search..."
                  value={addExpense.selectedExpense.value}
                  onChange={(item) => {
                    addExpense.setSelectedExpense(item);

                    setExpDropDownError(false);
                  }}
                  renderItem={(item) => {
                    return (
                      <View
                        style={{
                          backgroundColor:
                            item.value == addExpense.selectedExpense.value &&
                            colors.primaryBackground1,
                          paddingVertical: moderateScale(15),
                          paddingHorizontal: moderateScale(5),
                          borderBottomColor: colors.cardBorder,
                          borderBottomWidth: 1,
                        }}
                      >
                        <Text_Custom
                          text={item.label}
                          style={{ fontSize: scale(16) }}
                        />
                      </View>
                    );
                  }}
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
              {/* Left side: Text with asterisk */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text_Custom
                  text={"Upload Document"}
                  style={{
                    fontSize: scale(16),
                    // fontFamily: "NunitoSans",
                  }}
                />
                <Text style={{ color: 'red', fontSize: scale(16), marginLeft: moderateScale(5) }}>*</Text>
              </View>

              {/* Right side: Upload Button and Status */}
              <View style={{ flexDirection: "column" }}>
                {/* Conditional Upload button */}
                {!picture?.path ? (
                  <TouchableOpacity
                    onPress={() => modalOpen()}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      borderColor: CaptureError ? colors.error : colors.primary,
                      borderRadius: 5,
                      borderWidth: 1,
                      paddingHorizontal: moderateScale(15),
                      paddingVertical: moderateScale(5),
                    }}
                  >
                    
                    {/* <SVG.CameraSVg /> */}
                    <Text_Custom
                      text="Upload"
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
                    onPress={() => modalOpen()}
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
                    {/* Success SVG (Uncomment if available) */}
                    <SVG.SuccesSVG />
                 
                  </TouchableOpacity>
                )}

                {/* Error Message */}
                {CaptureError && (
                  <Text_Custom
                    text="Document Required..!"
                    style={{
                      fontSize: scale(10),
                      color: colors.error,
                      marginTop: moderateScale(5),
                    }}
                  />
                )}

                {/* Uploading Status */}
                {uploading && !picture?.path && (
                  <Text_Custom
                    text="Uploading..."
                    style={{
                      fontSize: scale(12),
                      color: 'green',
                      marginTop: moderateScale(5),
                    }}
                  />
                )}
              </View>
            </View>


            <View
              style={{
                width: moderateScale(100),
                overflow: "hidden",
                marginTop: moderateScale(5), // Adds space between the Capture button section and the TextTickers
              }}
            >
              <TextTicker
                style={{ fontSize: 12, color: colors.primary }}
                duration={5000}
                loop
                bounce
                repeatSpacer={50}
                marqueeDelay={3000}
              >
                Format supported: PNG/JPEG/PDF/DOC/DOCX/XLS/XLSX
              </TextTicker>

              <TextTicker
                style={{ fontSize: 12, color: colors.primary }}
                duration={5000}
                loop
                bounce
                repeatSpacer={50}
                marqueeDelay={3000}
              >
                Max Size: 20MB
              </TextTicker>
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
                    width: "85%",
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
                    text={tripStore?.selectedTrip?.currencySymbol}
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
              onPress={() => {
                console.log("from expense click")
                startTime = new Date().getTime();
                console.log("starttrime", startTime);
                

                if (
                  addExpense.selectedExpense?.value === "" ||
                  addExpense.selectedExpense?.value == {} ||
                  addExpense.selectedExpense?.value === undefined && (!picture?.path)
                ) {
                  console.log("setExpDropDownError empty")
                  setExpDropDownError(true);
                  setCaptureError(true);

                }
                else if (  addExpense.selectedExpense?.value === "" ||
                addExpense.selectedExpense?.value == {} ||
                addExpense.selectedExpense?.value === undefined ){
                  setExpDropDownError(true);
                }
                else if (!picture?.path) {
                  console.log("pathe empty");
                  setCaptureError(true);

                 
                }

                else {
                  console.log("captureER", CaptureError)
                  console.log("Expenseerr", ExpDropDownError)
                  console.log("!ExpDropDownError && !CaptureError")
                  handleSubmit();
                }
              }}
            />
          </>
        )}
      </Formik>
      <View>

        <Custom_Modalize
          modalizeRef={modalizeRef}
          openCamera={openCamera}
          // openGallery={openGallery}

          openFilePicker={handleFilePicker}

        />
      </View>
    </View>
  );
};

export default AddExpense;
