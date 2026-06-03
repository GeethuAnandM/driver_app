import { useTheme, useFocusEffect, useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react-lite";
import moment from "moment";
import Geolocation from "react-native-geolocation-service";
import React, { useEffect, useState, useRef,useCallback } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ToastAndroid,
} from "react-native";
import ReactNativeForegroundService from "@supersami/rn-foreground-service";
import { moderateScale, scale } from "react-native-size-matters";
import Icon from "react-native-vector-icons/Feather";
import * as SVG from "../../Assets/SVG";
import { Gradient_Button } from "../../Components/Button/Button";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import Container from "../../Components/Container/Container";
import Loader from "../../Components/Loader/Loader";
import Text_Custom from "../../Components/Text_Custom";
import { tripTypes } from "../../Constant/constant";
import {
  getExpenseTypeById,
  getExpenseforTrip,
} from "../../Services/Actions/ExpenseAction";
import {
  createCompleteTrip,
  getBataTripByTripID,
  getOtp,
  getTripByTripID,
  getUpdatedChecksByTripId,
  updateTripStatus,
} from "../../Services/Actions/TripActions";
import { expenseStore } from "../../Store/AuthStore/ExpenseStore";
import { imageStore } from "../../Store/AuthStore/ImageStore";
import { loaderStore } from "../../Store/AuthStore/LoaderStore";
import { tripStore } from "../../Store/AuthStore/TripStore";
import {
  getFloat,
  logTime,
  showError,
  showSuccess,
  stopTracking,
} from "../../Utils/helper";
import ExpenseContainer from "../../Components/Profile_Components/TripDetailsComponets/ExpenseContainer";
import { Modalize } from "react-native-modalize";
import AddExpense from "../../Components/ExpenseComponents/AddExpense";
import OpenImageModal from "../../Components/Profile_Components/TripDetailsComponets/OpenImageModal";
import { getItem, removeItem, setItem } from "../../Services/apiCalls";
import { logCustomEvent } from "../../Utils/analytics";
import DeviceInfo from 'react-native-device-info';
import ReactNativeCallBack from "../../Utils/gpsService";
const AddDocFinish = (props) => {
  const [Loading, setLoading] = useState(false);
  let startTime = null;
  const navigation = useNavigation();

  //const [checkIsAdded, setcheckIsAdded] = useState(false);
  const { colors, dark } = useTheme();
  const tripId = tripStore.selectedTrip.tripId;
  const [fetchData, setFetchData] = useState(true);
  const [AdvanceAmount, setAdvanceAmount] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const modalizeRef = useRef(null);
  const [imageModal, setImageModal] = useState(false);
  const [modalize, setModalize] = useState(false);
  const [imageSelected, setImageSelected] = useState("");

 
 
  const stopTask = () => {
    /*ReactNativeForegroundService.remove_all_tasks();
    ReactNativeForegroundService.stopAll().then(() => {
      ToastAndroid.show("Background Service Stoped", ToastAndroid.SHORT);
    });*/
    ReactNativeCallBack.stopService();
  };

  const onPressAddExp = () => {
    console.log("from addexpense press");
    console.log("modalizeRef.current:", modalizeRef.current);
    modalizeRef.current?.open();
    setModalize(true);
  };
  const onPressExp = (item) => {
    setImageSelected(item);
    setImageModal(true);
  };
  const closeAddExp = () => {
    modalizeRef.current?.close();
    setRefresh(!refresh);
    setModalize(false);
  };


//  const fetchExpense = async () => {


//     console.log("from fetch expense in adddoc finish");
//     await getTripByTripID(tripStore.selectedTrip).then(async (tripData) => {

//       var exp = await getExpenseforTrip(tripStore.selectedTrip.tripId);
//       console.log("expense ", exp);
//       tripStore.setSelectedTrip({
//         ...tripData,
//         //plannedBataAmount: planned_amount,
//         expanse: exp,
//       });
//     });
//   };
  const fetchExpense = async () => {
    console.log("from fetch expense in adddoc finish");
  
    var exp = await getExpenseforTrip(tripStore.selectedTrip.tripId);
    console.log("expense ", exp);
    tripStore.setSelectedTrip({
      ...tripStore.selectedTrip,
      expanse: exp,
    });
  };
  
  const {
    fuelmeter,
    odometer,
    selfie,
    Endodometer,
    EndFuelmeter,
    EndSelfie,
    EndOtp,
    EndSignature,
    EndFeedback,
    InStationChecked,
  } = imageStore;
  // const { endOdometer, endSelfie, endMeterReading } = tripStore.selectedTrip;




  const {
    endOdometer, endSelfie, endFuel,
    endOtpValidation,
    customerSignatureValidation,
    customerFeedbackValidation,
    expenseType,
  } = tripStore.selectedTrip;



  const [isRequired, setIsRequired] = useState({
    odometer: false,
    fuel: false,
    selfie: false,
    otp: false,
    signature: false,
    feedback: false,
    isExpense: false,
    reqExp: expenseStore?.mendatoryExpense.map((item) => ({
      typeId: item[0]?.typeId,
      isRequired: false,
    })),
  });


  const updateRequiredState = () => {
    if (EndFuelmeter?.image !== "" || !endFuel) {
      setIsRequired(prevState => ({
        ...prevState,
        fuel: false
      }));
    }
    if (EndSelfie?.image !== "" || !endSelfie) {
      setIsRequired(prevState => ({
        ...prevState,
        selfie: false
      }));
    }
    if (EndFeedback.verified || !customerFeedbackValidation) {
      setIsRequired(prevState => ({
        ...prevState,
        feedback: false
      }));
    }
    if (EndOtp?.verified || !endOtpValidation) {
      setIsRequired(prevState => ({
        ...prevState,
        otp: false
      }));
    }
  };

  useEffect(() => {
    updateRequiredState();
  }, [EndFuelmeter?.image !== "", EndSelfie?.image !== "", EndFeedback.verified, EndOtp?.verified, !endFuel, !endSelfie, !endOtpValidation, !customerFeedbackValidation]);
  

  const styles = StyleSheet.create({
    main_container: {
      marginHorizontal: moderateScale(20),
    },
  });
  const [mendatoryExp, setMendatoryExp] = useState([]);
  useEffect(() => {
    if (tripStore?.selectedTrip?.expenseType) {
      // setLoading(true);
      getExpen();
    } else {
      setMendatoryExp([]);
    }
  }, []);
  
  useFocusEffect(
    useCallback(() => {
      console.log("Screen is focused, toggling refresh");
      setRefresh(prev => !prev);   // <-- This toggles value
    }, [])
  );

  useEffect(() => {
    fetchExpense();
    console.log("refresh>>>>>>>>>>>>>>>>>>>>>>>>>>>>", refresh);
  }, [refresh]);

  const getExpen = async () => {
    var typesDetail = [];

    // Use Promise.all() with map() to wait for all promises to resolve
    await Promise.all(
      tripStore?.selectedTrip?.expenseType?.map(async (type) => {
        var typeDetail = await getExpenseTypeById(type);

        typesDetail.push(typeDetail);
      })
    );

    console.log("typesDetail from adddocfinish", typesDetail);

    // Process the resolved promises

    var data = typesDetail.map((item) => ({ ...item, isAdded: false }));

    // var data=[{"0": {"deletedBy": null, "deletedOn": null, "description": "", "insertedBy": 0, "insertedOn": "2023-06-27 11:12:14", "isDeleted": false, "isEnabled": true, "orgId": 1, "orgName": null, "subType": "Trip", "typeFlag": "Expense", "typeId": 172, "typeName": "Vehicle cleaning", "updatedBy": null, "updatedOn": null}, "isAdded": false}, {"0": {"deletedBy": null, "deletedOn": null, "description": "", "insertedBy": 0, "insertedOn": "2023-06-27 11:12:44", "isDeleted": false, "isEnabled": true, "orgId": 1, "orgName": null, "subType": "Vehicle", "typeFlag": "Expense", "typeId": 174, "typeName": "Maintenace", "updatedBy": null, "updatedOn": null}, "isAdded": false}, {"0": {"deletedBy": null, "deletedOn": null, "description": "toll paid", "insertedBy": 0, "insertedOn": "2023-06-23 08:21:51", "isDeleted": false, "isEnabled": true, "orgId": 1, "orgName": null, "subType": "Trip", "typeFlag": "Expense", "typeId": 171, "typeName": "Toll", "updatedBy": null, "updatedOn": null}, "isAdded": false}]
    console.log("Expensedata from adddocfinish", data);

    setMendatoryExp(data);

    expenseStore.setMendatoryExpense(data);
    if (expenseStore.newMendatoryExpense.length !== 0) {
      expenseStore.setMendatoryExpense(expenseStore.newMendatoryExpense);
    }
    setLoading(false);
  };

  const moveNext = async () => {
    // return true;
    console.log("movenext");
    if (endOdometer && Endodometer?.image === "") {
      showError("ODOMETER READING IS RQUIRED");
    } else if (endFuel && EndFuelmeter?.image === "") {
      showError("FUEL READING IS RQUIRED");
    } else if (endSelfie && EndSelfie?.image === "") {
      showError("TRIPSHEET IS RQUIRED");
    } else if (endOtpValidation && EndOtp?.verified === "") {
      console.log("otp verified", otp?.verified);
      showError("OTP  IS RQUIRED");
    } else if (customerSignatureValidation && EndSignature?.image === "" && !EndSignature.isDenied) {
      console.log("siganture verrified", EndSignature?.image);
      showError("SIGNATURE IS REQUIRED");
    } else if (customerFeedbackValidation && EndFeedback === false) {
      console.log("feedback verified", feedback);
      showError("FEEDBACK IS REQUIRED");
    } else if (tripStore?.selectedTrip?.expenseType?.length > 0) {
      var move = expenseStore?.mendatoryExpense?.find(
        (item) => item.isAdded === false
      );
      console.log("move", move)
      if (move) {
        showError("EXPENSE IS RQUIRED");
      } else {
        setLoading(true);
       
        stopTask();
        tripStore.setCurrentTripStartTime(Date.now());
        console.log(
          "from adddocfinishtripStore.selectedTrip",
          tripStore.selectedTrip
        );



        await createCompleteTrip().then(async (res) => {
          console.log(
            "imagestore.instationcheck from adddocfinish",
            InStationChecked
          );
          if (res.status) {
            const body = {
              isFromWeb:false,
              applyForRecurring: false,
              note: "",
              status: tripTypes[3],
              tripId: tripStore.selectedTrip.tripId,
              actualEndTime: moment().format("YYYY-MM-DD HH:mm:ss"),
              actualStartTime: res?.data?.jsonData?.actualTripStartDate,
              actualBataAmount: res?.data?.jsonData?.actualTripAmount,
              inStation: InStationChecked.verified,
              
            };
            loaderStore.setIsLoading(false);
            // setModalVisible(!modalVisible);
            var watchId=await getItem("watchId");
            console.log("watchId",watchId)
         

            await updateTripStatus(body).then(async (updateRes) => {
              setLoading(false);
             
              loaderStore.setIsLoading(false);
              // setModalVisible(!modalVisible);
           
              imageStore.resetAllImage();
              //const model = await DeviceInfo.getModel();
              //logCustomEvent(model);
              showSuccess("Trip completed");
             // Capture end time
            const endTime = new Date().getTime();
            // Calculate elapsed time in milliseconds
            const elapsedTime = Math.floor((endTime - startTime) / 1000);
            // Send elapsed time via Firebase Analytics along with other event parameters
            const eventParams = {
              elapsedTime: elapsedTime
              // Include other event parameters here if needed
            };
            logCustomEvent(`E_${tripStore.selectedTrip.uuid}_${elapsedTime}`, eventParams);
            console.log(`E_${tripStore.selectedTrip.uuid}_${elapsedTime}`);
              // await removeItem("selectedTrip");
              // await removeItem("lastScreen");

              expenseStore.setExpenseIsAdded([]);
              expenseStore.setNewMendatoryExpense([]);
              console.log(
                " expenseStore. setNewMendatoryExpense from 1st",
                expenseStore.newMendatoryExpense
              );
              console.log(
                " expenseStore. setExpenseIsAdded from 1st",
                expenseStore.ExpenseIsAdded
              );
              props.navigation.navigate("Listing", {
                screen: "TripDetailsScreen",
                params: { trip: tripStore.selectedTrip,status:"end",endClicked:startTime},
              });
              await removeItem("previousTrip");
              await removeItem("selectedTrip");
              await removeItem("updatedSelectedTrip");
              await removeItem("lastScreen");
              await removeItem("imageStore");
              await removeItem("expenseIsAdded");
      
              await removeItem("mendatoryExpense")
              await removeItem("newMendatoryExpense")
              
             // await removeItem("expenseStore");
            });
          } else {
            setLoading(false);
            loaderStore.setIsLoading(false);
            Alert.alert("Something wents wrong!", res.message);
            // setModalVisible(!modalVisible);
          }
        });


      }
    } else {
      setLoading(true);
    
      stopTask();
      tripStore.setCurrentTripStartTime(Date.now());
      console.log(
        "from adddocfinishtripStore.selectedTrip",
        tripStore.selectedTrip
      );
     
      await createCompleteTrip().then(async (res) => {
        if (res.status) {
          const body = {
            isFromWeb:false,
            applyForRecurring: false,
            note: "",
            status: tripTypes[3],
            tripId: tripStore.selectedTrip.tripId,
            actualEndTime: moment().format("YYYY-MM-DD HH:mm:ss"),
            actualStartTime: res?.data?.jsonData?.actualTripStartDate,
            actualBataAmount: res?.data?.jsonData?.actualTripAmount,
            inStation: InStationChecked.verified,
          };
          loaderStore.setIsLoading(false);
          // setModalVisible(!modalVisible);

         
          
          // stopTask();

          await updateTripStatus(body).then(async (updateRes) => {
            setLoading(false);
           loaderStore.setIsLoading(false);
           
            // setModalVisible(!modalVisible);

            imageStore.resetAllImage();
            // await removeItem("selectedTrip");
            // await removeItem("lastScreen");
           // const model = await DeviceInfo.getModel();
            //logCustomEvent(model);
            showSuccess("Trip completed");
           // Capture end time
           const endTime = new Date().getTime();
           // Calculate elapsed time in milliseconds
           const elapsedTime = Math.floor((endTime - startTime) / 1000);
           // Send elapsed time via Firebase Analytics along with other event parameters
           const eventParams = {
             elapsedTime: elapsedTime
             // Include other event parameters here if needed
           };
           logCustomEvent(`E_${tripStore.selectedTrip.uuid}_${elapsedTime}`, eventParams);
           console.log(`E_${tripStore.selectedTrip.uuid}_${elapsedTime}`);
            props.navigation.navigate("Listing", {
              screen: "TripDetailsScreen",
              params: { trip: tripStore.selectedTrip,status:"end",endClicked:startTime},
            });
          
           
            await removeItem("previousTrip");
            await removeItem("selectedTrip");
            await removeItem("updatedSelectedTrip");
            await removeItem("lastScreen");
            await removeItem("imageStore");
          });
        } else {
          setLoading(false);
          loaderStore.setIsLoading(false);
          Alert.alert("Somethig wents wrong!", res.message);
          // setModalVisible(!modalVisible);
        }
      });




      // await removeItem("mendatoryExpense")
      // await removeItem("newMendatoryExpense")
      // await removeItem("expenseIsAdded")
      // await removeItem("expenseStore");



    }
  };
  const moveTiDocUpload = (url) => {
    props.navigation.navigate(url, { status: "end" });
  };

  const validate = () => {
    console.log("validate");
    var state = {
      odometer: false,
      fuel: false,
      selfie: false,
      isExpense: false,
      otp: false,
      signature: false,
      feedback: false,
      reqExp: expenseStore?.mendatoryExpense.map((item) => ({
        typeId: item[0]?.typeId,
        isRequired: false,
      })),
    };

    var move = expenseStore?.mendatoryExpense?.find(
      (item) => item.isAdded === false
    );
    console.log("move", move)

    if (Endodometer?.image === "" && endOdometer) {
      state = { ...state, odometer: true };
    }
    if (EndFuelmeter?.image === "" && endFuel) {
      state = { ...state, fuel: true };
    }
    if (EndSelfie?.image === "" && endSelfie) {
      state = { ...state, selfie: true };
    }
    if (!EndOtp?.verified && endOtpValidation) {
      state = { ...state, otp: true };
    }
    if (EndSignature?.image === "" && customerSignatureValidation && !EndSignature.isDenied) {
      state = { ...state, signature: true };
    }

    if (!EndFeedback?.verified && customerFeedbackValidation) {
      state = { ...state, feedback: true };
    }

    if (move) {
      showError("Upload mendatory");
      var data = expenseStore?.mendatoryExpense.map((item) => ({
        typeId: item[0]?.typeId,

        isRequired: item.isAdded,
      }));
      console.log("data", data)
      state = { ...state, isExpense: true, reqExp: data };
    }
    setIsRequired(state);

    if (
      //all these are false then executes the movenext() opertion
      !state.odometer &&
      !state.fuel &&
      !state.selfie &&
      !state.isExpense &&
      !state.otp &&
      !state.signature &&
      !state.feedback
    ) {
      moveNext();
    } else {

      showError("Upload Required Documents");
    }
  };

  const renderItem = (item, index) => {
    const typeId = item[0]?.typeId;
    const checkIsAdded = expenseStore.ExpenseIsAdded.some(
      (item) => item.expenseTypeId === typeId
    );

    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("MendatoryExp", item);
        
        }}
        key={index}
        style={{
          borderRadius: 5,
          borderWidth: 1,
          // borderColor: isRequired.isExpense ? colors.error : colors.cardBorder,
          borderColor: !checkIsAdded ? (isRequired.isExpense ? colors.error : colors.cardBorder) : colors.cardBorder,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: colors.SecondaryBackground,
          padding: moderateScale(20),
          marginBottom: moderateScale(15),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <SVG.ExpBill />
          <Text_Custom
            style={{
              marginLeft: moderateScale(10),
              fontFamily: "NunitoSans-Bold",
            }}
            // data[0].updatedOn
            text={item[0]?.subType + " - " + item[0]?.typeName}
          //text={"Expenses"}
          />

          <Text_Custom
            style={{
              marginLeft: moderateScale(5),
              fontFamily: "NunitoSans-Bold",
              color: colors.error,
            }}
            text={"*"}
          />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {!checkIsAdded ? (
            <Icon name={"chevron-right"} size={scale(20)} color={colors.text} />
          ) : (
            <Icon
              name={"check-circle"}
              size={scale(20)}
              color={colors.completedText}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const OtpValidationSection = () => {
    return (
      <View
        style={{
          borderRadius: 5,
          borderWidth: 1,
          borderColor: isRequired.otp ? colors.error : colors.cardBorder,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: colors.SecondaryBackground,
          padding: moderateScale(20),
          marginBottom: moderateScale(15),
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <SVG.OtpSVG />
          <Text_Custom
            style={{
              marginLeft: moderateScale(10),
              fontFamily: "NunitoSans-Bold",
            }}
            text={"OTP Validation"}
          />
          {endOtpValidation && (
            <Text_Custom
              style={{
                marginLeft: moderateScale(5),
                fontFamily: "NunitoSans-Bold",
                color: colors.error,
              }}
              text={"*"}
            />
          )}
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {!EndOtp?.verified ? (
            <Icon name={"chevron-right"} size={scale(20)} color={colors.text} />
          ) : (
            <Icon
              name={"check-circle"}
              size={scale(20)}
              color={colors.completedText}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <Container>
      <OpenImageModal
        imageModal={imageModal}
        imageSelected={imageSelected}
        setImageModal={setImageModal}
      />
      <Modalize
        ref={modalizeRef}
        adjustToContentHeight
        withHandle={true}
        handlePosition="inside"
        childrenStyle={{
          backgroundColor: colors.SecondaryBackground,
        }}
        onClosed={() => {
          setModalize(false);
          console.log("Modal is closed");
        }}
      >
        <AddExpense closeAddExp={closeAddExp} />
      </Modalize>
      <CommonHeader title="Add Document" goBack />
      {/* <Loader isLoadingProps={Loading} /> */}

      <ScrollView
        contentContainerStyle={{
          marginHorizontal: moderateScale(20),
          marginVertical: moderateScale(20),
          // flex: 1,
          justifyContent: "space-between",
          paddingBottom: moderateScale(20),
        }}
      >
        <View>
          {!EndOtp?.verified ? (
            <TouchableOpacity onPress={() => moveTiDocUpload("AddOtp")}>
              <OtpValidationSection />
            </TouchableOpacity>
          ) : (
            <OtpValidationSection />
          )}

          <TouchableOpacity
            onPress={() => moveTiDocUpload("AddDocOdometer")}
            style={{
              borderRadius: 5,
              borderWidth: 1,
              borderColor: isRequired.odometer
                ? colors.error
                : colors.cardBorder,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: colors.SecondaryBackground,
              padding: moderateScale(20),
              marginBottom: moderateScale(15),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <SVG.SpeedometerSVG />
              <Text_Custom
                style={{
                  marginLeft: moderateScale(10),
                  fontFamily: "NunitoSans-Bold",
                }}
                text={"Capture Odometer"}
              />
              {endOdometer && (
                <Text_Custom
                  style={{
                    marginLeft: moderateScale(5),
                    fontFamily: "NunitoSans-Bold",
                    color: colors.error,
                  }}
                  text={"*"}
                />
              )}
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {Endodometer?.image === "" ? (
                <Icon
                  name={"chevron-right"}
                  size={scale(20)}
                  color={colors.text}
                />
              ) : (
                <Icon
                  name={"check-circle"}
                  size={scale(20)}
                  color={colors.completedText}
                />
              )}
            </View>
          </TouchableOpacity>
          {/*  */}
          <TouchableOpacity
            onPress={() => moveTiDocUpload("AddFuelMeter")}
            style={{
              borderRadius: 5,
              borderWidth: 1,
              borderColor: isRequired.fuel ? colors.error : colors.cardBorder,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: colors.SecondaryBackground,
              padding: moderateScale(20),
              marginBottom: moderateScale(15),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <SVG.FuelSVG />
              <Text_Custom
                style={{
                  marginLeft: moderateScale(10),
                  fontFamily: "NunitoSans-Bold",
                }}
                text={"Capture Fuel Reading"}
              />
              {endFuel && (
                <Text_Custom
                  style={{
                    marginLeft: moderateScale(5),
                    fontFamily: "NunitoSans-Bold",
                    color: colors.error,
                  }}
                  text={"*"}
                />
              )}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {EndFuelmeter?.image !== "" ? (

                <Icon
                  name={"check-circle"}
                  size={scale(20)}
                  color={colors.completedText}

                />

              ) : (
                <Icon
                  name={"chevron-right"}
                  size={scale(20)}
                  color={colors.text}
                />
              )}
            </View>
          </TouchableOpacity>

          {/*  */}
          <TouchableOpacity
            onPress={() => moveTiDocUpload("AddSelfie")}
            style={{
              borderRadius: 5,
              borderWidth: 1,
              borderColor: isRequired.selfie ? colors.error : colors.cardBorder,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: colors.SecondaryBackground,
              padding: moderateScale(20),
              marginBottom: moderateScale(15),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <SVG.CameraSVg />
              <Text_Custom
                style={{
                  marginLeft: moderateScale(10),
                  fontFamily: "NunitoSans-Bold",
                }}
                text={"Capture TripSheet"}
              />
              {endSelfie && (
                <Text_Custom
                  style={{
                    marginLeft: moderateScale(5),
                    fontFamily: "NunitoSans-Bold",
                    color: colors.error,
                  }}
                  text={"*"}
                />
              )}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {EndSelfie?.image === "" ? (
                <Icon
                  name={"chevron-right"}
                  size={scale(20)}
                  color={colors.text}
                />
              ) : (
                <Icon
                  name={"check-circle"}
                  size={scale(20)}
                  color={colors.completedText}
                />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => moveTiDocUpload("AddSignature")}
            style={{
              borderRadius: 5,
              borderWidth: 1,
              borderColor: isRequired.signature
                ? colors.error
                : colors.cardBorder,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: colors.SecondaryBackground,
              padding: moderateScale(20),
              marginBottom: moderateScale(15),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <SVG.OtpSVG />
              <Text_Custom
                style={{
                  marginLeft: moderateScale(10),
                  fontFamily: "NunitoSans-Bold",
                }}
                text={"Customer Signatures"}
              />
              {!EndSignature.isDenied && customerSignatureValidation && (
                <Text_Custom
                  style={{
                    marginLeft: moderateScale(5),
                    fontFamily: "NunitoSans-Bold",
                    color: colors.error,
                  }}
                  text={"*"}
                />
              )}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {!EndSignature?.verified ? (
                <Icon
                  name={"chevron-right"}
                  size={scale(20)}
                  color={colors.text}
                />
              ) : (
                <Icon
                  name={"check-circle"}
                  size={scale(20)}
                  color={colors.completedText}
                />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => moveTiDocUpload("AddStarFeedback")}
            style={{
              borderRadius: 5,
              borderWidth: 1,
              borderColor: isRequired.feedback
                ? colors.error
                : colors.cardBorder,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: colors.SecondaryBackground,
              padding: moderateScale(20),
              marginBottom: moderateScale(15),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <SVG.CameraSVg />
              <Text_Custom
                style={{
                  marginLeft: moderateScale(10),
                  fontFamily: "NunitoSans-Bold",
                }}
                text={"Customer Feedbacks"}
              />
              {customerFeedbackValidation && (
                <Text_Custom
                  style={{
                    marginLeft: moderateScale(5),
                    fontFamily: "NunitoSans-Bold",
                    color: colors.error,
                  }}
                  text={"*"}
                />
              )}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {!EndFeedback.verified ? (
                <Icon
                  name="chevron-right"
                  size={scale(20)}
                  color={colors.text}
                />
              ) : (
                <Icon
                  name="check-circle"
                  size={scale(20)}
                  color={colors.completedText}
                />
              )}
            </View>
          </TouchableOpacity>


          {mendatoryExp?.length > 0 &&
            expenseStore?.mendatoryExpense?.map(
              (item, index) => renderItem(item, index) // Pass the index as a key
            )}


          <ExpenseContainer
            AdvanceAmount={AdvanceAmount}
            onPressAddExp={onPressAddExp}
            onPressExp={onPressExp}
          />
        </View>
      </ScrollView>
      {!modalize && (
        <Gradient_Button
          text={"End Trip"}
          buttonStyles={{
            marginHorizontal: moderateScale(20),
            width: "90%",
            marginBottom: moderateScale(10),
          }}
          disable={Loading}
          disabled={Loading}
          onPress={() => {
            logTime("end trip clicked");
            logCustomEvent('End Trip Final');
            startTime = new Date().getTime();
            console.log("onpressindocfinish");
     
            validate();


            // expenseStore. setExpenseIsAdded([])
          }}
        />
      )}
    </Container>
  );
};

export default observer(AddDocFinish);

const styles = StyleSheet.create({});
