import { useNavigation, useTheme } from "@react-navigation/native";
import { observer } from "mobx-react";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { Modalize } from "react-native-modalize";
import { moderateScale, scale } from "react-native-size-matters";
import * as SVG from "../../Assets/SVG";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import Container from "../../Components/Container/Container";
import UploadDocsModal from "../../Components/Dashboard_Componets/UploadDocsModal";
import AddExpense from "../../Components/ExpenseComponents/AddExpense";
import Loader from "../../Components/Loader/Loader";
import AboutTrip from "../../Components/Profile_Components/TripDetailsComponets/AboutTrip";
import BataInfo from "../../Components/Profile_Components/TripDetailsComponets/BataInfo";
import BataInfoPlaned from "../../Components/Profile_Components/TripDetailsComponets/BataInfoPlaned";
import CustomerInfo from "../../Components/Profile_Components/TripDetailsComponets/CustomerInfo";
import MoreInfo from "../../Components/Profile_Components/TripDetailsComponets/MoreInfo";
import ExpenseContainer from "../../Components/Profile_Components/TripDetailsComponets/ExpenseContainer";
import MapComponent from "../../Components/Profile_Components/TripDetailsComponets/MapComponent";
import NoDetailConatiner from "../../Components/Profile_Components/TripDetailsComponets/NoDetailConatiner";
import NotesConatiner from "../../Components/Profile_Components/TripDetailsComponets/NotesConatiner";
import OpenImageModal from "../../Components/Profile_Components/TripDetailsComponets/OpenImageModal";
import PlannedTripConatiner from "../../Components/Profile_Components/TripDetailsComponets/PlannedTripConatiner";
import Text_Custom from "../../Components/Text_Custom";
import { tripTypes } from "../../Constant/constant";
import { getExpenseforTrip } from "../../Services/Actions/ExpenseAction";
import {
  getAdvByTripId,
  getBataTripByTripID,
  getCustomerById,
  getNotes,
  getOrgLevelSettings,
  getTripByTripID,
  getTripTrack,
  updateTripStatus,
} from "../../Services/Actions/TripActions";
import { loaderStore } from "../../Store/AuthStore/LoaderStore";
import { tripStore } from "../../Store/AuthStore/TripStore";
import PermitDetails from "../../Components/Profile_Components/TripDetailsComponets/PermitDetails";
import { logTime, showError, triggerMobGps } from "../../Utils/helper";
import { getItem, setItem } from "../../Services/apiCalls";
import { logCustomEvent } from "../../Utils/analytics";
import ComponentLoader from "../../Components/Loader/ComponentLoader";
import { alertStore } from "../../Store/AuthStore/AlertStore";
export const ToFromIndicator = ({
  vertical = true,
  SCOLOR = "#2196F3",
  ECOLOR = "#EF3131",
  Efill = "#EF3131",
  Sfill = "#2196F3",
}) => {
  const { colors, dark } = useTheme();
  return vertical ? (
    <View
      style={{
        flexDirection: "row",
        // justifyContent: "center",
        alignItems: "center",
        marginTop: moderateScale(15),
      }}
    >
      {SCOLOR !== null ? (
        <View
          style={{
            width: 25,
            height: 25,
            borderRadius: 12,
            backgroundColor: "white",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: SCOLOR,
              width: 20,
              height: 20,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </View>
      ) : (
        <SVG.SVGS_E />
      )}
      <SVG.Line />
      {ECOLOR !== null ? (
        <View
          style={{
            width: 25,
            height: 25,
            borderRadius: 12,
            backgroundColor: "white",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: ECOLOR,
              width: 20,
              height: 20,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </View>
      ) : (
        <SVG.SVGS_E fill={Efill} />
      )}
    </View>
  ) : (
    <View
      style={{
        // flexDirection: "row",
        // justifyContent: "center",
        alignItems: "center",
        marginTop: moderateScale(15),
      }}
    >
      <View
        style={{
          width: 25,
          height: 25,
          borderRadius: 12,
          backgroundColor: "white",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: SCOLOR,
            width: 20,
            height: 20,
            borderRadius: 12,
          }}
        />
      </View>
      <SVG.LineV_SVG />
      <View
        style={{
          width: 25,
          height: 25,
          borderRadius: 12,
          backgroundColor: "white",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: ECOLOR,
            width: 20,
            height: 20,
            borderRadius: 12,
          }}
        />
      </View>
    </View>
  );
};
const TripDetailsScreen = (props) => {
  //console.log("props",props)
  const nav = useNavigation();
  const [Loading, setLoading] = useState(false);
  const { colors, dark } = useTheme();
  const modalizeRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [imageSelected, setImageSelected] = useState("");
  const [notes, setNotes] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [NoData, setNoData] = useState(false);
  const [skipLoader, setskipLoader] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [route, setRoute] = useState([]);
  const [expense, setExpense] = useState([]);
  const [AdvanceAmount, setAdvanceAmount] = useState(0);
  const logVehicleId = props.route.params.trip.vehicleId;
  const logTripId = props.route.params.trip.tripId;
  const [canAddExpense, setCanAddExpense] = useState(true);
  const [loadComponent, SetComponent] = useState(false);
  const [allNotesRead, setAllNotesRead] = useState(false);
  const [highlightUnread, setHighlightUnread] = useState(false);

  useEffect(() => {
    // console.log("props.route.params.trip",props.route.params.trip);
    getMetric();
    
    init();
    console.log("<<<<<<<<<<tripdetailsscreen renderinggggggg>>>>>>>>>>>>>>>")
    const tripDetailRenderTime = new Date().getTime();
    console.log("rendertime from tripdetailsscreen", tripDetailRenderTime)
   

    return () => {
      tripStore.resetTrip();
    };




  }, [props, refresh,alertStore.visible]);


  const getMetric = () => {
    console.log("getMEtricccccccc")
    const logEvent = (prefix, uuid, timeTakenSeconds) => {
      const eventKey = `${prefix}_${uuid}_${timeTakenSeconds}`;
      console.log(eventKey, { timeTakenSeconds });
      logCustomEvent(eventKey);
    };

    const calculateTimeTaken = (startTime) => {
      const currentTime = new Date().getTime();
      return (currentTime - startTime) / 1000; // Convert milliseconds to seconds
    };
    const { status, endClicked, startTime, trip, tripUuid } = props.route.params;

    if (status === "end") {
      console.log("from endtrip to tripdetails");

      const timeTakenSeconds = calculateTimeTaken(endClicked);
      console.log("timeTaken for end trip in seconds", timeTakenSeconds);

      logEvent("T", trip.uuid, timeTakenSeconds);
    } else if (status === "start") {
      console.log("tripdetail props fro  start>>>>>>>>>>>>>>>>", props);

      const timeTakenSeconds = calculateTimeTaken(startTime);
      console.log("timeTaken for start trip in seconds", timeTakenSeconds);

      logEvent("D", tripUuid, timeTakenSeconds);
    }
    else
      console.log("undefined status")
  };

  const init = async () => {

    // await setItem("selectedTrip", props.route.params.trip);
    logTime("init starts")
    SetComponent(false);
    const { tripId, onwardStartTime, onwardEndTime, vehicleId, deviceId } = props.route.params.trip;


    Promise.all([
      getTripTrack(tripId, onwardStartTime, onwardEndTime, vehicleId, deviceId,"tripdetails").catch((error) => {
        console.error("Error in getTripTrack:", error);
        return null; // Return fallback value
      }),

      getAdvByTripId(tripId).catch((error) => {
        console.error("Error in getAdvByTripId:", error);
        return { advData: null }; // Return fallback value
      }),
    
     

    ])
      .then(([tripTrackResult, advResult]) => {
        // Handle `getTripTrack` result
        if (tripTrackResult) {
          logTime("getTripTrack ended");
          console.log("Trip track data:", tripTrackResult.list, tripTrackResult.remainingDistance);
          setRoute(tripTrackResult.list);
        }

        // Handle `getAdvByTripId` result
        if (advResult !== null || advResult !== undefined) {

          console.log("Advance amount>>>>>>>>>>>>>>>netring:",advResult);
          setAdvanceAmount(advResult);
        }
        console.log("getAdvByTripId ended");

     
        
      })
      .catch((error) => {
        // Handle unexpected errors
        console.error("Unexpected error occurred:", error);
      });



    //setLoading(true);

    // var previousTrip=await getItem("selectedTrip");
    // console.log("prevtrip>>>>>>>>>>>>>>>>,",previousTrip)
    // await setItem("previousTrip",previousTrip)

    await getTripByTripID(props.route.params.trip)

      .then(async (tripData) => {
        console.log("tripdata from tripdetail", tripData)

        logTime("getOrgLevelSettings started")
        var response = await getOrgLevelSettings();
        logTime("getOrgLevelSettings ended>>>>>>>>>>>")
        console.log("response from org level for expesne", response);
        setCanAddExpense(response.addExpenseValidation);
        var notesResult=await getNotes(props.route.params.trip.tripId)

        setNotes(notesResult.data.jsonData);
        console.log("notes in tripdeti",notes)
        if (
          tripData.status === tripTypes[3] ||
          tripData.status === tripTypes[4]
        ) {
          // console.log("  tripData.status ----", tripData.status);
          logTime("getBataTripByTripID started")
          await getBataTripByTripID(props.route.params.trip.tripId).then(
            async (res) => {
              console.log("res from bata api", res)
              logTime("getBataTripByTripID ended>>>>>>>")
              //console.log("resfrom", res);
              var completeTripData = res[0];
              logTime("getExpenseforTrip start")
               var exp = await getExpenseforTrip(tripData.tripId);
              logTime("getExpenseforTrip ended")
              tripStore.setSelectedTrip({
                ...tripData,

                completeTripData,
                expanse: exp,
              });
            
            
              await setItem("selectedTrip", tripStore.selectedTrip)
              loaderStore.setIsLoading(false);
              setLoading(false);
            }
          );
        } else {
          // loaderStore.setIsLoading(false);
          setLoading(false);
          setNoData(false);
          let planned_amount = 0;
          await getBataTripByTripID(props.route.params.trip.tripId)
            .then((res) => {
              console.log("res from bata api", res)
              if (res?.length > 0) {
                planned_amount = res[0]?.plannedTripAmount;
                console.log("res", res);
              }
            })
            .catch((err) => {
              console.log("planned bata component", err);
            });
           var exp = await getExpenseforTrip(tripData.tripId);
          //console.log("tripData ",tripData)
          //console.log("expense ", exp);
          tripStore.setSelectedTrip({
            ...tripData,

            plannedBataAmount: planned_amount,
            expanse: exp,
          });
         
     
          await setItem("selectedTrip", tripStore.selectedTrip)
          //console.log("tripData", tripData);
        }
        SetComponent(true)
        console.log(allNotesRead,"allNotesRead from tripdrtilusefect!!!!!!!!!!!!!!!!!!!!!!!")
        // getMetric();
        logTime("init ends>>>>>>>>")
      })

      .catch((err) => {
        setNoData(true);
        tripStore.setSelectedTrip({});
        setLoading(false);
        console.log("err", err);
      });

  };
  const onRefresh = () => {
    init();
  };
  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      height: 400,
      width: 400,
      justifyContent: "flex-end",
      alignItems: "center",
    },
    detailContainer: {
      marginTop: moderateScale(-40),
      marginHorizontal: moderateScale(20),
    },
    detailCard: {
      backgroundColor: colors.SecondaryBackground,
      padding: moderateScale(10),
      borderRadius: scale(10),
      borderColor: colors.cardBorder,
      borderWidth: 1,
      marginBottom: moderateScale(15),
    },
  });
  const Skip = async () => {
    setskipLoader(true);

    const body = {
      applyForRecurring: false,
      status: tripTypes[2],
      tripId: tripStore.selectedTrip.tripId,
      actualStartTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    };

    await updateTripStatus(body)
      .then(async (updateRes) => {
        loaderStore.setIsLoading(false);
        tripStore.setTripStatus("status", tripTypes[2]);
        setskipLoader(false);
        setModalVisible(!modalVisible);
        props.navigation.navigate("NavigateTrip", { status: "start" });
      })
      .catch((err) => {
        console.log("err", err);
        setskipLoader(false);
        loaderStore.setIsLoading(false);
      });
    // setskipLoader(false);
  };
  const upload = () => {
    setModalVisible(!modalVisible);
    props.navigation.navigate("AddDocOdometer", { status: "start" });
  };
  const closeAddExp = () => {
    modalizeRef.current?.close();
    setRefresh(!refresh);
  };
  const startTrip = () => {
    setModalVisible(false);
    tripStore.setCurrentTripStartTime(new Date());

    // setModalVisible(!modalVisible);
    props.navigation.navigate("AddDocStart");
    //props.navigation.navigate("OTP");
  };
  const moveTo = () => {
    if (props.route.params.isTrip === true) {
      nav.navigate("Trip");
    } else if (props.route.params.isTrip === false) {
      nav.navigate("PendingTrips");
    } else {
      nav.goBack();
    }
  };
  const onPressAddExp = () => {
    if (tripStore.selectedTrip.status === tripTypes[3] || tripStore.selectedTrip.status === tripTypes[4]) {
      showError("sorry you can't add expense for the completed trips")
    }
    else {
      modalizeRef.current?.open();
    }

  };
  const onPressExp = (item) => {
    setImageSelected(item);
    // console.log("item",item)
    setImageModal(true);
  };
  const DetailCard = ({ children }) => (
    <View style={styles.detailCard}>{children}</View>
  );

  return (
    <>
      <Loader isLoadingProps={Loading} />
      {NoData ? (
        <NoDetailConatiner moveTo={moveTo} />
      ) : (
        <Container>
          {/* Modals */}
          <UploadDocsModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            Skip={Skip}
            skipLoader={skipLoader}
            upload={startTrip}
          />
          <OpenImageModal
            imageModal={imageModal}
            imageSelected={imageSelected}
            setImageModal={setImageModal}
          />
          <Modalize
            ref={modalizeRef}
            adjustToContentHeight
            withHandle
            handlePosition="inside"
            childrenStyle={{ backgroundColor: colors.SecondaryBackground }}
          >
            <AddExpense closeAddExp={closeAddExp} />
          </Modalize>
  
          {/* Header */}
          <CommonHeader title="Trip Details" goBack moveTo={moveTo} />
  
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Trip Cancelled Banner */}
            {tripStore.selectedTrip.status === "Cancelled" && (
              <View style={styles.cancelledBanner}>
                <Text_Custom
                  style={styles.cancelledText}
                  text={"Trip Cancelled"}
                />
              </View>
            )}
  
            {/* Map */}
            <MapComponent
              route={route}
              scrollEnabled={false}
              onPress={() => props.navigation.navigate("FullScreenMap")}
            />
  
            {/* Details */}
            <View style={styles.detailContainer}>
              {/* About Trip */}
              <DetailCard>
                {loadComponent ? <AboutTrip /> : <ComponentLoader />}
              </DetailCard>
  
              {/* Bata Info */}
              <DetailCard>
                {loadComponent ? <BataInfo AdvanceAmount={AdvanceAmount} /> : <ComponentLoader />}
              </DetailCard>
  
              {/* Planned Bata Info */}
              <DetailCard>
                {loadComponent ? <BataInfoPlaned AdvanceAmount={AdvanceAmount} /> : <ComponentLoader />}
              </DetailCard>
  
              {/* Customer Information */}
              {tripStore?.selectedTrip?.customerData && (
                <DetailCard>
                  {loadComponent ? <MoreInfo /> : <ComponentLoader />}
                </DetailCard>
              )}
  
              <DetailCard>
                {loadComponent ? <CustomerInfo /> : <ComponentLoader />}
              </DetailCard>
  
              {/* Expense Container */}
              <DetailCard>
                {loadComponent ? (
                  <ExpenseContainer
                    AdvanceAmount={AdvanceAmount}
                    onPressAddExp={onPressAddExp}
                    onPressExp={onPressExp}
                    canAddExpense={canAddExpense}
                  />
                ) : (
                  <ComponentLoader />
                )}
              </DetailCard>
              <DetailCard>
           
  {loadComponent ? (
    <NotesConatiner notes={notes} title="Trip Notes" showAcknowledgment={true} />
  ) : (
    <ComponentLoader />
  )}
</DetailCard>

<DetailCard>
  {loadComponent ? (
    <NotesConatiner notes={notes}  title="Driver Notes" showAcknowledgment={false} />
  ) : (
    <ComponentLoader />
  )}
</DetailCard>

              {/* Planned Trip Info */}
              <DetailCard>
                {loadComponent ?  <PlannedTripConatiner   /> : <ComponentLoader />}
                {/* {loadComponent ?  <PlannedTripConatiner allNotesRead={false}    notes={notes} /> : <ComponentLoader />} */}
              </DetailCard>
             
            </View>
          </ScrollView>
        </Container>
      )}
    </>
  );
  
};
export default observer(TripDetailsScreen);
//python open image in frame?
