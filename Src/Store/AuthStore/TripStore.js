import { action, computed, makeObservable, observable } from "mobx";
import moment from "moment";
import { tripTypes } from "../../Constant/constant";
import { getItem, setItem } from "../../Services/apiCalls";
import { authStore } from "./AuthStore";
import { getRecentTripList } from "../../Services/Actions/TripActions";
class TripStore {
  activeTab = { name: "All", index: 0 };
  TripList = [];
  
  pendingTripCount = 0;
  pendingTrip = [];
  TripCount = 0;
  updatedSelectedTrip={};
  selectedTrip = {};
  recentTrip = null;
  notStarted = [];
  inProgress = [];
  completed = [];
  cancelled = [];
  currentTripStartTimmming = "";
  tripStartLoc = "";
  tripEndLoc = "";
  advanceAmountByCustomer = 0;
  curLocation = {};
  curLocationName = "";
  plannedTripRun = 0;
  actualTripTripRun = 0;
  totalTripRunTime = 0;
  loacationNames = {};
  constructor() {
    makeObservable(this, {
      activeTab: observable,
      TripList: observable,

      updatedSelectedTrip:observable,

      pendingTripCount: observable,
      pendingTrip: observable,
      TripCount: observable,
      selectedTrip: observable,
      notStarted: observable,
      inProgress: observable,
      completed: observable,
      cancelled: observable,
      currentTripStartTimmming: observable,
      tripStartLoc: observable,
      tripEndLoc: observable,
      advanceAmountByCustomer: observable,
      curLocation: observable,
      curLocationName: observable,
      plannedTripRun: observable,
      actualTripTripRun: observable,
      totalTripRunTime: observable,
      loacationNames: observable,
      setActiveTab: action,
      setCurLocation: action,
      setCurLocationName: action,
      setAdvanceAmount: action,
      setSelectedTrip: action,
      setTripList: action,
      setCurrentTripStartTime: action,
      setTripStartLoc: action,
      setTripEndLoc: action,
      resetStore: action,
      setPlannedTripRun: action,
      setActualTripTripRun: action,
      setTotalTripRunTime: action,
      setLocationNames: action,
      setUpdatedSelectedTrip:action,
      resetTrip: action,
    });
  }
  // setUpdatedSelectedTrip(value){
  //   this.updatedSelectedTrip = value;
  // }

  async setUpdatedSelectedTrip(value){
    this.updatedSelectedTrip = value;
    await setItem("updatedSelectedTrip",value);
  }
  setActiveTab(value) {
    this.activeTab = value;
  }
  setCurLocation(value) {
    this.curLocation = value;
  }
  setSelectedTrip(value) {
    this.selectedTrip = value;
  }
  setTripStatus(key, value) {
    let data = this.selectedTrip;
    data[key] = value;
    this.selectedTrip = data;
  }
  setTripList(value) {
    
    let filters = tripTypes;
   
    var data = value.sort(function (a, b) {
      return moment.utc(a.onwardStartTime).diff(moment.utc(b.onwardStartTime));
    });
    this.TripList = value.reverse();
    this.TripCount = value?.length;
    const count = value.filter((e) => e.status == tripTypes[1]);
    const filterCountToday = count.filter(
      (e) =>
        moment.utc(e.onwardStartTime).local().format("YYYY-MM-DD") ===
        moment().format("YYYY-MM-DD")
    );
    this.pendingTrip = filterCountToday;
    this.pendingTripCount =
    filterCountToday.length > 100 ? "99+" : filterCountToday.length;
    
    this.notStarted = data.filter((e) => e.status == filters[1]);
    this.inProgress = data.filter((e) => e.status == filters[2]);
    this.completed = data.filter((e) => e.status == filters[3]);
    this.cancelled = data.filter((e) => e.status == filters[4]);
  }
  setCurrentTripStartTime(time) {
    var date = moment.utc(time).format("YYYY-MM-DD HH:mm:ss");
    this.currentTripStartTimmming = date;
    setItem("selectedTripStartDate", date);
  }
  setTripStartLoc(value) {
    this.tripStartLoc = value;
  }
  setTripEndLoc(value) {
    this.tripEndLoc = value;
  }
  setAdvanceAmount(value) {
    console.log("amount",value)
    this.advanceAmountByCustomer = value;
    setItem("amountReceivedFRomCustomer",this.advanceAmountByCustomer)
  }
  setPlannedTripRun(value) {
    this.plannedTripRun = value;
  }
  setActualTripTripRun(value) {
    this.actualTripTripRun = value;
  }
  setTotalTripRunTime(value) {
    this.totalTripRunTime = value;
  }
  setCurLocationName(value) {
    this.curLocationName = value;
  }
  setLocationNames(value) {
    this.loacationNames = value;
  }
  async resetStore() {


   
    var trip = await getItem("selectedTrip");
    if (trip==null) {
    console.log("????????????????????????????resetStore")
    this.TripList = [];
    this.pendingTripCount = 0;
    this.TripCount = 0;
    this.selectedTrip = {};
    this.recentTrip = null;
    this.notStarted = [];
    this.inProgress = [];
    this.completed = [];
    this.cancelled = [];
    this.currentTripStartTimmming = "";
    this.tripStartLoc = {};
    this.tripEndLoc = {};
    this.advanceAmountByCustomer = 0;
    this.curLocation = {};
    this.plannedTripRun = 0;
    this.actualTripTripRun = 0;
    this.totalTripRunTime = 0;
    this.updatedSelectedTrip= {};
  }
  else{
    console.log("already a trip in progress")
  }
}
  async resetTrip() {
    var trip = await getItem("selectedTrip");
    if (trip==null) {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> reset trip")
    this.tripStartLoc = {};
    this.tripEndLoc = {};
    this.curLocation = {};
    this.loacationNames = {};
    this.selectedTrip = {};
    this.updatedSelectedTrip={};
    }
    else{
      console.log("already a trip in progress")
    }
  }
}
export const tripStore = new TripStore();
