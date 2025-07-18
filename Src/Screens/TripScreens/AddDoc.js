import { useTheme } from "@react-navigation/native";
import moment from "moment";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import Icon from "react-native-vector-icons/Feather";
import * as SVG from "../../Assets/SVG";
import { Gradient_Button } from "../../Components/Button/Button";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import Container from "../../Components/Container/Container";
import Text_Custom from "../../Components/Text_Custom";
import { tripTypes } from "../../Constant/constant";
import {
  createCompleteTrip,
  updateTripStatus,
} from "../../Services/Actions/TripActions";
import { imageStore } from "../../Store/AuthStore/ImageStore";
import { loaderStore } from "../../Store/AuthStore/LoaderStore";
import { tripStore } from "../../Store/AuthStore/TripStore";
import { showSuccess } from "../../Utils/helper";
import { observer } from "mobx-react";
const AddDoc = (props) => {
  const { status = "start" } = props.route.params;

  const [Loading, setLoading] = useState(false);
  const { colors, dark } = useTheme();
  const { fuelmeter, odometer, selfie, Endodometer, EndFuelmeter, EndSelfie } =
    imageStore;
  const styles = StyleSheet.create({
    main_container: {
      marginHorizontal: moderateScale(20),
      //   marginBottom: moderateScale(70),
      // flex: 1,
    },
  });
  const moveNext = async () => {
    setLoading(true);

    if (status === "start") {
      const body = {
        applyForRecurring: false,
        status: tripTypes[2],
        tripId: tripStore.selectedTrip.tripId,
        actualStartTime: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
      };
      await updateTripStatus(body)
        .then(async (updateRes) => {
          setLoading(false);
          tripStore.setTripStatus("status", tripTypes[2]);
          // setModalVisible(!modalVisible);
          loaderStore.setIsLoading(false);
          // setskipLoader(false);
          imageStore.resetAllImage();
          props.navigation.navigate("StartTrip");
        })
        .catch((err) => {
          setLoading(false);
          console.log("err", err);
          setskipLoader(false);
          loaderStore.setIsLoading(false);
        });
    } else if (status == "end") {
      tripStore.setCurrentTripStartTime(Date.now());
      await createCompleteTrip().then(async (res) => {
        if (res.status) {
          const body = {
            applyForRecurring: false,
            note: "string",
            status: tripTypes[3],
            tripId: tripStore.selectedTrip.tripId,
            actualEndTime: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
            actualStartTime: res?.data?.jsonData?.actualTripStartDate,
            actualBataAmount: res?.data?.jsonData?.actualTripAmount,
          };

          loaderStore.setIsLoading(false);
          // setModalVisible(!modalVisible);
          await updateTripStatus(body).then(async (updateRes) => {
            setLoading(false);
            loaderStore.setIsLoading(false);
            tripStore.setTripStatus("status", tripTypes[3]);
            // setModalVisible(!modalVisible);
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
          Alert.alert("Somethig wents wrong!", res.message);
          // setModalVisible(!modalVisible);
        }
      });
    }
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
              {status == "start" ? (
                <Text_Custom
                  text={odometer?.image !== "" ? "Added" : ""}
                  style={{
                    color: colors.completedText,
                    marginRight: moderateScale(15),
                  }}
                />
              ) : (
                <Text_Custom
                  text={Endodometer?.image !== "" ? "Added" : ""}
                  style={{
                    color: colors.completedText,
                    marginRight: moderateScale(15),
                  }}
                />
              )}
              <Icon
                name={"chevron-right"}
                size={scale(20)}
                color={colors.text}
              />
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
              {status == "start" ? (
                <Text_Custom
                  text={fuelmeter?.image !== "" ? "Added" : ""}
                  style={{
                    color: colors.completedText,
                    marginRight: moderateScale(15),
                  }}
                />
              ) : (
                <Text_Custom
                  text={EndFuelmeter?.image !== "" ? "Added" : ""}
                  style={{
                    color: colors.completedText,
                    marginRight: moderateScale(15),
                  }}
                />
              )}
              <Icon
                name={"chevron-right"}
                size={scale(20)}
                color={colors.text}
              />
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
              {status == "start" ? (
                <Text_Custom
                  text={selfie?.image !== "" ? "Added" : ""}
                  style={{
                    color: colors.completedText,
                    marginRight: moderateScale(15),
                  }}
                />
              ) : (
                <Text_Custom
                  text={EndSelfie?.image !== "" ? "Added" : ""}
                  style={{
                    color: colors.completedText,
                    marginRight: moderateScale(15),
                  }}
                />
              )}
              <Icon
                name={"chevron-right"}
                size={scale(20)}
                color={colors.text}
              />
            </View>
          </View>
        </View>
        <Gradient_Button
          text={status === "end" ? "Finish" : "Next"}
          disable={Loading}
          disabled={Loading}
          onPress={() => {
            moveNext();
          }}
        />
      </View>
    </Container>
  );
};
export default observer(AddDoc);
