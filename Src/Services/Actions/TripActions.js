import moment from "moment";
import axios from "axios";
import { Alert } from "react-native";
import { authStore } from "../../Store/AuthStore/AuthStore";
import { imageStore } from "../../Store/AuthStore/ImageStore";
import { feedbackStore } from "../../Store/AuthStore/FeedbackStore";
import { loaderStore } from "../../Store/AuthStore/LoaderStore";
import { tripStore } from "../../Store/AuthStore/TripStore";
import {
  dateFormate,
  getAvgSpeed,
  getFloat,
  getFuel,
  getNumber,
  getString,
  logTime,
  showError,
} from "../../Utils/helper";
import { apiGet, apiPost, getAuthData, getItem } from "../apiCalls";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ADD_NOTE,
  BATA_GET_TRIP_BY_TRIP_ID,
  CREATE_TRIP,
  CUSTOMER_AMOUNT,
  GET_ADV_AMOUNT_BY_T_ID,
  GET_CUSTOMER_BY_ID,
  GET_NOTE,
  GET_TOTAL_BATA,
  GET_TRACK,
  GET_TRIP_BY_TRIP_ID,
  GET_TRIP_DETAILS_BY_DRIVER_ID,
  UPDATE_TRIP_STATUS,
  GET_PERMITS_DETAILS,
  GET_OTP,
  POST_FEEDBACK,
  UPLOAD_SIGNATURE,
  POST_SIGNATURE,
  POST_OTP_VALIDATED,
  POST_LOCATION_DATA,
  POST_UUID,
  GET_DEVICE_STATUS,
  GET_RECENT_TRIP,
  CHECK_MANDATORY_VALIDATION,
  SCREEN_API,
  SCREEN_CUSTOMIZING,
  POST_GCM_DETAILS,
  GET_ORG_LEVEL_SETTINGS,
  GET_TRACK_VEHICLE,
} from "../urls";
import { StartEndLocation } from "./LocationActions";
import { permitStore } from "../../Store/AuthStore/PermitStore";
import { tripTypes } from "../../Constant/constant";
import { logCustomEvent } from "../../Utils/analytics";
export async function getTripList() {
  try {
    //loaderStore.setIsLoading(true);
    var auth = await getAuthData();
    console.log("<<before driver api")
    const userLoginRes = await apiGet(
      `${GET_TRIP_DETAILS_BY_DRIVER_ID}${auth?.driver_id}`
    );
    console.log("<<after driver api")

    if (userLoginRes?.length > 0) {
      loaderStore.setIsLoading(false);

      tripStore.setTripList(userLoginRes);

      loaderStore.setIsLoading(false);
      return userLoginRes;
    }
  } catch (error) {
    loaderStore.setIsLoading(false);
    console.log(error, "ERROR----getTripList");
    showError("Trip not found!");
    return Promise.reject(error);
  }
}

export async function getUpdatedChecksByTripId(tripId, dis,geocod) {
  try {
    const updated =
    dis == "true" && geocod=="true"
        ? await apiGet(`${GET_TRIP_BY_TRIP_ID}${tripId}/true/true`)
        : await apiGet(`${GET_TRIP_BY_TRIP_ID}${tripId}`);
    // console.log("GET_TRIP_BY_TRIP_ID",`${GET_TRIP_BY_TRIP_ID}${tripId}/true`);

    tripStore.setUpdatedSelectedTrip(updated);

    return updated;
  } catch (error) {
    console.log(error, "ERROR----getUpdatedTripByTripId");
  }
}

export async function getUpdatedChecksOnSkip(
  tripId,
  status,
  Screen,
  navigation
) {
  try {
    if (status == "start") {
      const updated = await apiGet(`${GET_TRIP_BY_TRIP_ID}${tripId}`);

      tripStore.setUpdatedSelectedTrip(updated);
      const {
        startOtpValidation,
        startOdometer,
        //startMeterReading,
        startFuel,
        startSelfie,
      } = tripStore.updatedSelectedTrip;

      if (
        startOdometer ||
        // startMeterReading ||
        startSelfie ||
        startFuel ||
        startOtpValidation
      ) {
        navigation.navigate("AddDocStart");
      } else {
        navigation.navigate(Screen);
      }
      return updated;
    }
    if (status == "end") {
      const updated = await apiGet(`${GET_TRIP_BY_TRIP_ID}${tripId}`);
      tripStore.setUpdatedSelectedTrip(updated);
      //console.log("updated", updated);
      const {
        endOdometer,
        // endMeterReading,
        endFuel,
        endSelfie,
        endOtpValidation,
        customerSignatureValidation,
        customerFeedbackValidation,
      } = tripStore.updatedSelectedTrip;
      const { expanse, expenseType } = tripStore.selectedTrip;

      if (
        endOtpValidation ||
        customerSignatureValidation ||
        customerFeedbackValidation ||
        // endMeterReading ||
        endFuel ||
        endOdometer ||
        endSelfie ||
        //expanse ||
        expenseType
      ) {
        navigation.navigate("AddDocFinish");
      } else {
        navigation.navigate(Screen);
      }

      return updated;
    }
  } catch (error) {
    console.log(error, "ERROR----getUpdatedTripByTripId");
  }
}

