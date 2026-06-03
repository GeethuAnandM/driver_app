import { action, computed, makeObservable, observable } from "mobx";
class ImageStore {
  licenceImage = "";
  odometer = { image: "", value: 0,OdometerValidated:false };
  Endodometer = { image: "", value: 0 ,EndOdometerValidated:false};
  fuelmeter = { image: "", value: 0 ,FuelValidated:false};
  EndFuelmeter = { image: "", value: 0 ,EndFuelValidated:false};
  selfie = { image: "", value: 0 ,SelfieValidated:false};
  EndSelfie = { image: "", value: 0,EndSelfieValidated:false };
  otp = { verified: false, value: 0 };
  EndOtp = { verified: false, value: 0 };
  EndSignature = {imageUrl: "", image: "",verified:false ,isDenied:false,capturedTime:""};
  EndFeedback = { verified: false, rating: "", feedback: "", review: "" ,EndFeedbackValidated:false,DriverFeedback:false};
  expense = [];
  InStationChecked = { verified: false };
currentScreen={name:""};

  // GpsTracking={verified:  ""};
  // GpsStopTracking={verified:  ""};

  EndTrip = { verified: "" };
  constructor() {
    makeObservable(this, {
      expense: observable,
      licenceImage: observable,
      odometer: observable,
      Endodometer: observable,
      fuelmeter: observable,
      EndFuelmeter: observable,
      selfie: observable,
      EndSelfie: observable,
      otp: observable,
      EndOtp: observable,
      EndSignature: observable,
      EndFeedback: observable,
      InStationChecked: observable,

      //GpsTracking:observable,
      EndTrip: observable,
      //GpsStopTracking:observable,

      setLicenceImage: action,
      setOdometerImage: action,
      setOdometerValidated:action,
      setEndOdometerImage: action,
      setOdometerValue: action,
      setEndOdometerValue: action,
      setEndOdometerValidated:action,
      setFuelmeterImage: action,
      setFuelmeterValue: action,
      setEndFuelmeterImage: action,
      setEndFuelmeterValue: action,
      setSelfie: action,
      setEndSelfie: action,
setFuelValidated:action,
setEndFuelValidated:action,
setEndSelfieValidated:action,
setEndFeedbackValidated:action,
      setOtp: action,
      setOtpValue: action,
      setEndOTP: action,
      setEndOtpValue: action,

      // setEndOtpValue:action,
      setEndSignature: action,
      setEndSignatureImageUrl: action,
      setEndSignatureImage: action,
      setEndSignatureTime:action,
      setSignatureDenied:action,
      
      setEndFeedback: action,
      setEndRating: action,
      setEndFeedbackSelected: action,
      setEndFeedbackReview: action,
      setDriverFeedback:action,

      setExpenseImage: action,
      // setStopGpsTracking:action,
      // setGpsTracking:action,
      setEndTrip: action,
      setInStationChecked: action,
      
      setCurrentScreen:action,
      setSelfieValidated:action,
      resetAllImage: action,
      clearOdometer: action,
      clearFuelMeter: action,
      clearEndSignature: action,
    });
  }

  setLicenceImage(value) {
    this.licenceImage = value;
  }
  setOdometerImage(value) {
    this.odometer.image = value;
  }
  setOdometerValidated(value){
    this.odometer.OdometerValidated = value;
  }
  setOdometerValue(value) {
    this.odometer.value = value;
  }
  setEndOdometerImage(value) {
    this.Endodometer.image = value;
  }
  setEndOdometerValue(value) {
    this.Endodometer.value = value;
  }
  setEndOdometerValidated(value){
    this.Endodometer.EndOdometerValidated = value;
  }
  setFuelmeterImage(value) {
    this.fuelmeter.image = value;
  }
  setFuelmeterValue(value) {
    this.fuelmeter.value = value;
  }
  setFuelValidated(value){
    this.fuelmeter.FuelValidated = value;
  }
  setEndFuelValidated(value){
this.EndFuelmeter.EndFuelValidated=value
  }
  setEndFuelmeterImage(value) {
    this.EndFuelmeter.image = value;
  }
  setEndFuelmeterValue(value) {
    this.EndFuelmeter.value = value;
  }
  setSelfie(value) {
    this.selfie.image = value;
  }

