import { Alert } from "react-native";
import { loaderStore } from "../../Store/AuthStore/LoaderStore";
import { tripStore } from "../../Store/AuthStore/TripStore";
import { apiGet } from "../apiCalls";
import { GEO_CODING } from "../urls";
export async function geoCoading({ lattitude, longitude }) {
  try {
    // var Lat_long = `${latitude},${longitude}`;
    var url = `http://map.itac.cogniphi.com/nominatim/reverse?format=json&lat=${lattitude}&lon=${longitude}&zoom=20&addressdetails=4`;
    const code = await apiGet(url);
    console.log("🚀 ~ file: LocationActions.js:11 ~ geoCoading ~ url:", url);
    loaderStore.setIsLoading(false);

    var StartName = code?.display_name
      ?.split(",")
      .splice(0, code?.display_name?.split(",")?.length - 2)
      .join();
    tripStore.setCurLocationName(StartName);

    return StartName;
  } catch (error) {
    console.log(error, "ERROR----geoCoading");
    loaderStore.setIsLoading(false);

    return Promise.reject(error);
  }
}
export async function StartEndLocation(tripData) {
  try {
    var base_url = `http://map.itac.cogniphi.com/nominatim/reverse?format=json&lat=${tripData?.baseStartLat}&lon=${tripData?.baseStartLong}&zoom=20&addressdetails=4`;
    var base_urlEnd = `http://map.itac.cogniphi.com/nominatim/reverse?format=json&lat=${tripData?.baseEndLat}&lon=${tripData?.baseEndLong}&zoom=20&addressdetails=4`;
    // http://map.itac.cogniphi.com/nominatim/reverse?format=json&lat=13.055403&lon=80.2213931&zoom=20&addressdetails=4
    var actual_url = `http://map.itac.cogniphi.com/nominatim/reverse?format=json&lat=${tripData?.startLat}&lon=${tripData?.startLong}&zoom=20&addressdetails=4`;
    var actual_urlEnd = `http://map.itac.cogniphi.com/nominatim/reverse?format=json&lat=${tripData?.endLat}&lon=${tripData?.endLong}&zoom=20&addressdetails=4`;
    const base_Start_code = apiGet(base_url);
    const base_End_code = apiGet(base_urlEnd);
    const Start_code =
      tripData?.startLat && tripData?.startLong && apiGet(actual_url);
    const End_code =
      tripData?.endLat && tripData?.endLong && apiGet(actual_urlEnd);
    var FinalData = Promise.allSettled([
      base_Start_code,
      base_End_code,
      Start_code,
      End_code,
    ])
      .then((res) => {
        var StartName = "";
        var EndName = "";
        var actualStartName = "";
        var actualEndName = "";
        if (res[0].status === "fulfilled") {
          StartName = res[0]?.value?.display_name;
        }
        if (res[1].status === "fulfilled") {
          EndName = res[1]?.value?.display_name;
        }
        if (res[2].status === "fulfilled") {
          actualStartName = res[2]?.value?.display_name;
        }
        if (res[3].status === "fulfilled") {
          actualEndName = res[3]?.value?.display_name;
        }

        tripStore.setTripStartLoc(StartName);
        tripStore.setTripEndLoc(EndName);

        tripStore.setLocationNames({
          StartName,
          EndName,
          actualStartName,
          actualEndName,
        });
        loaderStore.setIsLoading(false);

        return { StartName, EndName, actualStartName, actualEndName };
      })
      .catch((err) => console.log("geo error", err));
  } catch (error) {
    console.log(error, "ERROR----geoCoading");
    loaderStore.setIsLoading(false);
    return Promise.reject(error);
  }
}
export async function StartEndLocationRoute(routeData) {
  try {
    var StartLocations = `${routeData[0]?.latitude},${routeData[0]?.longitude}`;
    var EndLocations = `${routeData[routeData?.length - 1].latitude},${
      routeData[routeData?.length - 1]?.longitude
    }`;
    const Start_code = apiGet(`${GEO_CODING}${StartLocations}`);
    const End_code = apiGet(`${GEO_CODING}${EndLocations}`);
    var FinalData = Promise.all([Start_code, End_code])
      .then((res) => {
        var Routes = res.map((item) => {
          return item?.results?.find(
            (add) => add?.types[0] === "route" || add?.types[0] === "locality"
          );
        });
        var StartName = Routes[0]?.formatted_address
          ?.split(",")
          .splice(0, Routes[0]?.formatted_address?.split(",")?.length - 2)
          .join();
        var EndName = Routes[1]?.formatted_address
          ?.split(",")
          .splice(0, Routes[1]?.formatted_address?.split(",")?.length - 2)
          .join();
        tripStore.setTripStartLoc(StartName);
        tripStore.setTripEndLoc(EndName);
        loaderStore.setIsLoading(false);

        return { StartName, EndName };
      })
      .catch((err) => console.log("geo error", err));

    // return code.results;
  } catch (error) {
    console.log(error, "ERROR----geoCoading");
    loaderStore.setIsLoading(false);
    return Promise.reject(error);
  }
}
