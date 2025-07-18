import { useTheme } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { moderateScale, scale } from "react-native-size-matters";
import * as SVG from "../../Assets/SVG";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import Container from "../../Components/Container/Container";
import MenuComponent from "../../Components/Menu/MenuComponent";
import Text_Custom from "../../Components/Text_Custom";
import { api_key } from "../../Constant/constant";
import { tripStore } from "../../Store/AuthStore/TripStore";
import { formatedDateTime, getFloat, toFix } from "../../Utils/helper";
import { ToFromIndicator } from "./TripDetailsScreen";
import { Observer } from "mobx-react";
const StartTrip = (props) => {
  const { colors, dark } = useTheme();
  const mapRef = useRef();
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
      fontSize: scale(12),
      fontWeight: "700",
      // marginTop: moderateScale(10),
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
  });
  const [showStraightLine, setshowStraightLine] = useState(false);
  const key = "AIzaSyCHPaQI4Y4Lm9NZdSXXt3W4l_qqKAHM5x0";
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(!visible);
  const [isTripStarted, setIsTripStarted] = useState(false);
  const closeMenu = () => setVisible(false);

  const [originDestination, setOriginDestination] = useState([
    {
      latitude: getFloat(tripStore.selectedTrip.baseStartLat),
      longitude: getFloat(tripStore.selectedTrip.baseStartLong),
    },
    {
      latitude: getFloat(tripStore.selectedTrip.baseEndLat),
      longitude: getFloat(tripStore.selectedTrip.baseEndLong),
    },
  ]);
  const fetchTime = (d, t) => {
    tripStore.setPlannedTripRun(d);
    tripStore.setActualTripTripRun(d);
    // updateState({
    //   distance: d,
    //   time: t,
    // });
  };
  const MenuItems = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => closeMenu()}
          style={{
            marginVertical: moderateScale(10),
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <SVG.ExpanceSVG />
          <Text_Custom
            text="Add Expense"
            style={{ marginLeft: moderateScale(10), color: "black" }}
          />
        </TouchableOpacity>
        <View style={{ borderTopColor: "#BDDAF1", borderTopWidth: 1 }} />
        <TouchableOpacity
          onPress={() => closeMenu()}
          style={{
            marginVertical: moderateScale(10),
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <SVG.AdvanceAmount />
          <Text_Custom
            text="Advance Amount"
            style={{ marginLeft: moderateScale(10), color: "black" }}
          />
        </TouchableOpacity>
      </View>
    );
  };
  const startTrip = () => {
    setIsTripStarted(true);
  };
  const TripStarted = () => {
    return (
      <View>
        <View style={[styles.CustomerItems]}>
          <View style={styles.tripDateContainer}>
            <Text_Custom
              text={"Trip Start (Date & Time)"}
              style={styles.TripStart}
            />
            <Text_Custom
              text={formatedDateTime(tripStore.selectedTrip.onwardStartTime)}
              style={styles.TripStartDate}
            />
          </View>
          <View style={styles.tripDateContainer}>
            <Text_Custom
              text={"Trip End (Date & Time)"}
              style={styles.TripStart}
            />
            <Text_Custom
              text={formatedDateTime(tripStore.selectedTrip.onwardEndTime)}
              style={styles.TripStartDate}
            />
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text_Custom text={"Location"} style={styles.LocationText} />
          <Text_Custom text={"Distance"} style={styles.LocationText} />
        </View>
        <View style={styles.LocationContainer}>
          <View style={styles.tripToFrom}>
            <ToFromIndicator vertical={!true} />
            <View style={styles.tripTo}>
              <Text_Custom
                text={tripStore.selectedTrip.startLocation}
                style={styles.TripStartDate}
              />
              {/* <Text_Custom
                text={"Pune H.O, Pune"}
                style={styles.AddessToFrom}
              /> */}
              <View style={{ marginTop: moderateScale(30) }}>
                <Text_Custom
                  text={tripStore.selectedTrip.endLocation}
                  style={styles.TripStartDate}
                />
                {/* <Text_Custom text={"Andheri H.O"} style={styles.AddessToFrom} /> */}
              </View>
            </View>
            <View style={[styles.DistanceAverageContainer]}>
              <View>
                {/* <Text_Custom text={"Distance"} style={styles.LocationText} /> */}
                <Text_Custom
                  text={`${toFix(tripStore.selectedTrip.totalDistance)} Km`}
                  style={styles.TripStartDate}
                />
              </View>
              <View style={{ marginTop: moderateScale(35) }}>
                <Text_Custom
                  text={"Average Speed"}
                  style={styles.LocationText}
                />
                <Text_Custom
                  text={"60km/hr"}
                  style={[styles.TripStartDate, { textAlign: "right" }]}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <Container>
      <CommonHeader
        goBack
        moveTo={() =>
          props.navigation.navigate("TripDetailsScreen", {
            trip: tripStore.selectedTrip,
          })
        }
        title="Start Trip"
        // RightIcon={
        //   <TouchableOpacity onPress={() => openMenu()}>
        //     <SVG.AddSVG />
        //   </TouchableOpacity>
        // }
      />
      <MenuComponent showMenu={visible} onClickOutside={closeMenu}>
        {MenuItems()}
      </MenuComponent>
      <View
        onTouchStart={() => closeMenu()}
        style={{ justifyContent: "flex-end", flex: 1 }}
      >
        <MapView
          style={{ flex: 1 }}
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          loadingEnabled={true}
          loadingIndicatorColor={colors.primary1}
          region={{
            ...originDestination[0],
            latitudeDelta: 2.1,
            longitudeDelta: 2.1,
          }}
        >
          {!showStraightLine &&
            originDestination[0].latitude !== 0 &&
            originDestination[1].latitude !== 0 && (
              <MapViewDirections
                strokeWidth={4}
                strokeColor={colors.primary}
                optimizeWaypoints={true}
                onError={(e) => {
                  setshowStraightLine(true);
                }}
                onReady={(result) => {
                  fetchTime(result.distance, result.duration);
                  mapRef?.current?.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      right: 30,
                      bottom: 70,
                      left: 30,
                      top: 70,
                    },
                  });
                }}
                apikey={api_key}
                origin={originDestination[0]}
                destination={originDestination[1]}
              />
            )}
          {/* {originDestination[0].latitude !== 0 &&
            originDestination[1].latitude !== 0 && (
              <></>
            )} */}
          {showStraightLine && (
            <Polyline
              strokeWidth={4}
              strokeColor={colors.primary}
              coordinates={originDestination}
            />
          )}
          {originDestination[0].latitude !== 0 && (
            <Marker
              coordinate={originDestination[0]}
              image={require("../../Assets/greenDot.png")}
            />
          )}
          {originDestination[1].latitude !== 0 && (
            <Marker
              coordinate={originDestination[1]}
              image={require("../../Assets/redDot.png")}
            />
          )}
          {/* <Marker
            coordinate={{
              latitude: 19.1136,
              longitude: 72.8697,
            }}
            image={require("../../Assets/greenDot.png")}
          /> */}
          {/* <Marker
            coordinate={{
              latitude: 18.5204,
              longitude: 73.8567,
            }}
            image={require("../../Assets/redDot.png")}
          /> */}
        </MapView>
        <View
          style={{
            marginTop: moderateScale(-20),
            // marginBottom: moderateScale(20),
            // flex: 0.2,
            justifyContent: "flex-end",
            paddingHorizontal: moderateScale(30),
            paddingVertical: moderateScale(20),
            backgroundColor: colors.SecondaryBackground,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            justifyContent: "space-around",
          }}
        >
          <TouchableOpacity
            onPress={() => props.navigation.navigate("NavigateTrip")}
            style={{
              position: "absolute",
              // top: scale(190),
              marginTop: -55,
              alignSelf: "center",
              backgroundColor: "#fff",
              width: "38%",
              height: "16%",
              borderRadius: 50,
              justifyContent: "space-evenly",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text_Custom
              text="Navigate"
              style={{
                color: "#000",
                fontSize: scale(14),
                fontFamily: "NunitoSans-Bold",
              }}
            />
            <Image source={require("../../Assets/navigatePNG.png")} />
          </TouchableOpacity>
          <TripStarted />
          {/* {isTripStarted ? (
            <TripStarted />
          ) : (
            <>
              <Gradient_Button
                text="Start Trip"
                onPress={() => {
                  startTrip();
                }}
              />
              <Button
                text="Add Notes"
                onPress={() => {
                  props.navigation.navigate("AddNote", {
                    tripID: tripStore.selectedTrip?.tripId,
                  });
                }}
                // onPress={() => props.navigation.navigate("AddNote")}
                buttonStyles={{
                  backgroundColor: colors.SecondaryBackground,
                  borderColor: colors.primary1,
                  borderWidth: 1,
                  marginTop: moderateScale(20),
                }}
                titleStyles={{ color: colors.primary1 }}
              />
            </>
          )} */}
        </View>
      </View>
    </Container>
  );
};
export default StartTrip;
