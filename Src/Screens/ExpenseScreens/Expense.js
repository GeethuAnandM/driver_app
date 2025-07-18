import { useTheme } from "@react-navigation/native";
import { observer } from "mobx-react";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View ,Text} from "react-native";
import ImageCropPicker, { cleanSingle } from "react-native-image-crop-picker";
import { Modalize } from "react-native-modalize";
// import DropDown from "react-native-paper-dropdown";
import { Formik } from "formik";
import { Dropdown } from "react-native-element-dropdown";
import { Portal } from "react-native-portalize";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import * as yup from "yup";
import * as SVG from "../../Assets/SVG";
import { Gradient_Button } from "../../Components/Button/Button";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import Container from "../../Components/Container/Container";
import FAB from "../../Components/FAB/FAB";
import Loader from "../../Components/Loader/Loader";
import TextInput_custom from "../../Components/TextInput_custom";
import Text_Custom from "../../Components/Text_Custom";
import { uploadImageURL } from "../../Services/Actions/AuthActions";
import {
  CreateExpense,
  getExpenseByDriverID,
  getExpenseTypes,
} from "../../Services/Actions/ExpenseAction";
import { addExpense } from "../../Store/AuthStore/AddExpense";
import { expenseStore } from "../../Store/AuthStore/ExpenseStore";
import { tripStore } from "../../Store/AuthStore/TripStore";
import {
  AlertOpenSettings,
  expenseValidationSchema,
  formatedDateTime,
  showError,
  showSuccess,
  uniqueArray,
  uploadingDoc,
} from "../../Utils/helper";
import GeneralExpense from "./GeneralExpense";
import TripExpenseList from "./TripExpenseList";
import { authStore } from "../../Store/AuthStore/AuthStore";
import { tripTypes } from "../../Constant/constant";
import { getOrgLevelSettings } from "../../Services/Actions/TripActions";
import Custom_Modalize from "../../Components/Modalize/Custom_Modalize";
import DocumentPicker from 'react-native-document-picker';
import TextTicker from "react-native-text-ticker";
import { EXPENSE_VALIDATION_STRING } from "../../Utils/validator";

