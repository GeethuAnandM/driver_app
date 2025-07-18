import moment from "moment";
import { Alert } from "react-native";
import { addExpense } from "../../Store/AuthStore/AddExpense";
import { authStore } from "../../Store/AuthStore/AuthStore";
import { expenseStore } from "../../Store/AuthStore/ExpenseStore";
import { loaderStore } from "../../Store/AuthStore/LoaderStore";
import { tripStore } from "../../Store/AuthStore/TripStore";
import { showError, showSuccess, sortByDate } from "../../Utils/helper";
import { apiDelete, apiGet, apiPost, apiPut } from "../apiCalls";
import {
  CREATE_EXPENSE,
  DELETE_EXPENSE_BY_ID,
  GET_ALL_EXPENSE_TYPE,
  GET_EXPENSE_BY_DRIVER_ID,
  GET_EXPENSE_BY_ID,
  GET_EXPENSE_BY_TRIPID,
  GET_EXPENSE_TYPE_BY_ID,
  UPDATE_EXPENSE,
} from "../urls";

export async function getExpenseTypes() {
  try {
    console.log("---------?");
    const expenseTypes = await apiGet(GET_ALL_EXPENSE_TYPE);
    //console.log("expense types",expenseTypes.data.jsonData);
    if (expenseTypes.status) {
      expenseStore.setExpenseTypes(expenseTypes.data.jsonData);
      loaderStore.setIsLoading(false);
      return expenseTypes;
    } else {
      loaderStore.setIsLoading(false);
      return {};
    }
  } catch (error) {
    loaderStore.setIsLoading(false);
    console.log(error, "ERROR----getExpenseTypes");
    return Promise.reject(error);
  }
}
export async function CreateExpenseforTrip(expData,type ) {
  try {
    console.log("expData from expenseaction",expData)
    const { selectedTrip } = tripStore;
    const body = {
      tripName: expData?.trip?.tripName,
      driverFirstName: authStore?.driverData?.firstName,
      driverMiddleName: authStore?.driverData?.middleName,
      driverLastName: authStore?.driverData?.lastName,

      expenseDate: moment().format("YYYY-MM-DD HH:mm:ss"),
     // {item[0]?.subType
      //expenseTypeId: expData.expenseType[0]?.typeId,
      expenseTypeId:type=="tripScreen"? expData.expenseType.typeId:expData.expenseType[0]?.typeId,
      //expenseTypeId:expData.expenseType[0].typeId,
      amount: expData.amount,
      expenseTypeName:type=="tripScreen"? expData?.expenseType.typeName:expData?.expenseType[0]?.typeName,
      //expenseTypeName: expData?.expenseType[0]?.typeName,
      reference: `${Math.floor(Math.random() * 101)}`,
      description: expData.title,
      expenseTitle: expData.title,
      tripId: expData?.trip?.tripId,
      currencyId: expData?.trip?.currencyId ? expData?.trip?.currencyId : 1,
      currencyName: expData?.trip?.currencyName,
      currencySymbol: expData?.trip?.currencySymbol,
      imageUrl1: expData?.picture?.path ? expData.picture.path : "",
      orgId: authStore?.driverData?.orgId,
      orgName: authStore?.driverData?.orgName,
      insertedBy: authStore.driverData.driverId,
      DeviceId: authStore?.driverData?.driverId,
      insertedOn: moment().format("YYYY-MM-DD HH:mm:ss"),
      UuId: expData?.trip?.uuid,
      subType:type=="tripScreen"? expData?.expenseType.subType: expData?.expenseType[0].subType,
      // subType: expData?.expenseType[0].subType,
      insertedBy: authStore?.driverData?.driverId,
    };
    console.log("body exp=>>>>", body);
    const createdExp = await apiPost(CREATE_EXPENSE, body);
    if (createdExp.status) {
      loaderStore.setIsLoading(false);
      await getExpenseByDriverID();
      return createdExp;
    }
    loaderStore.setIsLoading(false);
  } catch (error) {
    loaderStore.setIsLoading(false);
    console.log(error, "ERROR----CreateExpenseforTrip");
    if (error.message) {
      showError(error.message);
    } else {
      showError(error?.msg);
    }
    return Promise.reject(error);
  }
}
export async function getExpenseforTrip(tripID) {
  try {
    loaderStore.setIsLoading(true);
    //loaderStore.setIsLoading(true);
    const expData = await apiGet(`${GET_EXPENSE_BY_TRIPID}${tripID}`);
    if (expData?.status) {
      loaderStore.setIsLoading(false);
      expenseStore.setDriverSelectedExpense(expData.data.jsonData);

      return expData.data.jsonData;
    }
    expenseStore.setDriverSelectedExpense([]);
    return [];
  } catch (error) {
    loaderStore.setIsLoading(false);
    console.log(error, "ERROR----getExpenseforTrip");
    // if (error.message) {
    //   Alert.alert(error.message);
    // } else {
    //   Alert.alert(error?.msg);
    // }
    // return Promise.reject(error);
    return error;
  }
}
export async function deleteExpenseById(exp) {
  try {
    loaderStore.setIsLoading(true);
    const expData = await apiDelete(`${DELETE_EXPENSE_BY_ID}${exp.expenseId}`);
    if (expData?.status) {
      // await getExpenseforTrip(exp.tripId);
      await getExpenseByDriverID();
      showSuccess(expData.message);
      loaderStore.setIsLoading(false);
      return expData;
    }
    return [];
  } catch (error) {
    loaderStore.setIsLoading(false);
    console.log(error, "ERROR----deleteExpenseById");
    return error;
  }
}
export async function getExpenseByDriverID(id) {
  try {
    var driverId = id !== undefined ? id : authStore.driverData.driverId;
    loaderStore.setIsLoading(true);
    //loaderStore.setIsLoading(true);
    const expData = await apiGet(`${GET_EXPENSE_BY_DRIVER_ID}${driverId}`);

    if (expData?.status) {
      var data = sortByDate(expData?.data?.jsonData);
      expenseStore.setDriverExpense(data);
      //loaderStore.setIsLoading(false);
      return expData.data.jsonData;
    } else {
      expenseStore.setDriverExpense([]);
      return [];
    }
  } catch (error) {
    loaderStore.setIsLoading(false);
    console.log(error, "ERROR----getExpenseByDriverID");
    // if (error.message) {
    //   Alert.alert(error.message);
    // } else {
    //   Alert.alert(error?.msg);
    // }
    // return Promise.reject(error);
    return error;
  }
}
export async function getExpenseByID(Id) {
  try {
    loaderStore.setIsLoading(true);
    //loaderStore.setIsLoading(true);
    const expData = await apiGet(`${GET_EXPENSE_BY_ID}${Id}`);
    if (expData?.status) {
      var driverId = authStore.driverData.driverId;

      getExpenseByDriverID();
      loaderStore.setIsLoading(false);
      return expData.data.jsonData;
    }
    return [];
  } catch (error) {
    loaderStore.setIsLoading(false);
    console.log(error, "ERROR----getExpenseByDriverID");
    // if (error.message) {
    //   Alert.alert(error.message);
    // } else {
    //   Alert.alert(error?.msg);
    // }
    // return Promise.reject(error);
    return error;
  }
}
export async function updateExpense(exp) {
  try {
    loaderStore.setIsLoading(true);
    const expData = await apiPut(UPDATE_EXPENSE, exp);
    if (expData?.status) {
      // expenseStore.setDriverExpense(expData.data.jsonData);
      await getExpenseByDriverID();
      // await getExpenseforTrip(expData.data.jsonData.tripId).then((res) => {});
      return expData.data.jsonData;
    }
    return [];
  } catch (error) {
    loaderStore.setIsLoading(false);
    console.log(error, "ERROR----getExpenseByDriverID");
    // if (error.message) {
    //   Alert.alert(error.message);
    // } else {
    //   Alert.alert(error?.msg);
    // }
    // return Promise.reject(error);
    return error;
  }
}
export async function CreateExpense(expData) {
  try {
    // //loaderStore.setIsLoading(true);
    const {
      amount = 0,
      expenseType,
      title = "",
      trip = [],
      expImage = "",
      expTypeSelect,
      vehicle,
    } = expData;
    console.log(
      "🚀 ~ file: ExpenseAction.js:218 ~ CreateExpense ~ expData:",
      expData
    );
    const body = {
      tripName: expTypeSelect === 0 ? trip?.tripName : null,
      licensePlate: expTypeSelect === 1 ? vehicle?.vehicleName : null,
      driverFirstName: authStore?.driverData?.firstName,
      driverMiddleName: authStore?.driverData?.middleName,
      driverLastName: authStore?.driverData?.lastName,

      expenseDate: moment().format("YYYY-MM-DD HH:mm:ss"),
      expenseTypeId: expenseType?.typeId,
      amount: amount,
      expenseTypeName: expenseType?.typeName,
      reference: `${Math.floor(Math.random() * 101)}`,
      description: title,
      expenseTitle: title,
      tripId: expTypeSelect === 0 ? trip?.tripId : null,
      vehicleId: expTypeSelect === 1 ? vehicle?.vehicleId : null,
      deviceId: null,
      currencyId:
        expTypeSelect === 0
          ? trip.currencyId
          : authStore?.driverData?.currencyId,
          currencySymbol:
          expTypeSelect === 0
            ? trip.currencySymbol ?? authStore?.driverData?.currency // Use currency from driverData if trip.currencySymbol is null or undefined
            : authStore?.driverData?.currency,
        
        currencyName:
          expTypeSelect === 0
            ? trip.currencyName ?? authStore?.driverData?.currencyName // Use currencyName from driverData if trip.currencyName is null or undefined
            : authStore?.driverData?.currencyName,
      imageUrl1: expData?.expImage ? expData.expImage : "",
      orgId: authStore?.driverData?.orgId,
      orgName: authStore?.driverData?.orgName,
      isEnabled: true,
      insertedBy: authStore?.driverData?.driverId,
      DeviceId: authStore?.driverData?.driverId,
      insertedOn: moment().format("YYYY-MM-DD HH:mm:ss"),
      UuId: expTypeSelect === 0 ? expData?.trip?.uuid : "",
      subType: expenseType.subType,
    };

    const createdExp = await apiPost(CREATE_EXPENSE, body);

    if (createdExp.status) {
      addExpense.resetAllExpense();
      loaderStore.setIsLoading(false);
      showSuccess("Expense added sucessfully");
      await getExpenseByDriverID();
      return createdExp;
    }
    loaderStore.setIsLoading(false);
  } catch (error) {
    loaderStore.setIsLoading(false);
    console.log(error, "ERROR----CreateExpense");
    if (error.message) {
      // Alert.alert(error.message);
    } else {
      // Alert.alert(error?.msg);
    }
    return Promise.reject(error);
  }
}
export async function getExpenseTypeById(Id) {
  try {
    const expData = await apiGet(`${GET_EXPENSE_TYPE_BY_ID}${Id}`);
    if (expData?.status) {
      console.log("expData",expData)
      console.log("expData?.status",expData?.status)
      console.log("expData.data.jsonData",expData.data.jsonData)
      return expData.data.jsonData;
    }
    return {};
  } catch (error) {
    loaderStore.setIsLoading(false);
    console.log(error, "ERROR----getExpenseTypeById");
    return {};
  }
}
