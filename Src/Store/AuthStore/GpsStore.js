import { action, makeObservable, observable } from "mobx";

class GpsStore {
    GpsTracking={verified:  false};
    GpsStopTracking={verified:  false};
  

  constructor() {
    makeObservable(this, {
        GpsTracking:observable,
        GpsStopTracking:observable,

        setStopGpsTracking:action,
        setGpsTracking:action,
    });
  }

  setGpsTracking(value){
    this.GpsTracking.verified=value
  }
  setStopGpsTracking(value){
    this.GpsStopTracking.verified=value
  }
  resetGpstore() {
    this.GpsTracking={verified:false};
    this.GpsStopTracking={verified:false};
  }
}
export const gpsStore = new GpsStore();