export async function getTripByTripID(trip) {
  try {
    //loaderStore.setIsLoading(true);
    //console.log("trip prop paasing to  getTripByTripID ",trip)
    logTime("tridetial started");
    const userLoginRes = await apiGet(`${GET_TRIP_BY_TRIP_ID}${trip.tripId}/false/false`);
    //const userLoginRes = await apiGet(`${GET_TRIP_BY_TRIP_ID}${trip.tripId}`);
    logTime("tridetial ended>>>>>>>>>>>>");
    //console.log("trip",trip)
    // console.log("response from tripdetail api", userLoginRes);
    console.log("userlogin", userLoginRes)
    let customerData = {};
    let start_location = [];

    console.log("userLoginRes.customerId>>>>>>>>>>>>>>>>>>>>>>>>", userLoginRes.customerId)

    // logTime("custoere api started");
    customerData = await getCustomerById(trip.tripId);
    //    logTime("custoere api ended>>>>>>>>>>>>>>");


    //  console.log("custoemrdata>>>>>>>>>>>>>>>>>>>",customerData)
    //console.log("customer",userLoginRes.customerId);
    logTime("StartEndLocation");
      await StartEndLocation(userLoginRes);
  
    logTime("StartEndLocation ended>>>>>>>>>>>>>>>")
    // loaderStore.setIsLoading(false);
    // console.log("trip from action",trip )
    return {
      ...trip,
      ...userLoginRes,
      customerData,
    }; // }
  } catch (error) {
    console.log(error, "ERROR----getTripByTripID");
    showError("Trip information not found.");
    loaderStore.setIsLoading(false);
    // if (error.message) {
    //   Alert.alert(error.message);
    // } else {
    //   Alert.alert(error?.msg);
    // }
    loaderStore.setIsLoading(false);
    return Promise.reject(error);
  }
}
export async function getCustomerById(id) {
  try {
    console.log("passing id", id)

    var C_id = id == null ? 1 : id;

    console.log("id from customer", C_id)
    //var trip_id = tripStore.selectedTrip.tripId;

    //console.log("id",id)
    // const customerID = await apiGet(`${GET_CUSTOMER_BY_ID}${C_id}`);

    const customerID = await apiGet(`${GET_CUSTOMER_BY_ID}${C_id}`);


    console.log('customerId', customerID);
    if (customerID.data == null) {
      return;
    }
    else {
      loaderStore.setIsLoading(false);
      return Promise.resolve(customerID.data.jsonData);
    }


  } catch (error) {
    loaderStore.setIsLoading(false);
    console.log(error, "ERROR----getCustomerById");
    showError("Customer details not found.");
    return {};
  }
}
export async function updateTripStatus(body) {
  try {
    loaderStore.setIsLoading(true);
    console.log("body for update tripstatus", body);
    const tripStatus = await apiPost(UPDATE_TRIP_STATUS, body);
    console.log("tripStatus", tripStatus);
    console.log(
      "🚀 ~ file: TripActions.js:113 ~ updateTripStatus ~ tripStatus:",
      tripStatus
    );
    // await getTripList();

    // await getTripByTripID({ tripId: body.tripId });
    // loaderStore.setIsLoading(false);
    // showSuccess("Trip status updated");
    return Promise.resolve(tripStatus);
  } catch (error) {
    loaderStore.setIsLoading(false);

    showError(error.data.message);

    return Promise.reject(error);
  }
}
export async function getTotalBata() {
  try {
    loaderStore.setIsLoading(true);
    var auth = await getAuthData();
    id = authStore.driverData.driverId;
    const totalBata = await apiGet(`${GET_TOTAL_BATA}${id}`);
    loaderStore.setIsLoading(false);
    return Promise.resolve(totalBata);
  } catch (error) {
    loaderStore.setIsLoading(false);
    console.log(error, "ERROR----getTotalBata");
    if (error.message == null) {
      showError("Bata not found.");
    } else {
      // Alert.alert(error?.msg);
    }
    return error;
  }
}
export async function createCompleteTrip(data) {
  logTime("touchong cretecompleter tripmetod")

  try {
    logTime("await getItem(selectedTrip in cretecompltetrip")
    const selected_trip = await getItem("selectedTrip");
    logTime("ended>>>>>>>>>await getItem(selectedTrip in cretecompltetrip")
    //const selected_trip = tripStore.selectedTrip;


    var startDate = "";
    // var startDate = "2022-11-15 10:16:00";
    logTime("await tripDetails api in cretecompltetrip")
    const tripDetails = await apiGet(
      `${GET_TRIP_BY_TRIP_ID}${selected_trip.tripId}`
    )
      .then((res) => {
        logTime("ended>>>>>>>>await tripDetails api in cretecompltetrip")
        //console.log("res from tripaction",res)
        return res;
      })
      .catch((err) => console.log("error", err));

    startDate = tripDetails?.onwardActualStartTime;
    if (startDate === "" || startDate === null) {
      startDate = await getItem("selectedTripStartDate");
      console.log("startdate", startDate)
    } else {
      startDate = tripDetails?.onwardActualStartTime;
    }

    const {
      odometer,
      Endodometer,
      fuelmeter,
      EndFuelmeter,
      selfie,
      EndSelfie,
      EndFeedback,
    } = imageStore;
    const driverData = authStore.driverData;

    var __startTime = moment(
      dateFormate(getString(selected_trip.onwardStartTime)),
      "YYYY-MM-DD HH:mm:ss"
    ).format();
    var __endTime = moment(
      dateFormate(getString(selected_trip.onwardEndTime)),
      "YYYY-MM-DD HH:mm:ss"
    ).format();
    var __ActualstartTime = moment(startDate).format();
    var __ActualendTime = moment().format();
    var __Actualduration = moment.duration(
      moment(__ActualendTime).diff(__ActualstartTime)
    );
    var __Actualhours = __Actualduration.asHours();
    console.log(__Actualhours);
    const actualUnit =
      selected_trip.bataType === null
        ? "hours"
        : getString(selected_trip.bataType).toLowerCase() === "time"
          ? "hours"
          : "kms";
    var __duration = moment.duration(moment(__endTime).diff(__startTime));
    var __hours = __duration.asHours();
    var body = {};
    console.log(__hours);

    if (data === "feedback") {
      body = {
        plannedTripRun: getNumber(tripStore?.selectedTrip?.totalDistance),
        plannedTripAmount: getNumber(
          tripStore?.selectedTrip?.plannedBataAmount
        ),
        plannedTripUnit: actualUnit,
        plannedTripStartDate: dateFormate(
          getString(selected_trip.onwardStartTime)
        ),
        plannedTripStartTime: dateFormate(
          getString(selected_trip.onwardStartTime)
        ),
        //plannedTripEndDate: dateFormate(getString(selected_trip.onwardEndTime)),
        plannedTripEndDate: (selected_trip.onwardEndTime !== null ? dateFormate(getString(selected_trip.onwardEndTime)) : null),
        //plannedTripEndTime: dateFormate(getString(selected_trip.onwardEndTime)),
        plannedTripEndTime: (selected_trip.onwardEndTime !== null ? dateFormate(getString(selected_trip.onwardEndTime)) : null),
        actualTripTripRun: getNumber(tripStore.selectedTrip.totalDistance),
        actualTripAmount: 0,
        actualTripUnit: actualUnit,
        actualTripStartDate: startDate,
        actualTripStartTime: startDate,
        actualTripEndDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        actualTripEndTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        driverFirstName: getString(driverData?.firstName),
        driverMiddleName: getString(driverData?.middleName),
        driverLastName: getString(driverData?.lastName),
        driverId: getNumber(selected_trip.driverId),
        tripId: getNumber(selected_trip.tripId),
        uuId: selected_trip.uuid,
        tripType: getString(selected_trip.category),
        customerId: getNumber(selected_trip.customerId),
        customerName: getString(selected_trip?.customerData?.name),
        customerAddress: getString(selected_trip?.customerData?.address),
        customerPhone: getString(selected_trip?.customerData?.phone),
        orgId: getNumber(driverData.orgId),
        currencyId: getNumber(driverData.currencyId),
        currencyName: driverData?.currencyName,
        currencySymbol: driverData?.currency,
        startLat: getFloat(selected_trip.startLat),
        startLong: getFloat(selected_trip.startLong),
        endLat: getFloat(selected_trip.endLat),
        endLong: getFloat(selected_trip.endLong),
        startBaseLoacation: getString(selected_trip.startLocation),
        endBaseLoacation: getString(selected_trip.endLocation),

        tripStartOdoMeterReading: getNumber(
          selected_trip.completeTripData.tripStartOdoMeterReading
        ),
        tripStartFuelMeterReading: getFuel(
          selected_trip.completeTripData.tripStartFuelMeterReading
        ),
        tripStartPoint: getString(selected_trip.startLocation),

        tripStartOdoMeterImage:
          selected_trip.completeTripData.tripStartOdoMeterImage,
        tripStartFuelMeterImage:
          selected_trip.completeTripData.tripStartFuelMeterImage,
        tripStartDriverSelfieImage:
          selected_trip.completeTripData.tripStartDriverSelfieImage,

        tripEndFuelMeterReading: getFuel(
          selected_trip.completeTripData.tripEndFuelMeterReading
        ),
        tripEndOdoMeterReading: getNumber(
          selected_trip.completeTripData.tripEndOdoMeterReading
        ),
        tripEndPoint: getString(selected_trip.endLocation),
        tripEndOdoMeterImage:
          selected_trip.completeTripData.tripEndOdoMeterImage,
        tripEndFuelMeterImage:
          selected_trip.completeTripData.tripEndFuelMeterImage,
        tripEndDriverSelfieImage:
          selected_trip.completeTripData.tripEndDriverSelfieImage,

        tripEndRating: feedbackStore.EndFeedback.rating,
        tripEndFeedback: feedbackStore.EndFeedback.feedback,
        tripEndReview: feedbackStore.EndFeedback.review,

        insertedBy: getNumber(driverData.driverId),
        lastUpdatedBy: null,
        deletedBy: null,
        tripName: getString(selected_trip.tripName),
        vehicleModel:
          getString(selected_trip.vehicleModel) === ""
            ? "Tata Nexon"
            : getString(selected_trip.vehicleModel),
        vehicleType: getString(selected_trip.vehicleType),
        vehicleRegistrationNumber: getString(selected_trip.licensePlate),
        orgName: getString(driverData?.orgName),
        insertedOn: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
        advanceAmountDriver: getNumber(tripStore.selectedTrip?.advanceAmount),
       //advanceReceivedByCustomer: tripStore?.advanceAmountByCustomer,

         advanceReceivedByCustomer:  await getItem("amountReceivedFRomCustomer"),
        isReccuring: selected_trip.isRecurring,
        bataPaymentStatus: "UnPaid",
        manufacturer: "",
        averageSpeed: getAvgSpeed(),
        highestSpeed: getAvgSpeed(),

        totalDistanceTravelled: getFloat(tripDetails?.travelDistance),
        //totalDistanceTravelled: 12,
        totalTimeTaken: getFloat(__Actualhours),
        inStationOutStation: imageStore.InStationChecked.verified ? "in station" : "out station",
        // inStationOutStation:
        //   getString(selected_trip.inStationOutStation) === ""
        //     ? "instation"
        //     : getString(selected_trip.inStationOutStation),
        bataType: "",
      };
    } else {
      logTime("crating bodhy for api  api in cretecompltetrip")
      body = {
        plannedTripRun: getNumber(tripStore?.selectedTrip?.totalDistance),
        plannedTripAmount: getNumber(
          tripStore?.selectedTrip?.plannedBataAmount
        ),
        plannedTripUnit: actualUnit,
        plannedTripStartDate: dateFormate(
          getString(selected_trip.onwardStartTime)
        ),
        plannedTripStartTime: dateFormate(
          getString(selected_trip.onwardStartTime)
        ),
        plannedTripEndDate: (selected_trip.onwardEndTime !== null ? dateFormate(getString(selected_trip.onwardEndTime)) : null),
        //plannedTripEndTime: dateFormate(getString(selected_trip.onwardEndTime)),
        plannedTripEndTime: (selected_trip.onwardEndTime !== null ? dateFormate(getString(selected_trip.onwardEndTime)) : null),
        actualTripTripRun: getNumber(tripStore.selectedTrip.totalDistance),
        actualTripAmount: 0,
        actualTripUnit: actualUnit,
        actualTripStartDate: startDate,
        actualTripStartTime: startDate,
        actualTripEndDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        actualTripEndTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        driverFirstName: getString(driverData?.firstName),
        driverMiddleName: getString(driverData?.middleName),
        driverLastName: getString(driverData?.lastName),
        driverId: getNumber(selected_trip.driverId),
        tripId: getNumber(selected_trip.tripId),
        uuId: selected_trip.uuid,
        tripType: getString(selected_trip.category),
        customerId: getNumber(selected_trip.customerId),
        customerName: getString(selected_trip?.customerData?.name),
        customerAddress: getString(selected_trip?.customerData?.address),
        customerPhone: getString(selected_trip?.customerData?.phone),
        orgId: getNumber(driverData.orgId),
        currencyId: getNumber(driverData.currencyId),
        currencyName: driverData?.currencyName,
        currencySymbol: driverData?.currency,
        startLat: getFloat(selected_trip.startLat),
        startLong: getFloat(selected_trip.startLong),
        endLat: getFloat(selected_trip.endLat),
        endLong: getFloat(selected_trip.endLong),
        startBaseLoacation: getString(selected_trip.startLocation),
        endBaseLoacation: getString(selected_trip.endLocation),

        tripStartOdoMeterReading: getNumber(odometer.value),
        tripStartFuelMeterReading: getFuel(fuelmeter.value),
        tripStartPoint: getString(selected_trip.startLocation),

        tripStartOdoMeterImage: odometer.image,
        tripStartFuelMeterImage: fuelmeter.image,
        tripStartDriverSelfieImage: selfie.image,

        tripEndFuelMeterReading: getFuel(EndFuelmeter.value),
        tripEndOdoMeterReading: getNumber(Endodometer.value),
        tripEndPoint: getString(selected_trip.endLocation),
        tripEndOdoMeterImage: Endodometer.image,
        tripEndFuelMeterImage: EndFuelmeter.image,
        tripEndDriverSelfieImage: EndSelfie.image,

        tripEndRating: EndFeedback.rating,
        tripEndFeedback: EndFeedback.feedback,
        tripEndReview: EndFeedback.review,

        insertedBy: getNumber(driverData.driverId),
        lastUpdatedBy: null,
        deletedBy: null,
        tripName: getString(selected_trip.tripName),
        vehicleModel:
          getString(selected_trip.vehicleModel) === ""
            ? "Tata Nexon"
            : getString(selected_trip.vehicleModel),
        vehicleType: getString(selected_trip.vehicleType),
        vehicleRegistrationNumber: getString(selected_trip.licensePlate),
        orgName: getString(driverData?.orgName),
        insertedOn: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
        advanceAmountDriver: getNumber(tripStore.selectedTrip?.advanceAmount),

        //advanceReceivedByCustomer: tripStore?.advanceAmountByCustomer,
        advanceReceivedByCustomer:  await getItem("amountReceivedFRomCustomer"),
        isReccuring: selected_trip.isRecurring,
        bataPaymentStatus: "UnPaid",
        manufacturer: "",
        averageSpeed: getAvgSpeed(),
        highestSpeed: getAvgSpeed(),

        totalDistanceTravelled: getFloat(tripDetails?.travelDistance),
        //totalDistanceTravelled: 12,
        totalTimeTaken: getFloat(__Actualhours),
        inStationOutStation: imageStore.InStationChecked.verified ? "in station" : "out station",
        // {inStationChecked ? imageStore.setInStationChecked(true):imageStore.setInStationChecked(false)}
        // inStationOutStation:

        //   getString(selected_trip.inStationOutStation) === ""
        //     ? "instation"
        //     : getString(selected_trip.inStationOutStation),
        bataType: "",
      };
      logTime("ended>>>>>>>> cretaed for api in cretecompltetrip")
    }



    console.log("create complete trip0->>>>>>>>>>>>>>>>>>>>>>>", body);
    //var inputAdvanceReceivedByCustomer=body.advanceReceivedByCustomer;
    // var inputAdvanceReceivedByCustomer=await getItem("amountReceivedFRomCustomer")
    // var amountReceived = parseFloat(inputAdvanceReceivedByCustomer);
    // console.log("input _advanceReceivedByCustomer 1st",amountReceived)

    // // console.log("body from tripaction for complete trip", body);
    // var requestTime = new Date().getTime();
    // console.log("requestTime",requestTime);

    logTime("await CREATE_TRIP api in cretecompltetrip")
    var createdTrip = await apiPost(CREATE_TRIP, body);
    logTime("ended CREATE_TRIP api in cretecompltetrip")


    console.log(createdTrip, "createCompleteTrip");
    console.log("createCompleteTrip_status", createdTrip.status);

    // if(createdTrip.status){

    //   var outputAdvanceReceivedByCustomer=createdTrip.data.jsonData.advanceReceivedByCustomer;
    //   console.log(" output_AdvanceReceivedByCustomer",outputAdvanceReceivedByCustomer)
    //   console.log("input _advanceReceivedByCustomer",amountReceived)
    //   // if (input_advanceReceivedByCustomer.AdvanceReceivedByCustomer > 0 && input_advanceReceivedByCustomer.AdvanceReceivedByCustomer === output_AdvanceReceivedByCustomer.advanceReceivedByCustomer) {
    //     if (amountReceived > 0) {
    //      console.log("compariosn needed")
    //      var responseTime=new Date().getTime();
    //      console.log("responseTime",responseTime);


    //      const timeTaken = responseTime - requestTime;


    //      const timeTakenSeconds = Math.floor(timeTaken / 1000);
    //     // console.log("timeTaken for end tripin seconds  ", timeTakenSeconds);
    //      const eventParams = {
    //        timeTakenSeconds: timeTakenSeconds

    //      };
    //      //console.log("tripstore.selectrip from tripdetail after end",props.route.params.trip.uuid);


    //       logCustomEvent(`Am_${selected_trip.uuid}_${timeTakenSeconds}`);


    //   }
    //   else{

    //     console.log("not grater")
    //   }
    // }

    if (data !== "startDocuments") {
      tripStore.setAdvanceAmount(0);
      imageStore.resetAllImage();
      //console.log("consolng from ")
      // showSuccess("Trip completed");
      tripStore.setPlannedTripRun(0);
      tripStore.setActualTripTripRun(0);
      //await getTotalDistance();
      // await getTripList();
      logTime("create trip ended>>>>>>>>>>>")
      return Promise.resolve(createdTrip);
    }

  } catch (error) {
    console.log(error, "ERROR----createCompleteTrip");
    showError("Something wents wrong while completing trip.");
    // if (error.message !== null) {
    //   Alert.alert("Something went wrong!", error.message);
    // } else {
    //   Alert.alert(error?.msg);
    // }
    return Promise.reject(error);
  }
}
export async function getBataTripByTripID(id) {
  try {
    loaderStore.setIsLoading(true);
    logTime("getBataTripByTripID compledeta")
    const trip = await apiGet(`${BATA_GET_TRIP_BY_TRIP_ID}${id}`);
    logTime(" end getBataTripByTripID compledeta")
    //console.log("trip from bata", trip);
    if (trip.status === true) {
      loaderStore.setIsLoading(false);
      return Promise.resolve(trip.data.jsonData);
    } else {
      loaderStore.setIsLoading(false);
      throw trip;
    }
  } catch (error) {
    loaderStore.setIsLoading(false);
    console.log(error, "ERROR-----getBataTripByTripID");
    // showError("");
    // if (error.message == null) {
    //   Alert.alert("Something went wrong!", "Completed trip details not found");
    //   loaderStore.setIsLoading(false);
    // } else {
    //   Alert.alert(error?.msg);
    // }
    return error;
  }
}
export async function addNote(note, noteTitle) {
  loaderStore.setIsLoading(true);
  try {
    const { tripId } = tripStore.selectedTrip;
    const { orgId, orgName } = authStore.driverData;
    var body = {
      note: note,
      noteTitle: noteTitle,
      tripId: tripId,
      orgId: orgId,
      orgName: orgName,
      isEnabled: true,
      isDeleted: false,
      insertedBy: 0,
      insertedOn: dateFormate(Date.now()),
      lastUpdatedBy: 0,
      lastUpdatedOn: null,
      deletedBy: 0,
      deletedOn: null,
      NoteType :'Driver Note'
    };
    console.log("body for addnote", body)
    var data = await apiPost(ADD_NOTE, body);
    loaderStore.setIsLoading(false);
    return data;
  } catch (error) {
    loaderStore.setIsLoading(false);
    showError("Something wents wrong while adding note");
    console.log("error", error);
  }
}
export async function getTripTrack(tripId, onwardStartTime, onwardEndTime, vehicleId, deviceId, screen) {
  try {



    const formatonwardStartTime = moment(onwardStartTime).format("YYYY-MM-DD") + " 00:00:00";
    const formatonwardEndTime = moment(onwardEndTime).format("YYYY-MM-DD") + " 23:59:59";



    var trackInput = { id: vehicleId, fromTime: formatonwardStartTime, toTime: formatonwardEndTime, tripId: tripId }





    console.log("trackInput",trackInput)





    // Fetch data
    const data = await apiPost(GET_TRACK, trackInput);
    console.log("data from track",data)
    
    if (!data?.list?.length) {
      showError("track not found");
      return { list: [], remainingDistance: 0 };
    }
    
    
  else{
    const mappedData = data.list.map(ele => ({
      ...ele,
      latitude: ele.lattitude,
      longitude: ele.longitude,
    }));

    if (screen === "tripdetails") {
      // For trip details, return data without additional distance calculation
      return { list: mappedData, remainingDistance: 0 };
    }
    else {
      // Fetch additional trip detail for other screens
      console.log("tripsweeewtrackk")
      const tripDetail = await apiGet(GET_TRIP_BY_TRIP_ID + tripId);
      const remainingDistance = getFloat(tripDetail?.remainingDistance || 0);

      return { list: mappedData, remainingDistance };
    }

  }









  } catch (error) {
    console.log("error in getTripTrack", error);
    showError("something went wrong while fetching your location")
    return { list: [], remainingDistance: 0 };
  }
}
export async function getVehicleTrack(tripData) {
  try {
    const { tripId, onwardStartTime, onwardEndTime, vehicleId, deviceId } =
      tripData;
    // {"id":10476,"fromTime":"2024-11-22 00:00:00","toTime":"2024-11-22 23:59:00","tripId":32072}
    // console.log("authStore.driverData", toJS(authStore.driverData));
    let body = {
      fromTime: moment().format("YYYY-MM-DD") + " " + "00:00:55",
      id: vehicleId,
      isFromScheduler: false,
      tripId: tripId,
    };

    console.log("🚀 ~ file: TripActions.js:524 ~ getVehicleTrack ~ body", body);
    var data = await apiPost(GET_TRACK_VEHICLE, body);
    var distanceFromTripDetail = await apiGet(GET_TRIP_BY_TRIP_ID + tripId);
    const NewDistance = getFloat(distanceFromTripDetail?.remainingDistance);

    if (data.success) {
      var newPath = data?.list;
      return { list: newPath, remainingDistance: NewDistance };
    } else return [];
  } catch (error) {
    // console.log("error", error);
    return [];
  }
}
export async function getNotes(id) {
  try {
    logTime("getNotes started")
    const { tripId } = tripStore.selectedTrip;
    var data = await apiGet(`${GET_NOTE}${id}`);
    logTime("getNotes ended")

    console.log("data", data)
    return data;
  } catch (error) {
    console.log("error->>>getNotes", error);
  }
}
export async function getAdvByTripId(id) {
  try {
    var advData = await apiGet(`${GET_ADV_AMOUNT_BY_T_ID}${id}`);
    console.log("advData from getAdvByTripId>>>>>>", advData.advanceAmount);
    var advCustomer = await apiGet(`${CUSTOMER_AMOUNT}${id}`);
     console.log("advCustomer", advCustomer);
    return {
      customerAmount: advCustomer?.data?.jsonData,
      customerAmountDetails: advCustomer?.customerAmountDetail?.detail,
      advanceAmount: advData.advanceAmount,
    };
  } catch (error) {
    loaderStore.setIsLoading(false);
    console.log(error, "ERROR-----getAdvByTripId");
    return { customerAmount: 0, advanceAmount: 0 };
  }
}



