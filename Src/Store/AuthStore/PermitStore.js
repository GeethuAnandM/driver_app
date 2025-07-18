import { action, computed, makeObservable, observable } from "mobx";
import moment from "moment";
import { tripTypes } from "../../Constant/constant";
import { setItem } from "../../Services/apiCalls";
class PermitStore {
 
  permitRefresh={verified: false };
  //permitList = [];
  //EndFeedback={verified: false};
 
  constructor() {
    makeObservable(this, {
      permitRefresh:observable,
     
     setPermitRefresh:action,
     
    });
  }
  // setPermitList(value){
  //   this.permitList=value;
  // }
 
  setPermitRefresh(value){
    this.permitRefresh.verified=value
  }
  resetPermit() {
   // this.permitList = [];
    this.permitRefresh={verified:false};
    
  }

  
}
export const permitStore = new PermitStore();
