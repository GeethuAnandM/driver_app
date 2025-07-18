import { useTheme } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useEffect, useState,useRef } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImageCropPicker from "react-native-image-crop-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DropDown from "react-native-paper-dropdown";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import * as yup from "yup";
import * as SVG from "../../Assets/SVG";
import { Gradient_Button } from "../../Components/Button/Button";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import Container from "../../Components/Container/Container";
import TextInput_custom from "../../Components/TextInput_custom";
import Text_Custom from "../../Components/Text_Custom";
import { uploadImageURL } from "../../Services/Actions/AuthActions";
import {
  getExpenseTypes,
  updateExpense,
} from "../../Services/Actions/ExpenseAction";
import { authStore } from "../../Store/AuthStore/AuthStore";
import {
  dateFormate,
  expenseValidationSchema,
  getFloat,
  isImage,
  showSuccess,
  uploadingDoc,
} from "../../Utils/helper";
import DocumentPicker from 'react-native-document-picker';
import Custom_Modalize from "../../Components/Modalize/Custom_Modalize";
import { EXPENSE_VALIDATION_STRING } from "../../Utils/validator";
const EditExpenseDetails = (props) => {
  const { colors } = useTheme();
  const {
    imageUrl1,
    expenseTypeName,
    description,
    amount,
    expenseId,
    expenseTypeId,
    expenseTitle,
    currencySymbol,
  } = props.route.params.expense;

  const [showExpTypeDropDown, setShowExpTypeDropDown] = useState(false);
  const [expType, setExpType] = useState("");
  const [ExpTypeList, setExpTypeList] = useState([]);
  const [dropDownError, setDropDownError] = useState(false);
  const [ExpAmount, setExpAmount] = useState(getFloat(amount));
  const [imageUrl, setImageUrl] = useState(imageUrl1);
  const modalizeRef = useRef(null);
  const [uploading,setUploading]=useState(false);
  let height = Dimensions.get("screen").height;
  useEffect(() => {
    const init = async () => {
      setImageUrl(imageUrl1);
      const { tripId, vehicleId } = props.route.params.expense;

      await getExpenseTypes().then((res) => {
        const ExpType = [];
        var data = res?.data?.jsonData?.filter(
          (item) => item?.isActive === "Active"
        );
        if (tripId !== null) {
          // setExpTitle("Trip");
          data?.map((exp, index) =>
            ExpType.push({
              label: exp.typeName,
              value: exp.typeId,
              ...exp,
            })
          );

          setExpTypeList(ExpType?.filter((ele) => ele.subType === "Trip"));
        } else if (vehicleId !== null) {
          data?.map((exp, index) =>
            ExpType.push({
              label: exp.typeName,
              value: exp.typeId,
              ...exp,
            })
          );

          setExpTypeList(ExpType?.filter((ele) => ele.subType === "Vehicle"));
        } else if (vehicleId === null && tripId === null) {
          data?.map((exp, index) =>
            ExpType.push({
              label: exp.typeName,
              value: exp.typeId,
              ...exp,
            })
          );

          setExpTypeList(ExpType?.filter((ele) => ele.subType === "General"));
        }
        var currentEXp = ExpType?.find((e) => e.typeId === expenseTypeId);

        // setExpType(currentEXp);

        setExpType(currentEXp.typeId);
      });
    };
    init();
  }, []);

  const styles = StyleSheet.create({
    mainConatiner: {
      backgroundColor: colors.SecondaryBackground,
      borderRadius: 10,
      height: Platform.OS === "ios" ? height * 0.5 : height * 0.8,
      borderColor: colors.cardBorder,

      borderWidth: 1,
      padding: moderateScale(12),
      marginVertical: moderateScale(20),
    },
    imageContainer: {
      height: "30%",
      backgroundColor: colors.SecondaryBackground,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: "100%",
      height: "100%",
      borderRadius: 10,
      borderColor: colors.cardBorder,
      borderWidth: 1,
    },
    expenseTypeName: {
      color: colors.primary,
      fontSize: scale(14),
      fontFamily: "NunitoSans-Bold",
    },
    title: { fontSize: scale(14) },
    textContainer: {
      flexDirection: "row",
      padding: moderateScale(10),
      justifyContent: "space-between",
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
    },
    button: {
      marginVertical: moderateScale(15),
    },
    titleStyles: {
      color: colors.primary,
    },
    textInputContainer: {
      marginVertical: moderateScale(15),
      marginBottom: moderateScale(20),
    },
  });
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

  const onEdit = async (value) => {
    // props.navigation.navigate("EditExpenseDetails", {
    //   expense: props.route.params.expense,
    // });
    if (expType !== "") {
      setDropDownError(false);
      var expName = ExpTypeList.find((ele) => ele.typeId === expType);
      var body = {
        ...props.route.params.expense,
        amount: value.amount,
        expenseTitle: value.title,
        description: value.title,
        imageUrl1: imageUrl,
        expenseTypeName: expName?.typeName,
        expenseTypeId: expType,
        updatedBy: authStore.driverData.driverId,
        updatedOn: dateFormate(new Date()),
      };

      await updateExpense(body).then((res) => {
        showSuccess("Expense Updated Successfully");
        props.navigation.navigate("ExpenseDetails", {
          expense: props.route.params.expense,
        });
      });
    } else {
      setDropDownError(true);
    }
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
    // Determine the correct argument for uploadImageURL based on the type
    const uploadType = type === "handleFilePicker" ? "allType" : "";
  
    const img = await uploadImageURL(message, uploadType).then((res) => {
      console.log("res from S3", res);
  
      setImageUrl(res.message);
      setUploading(false);
      
      return res;
    });
    showSuccess("Expense document uploaded successfully")
  };
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

 
  return (
    <Container>
      <CommonHeader title="Edit Expense" goBack />
      <KeyboardAwareScrollView
        // keyboardShouldPersistTaps={Platform.OS === "ios" ? "never" : "always"}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{
          paddingHorizontal: moderateScale(20),
          paddingVertical: moderateScale(25),
        }}
      >
        {/* <ScrollView
        scrollEnabled
        nestedScrollEnabled
        keyboardShouldPersistTaps={"always"}
        style={{
          paddingHorizontal: moderateScale(20),
          paddingVertical: moderateScale(25),
        }}
      > */}
        <TouchableOpacity style={styles.imageContainer} onPress={modalOpen}>
          {imageUrl !== "" ? (
            <Image source={isImage(imageUrl)} style={styles.image} />
          ) : (
            <SVG.NoImageSvg />
          )}
       <View
  style={{
    position: "absolute",
    backgroundColor: uploading ? 'green' : colors.primary,
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(4),
    borderRadius: 5,
    right: 10,
    top: 10,
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <Text_Custom text={uploading ? "Uploading..." : "Change"} style={{ color: "#fff" }} />
</View>

        </TouchableOpacity>
        <View style={styles.mainConatiner}>
          <Formik
            // enableReinitialize={true}
            validationSchema={expenseValidationSchema}
            initialValues={{ title: expenseTitle, amount: `${amount}` }}
            onSubmit={(values) => {
              onEdit(values);
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
                    marginTop: moderateScale(5),
                    justifyContent: "space-between",
                  }}
                >
                  <Text_Custom
                    text="Expense Type"
                    style={{
                      fontSize: scale(14),
                      marginBottom: moderateScale(10),
                    }}
                  />
                  <DropDown
                    mode={"flat"}
                    visible={showExpTypeDropDown}
                    showDropDown={() => setShowExpTypeDropDown(true)}
                    onDismiss={() => setShowExpTypeDropDown(false)}
                    // onBlur={handleBlur("ExpType")}
                    // value={values.ExpType}
                    // onChangeText={handleChange("title")}

                    value={expType}
                    setValue={(value) => {
                      setDropDownError(false);
                      setExpType(value);
                    }}
                    list={ExpTypeList}
                    placeholder={"Expense Types"}
                    dropDownItemTextStyle={{ fontSize: scale(14) }}
                    // activeColor={"red"}
                    dropDownStyle={{ color: colors.text }}
                    inputProps={{
                      placeholderTextColor: colors.placeholder,
                      placeholderStyle: { color: "red" },
                      style: {
                        height: scale(40),
                        justifyContent: "center",
                        fontSize: scale(14),
                        backgroundColor: colors.primary,
                        borderRadius: scale(5),
                        borderWidth: 1,
                        color: colors.text,
                        borderColor: dropDownError
                          ? colors.error
                          : colors.border,
                      },
                    }}
                  />
                  {dropDownError && (
                    <Text
                      style={{
                        color: colors.error,
                        fontSize: scale(12),
                        textTransform: "capitalize",
                        marginTop: verticalScale(5),
                      }}
                    >
                      {"Expense type is required"}
                    </Text>
                  )}
                </View>
                <View style={{ marginTop: moderateScale(20) }}>
                  <Text_Custom
                    text="Title"
                    style={{
                      fontSize: scale(14),
                      marginBottom: moderateScale(10),
                    }}
                  />
                  <TextInput_custom
                    textInputStyles={{ height: scale(40) }}
                    containerStyles={{
                      height: scale(40),
                    }}
                    ERROR_MSG={{
                      show: touched.title ? errors.title : "",
                      msg: touched.title ? errors.title : "",
                    }}
                    onBlur={handleBlur("title")}
                    value={values.title}
                    onChangeText={handleChange("title")}
                    placeholder={"Enter Title"}
                    //   onChangeText={(value) => {
                    //     setExpTitle(value);
                    //   }}
                  />
                </View>

                <View style={styles.textInputContainer}>
                  <Text_Custom
                    text="Amount"
                    style={{
                      fontSize: scale(14),
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
                      inputProps={{ keyboardType: "number-pad" }}
                      containerStyles={{
                        height: scale(40),
                        width: "85%",
                        marginBottom: 0,
                      }}
                      ERROR_MSG={{
                        show: touched.amount ? errors.amount : "",
                        msg: touched.amount ? errors.amount : "",
                      }}
                      onBlur={handleBlur("amount")}
                      value={values.amount}
                      onChangeText={handleChange("amount")}
                      textInputStyles={{ height: scale(40) }}
                      placeholder={"Enter Amount"}
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
                        text={currencySymbol}
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
                  buttonStyles={styles.button}
                  // width={"99%"}
                  text={"Update"}
                  onPress={handleSubmit}
                />
              </>
            )}
          </Formik>
        </View>
        <View>
    
    <Custom_Modalize
modalizeRef={modalizeRef}
openCamera={openCamera}
openFilePicker={handleFilePicker} 




/>
</View>
        {/* </ScrollView> */}
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default EditExpenseDetails;
