import { useTheme } from "@react-navigation/native";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { useEffect, useRef, useState,useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Linking,
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { AnimatedRegion, Marker } from "react-native-maps";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-paper";
import { moderateScale, scale } from "react-native-size-matters";
import Icon from "react-native-vector-icons/Entypo";
import { Button } from "../../Components/Button/Button";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import Container from "../../Components/Container/Container";
import UploadDocsModal from "../../Components/Dashboard_Componets/UploadDocsModal";
import Loader from "../../Components/Loader/Loader";
import AddAdvance from "../../Components/Profile_Components/TripDetailsComponets/AddAdvance";
import MapComponent from "../../Components/Profile_Components/TripDetailsComponets/MapComponent";
import Text_Custom from "../../Components/Text_Custom";
import { tripTypes } from "../../Constant/constant";
//import * as SVG from "../../../Assets/SVG";
import { CallSVG } from "../../Assets/SVG";
import { geoCoading } from "../../Services/Actions/LocationActions";
import {
  createCompleteTrip,
  getTripTrack,
  getUpdatedChecksByTripId,
  getUpdatedOnAmountScreen,
  getVehicleTrack,
  updateTripStatus,
} from "../../Services/Actions/TripActions";
import { imageStore } from "../../Store/AuthStore/ImageStore";
import { loaderStore } from "../../Store/AuthStore/LoaderStore";
import { tripStore } from "../../Store/AuthStore/TripStore";
import {

  getFloat,



  getNumber,
  showSuccess,

} from "../../Utils/helper";
//import Geolocation from "react-native-geolocation-service";
//import { NativeModules } from 'react-native';

import StyleCommon from "../../Styles/StyleCommon"

const screen = Dimensions.get("window");
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const NavigateTrip = (props) => {

  const [latitudes, setLatitude] = useState(null);
  const [longitudes, setLongitude] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [locationData, setLocationData] = useState([]);
  const { colors, dark } = useTheme();
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const tripId = tripStore.selectedTrip.tripId;
  const [fetchData, setFetchData] = useState(true);
  const [totalDistance, setTotalDistance] = useState();
  const [remainingDistance, setRemainingDistance] = useState();
  const [reportToNumber, setReportToNumber] = useState([]);

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
    resetButton: {
      marginTop: moderateScale(10),
      backgroundColor: colors.primary1,
      padding: moderateScale(10),
      borderRadius: moderateScale(10),
      borderTopLeftRadius: moderateScale(10),
      borderBottomLeftRadius: moderateScale(10),
      alignItems: "center",
      width: moderateScale(150),

      //marginRight: moderateScale(50), // Add this line
    },
    CustomerAddresskey: {
      marginVertical: moderateScale(10),
      fontSize: scale(12),
      fontWeight: "700",
      color: colors.primary1,
    },
    // CustomerAddress: {
    //   // width: "100%",
    //   fontSize: scale(14),
    //   // fontWeight: "600",
    //   fontFamily: "NunitoSans-Regular",
    // },
    addressContainer: {
      // paddingVertical: moderateScale(10),
    },
    CustomerItems: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: moderateScale(5),
      alignItems: "center",
      //borderBottomWidth: 1,
      borderColor: colors.border,
      paddingBottom: moderateScale(10),
    },
    BETAvalue: {
      fontSize: scale(12),
      fontWeight: "700",
      color: colors.primary1,
    },
    Customervalue: {
      borderColor: colors.primary1,
      borderWidth: 1,
      paddingHorizontal: moderateScale(3),
      paddingVertical: moderateScale(6),
      borderRadius: 5,
      flexDirection: "row",
      width: "40%",
      justifyContent: "space-around",
      alignItems: "center",
    },
    // CustomerAddress: {
    //   fontSize: scale(12),
    //   fontWeight: "600",
    //   fontFamily: "NunitoSans-Bold",
    //   marginVertical: moderateScale(5),
    // },
    rowContainer: {
      flexDirection: "row",
      justifyContent: "space-between", // Add this
      alignItems: "center",
     
      
    },
    columnContainer: {
      flexDirection: "column",
      width: "100%",
      height: "100%",
      alignItems: "flex-start", // You can adjust alignment based on your design
      justifyContent: "flex-start",
    },
  });

  const markerRef = useRef();
  const [modalVisible, setModalVisible] = useState(false);
  const [Loading, setLoading] = useState(false);
  const modalizeRef = useRef(null);
  const [margineBottom, setmargineBottom] = useState(1);
  const [visible, setVisible] = React.useState(false);
  const [isTripStarted, setIsTripStarted] = useState(false);
  const [AdvOrExp, setAdvOrExp] = useState(0);
  const [routes, setRoutes] = useState([]);
  const [state, setState] = useState({
    curLoc: {
      latitude: tripStore?.curLocation?.latitude,
      longitude: tripStore?.curLocation?.latitude,
    },
    destinationCords: {},
    isLoading: false,
    coordinate: new AnimatedRegion({
      latitude: 8.499733,
      longitude: 76.9241666,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
    time: 0,
    distance: 0,
    heading: 0,
  });
  const {
    curLoc,
    time,
    distance,
    destinationCords,
    isLoading,
    coordinate,
    heading,
  } = state;




  useEffect(() => {
    const reportToNumber = tripStore?.selectedTrip?.customerData?.reportToNumber;

    if (typeof reportToNumber === "string" && reportToNumber.trim() !== "") {
      // Split the string into an array using commas as the delimiter
      let numbersArray = reportToNumber.split(",");

      // Trim each element to remove leading and trailing whitespaces
      numbersArray = numbersArray.map((number) => number.trim());

      // Take only the first two elements
      const firstTwoNumbers = numbersArray.slice(0, 2);

      setReportToNumber(firstTwoNumbers);
      console.log("firstTwoNumbers", firstTwoNumbers);
    }
  }, [tripStore?.selectedTrip?.customerData?.reportToNumber]);



  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const [originDestination] = useState([
    {
      latitude: getFloat(tripStore?.selectedTrip?.baseStartLat),
      longitude: getFloat(tripStore?.selectedTrip?.baseStartLong),
    },
    {
      latitude: getFloat(tripStore?.selectedTrip?.baseEndLat),
      longitude: getFloat(tripStore?.selectedTrip?.baseEndLong),
    },
  ]);
  useEffect(() => {
    setLoading(false);
    updateState({
      curLoc: {
        latitude: tripStore?.curLocation?.latitude,
        longitude: tripStore?.curLocation?.longitude,
      },
    });
    loaderStore?.setIsLoading(false);
    const init = async () => {
     await getLiveLocation();
      var routes = await getTripTrack(tripStore.selectedTrip.tripId,tripStore.selectedTrip.onwardStartTime,
        tripStore.selectedTrip.onwardEndTime,
        tripStore.selectedTrip.vehicleId);
      setRoutes(routes);
   
      loaderStore?.setIsLoading(false);
    };
    init();
  }, []);
  const openMenu = () => setVisible(!visible);
  const closeMenu = () => setVisible(false);

  const Skip = async () => {
    setLoading(true);

    await createCompleteTrip().then(async (res) => {
      if (res?.status) {
        const body = {
          applyForRecurring: false,
          note: "string",
          status: tripTypes[3],
          tripId: tripStore?.selectedTrip?.tripId,
          actualEndTime: moment().format("YYYY-MM-DD HH:mm:ss"),
          actualStartTime: res?.data?.jsonData?.actualTripStartDate,
          actualBataAmount: res?.data?.jsonData?.actualTripAmount,
        };

        loaderStore?.setIsLoading(false);
        setModalVisible(!modalVisible);
        await updateTripStatus(body).then(async (updateRes) => {
          setLoading(false);
          tripStore.setTripStatus("status", tripTypes[3]);
          loaderStore.setIsLoading(false);
          setModalVisible(!modalVisible);
          imageStore?.resetAllImage();
          showSuccess("Trip completed");

          props.navigation.navigate("Listing", {
            screen: "TripDetailsScreen",
            params: { trip: tripStore?.selectedTrip },
          });
        });
      } else {
        setLoading(false);
        loaderStore?.setIsLoading(false);
        Alert.alert("Something wents wrong!", res?.message);
        setModalVisible(!modalVisible);
      }
    });
  };
  const upload = () => {
    setModalVisible(!modalVisible);
    props.navigation.navigate("AddDocOdometer", { status: "end" });
  };

  const endTrip = async () => {
    // tripStore.setCurrentTripStartTime(Date.now());
    // console.log("seelctedtrip",tripStore.selectedTrip)
    //fetchTotalDistance();
    const body = {
      applyForRecurring: false,
      note: "Testing",
      status: tripTypes[2],
      actualEndTime: moment().format("YYYY-MM-DD HH:mm:ss"),
      tripId: tripStore?.selectedTrip?.tripId,
    };
    console.log("body", body);

    var response = await updateTripStatus(body);
    console.log("response from endtrip", response);
    if (response.message === "Trip status updated succesfully.") {
      await fetchTotalDistance(tripId);
    }

    setAdvOrExp(1);
    modalizeRef?.current?.open();
  };
  const closeAddExp = () => {
    modalizeRef.current?.close();
  };
  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(() => {
        getLiveLocation();
      }, 6000);
  
      return () => clearInterval(interval); // cleanup on blur
    }, [])
  );






  useEffect(() => {
    animate(state.curLoc.latitude, state.curLoc.longitude);
  }, [state.curLoc]);

  const getLiveLocation = async () => {
    /*const locPermissionDenied = await locationPermission();*/

    var { list, remainingDistance } = await getTripTrack(tripStore.selectedTrip.tripId,tripStore.selectedTrip.onwardStartTime,
      tripStore.selectedTrip.onwardEndTime,
      tripStore.selectedTrip.vehicleId);
    setRemainingDistance(remainingDistance);

    var route = list?.map((ele) => ({
      latitude: ele?.lattitude,
      longitude: ele?.longitude,
    }));

    let liveLocation = {};
    let distance = 0;
    if (list?.length > 0) {
      liveLocation = list[list?.length - 1];
      distance = remainingDistance.toFixed(2);
  
      // loaderStore.setLoader(false);
    }

    setRoutes(list);

    if (liveLocation?.lattitude && liveLocation?.longitude) {
      animate(liveLocation?.lattitude, liveLocation?.longitude);
      await geoCoading({
        lattitude: liveLocation?.lattitude,
        longitude: liveLocation?.longitude,
      });
      updateState({
        distance: distance,
        heading: liveLocation?.heading,
        curLoc: {
          lattitude: liveLocation?.lattitude,
          longitude: liveLocation?.longitude,
        },
        coordinate: new AnimatedRegion({
          lattitude: liveLocation?.lattitude,
          longitude: liveLocation?.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }),
      });
    } else {
      updateState({ curLoc: { ...originDestination[0] } });
    }
  };
  const animate = (latitude, longitude) => {
    const newCoordinate = { latitude, longitude };
    if (Platform.OS == "android") {
      if (markerRef?.current) {
        markerRef?.current?.animateMarkerToCoordinate(newCoordinate, 7000);
      }
    } else {
      coordinate?.timing(newCoordinate)?.start();
    }
  };
  const onPressItem = (value) => {
    setAdvOrExp(value);
    closeMenu();
    modalizeRef?.current?.open();
  };
  const fetchTime = (d, t) => {
    tripStore?.setPlannedTripRun(d);
    tripStore?.setActualTripTripRun(d);
    tripStore?.setTotalTripRunTime(t);
    updateState({
      distance: d,
      time: t,
    });
  };
  const fetchValue = (data) => {
    updateState({
      destinationCords: {
        latitude: data?.destinationCords?.latitude,
        longitude: data?.destinationCords?.longitude,
      },
    });
  };

  const fetchTotalDistance = async (tripId) => {
    try {
      const response = await getUpdatedChecksByTripId(tripId, "true","true");
      //console.log("response from planedtripcontainer for updtaedchecks:", response); // Log the response
      tripStore.setUpdatedSelectedTrip(response);
      setTotalDistance(tripStore.updatedSelectedTrip.totalDistance);
      console.log("navigate trip", tripStore.updatedSelectedTrip.totalDistance);
      //console.log("updatedselected trip",tripStore.updatedSelectedTrip)
    } catch (error) {
      console.error("API error from feedback:", error);
    }
  };
  const fetchUpdatedChecks = async (tripId) => {
    try {
      const response = await getUpdatedChecksByTripId(tripId);
      console.log(
        "response from planedtripcontainer for updtaedchecks:",
        response
      ); // Log the response
      tripStore.setUpdatedSelectedTrip(response);
      //console.log("updatedselected trip", tripStore.updatedSelectedTrip);
    } catch (error) {
      console.error("from fetchUpdatedChecks in navigate trip :", error);
    }
  };

  const saveAdvance = async (value) => {
    console.log("amount from from customer", value);
    //await fetchUpdatedChecks(tripId);
    const { expanse, expenseType } =
      tripStore.selectedTrip;
    const {
      endOdometer, endSelfie, endFuel,
      endOtpValidation,
      //customerSignatureValidation,
      customerFeedbackValidation,
    } = tripStore.updatedSelectedTrip;

    var amount = Number(value);
    console.log("getNumber", amount);
    tripStore?.setAdvanceAmount(amount);
    
   
    modalizeRef?.current?.close();
   props.navigation.navigate("EndSignature");

  
    //
  };
  const makePayment = () => {
    modalizeRef?.current?.close();
    console.log("SDasmdlasdpayment")
    props.navigation.navigate("AddDocFinish");
    // setModalVisible(true);
  };

  return (
    <>
      <CommonHeader goBack title="Route" />


      {/* <Loader /> */}
      {Loading && (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              zIndex: 99999999,
              justifyContent: "center",
              backgroundColor: "black",
            },
          ]}
        >
          <ActivityIndicator />
        </View>
      )}
      <Container>
        <UploadDocsModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          Skip={Skip}
          upload={upload}
          skipLoader={Loading}
        />

        <View
          // onTouchStart={() => closeMenu()}
          style={{ justifyContent: "flex-end", flex: 1 }}
        >
          <MapComponent
            extraStyles={{ flex: 1, marginBottom: margineBottom }}
            curLoc={curLoc}
            onMapReady={() => setmargineBottom(1)}
            route={routes}
          >
            <Marker.Animated ref={markerRef} coordinate={coordinate}>
              <Animated.Image
                source={require("../../Assets/cLocationNavi.png")}
                style={{
                  width: 40,
                  height: 40,
                  transform: [{ rotate: `${heading}deg` }],
                }}
                resizeMode="contain"
              />
            </Marker.Animated>
          </MapComponent>

          {/* <>
      {latitudes !== null && longitudes !== null && (
        <MapScreen latitude={latitudes} longitude={longitudes} />

        //  <MapScreen latitude={latitudes} longitude={longitudes} />
      )}
    </> */}


          <View
            style={{
              marginTop: moderateScale(-20),
              justifyContent: "flex-end",
              paddingHorizontal: moderateScale(30),
              paddingVertical: moderateScale(20),
              backgroundColor: colors.SecondaryBackground,
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              justifyContent: "space-around",
            }}
          >{tripStore.selectedTrip?.customerData ?.reportToAddress ||tripStore.selectedTrip?.customerData ?. reportToNumber? (
            <View style={[styles.CustomerItems]}>
              <View style={{ width: "50%" }}>
                <Text_Custom text={"Report To "} style={{ fontSize: scale(14), fontFamily: "NunitoSans-Bold" }} />
                <Text_Custom
                  text={`${tripStore.selectedTrip?.customerData?.reportToAddress}`}
                  style={styles.CustomerAdderss}
                />
              </View>

              

              <View style={styles.columnContainer}>
                {reportToNumber.map((phoneNumber, index) => (
                  <View
                    key={index}
                    style={[
                      styles.rowContainer,
                      index < reportToNumber.length - 1 && { marginBottom: 10 },
                    ]}
                  >
                
                    
                <CallSVG />
                    <TouchableOpacity
                      style={styles.Customervalue}
                      onPress={() => Linking.openURL(`tel:${phoneNumber}`)}
                    >
                      <Text_Custom
                        text={`+91 ${phoneNumber}`}
                        style={styles.BETAvalue}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

            </View>
          ) : (<View>
          </View>)}
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: moderateScale(10),
                }}
              >


                <Text_Custom
                  text={"Current Location"}
                  style={{ fontSize: scale(14), fontFamily: "NunitoSans-Bold" }}
                />
                <Text_Custom
                  text={"Remaining Distance"}
                  style={{ fontSize: scale(14), fontFamily: "NunitoSans-Bold" }}
                />

              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginVertical: moderateScale(10),
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Image
                    source={require("../../Assets/NavigateUp.png")}
                    style={{
                      width: 40,
                      height: 40,
                      marginRight: moderateScale(10),
                    }}
                  />
                  {/* <SVG.NavigationUp /> */}
                  <View>
                    <Text_Custom
                      text={tripStore?.curLocationName}
                      numberOfLines={3}
                      style={{
                        fontSize: scale(12),
                        fontFamily: "NunitoSans-Bold",
                        width: scale(170),
                      }}
                    />
                  </View>
                </View>
                <Text_Custom
                  text={
                    remainingDistance && typeof remainingDistance === "number"
                      ? `${remainingDistance.toFixed(2)}Kms`
                      : 0
                  }
                  style={{
                    fontSize: scale(12),
                    fontFamily: "NunitoSans-Bold",
                    color: colors.primary1,
                  }}
                />
              </View>
            </View>
            <Button
              onPress={() => {

                endTrip(); // Call the endTrip function
              }}
              text="End Trip"
              buttonStyles={{
                backgroundColor: colors.error,
                borderColor: colors.error,
                borderWidth: 1,
                marginTop: moderateScale(20),
              }}
              titleStyles={{ color: "#fff" }}
            />
          </View>
        </View>
        <Portal>
          <Modalize
            style={{ zIndex: 999 }}
            ref={modalizeRef}
            adjustToContentHeight
            withHandle={false}
            HeaderComponent={() => (
              <View style={{ backgroundColor: colors.SecondaryBackground }}>
                <TouchableOpacity
                  onPress={() => {console.log("presing");modalizeRef.current?.close()}}
                  style={{
                    alignSelf: "flex-end",
                    paddingHorizontal: moderateScale(20),
                    paddingTop: moderateScale(10),
                  }}
                >
                  <Icon name={"cross"} size={scale(30)} />
                </TouchableOpacity>
              </View>
            )}
            handlePosition="inside"
            childrenStyle={{
              backgroundColor: colors.SecondaryBackground,
            }}
          >
            {AdvOrExp == 0 ? (
              <></>
            ) : (
              // <AddExpense closeAddExp={closeAddExp} />
              <AddAdvance
                totalDistance={totalDistance}
                saveAdvance={saveAdvance}
                makePayment={makePayment}
                colors={colors}
              />
            )}
          </Modalize>
        </Portal>
      </Container>
    </>
  );
};
export default observer(NavigateTrip);
