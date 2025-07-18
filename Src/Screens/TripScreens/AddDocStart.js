import { useTheme } from "@react-navigation/native";

import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import Icon from "react-native-vector-icons/Feather";
import * as SVG from "../../Assets/SVG";
import { Gradient_Button } from "../../Components/Button/Button";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import Container from "../../Components/Container/Container";
import Text_Custom from "../../Components/Text_Custom";
import { tripTypes } from "../../Constant/constant";
import { getExpenseTypeById } from "../../Services/Actions/ExpenseAction";
import {
 
 
  createCompleteTrip,
  getUpdatedChecksByTripId,
  updateTripStatus,
} from "../../Services/Actions/TripActions";
import { imageStore } from "../../Store/AuthStore/ImageStore";

import { tripStore } from "../../Store/AuthStore/TripStore";
import { showError } from "../../Utils/helper";
import { getItem } from "../../Services/apiCalls";
import { logCustomEvent } from "../../Utils/analytics";
const AddDocStart = (props) => {
  const [Loading, setLoading] = useState(false);
  const { colors, dark } = useTheme();

  const tripId = tripStore.selectedTrip.tripId;
 
 


 




  


  const {
     fuelmeter,
     odometer,
    selfie,
    otp,
    Endodometer,
    EndFuelmeter,
    EndSelfie,
  } = imageStore;





  const { startOtpValidation,startOdometer, startSelfie, startFuel  } = tripStore.selectedTrip;
  logCustomEvent(`S_M_${tripStore.selectedTrip.uuid}_${startOtpValidation}_${startOdometer}_${startSelfie}_${startFuel}`);
  
  const [isRequired, setIsRequired] = useState({
    odometer: false,
    fuel: false,
    selfie: false,
    otp: false,
  });
  const styles = StyleSheet.create({
    main_container: {
      marginHorizontal: moderateScale(20),
    },
  });
  const updateRequiredState = () => {
    if (fuelmeter?.image !== "" || !startFuel) {
        setIsRequired(prevState => ({
            ...prevState,
            fuel: false
        }));
    }
    if (selfie?.image !== "" || !startSelfie) {
        setIsRequired(prevState => ({
            ...prevState,
            selfie: false
        }));
    }
    if (otp?.verified || !startOtpValidation) {
      setIsRequired(prevState => ({
          ...prevState,
          otp: false
      }));
  }
};

useEffect(() => {
    updateRequiredState();
}, [fuelmeter?.image !== "",selfie?.image !== "",otp?.verified ,!startFuel,!startSelfie,!startOtpValidation]);




  useEffect(() => {
    if (fuelmeter?.image !== "") {
        setIsRequired(prevState => ({
            ...prevState,
            fuel: false
        }));
    }
  }, [fuelmeter?.image!==""]);

  useEffect(() => {
    if (selfie?.image !== "") {
        setIsRequired(prevState => ({
            ...prevState,
            selfie: false
        }));
    }
  }, [selfie?.image !== "" ])

  const moveNext = async () => {
    if (startOdometer && odometer?.image === "") {
      showError("ODOMETER READING IS RQUIRED");
    } else if (startFuel && fuelmeter?.image === "") {
      showError("FUEL READING IS RQUIRED");
    } else if (startSelfie && selfie?.image === "") {
      showError("SELFE IS RQUIRED");
    } else if (startOtpValidation && otp?.verified === "") {
      console.log("otp verified", otp?.verified);
      showError("OTP  IS REQUIRED");
    } else {
      setLoading(true);
      // stopFetchingUpdates();
      tripStore.setCurrentTripStartTime(Date.now());
      await createCompleteTrip("startDocuments");
      const body = {
        applyForRecurring: false,
        status: tripTypes[2],
        tripId: tripStore.selectedTrip.tripId,
        actualStartTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      };
      await updateTripStatus(body)
        .then(async (updateRes) => {
          setLoading(false);
      
          tripStore.setTripStatus("status", tripTypes[2]);
          props.navigation.navigate("NavigateTrip");
        })
        .catch((err) => {
          setLoading(false);
          console.log("err", err);
        });
    }
  };

  const validate = () => {
    var state = { odometer: false, fuel: false, selfie: false, otp: false };
    if (fuelmeter?.image === "" && startFuel) {
      state = { ...state, fuel: true };
      // setIsRequired({ ...isRequired, fuel: true });
    }
    if (selfie?.image === "" && startSelfie) {
      state = { ...state, selfie: true };
      // setIsRequired({ ...isRequired, selfie: true });
    }
    if (odometer?.image === "" && startOdometer) {
      state = { ...state, odometer: true };

      // setIsRequired({ ...isRequired, odometer: true });
    }

    if (!otp?.verified && startOtpValidation) {
      state = { ...state, otp: true };

      // setIsRequired({ ...isRequired, odometer: true });
    }
    setIsRequired(state);
    console.log("required",isRequired)
    if (!state.odometer && !state.fuel && !state.selfie && !state.otp) {
      moveNext();
    } else {
      showError("Upload Required Documents");
    }
  };
  const moveTiDocUpload = (url) => {
   
    props.navigation.navigate(url, { status: "start" });
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
          {startOtpValidation && (
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
          {!otp?.verified ? (
            <Icon name={"chevron-right"} size={scale(20)} color={colors.text} />
          ) : (
            <>
            <Icon
              name={"check-circle"}
              size={scale(20)}
              color={colors.completedText}
            />
           
            </>
          )}
        </View>
      </View>
    );
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
          {!otp?.verified ? (
            <TouchableOpacity
              onPress={() => {
                console.log("hai from otpvalidation");
                moveTiDocUpload("AddOtp");
              }}
            >
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
              {startOdometer && (
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
              {startFuel && (
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
              {fuelmeter?.image !== "" ? (
             
                
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
                text={"Capture Selfies"}
              />
              {startSelfie && (
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
              {selfie?.image === "" ? (
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
        </View>
        <Gradient_Button
          text={"Start Trip"}
          disable={Loading}
          disabled={Loading}
          onPress={() => {
            //stopFetchingUpdates();
            validate();
            // triggerMobGps();
          }}
        />
      </View>
    </Container>
  );
};

export default observer(AddDocStart);

const styles = StyleSheet.create({});