let ExpTypeList = [];
const Expense = (props) => {
  const { colors, dark } = useTheme();
  const [expMenu, setExpMenu] = useState(false);
  const modalizeRef = useRef(null);
  const [openModalize, setOpenModalize] = useState(0);
  const [loading, setloading] = useState(false);


  const styles = StyleSheet.create({
    dropDownMain: {
      height: scale(40),
      justifyContent: "center",
      backgroundColor: colors.inputBackground,
      borderRadius: scale(5),
      borderWidth: 1,
      paddingHorizontal: moderateScale(10),
    },
    tripExpHeading: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    addExpText: { fontSize: scale(20), fontFamily: "NunitoSans-Bold" },

    expTypetext: {
      color: colors.primary,
      fontSize: scale(14),
      fontFamily: "NunitoSans-Bold",
    },

    IDinput: {
      fontSize: scale(16),
      marginBottom: moderateScale(10),
    },

    dropDownContainer: {
      backgroundColor: colors.inputBackground,
      borderRadius: 5,
      borderBottomWidth: 1,
      borderColor: colors.cardBorder,
      color: colors.text,
    },
    dropDownPlacholder: {
      color: colors.placeholder,
      fontSize: scale(14),
      fontWeight: "500",
    },
  });
  let orgId= authStore?.driverData?.orgId;
  useEffect(() => {
    ExpTypeList = expenseStore?.expenseTypes?.map((exp) => ({
      label: exp.typeName,
      value: exp.typeId,
      ...exp,
    }));
  }, [props, expenseStore]);
  const init = async () => {
    setloading(true);

    await getExpenseTypes();
    await getExpenseByDriverID().then((res) => {
      setloading(false);
    });
  };

  const onRefresh = React.useCallback(async () => {
    init();
  }, []);
  const FloatingMenu = () => {
    const pressMenuItem = (index = 0) => {
      setOpenModalize(index);
      setExpMenu(false);
      modalizeRef.current?.open();
    };
    return (
      <View
        style={{
          position: "absolute",
          right: scale(30),
          bottom: scale(120),
          backgroundColor: colors.SecondaryBackground,
          width: scale(130),
          paddingHorizontal: moderateScale(10),
          paddingVertical: moderateScale(10),
          borderRadius: 10,
          borderColor: colors.cardBorder,
          borderWidth: 1,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,

          elevation: 6,
        }}
      >
        <TouchableOpacity
          onPress={() =>pressMenuItem(0)
           //console.log(" tripStore.TripList", tripStore.TripList);}
            
          }
          style={{
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            paddingBottom: moderateScale(8),
            marginBottom: moderateScale(8),
          }}
        >
          <Text_Custom
            text="Trip Expense"
            style={{ fontSize: scale(14), fontFamily: "NunitoSans-SemiBold" }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => pressMenuItem(1)}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            paddingBottom: moderateScale(8),
            marginBottom: moderateScale(8),
          }}
        >
          <Text_Custom
            text="Vehicle Expense"
            style={{ fontSize: scale(14), fontFamily: "NunitoSans-SemiBold" }}
          />
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => pressMenuItem(2)}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            paddingBottom: moderateScale(8),
            marginBottom: moderateScale(8),
          }}
        >
          <Text_Custom
            text="Device Expense"
            style={{ fontSize: scale(14), fontFamily: "NunitoSans-SemiBold" }}
          />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => pressMenuItem(3)}>
          <Text_Custom
            text="General"
            style={{ fontSize: scale(14), fontFamily: "NunitoSans-SemiBold" }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const VehicleExpense = () => {
    return (
      <View>
        <Text_Custom
          text="Trip Expense"
          style={{ fontSize: scale(14), fontFamily: "NunitoSans-SemiBold" }}
        />
      </View>
    );
  };

  const TripExpense = ({ type = "Trip" }) => {
    const [picture, setPicture] = useState("");
    const [cs, setcs] = useState(authStore.driverData.currency);
    const [ExpDropDownError, setExpDropDownError] = useState(false);
    const [TripDropDownError, setTripDropDownError] = useState(false);
    const [VehicleDropDownError, setVehicleDropDownError] = useState(false);
    const [selectedVehicle, setselectedVehicle] = useState({});
    const [isCompletedTrip,setCompletedTrip]=useState(false);
    const [canAddExpense,setCanAddExpense]=useState(true);
    const [isDropDownClicked,setisDropDownClicked]=useState(false);
    const modalizeRef = useRef(null);
    const [CaptureError, setCaptureError] = useState(false);
    const[uploading ,setUploading]=useState(false);

    // useEffect(() => {
    //   ExpTypeList = expenseStore?.expenseTypes?.map((exp) => ({
    //     label: exp.typeName,
    //     value: exp.typeId,
    //     ...exp,
    //   }));
      
    const modalOpen = () => {
      try {
        console.log("openingngnn")
        modalizeRef.current?.open();
      } catch (error) {
        console.log("xp ", error);
      }
    };

    // }, []);
    useEffect(() => {
      const fetchData = async () => {
        try {
          // Map expense types
          const ExpTypeList = expenseStore?.expenseTypes?.map((exp) => ({
            label: exp.typeName,
            value: exp.typeId,
            ...exp,
          }));
    
          // Fetch organization level settings
          const orgResponse = await getOrgLevelSettings(); // Assuming getOrgLevelSettings is an async function
    
          // Set state based on fetched data
          setCanAddExpense(orgResponse.addExpenseValidation);
        } catch (error) {
          console.error('Error fetching data:', error);
          // Handle errors if needed
        }
      };
    
      // Call fetchData function when component mounts (empty dependency array)
      fetchData();
    }, []); // Empty dependency array means this effect runs once, on mount
    

    //here the dropdown for selscting trip for expense
    const tripIDList = tripStore.TripList.map((exp, index) => ({
      label: `${exp.tripName} | ${exp.uuid} | ${formatedDateTime(
        exp.onwardStartTime,
        "date"
      )}`,
      value: index,
      ...exp,
    }));
   
    const vehicleList = uniqueArray(
      tripStore?.completed
        ?.filter(exp => exp?.vehicleName) // Filter out entries where `vehicleName` is null or undefined
        .map((exp, index) => ({
          label: exp.vehicleName,
          value: exp.vehicleId,
          vehicleId: exp.vehicleId,
          vehicleName: exp.vehicleName,
        })) , // Fallback to an empty array if `completed` is undefined
      "vehicleId"
    );
    
    const ExpTypeListTrip = ExpTypeList?.filter(
      (ele) => ele.subType === "Trip" && ele.typeFlag === "Expense" && ele.orgId==orgId 
    );

    const ExpTypeListVehicle = ExpTypeList?.filter(
      (ele) => ele.subType === "Vehicle" && ele.typeFlag === "Expense" &&  ele.orgId==orgId 
    );

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
  

   
    
    
    const addExpenseForTrip = async (value) => {
      console.log("from ")
      if (value.expenseType == {}) {
        return setExpDropDownError(true);
      } else if (value.trip == {} && value.trip === undefined) {
       
        return setTripDropDownError(true);
      } 
      
      // else if (value.trip.status == tripTypes[3]|| tripTypes[4] && value.trip === undefined) {
      //   return setTripDropDownError(true);
      // } 
      
      else {
        await CreateExpense({ ...value, expTypeSelect: openModalize }).then(
          (res) => init()
        );
        addExpense.resetAllExpense();
      }
      modalizeRef?.current?.close();
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
      console.log("exxxx")

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

    const RenderItem = (item, selectedId) => {
      return (
        <View
          style={{
            backgroundColor:
              item?.value == selectedId && colors.primaryBackground1,
            paddingVertical: moderateScale(15),
            paddingHorizontal: moderateScale(10),
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
          validationSchema={expenseValidationSchema}
          initialValues={{ title: "", amount: "" }}
          onSubmit={(values) => {
            addExpenseForTrip({
              ...values,
              trip: addExpense.selectedTrip,
              expenseType: addExpense.selectedExpense,
              expImage: picture.path,
              vehicle: selectedVehicle,
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
              <View style={{marginTop: moderateScale(20)}}>
                {openModalize === 1 && (
                  <>
                    <Text_Custom text="Vehicle Name" style={styles.IDinput} />
                    {/* <TextInput_custom
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
                    /> */}
                    <Dropdown
                      search={true}
                      searchPlaceholder={"Search Vehicle"}
                      style={[
                        styles.dropDownMain,
                        {
                          borderColor: VehicleDropDownError
                            ? colors.error
                            : colors.border,
                        },
                      ]}
                      inputSearchStyle={{
                        backgroundColor: colors.inputBackground,
                        color: colors.text,
                      }}
                      containerStyle={{
                        backgroundColor: colors.SecondaryBackground,
                        borderRadius: 5,
                        borderColor: colors.cardBorder,
                        color: colors.text,
                      }}
                      selectedTextStyle={{
                        color: colors.text,
                      }}
                      data={vehicleList}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={"Select Vehicle"}
                      placeholderStyle={{
                        color: colors.placeholder,
                        fontSize: scale(14),
                        fontWeight: "500",
                      }}
                      value={selectedVehicle.value}
                      onChange={(item) => {
                        console.log(tripStore.completed,"tripstore.comp")
                        setselectedVehicle(item);
                        setVehicleDropDownError(false);
                      }}
                      renderItem={(item) =>
                        RenderItem(item, selectedVehicle.value)
                      }
                    />
                    {VehicleDropDownError && (
                      <Text_Custom
                        text="Vehicle ID is required"
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

                {openModalize === 0 && (
                  <>
                    <Text_Custom text="Trip Name & ID" style={styles.IDinput} />

                    <Dropdown
                      search={true}
                      searchPlaceholder={"Search Trip Name / ID"}
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
                        backgroundColor: colors.SecondaryBackground,
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
                        console.log("item",item)
                        console.log("selctrdtrip for expense",addExpense.selectedTrip.value)
                        console.log("canadddex",canAddExpense)
                  
                        if((item.status==tripTypes[3]|| item.status==tripTypes[4] )&& !canAddExpense){
                       
                          addExpense.setSelectedTrip(item);
                           // showError("sorry you can't add expense for completed trips")
                            setCompletedTrip(true);
                           
                            // addExpense.setSelectedTrip(item);
                           
                        }
                        else{
                          addExpense.setSelectedTrip(item);
                          setcs(item.currencySymbol);
  
                          setTripDropDownError(false);
                          setCompletedTrip(false);
                        }
                       
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
                     {isCompletedTrip && (
                      <Text_Custom
                        text="You can't add expense for completed trips"
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
                    data={
                      //openModalize === 0 ? ExpTypeListTrip : ExpTypeListVehicle
                      isCompletedTrip ? [] : (openModalize === 0 ? ExpTypeListTrip : ExpTypeListVehicle)
                    }
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
                    <SVG.SuccesSVG />
                  </TouchableOpacity>
                )}

                {/* Error Message below Capture */}
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
                 // fromExpense={ isCompletedTrip ? false:true}
                 editable={isCompletedTrip ? false:true}
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
                    //fromExpense={isCompletedTrip?false:true}
                   editable ={isCompletedTrip ? false:true}
                    onBlur={handleBlur("amount")}
                    value={values.amount}
                    onChangeText={handleChange("amount")}
                    disabled={true}
                  />
                  <View
                    style={{
                      paddingHorizontal: moderateScale(20),
                      paddingVertical: moderateScale(9),
                      backgroundColor: colors.primary1,
                      borderRadius: 5,
                    }}
                  >
                    {openModalize === 0 ? (
                      <Text_Custom
                        text={cs}
                        style={{
                          color: "#fff",
                          fontSize: scale(16),
                          // fontFamily: "NunitoSans",
                        }}
                      />
                    ) : (
                      <Text_Custom
                        text={authStore?.driverData?.currency}
                        style={{
                          color: "#fff",
                          fontSize: scale(16),
                          // fontFamily: "NunitoSans",
                        }}
                      />
                    )}
                  </View>
                </View>
              </View>
              {!isCompletedTrip?
              (<Gradient_Button
                text="Submit"
              
                onPress={() => {
                  if (openModalize === 0) {
                    if (
                      addExpense.selectedTrip?.value === "" ||
                      addExpense.selectedTrip?.value == {} ||
                      addExpense.selectedTrip?.value === undefined
                    ) {
                      setTripDropDownError(true);
                    } else if (
                      addExpense.selectedExpense?.value === "" ||
                      addExpense.selectedExpense?.value == {} ||
                      addExpense.selectedExpense?.value === undefined
                    ) {
                      setExpDropDownError(true);
                    } else {
                      if(!picture?.path){
                        setCaptureError(true);
                      }
                      else{
                        handleSubmit();
                      }
                     
                    }
                  } else if (openModalize === 1) {
                    if (
                      selectedVehicle?.value === "" ||
                      selectedVehicle?.value =={} ||
                      selectedVehicle?.value === undefined
                    ) {
                      setVehicleDropDownError(true);
                    } else if (
                      addExpense.selectedExpense?.value === "" ||
                      addExpense.selectedExpense?.value == {} ||
                      addExpense.selectedExpense?.value === undefined
                    ) {
                      setExpDropDownError(true);
                    } else {
                      if(!picture?.path){
                        setCaptureError(true);
                      }
                      else{
                        handleSubmit();
                      }
                    }
                  }
                }}
              />):(<View>
                
              </View>)}
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

  const NoExpense = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: moderateScale(20),
          paddingVertical: moderateScale(25),
        }}
      >
        <SVG.TripExpBG />
      </View>
    );
  };

  const closeModalize = () => {
    init();
    addExpense.resetAllExpense();
    modalizeRef?.current?.close();
  };
  // return (
  //   <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
  //     <Text_Custom text={"Coming Soon"} />
  //   </View>
  // );
  return (
    <Container>
      <Loader isLoadingProps={loading} />
      <CommonHeader title="Expenses" />

      {expenseStore.driverExpense.length > 0 ? (
        <TripExpenseList onRefresh={onRefresh} />
      ) : (
        <NoExpense />
      )}

      {expMenu && <FloatingMenu />}
      <FAB onPress={() => setExpMenu(!expMenu)} />
      <Portal>
        <Modalize
          ref={modalizeRef}
          adjustToContentHeight
          // avoidKeyboardLikeIOS={true}
          // keyboardAvoidingBehavior={"height"}
          // modalStyle={{
          //   minHeight: "100%",
          // }}
          withHandle={false}
          onClose={() => addExpense.resetAllExpense()}
          onClosed={() => addExpense.resetAllExpense()}
          childrenStyle={{
            backgroundColor: colors.SecondaryBackground,
          }}
          onOverlayPress={() => addExpense.resetAllExpense()}
        >
          {/* <TripExpense /> */}
          {openModalize == 3 ? (
            <GeneralExpense
              closeModalize={closeModalize}
              openModalize={openModalize}
            />
          ) : (
            <TripExpense />
          )}
        </Modalize>
      </Portal>
    </Container>
  );
};

export default observer(Expense);