export async function getpermitdetails(vehicleId) {
  try {
    console.log("vehicle id from tripaction", vehicleId);

    var permit = await apiGet(`${GET_PERMITS_DETAILS}${vehicleId}`);
    //var permit = await apiGet(`${GET_PERMITS_DETAILS}${9741}`);
    console.log("vehicle id from tripaction", vehicleId);

    //console.log("from trip action permitstore",perm)

    //console.log("vehicleid from tripaction",vehicleId)
    console.log("permit response from tripaction", permit);
    return permit;
  } catch (error) {
    console.log(error, "ERROR-----getpermitdetials from tripaction");
  }
}

export async function getOtp(requestData) {
  try {
    console.log("otp requestData", requestData);
    var otp = await apiPost(GET_OTP, requestData);
    console.log("otp from tripaction", otp);

    return otp;
  } catch (error) {
    console.log(error, "ERROR-----getOtp from tripAction");
  }
}

export async function postOtpValidated(requestData) {
  try {
    console.log("request body for postOtpValidatedtripaction", requestData);
    var message = await apiPost(POST_OTP_VALIDATED, requestData);
    console.log("otp from tripaction", message);

    return message;
  } catch (error) {
    console.log(error, "ERROR-----postOtpValidated from tripAction");
  }
}

export async function postFeedback(requestBody) {
  try {
    //loaderStore.setIsLoading(true);
    console.log("request body for starfeedback", requestBody);
    //console.log("from tripaction for otp")
    var responseMsg = await apiPost(POST_FEEDBACK, requestBody);

    console.log("responseMsg from postfedback in tripaction", responseMsg);

    return responseMsg;
  } catch (error) {
    console.log(error, "ERROR-----postFeedbacks from tripAction");
  }
}