  setSelfieValidated(value){
    this.selfie.SelfieValidated = value;
  }
  setEndSelfie(value) {
    this.EndSelfie.image = value;
  }
  setEndSelfieValidated(value){
    this.EndSelfie.EndSelfieValidated = value;
  }
  setEndFeedbackValidated(value){
    this.EndFeedback.EndFeedbackValidated=value;
  }
  setDriverFeedback(value){
    this.EndFeedback.DriverFeedback=value;
  }
  setOtp(value) {
    this.otp.verified = value;
  }

  setOtpValue(value) {
    this.otp.value = value;
  }

  setEndOtpValue(value) {
    this.EndOtp.value = value;
  }

  setEndOTP(value) {
    this.EndOtp.verified = value;
  }

  setEndSignature(value) {
    this.EndSignature.verified = value;
  }
  setEndSignatureImageUrl(value) {
    this.EndSignature.imageUrl = value;
  }
  setEndSignatureImage(value) {
    this.EndSignature.image = value;
  }
   setEndSignatureTime(value){
    console.log("valuetimw",value)
    this.EndSignature.capturedTime=value
   }

   setSignatureDenied(value){
    this.EndSignature.isDenied=value
   }
  setEndFeedback(value) {
    this.EndFeedback.verified = value;
  }
  setEndRating(value) {
    this.EndFeedback.rating = value;
  }
  setEndFeedbackSelected(value) {
    this.EndFeedback.feedback = value;
  }
  setEndFeedbackReview(value) {
    this.EndFeedback.review = value;
  }
  // expense.push({ image: "receipt.jpg", value: 50, typeId: "food" });
  // expense.push({ image: "bill.png", value: 30, typeId: "utilities" });
  // setGpsTracking(value){
  //   this.GpsTracking.verified=value
  // }
  // setStopGpsTracking(value){
  //   this.GpsStopTracking.verified=value
  // }
  setEndTrip(value) {
    this.EndTrip.verified = value;
  }
  setExpenseImage(path, typeId) {
    this.expense.push({ image: path, typeId: typeId });
  }
  setInStationChecked(value) {
    this.InStationChecked.verified = value;
  }

  setCurrentScreen(value){
    this.currentScreen.name=value;
  }
  // setExpenseImage(imgValue, idValue) {
  //   this.expense.image.push({ img: imgValue, id: idValue });
  // }

  // setExpenseTypeId(value) {
  //   this.expense.typeId = value;
  // }

  clearEndSignature() {
    this.EndSignature = { verified: "", image: "" };
  }
  clearOdometer() {
    this.odometer = { image: "", value: "" };
  }
  clearEndOdometer() {
    this.Endodometer = { image: "", value: "" };
  }
  clearFuelMeter() {
    this.fuelmeter = { image: "", value: "" };
  }
  clearExpense() {
    this.expense = [];
  }
  // clearOtp(){

  //   this.otp = { value: 0 };
  // }
  resetAllImage() {
    this.licenceImage = "";
    this.odometer = { image: "", value: 0,OdometerValidated:false };
    this.Endodometer = { image: "", value: 0,EndOdometerValidated:false };
    this.fuelmeter = { image: "", value: 0,FuelValidated:false };
    this.EndFuelmeter = { image: "", value: 0 ,EndFuelValidated:false};
    this.selfie = { image: "", value: 0,SelfieValidated:false };
    this.EndSelfie = { image: "", value: 0,EndSelfieValidated:false };
    this.otp = { verified: false, value: 0 };
    this.EndOtp = {  verified: false, value: 0 };
    this.EndSignature = {  verified: false, imageUrl: "", image: "" ,isDenied:false,capturedTime:""};
    this.EndFeedback = {
      verified: false,
      rating: "",
      feedback: "",
      review: "",
      EndFeedbackValidated:false,
      DriverFeedback:false 
    };
    this.expense = [];
    // this.GpsTracking={verified:""};
    // this.GpsStopTracking={verified:""};
    this.EndTrip = { verified: "" };
    this.InStationChecked = { verified: false };
  }
}
export const imageStore = new ImageStore();
