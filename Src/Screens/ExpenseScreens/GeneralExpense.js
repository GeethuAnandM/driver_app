import { useTheme } from "@react-navigation/native";
import React, { useState,useRef } from "react";
import { StyleSheet, TouchableOpacity, View ,Text} from "react-native";
// import DropDown from "react-native-paper-dropdown";
import { Formik } from "formik";
import { Dropdown } from "react-native-element-dropdown";
import ImageCropPicker from "react-native-image-crop-picker";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import * as yup from "yup";
import * as SVG from "../../Assets/SVG";
import { Gradient_Button } from "../../Components/Button/Button";
import TextInput_custom from "../../Components/TextInput_custom";
import Text_Custom from "../../Components/Text_Custom";
import { uploadImageURL } from "../../Services/Actions/AuthActions";
import { CreateExpense } from "../../Services/Actions/ExpenseAction";
import { addExpense } from "../../Store/AuthStore/AddExpense";
import { expenseStore } from "../../Store/AuthStore/ExpenseStore";
import { authStore } from "../../Store/AuthStore/AuthStore";
import { AlertOpenSettings, expenseValidationSchema, showError, showSuccess, uploadingDoc } from "../../Utils/helper";
import { observer } from "mobx-react";
import DocumentPicker from 'react-native-document-picker';
import Custom_Modalize from "../../Components/Modalize/Custom_Modalize";
import TextTicker from "react-native-text-ticker";
import { EXPENSE_VALIDATION_STRING } from "../../Utils/validator";
const GeneralExpense = ({ openModalize, closeModalize }) => {
 
  const { colors } = useTheme();
  const [picture, setPicture] = useState("");
  const [ExpDropDownError, setExpDropDownError] = useState(false);
  const [loading, setloading] = useState(false);
  const modalizeRef = useRef(null);
  const [CaptureError, setCaptureError] = useState(false);
  const[uploading ,setUploading]=useState(false);
  
  
  const openCamera = async () => {
    try {
      const { isValid, message } = await uploadingDoc("camera");
      console.log("isvalid",isValid)
      if (isValid) {
        console.log("isvlaid")
        await getImageUrl(message);
      }
    } catch (error) {
      console.log("openCamera  - ", error);
    }
  };
  let orgId= authStore?.driverData?.orgId;
  const ExpTypeList = expenseStore.expenseTypes.map((exp) => ({
    label: exp.typeName,
    value: exp.typeId,
    ...exp,
  }));

  const ExpTypeListVehicle = ExpTypeList?.filter(
    (ele) => ele.subType === "General" && ele.orgId==orgId
  );
  const addGeneralExp = async (values) => {
    setloading(true);
    await CreateExpense({
      ...values,
      expImage: picture.path,
      expenseType: addExpense.selectedExpense,
      expTypeSelect: openModalize,
    }).then((res) => {
      setloading(!true);
      closeModalize();
    });
    setloading(!true);
    addExpense.resetAllExpense();
  };
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
        await getImageUrl(message,"handleFilePicker");
      }

    } catch (err) {
      console.log("err", err)
    }
  };
  return (
    <View style={{ margin: moderateScale(30) }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text_Custom
          text={"Add Expense"}
          style={{ fontSize: scale(20), fontFamily: "NunitoSans-Bold" }}
        />
        <Text_Custom
          text={"General"}
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
          addGeneralExp(values);
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
               <View style={{ flexDirection: "column" }}>
              {!picture?.path ? (
                <TouchableOpacity
                  // onPress={() => props.navigation.navigate("AddBill")}
                  onPress={() => modalOpen()}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    borderColor: CaptureError ? colors.error : colors.primary,
                    borderRadius: 5,
                    borderWidth: 1,
                    paddingHorizontal: moderateScale(15),
                    paddingVertical: moderateScale(10),
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
                  // onPress={() => props.navigation.navigate("AddBill")}
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
                  <SVG.SuccesSVG />
                </TouchableOpacity>
              )}
                {CaptureError && (
                  <Text_Custom
                    text="Document Required!"
                    style={{
                      fontSize: scale(10),
                      color: colors.error,
                      marginTop: moderateScale(5), // Adds space between the button and the error message
                    }}
                  />
                )}
                  {(uploading  && !picture?.path)?(
                 
                 <Text_Custom
                 text="Uploading..."
                 style={{
                   fontSize: scale(12),
                   color:'green',
                   marginTop: moderateScale(5), // Adds space between the button and the error message
                 }}
               />

                 ):
                 <View>

                  </View>
                  }
            </View>
            </View>
            <View
              style={{
                width: moderateScale(150),
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
                    },
                  ]}
                  containerStyle={{
                    backgroundColor: colors.inputBackground,
                    borderRadius: 5,
                    borderBottomWidth: 1,
                    borderColor: colors.cardBorder,
                  }}
                  selectedTextStyle={{
                    color: colors.text,
                  }}
                  data={ExpTypeListVehicle}
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
              disable={loading}
              disabled={loading}
              onPress={() => {
              //   if (
              //     addExpense.selectedExpense?.value === "" ||
              //     addExpense.selectedExpense?.value =={} ||
              //     addExpense.selectedExpense?.value === undefined
              //   ) {
              //     setExpDropDownError(true);
              //   } else {
              //     if (!picture?.path) {
              //       console.log("pathe empty")
              //       setCaptureError(true);
              //     }
  
              //     if (!ExpDropDownError && !CaptureError) {
              //       handleSubmit();
              //     }
               
              //   }
              // }}
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
openFilePicker={handleFilePicker} 




/>
</View>
    </View>
  );
};
export default observer(GeneralExpense);
const styles = StyleSheet.create({});