export async function uploadSignature(signature,latitude,longitude,screen,tripId) {
  try {

    let userData = await AsyncStorage.getItem("authData");
    let userId = null;
  //   const tripId=tripStore.selectedTrip.tripId;
  //  console.log("tripId,",tripId)

    
    if (userData) {
      userData = JSON.parse(userData);
      userId = userData?.user_id || null;
    }
    
    
    
    //console.log("from uploadSignature in Authaction ",signature)
    const requestBody = {
      base64String: signature,
      tripId:tripId,
      userId: userId || "",
      driverId :userData?.userDetail?.driverId || "",
    orgId: userData?.userDetail?.orgId || "",
    source: "DMA",
    timeStamp: Date.now(),
    screen:screen|| "",
     lat:latitude||"NA",
     lng: longitude||"NA"

    };
    console.log("requestBody:signature>>>>>>>>>>>>.",requestBody)
    var uploadedUrl = await apiPost(UPLOAD_SIGNATURE, requestBody);
    console.log("return url", uploadedUrl);
    return uploadedUrl;
  } catch (error) {
    console.log(error, "ERROR---- in uploadSignature from tripaction ");

    return Promise.reject(error);
  }
}

export async function postSignature(requestData) {
  try {
    //console.log("from uploadSignature in Authaction ",signature)

    var responseMsg = await apiPost(POST_SIGNATURE, requestData);
    console.log("responseMsg", responseMsg);
    return responseMsg;
  } catch (error) {
    console.log(error, "ERROR---- in postSignature from tripaction ");

    return Promise.reject(error);
  }
}

