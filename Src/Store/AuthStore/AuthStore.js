import { action, computed, makeObservable, observable } from "mobx";
class AuthStore {
  userData = {
    actionSheet: false,
    islogin: false,
    otp: "",
  };
  driverData = {};
  authData = {};
  lpNumber = "";
  lpExpDate = "";
  totalDistance = 0;
  fullname = { FirstName: "", LastName: "", MiddleName: "" };
  notification = [];
  notificationCount = 0;
  constructor() {
    makeObservable(this, {
      userData: observable,
      driverData: observable,
      lpNumber: observable,
      lpExpDate: observable,
      totalDistance: observable,
      fullname: observable,
      notification: observable,
      notificationCount: observable,
      setActionSheet: action,
      setLogin: action,
      setOtp: action,
      setDriverData: action,
      setAuthData: action,
      resSetStore: action,
      setTotalDistance: action,
      resetlp: action,
      setFullName: action,
      setFname: action,
      setMname: action,
      setLname: action,
      setNotification: action,
    });
  }
  setFullName(value) {
    this.fullname = value;
  }
  setFname(value) {
    this.fullname = { ...this.fullname, FirstName: value };
  }
  setMname(value) {
    this.fullname = { ...this.fullname, MiddleName: value };
  }
  setLname(value) {
    this.fullname = { ...this.fullname, LastName: value };
  }
  setAuthData(value) {
    this.authData = value;
  }
  setActionSheet(value) {
    this.userData.actionSheet = value;
  }
  setLogin(value) {
    this.userData.islogin = value;
  }
  setOtp(value) {
    this.userData.otp = value;
  }
  setDriverData(value) {
    this.driverData = value;
    this.lpExpDate = value.licenseExpirationDate;
    this.lpNumber = value.licenseNumber;
  }
  setLpExpDate(value) {
    this.lpExpDate = value;
  }
  setLpNumber(value) {
    this.lpNumber = value;
  }
  setTotalDistance(value) {
    this.totalDistance = value;
  }
  setNotification(value) {
    this.notification = value;
    var count = 0;
    if (value?.length > 0) {
      var data = value?.map((item) => {
        var isReaded = item?.list?.filter((ele) => !ele?.isRead)?.length;
        count = count + isReaded;
      });
      this.notificationCount = count;
    } else {
      this.notificationCount = count;
    }
  }
  resetlp() {
    this.lpNumber = "";
    this.lpExpDate = "";
  }
  resSetStore() {
    this.userData = {
      actionSheet: false,
      islogin: false,
      otp: "",
    };
    this.driverData = {};
    this.authData = {};
    this.lpNumber = "";
    this.lpExpDate = "";
    this.totalDistance = 0;
  }
}
export const authStore = new AuthStore();
