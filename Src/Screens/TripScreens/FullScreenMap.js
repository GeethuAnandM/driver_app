import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Animated,
} from "react-native";
import React, { useEffect, useState } from "react";
import MapComponent from "../../Components/Profile_Components/TripDetailsComponets/MapComponent";
import { tripStore } from "../../Store/AuthStore/TripStore";
import {
  getVehicleTrack,
  getTripTrack,
} from "../../Services/Actions/TripActions";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import { tripTypes } from "../../Constant/constant";
import { scale } from "react-native-size-matters";
import { getCurrentLocation, locationPermission } from "../../Utils/helper";
import { AnimatedRegion, Marker } from "react-native-maps";
import { observer } from "mobx-react";
const screen = Dimensions.get("window");
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const FullScreenMap = () => {
  const [Route, setRoute] = useState([]);

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
  const markerRef = React.useRef();
  useEffect(() => {
    let interval = "";
    init();
    if (tripStore.selectedTrip.status === tripTypes[2]) {
      interval = setInterval(() => {
        init();
      }, 6000);
    } else {
      init();
    }
    return () => clearInterval(interval);
  }, []);
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const init = async () => {
    /*const locPermissionDenied = await locationPermission();*/

    var { list, remainingDistance } = await getTripTrack(tripStore.selectedTrip.tripId,tripStore.selectedTrip.onwardStartTime,
      tripStore.selectedTrip.onwardEndTime,
      tripStore.selectedTrip.vehicleId);

    let liveLocation = {};

    if (list?.length > 0) {
      liveLocation = list[list?.length - 1];

      // loaderStore.setLoader(false);
    } else {
      /*if (locPermissionDenied) {
        const { latitude, longitude, heading } = await getCurrentLocation();
        liveLocation = { lattitude: latitude, longitude, heading };
      }*/
    }

    updateState({
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

    animate(liveLocation?.lattitude, liveLocation?.longitude);
    setRoute(list);
  };

  const animate = (latitude, longitude) => {
    const newCoordinate = { latitude, longitude };

    if (Platform.OS === "android") {
      if (markerRef?.current) {
        markerRef?.current?.animateMarkerToCoordinate(newCoordinate, 7000);
      }
    } else {
      coordinate?.timing(newCoordinate)?.start();
    }
  };
  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? scale(5) : scale(35),
      }}
    >
      <CommonHeader goBack title="Route" />
      {!!Route && (
        <MapComponent route={Route} extraStyles={{ flex: 1 }}>
          <Marker.Animated ref={markerRef} coordinate={coordinate}>
            <Animated.Image
              source={require("../../Assets/cLocationNavi.png")}
              style={{
                width: 40,
                height: 40,
                // transform: [{ rotate: `${heading}deg` }],
              }}
              resizeMode="contain"
            />
          </Marker.Animated>
        </MapComponent>
      )}
    </View>
  );
};

export default observer(FullScreenMap);

const styles = StyleSheet.create({});