export async function postUuid(requestData) {
  try {
    console.log("request body for postUuidtripaction", requestData);
    var message = await apiPost(POST_UUID, requestData);
    console.log("uuid from tripaction", message);

    return message;
  } catch (error) {
    console.log(error, "ERROR--postUuid from tripAction");
  }
}

export async function getRecentTripList() {
  try {
    const todayStart = moment().startOf("day").format("YYYY-MM-DD HH:mm:ss");
    const todayEnd = moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");
    const auth = await getAuthData();

    const requestData = {
      id: auth?.driver_id,
      fromTime: todayStart,
      toTime: todayEnd,
    };

    const response = await apiPost(GET_RECENT_TRIP, requestData);

    const pendingTrip = response.filter((e) => e.status === tripTypes[1]);

    const pendingTripCount =
      pendingTrip.length > 100 ? "99+" : pendingTrip.length;

    return { recentTripList: response, pendingTripCount, pendingTrip };
  } catch (error) {
    return { recentTripList: [], pendingTripCount: 0, pendingTrip: [] };
  }
}

export async function checkMandatoryValidation(requestData) {
  try {
    console.log("requestdata", requestData);

    var reponse = await apiPost(CHECK_MANDATORY_VALIDATION, requestData);

    return reponse.message;
  } catch (error) {
    console.log(
      error.data.message,
      "ERROR--checkMandatoryValidation from tripAction"
    );
    return error.data.message;
  }
}

