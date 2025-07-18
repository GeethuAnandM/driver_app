import { useTheme } from "@react-navigation/native";
import moment from "moment";
import React, { useEffect, useState } from "react";
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
import { showSuccess } from "../../../Utils/helper";
import { imageStore } from "../../../Store/AuthStore/ImageStore";
import { loaderStore } from "../../../Store/AuthStore/LoaderStore";
import { tripStore } from "../../../Store/AuthStore/TripStore";
import { observer } from "mobx-react";
const StartDocCheck = (props) => {
  const [Loading, setLoading] = useState(false);
  const { colors, dark } = useTheme();
  const [fetchData, setFetchData] = useState(true);
  const [updatedChecks, setUpdatedChecks] = useState(false);
  const tripId = tripStore.selectedTrip.tripId;
  const navigation = useNavigation();
  const { fuelmeter, odometer, selfie } = imageStore;
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
      console.error("from fetchUpdatedChecks in add docstart", error);
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
  const stopFetchingUpdates = () => {
    setUpdatedChecks(false);
    setFetchData(false);
  };

  useEffect(() => {
   

    const intervalId = setInterval(() => {
      if (updatedChecks) {
        console.log("from StartDocCheck");
        console.log("updatedsel", tripStore.updatedSelectedTrip);
        const { startOtpValidation } = tripStore.updatedSelectedTrip;
        const{startOdometer,startSelfie,startMeterReading}=tripStore.selectedTrip;
        if (startOtpValidation|| startOdometer||startSelfie||startMeterReading) {
          console.log("from if in StartDocCheck");
          props.navigation.navigate("AddDocStart");
          setUpdatedChecks(false);
          stopFetchingUpdates(); 

          console.log("from if in StartDocCheck after nav");
        }
      }
    }, 1000); 
    return () => clearInterval(intervalId);
  }, [updatedChecks]);// Adjust the interval as needed
 

  const moveNext = async () => {
    setLoading(true);
    
    const body = {
      applyForRecurring: false,
      status: tripTypes[2],
      tripId: tripStore.selectedTrip.tripId,
      actualStartTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    };
    await updateTripStatus(body)
      .then(async (updateRes) => {
        setLoading(false);
        loaderStore.setIsLoading(false);
        //stopFetchingUpdates();
        tripStore.setTripStatus("status", tripTypes[2]);
        props.navigation.navigate("NavigateTrip");
        
      })
      .catch((err) => {
        setLoading(false);
        console.log("err", err);

        loaderStore.setIsLoading(false);
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
              {odometer?.image === "" ? (
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
              {fuelmeter.image === "" ? (
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
                text={"Capture Selfie"}
              />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {selfie.image === "" ? (
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
          text={"Start Trip"}
          disable={Loading}
          disabled={Loading}
          onPress={() => {
            stopFetchingUpdates();
            moveNext();
          }}
        />
      </View>
    </Container>
  );
};
export default observer(StartDocCheck);
