import { useTheme} from "@react-navigation/native";
import moment from "moment";
import React, { useState,useEffect } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import Icon from "react-native-vector-icons/Feather";
import * as SVG from "../../../Assets/SVG";
import { Gradient_Button } from "../../Button/Button";
import CommonHeader from "../../CommonHeader/CommonHeader";
import Container from "../../Container/Container";
import Text_Custom from "../../Text_Custom";
import { tripTypes } from "../../../Constant/constant";
import {
  createCompleteTrip,
  getUpdatedChecksByTripId,
  updateTripStatus,
} from "../../../Services/Actions/TripActions";
import { useNavigation } from "@react-navigation/native";
import { getFloat, showSuccess } from "../../../Utils/helper";
import { imageStore } from "../../../Store/AuthStore/ImageStore";
import { loaderStore } from "../../../Store/AuthStore/LoaderStore";
import { tripStore } from "../../../Store/AuthStore/TripStore";
import { observer } from "mobx-react";
import EndSignature from "./EndSignature";
const EndDocCheck = (props) => {
  const [Loading, setLoading] = useState(false);
  const { colors, dark } = useTheme();
  const { EndFuelmeter, Endodometer, EndSelfie,EndFeedback,EndSignature } = imageStore;
  const [fetchData, setFetchData] = useState(true);
  const [updatedChecks, setUpdatedChecks] = useState(false);
  const tripId=tripStore.selectedTrip.tripId;
  const navigation = useNavigation();
  const styles = StyleSheet.create({
    main_container: {
      marginHorizontal: moderateScale(20),
    },
  });

  const fetchUpdatedChecks = async (tripId) => {
    try {
    
      const response = await getUpdatedChecksByTripId(tripId);
      //console.log("response from planedtripcontainer for updtaedchecks:", response); // Log the response
      tripStore.setUpdatedSelectedTrip(response);
      //setUpdatedChecks(true);
      //console.log("updatedselected trip",tripStore.updatedSelectedTrip)
    } catch (error) {
      console.error("from fetchUpdatedChecks in end docstart", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (fetchData) {
        fetchUpdatedChecks(tripId);
        setUpdatedChecks(true);
      }
    }, 1000); // Adjust the interval as needed

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [fetchData]);
 
  useEffect(() => {
  

    const intervalId = setInterval(() => {
      if (updatedChecks) {
        console.log("from StartDocCheck");
        console.log("updatedsel", tripStore.updatedSelectedTrip);
        const { endOtpValidation,customerSignatureValidation,customerFeedbackValidation } = tripStore.updatedSelectedTrip;
        const { endSelfie,endMeterReading,endOdometer,expenseType}=tripStore.selectedTrip;
        if (endOtpValidation || customerSignatureValidation || customerFeedbackValidation || endSelfie ||
          endMeterReading || endOdometer || expenseType)
       {
          console.log("from if in StartDocCheck");
          props.navigation.navigate("AddDocFinish");
          setUpdatedChecks(false);
          stopFetchingUpdates(); 
          console.log("from if in enddocCheck after nav");
        }
      }
    }, 1000); 
    return () => clearInterval(intervalId);
  }, [updatedChecks]);// Adjust the interval as needed

  // useEffect(() => {
  //   console.log("from endDocCheck");
  //   console.log("updatedsel from endDocCheck", tripStore.updatedSelectedTrip);

  //   const intervalId = setInterval(() => {
  //     if (updatedChecks) {
  //       const { endOtpValidation,customerSignatureValidation,customerFeedbackValidation } = tripStore.updatedSelectedTrip;
  //       const { endSelfie,endMeterReading,endOdometer,expenseType}=tripStore.selectedTrip;
  //       if (endOtpValidation||customerSignatureValidation|| customerFeedbackValidation|| endSelfie||
  //         endMeterReading || endOdometer|| expenseType== true) {
  //         console.log("from if in StartDocCheck");
  //         props.navigation.navigate("AddDocfinish");
  //         console.log("from if in enddocCheck after nav");
  //       }
  //     }
  //   }, 5000); 
  //   return () => clearInterval(intervalId);
  // }, [updatedChecks]);// Adjust the interval as needed

  const stopFetchingUpdates = () => {
    setUpdatedChecks(true);
    setFetchData(false);
  };

  const moveNext = async () => {
    setLoading(true);
    
    stopFetchingUpdates();

    tripStore.setCurrentTripStartTime(Date.now());
    await createCompleteTrip().then(async (res) => {
      if (res.status) {
        const body = {
          applyForRecurring: false,
          note: "",
          status: tripTypes[3],
          tripId: tripStore.selectedTrip.tripId,
          actualEndTime: moment().format("YYYY-MM-DD HH:mm:ss"),
          actualStartTime: res?.data?.jsonData?.actualTripStartDate,
          actualBataAmount: res?.data?.jsonData?.actualTripAmount,
        };
        loaderStore.setIsLoading(false);
        // setModalVisible(!modalVisible);
        await updateTripStatus(body).then(async (updateRes) => {
          setLoading(false);
          loaderStore.setIsLoading(false);
          tripStore.setTripStatus("status", tripTypes[3]);
          imageStore.resetAllImage();
     
          showSuccess("Trip completed");
          props.navigation.navigate("Listing", {
            screen: "TripDetailsScreen",
            params: { trip: tripStore.selectedTrip },
          });
        });
      } else {
        setLoading(false);
        loaderStore.setIsLoading(false);
        // Alert.alert("Somethig wents wrong!", res.message);
        // setModalVisible(!modalVisible);
      }
    });
  };
  return (
    <Container>
      <CommonHeader title="Add Document" goBack />
      <View
        style={{
          marginHorizontal: moderateScale(20),
          marginVertical: moderateScale(20),
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <View>
          <View
            style={{
              borderRadius: 5,
              borderWidth: 1,
              borderColor: colors.cardBorder,
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
          </View>
          <View
            style={{
              borderRadius: 5,
              borderWidth: 1,
              borderColor: colors.cardBorder,
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
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {EndFuelmeter.image === "" ? (
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
          </View>
          <View
            style={{
              borderRadius: 5,
              borderWidth: 1,
              borderColor: colors.cardBorder,
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
                text={"Capture Selfie"}
              />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {EndSelfie.image === "" ? (
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
          </View>







          <View
            style={{
              borderRadius: 5,
              borderWidth: 1,
              borderColor: colors.cardBorder,
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
                text={"Customer Signature"}
              />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {EndSignature?.image === ""? (
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
          </View>




          <View
            style={{
              borderRadius: 5,
              borderWidth: 1,
              borderColor: colors.cardBorder,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: colors.SecondaryBackground,
              padding: moderateScale(20),
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
                text={"Customer Feedback"}
              />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {!EndFeedback.verified ? (
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
          </View>







         








         




        </View>
        <Gradient_Button
          text={"End Trip"}
        
          disable={Loading}
          disabled={Loading}
          onPress={() => {
            moveNext();
            //imageStore.clearEndSignature();
           
          // CheckmendatoryOtp();
            
          }}
         
        />
      </View>
    </Container>
  );
};
export default observer(EndDocCheck);