export async function getDeviceStatus(requestBody) {
  try {
    console.log("requestbody fpr device status", requestBody)
    var deviceStatus = await apiPost(GET_DEVICE_STATUS, requestBody);
    console.log("deviceStatus", deviceStatus);
    return deviceStatus;
  } catch (error) {
    console.log(error, "ERROR---- in getDeviceStatus from tripaction ");

    return Promise.reject(error);
  }
}

export async function postLocationData(locationData) {

  // id,
  // lat,
  // lon,
  // timestamp,
  // speed,
  // driverId,
  // tripId,
  // batt
  // ) {
  try {
    //console.log("from uploadSignature in Authaction ",signature)


    // uuid: uniqueId,
    // latitude: coords.latitude,
    // longitude: coords.longitude,
    // speed: coords.speed,
    // altitude: coords.altitude,
    // heading: coords.heading,
    // batteryPercentage: (level * 100).toFixed(2),
    // timestamp: timestamp,

    console.log("from>>>>>>postLocationData")
    console.log("locationData from postloctiondata", locationData)

    //  let driverId=tripStore.selectedTrip.driverId;
    //  let tripId=tripStore.selectedTrip.tripId;
    var trip = await getItem("selectedTrip");
    let driverId = trip.driverId;
    let tripId = trip.tripId;

    const params = {
      id: locationData.uuid,
      lat: locationData.latitude,
      lon: locationData.longitude,
      timestamp: locationData.timestamp,
      // altitude: '224.0',
      speed: locationData.speed,
      driverId: driverId,
      tripId: tripId,
      batt: locationData.batteryPercentage,
    };
    console.log("params", params)
    const queryString = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&");

    const baseUrl = POST_LOCATION_DATA;

    const apiUrl = `${baseUrl}?${queryString}`;
    console.log("apiurl", apiUrl);

    await axios.post(apiUrl);

    return apiUrl;
  } catch (error) {
    console.log(error, "ERROR in postLocationData");
    return Promise.reject(error);
  }
}

export async function postBackgroundLocation(
  id,
  lat,
  lon,
  timestamp,
  speed,
  driverId,
  batt
) {
  try {
    //console.log("from uploadSignature in Authaction ",signature)
    const params = {
      id: id,
      lat: lat,
      lon: lon,
      timestamp: timestamp,
      // altitude: '224.0',
      speed: speed,
      driverId: driverId,
      batt: batt,
    };

    const queryString = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&");

    const baseUrl = POST_LOCATION_DATA;

    const apiUrl = `${baseUrl}?${queryString}`;
    console.log("apiurl", apiUrl);

    await axios.post(apiUrl);

    return apiUrl;
  } catch (error) {
    console.log(error, "ERROR in postBAckgroundData");
    return Promise.reject(error);
  }
}
export async function postGcm(requestData) {
  try {


    console.log("request body for postGcm", requestData);
    var message = await apiPost(POST_GCM_DETAILS, requestData);
    console.log("message from postGcm", message);

    return message;
  } catch (error) {
    console.log(error, "ERROR--postGcm from tripAction");
  }
}
//  export async function getCustomizedScreen() {
//   try {
//     console.log("fromgetCustomizedScreen ")
//     const response = await fetch('http://localhost:7149/api/customization');
//     consoel.log("response from getCustomisedscreen",response)
//     const jsonData = await response.json();
//     console.log("fields from getCustomizedScreen",jsonData)

//    return jsonData;
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }

// }

export async function getOrgLevelSettings() {
  try {
    var orgLevelSettings = await apiGet(`${GET_ORG_LEVEL_SETTINGS}${authStore?.driverData?.orgId}`);
    return orgLevelSettings;
  } catch (error) {
    console.log(error, "ERROR---- getting orglevel settings  ");
    return Promise.reject(error);
  }
}