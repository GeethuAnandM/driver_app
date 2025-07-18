import { useTheme } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, {
  Callout,
  Marker,
  Polyline,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { scale } from "react-native-size-matters";
import * as SVG from "../../../Assets/SVG";
import { mapStyles, tripTypes } from "../../../Constant/constant";
import { tripStore } from "../../../Store/AuthStore/TripStore";
import { getFloat } from "../../../Utils/helper";
import Custom_Text from "../../Text_Custom";
import Icon from "react-native-vector-icons/MaterialIcons";
import { observer } from "mobx-react";
const screen = Dimensions.get("window");
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.001;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const MapComponent = (props) => {
  const { colors, dark } = useTheme();

  const [Route, setRoute] = useState(props?.route);
  const mapRef = useRef();
  const SBMarker = useRef();
  const styles = StyleSheet.create({
    map: {
      height: scale(200),
      // borderWidth: 1,
    },
    pointText: {
      fontFamily: "NunitoSans-Bold",
      fontSize: scale(10),
      textAlign: "center",
    },
    plainView: {
      width: 60,
    },
  });
  const [originDestination, setOriginDestination] = useState([
    {
      latitude: getFloat(tripStore?.selectedTrip?.baseStartLat),
      longitude: getFloat(tripStore?.selectedTrip?.baseStartLong),
    },
    {
      latitude: getFloat(tripStore?.selectedTrip?.baseEndLat),
      longitude: getFloat(tripStore?.selectedTrip?.baseEndLong),
    },
  ]);
  const [showStraightLine, setshowStraightLine] = useState(true);

  useEffect(() => {
    setshowStraightLine(true);
    init();

    return () => {
      setRoute([]);
      setOriginDestination([]);
      setshowStraightLine(false);
    };
  }, [props]);

  const init = () => {
    setRoute(props.route);
    // if (
    //   tripStore?.selectedTrip?.baseStartLat === null ||
    //   tripStore?.selectedTrip?.baseStartLong === null
    // ) {
    //   console.log(
    //     "baseStartLat",
    //     {
    //       latitude: getFloat(tripStore?.selectedTrip?.baseEndLat),
    //       longitude: getFloat(tripStore?.selectedTrip?.baseEndLong),
    //     },
    //     {
    //       latitude: getFloat(tripStore?.selectedTrip?.baseEndLat),
    //       longitude: getFloat(tripStore?.selectedTrip?.baseEndLong),
    //     }
    //   );
    //   setOriginDestination([
    //     {
    //       latitude: getFloat(tripStore?.selectedTrip?.baseEndLat),
    //       longitude: getFloat(tripStore?.selectedTrip?.baseEndLong),
    //     },
    //     {
    //       latitude: getFloat(tripStore?.selectedTrip?.baseEndLat),
    //       longitude: getFloat(tripStore?.selectedTrip?.baseEndLong),
    //     },
    //   ]);
    // }
    // if (
    //   tripStore?.selectedTrip?.baseEndLat === null ||
    //   tripStore?.selectedTrip?.baseEndLong === null
    // ) {
    //   console.log(
    //     "baseEndLat->>>>>>>>>>>>>>>>",
    //     {
    //       latitude: getFloat(tripStore?.selectedTrip?.baseStartLat),
    //       longitude: getFloat(tripStore?.selectedTrip?.baseStartLong),
    //     },
    //     {
    //       latitude: getFloat(tripStore?.selectedTrip?.baseStartLat),
    //       longitude: getFloat(tripStore?.selectedTrip?.baseStartLong),
    //     }
    //   );
    //   setOriginDestination([
    //     {
    //       latitude: getFloat(tripStore?.selectedTrip?.baseStartLat),
    //       longitude: getFloat(tripStore?.selectedTrip?.baseStartLong),
    //     },
    //     {
    //       latitude: getFloat(tripStore?.selectedTrip?.baseStartLat),
    //       longitude: getFloat(tripStore?.selectedTrip?.baseStartLong),
    //     },
    //   ]);
    // }
    if (props?.route?.length > 1) {
      mapRef.current.animateCamera(
        {
          center: {
            ...Route[Route?.length - 1],
          },
          heading: Route[Route?.length - 1]?.heading,
          zoom: 16,
        },
        { duration: 2000 }
      );
      if (!tripStore.selectedTrip.status === tripTypes[3]) {
        setOriginDestination([
          { ...props?.route[0] },
          {
            ...props?.route[props?.route?.length - 1],
          },
        ]);
      } else {
        setOriginDestination([
          {
            latitude: getFloat(tripStore?.selectedTrip?.baseStartLat),
            longitude: getFloat(tripStore?.selectedTrip?.baseStartLong),
          },
          {
            latitude: getFloat(tripStore?.selectedTrip?.baseEndLat),
            longitude: getFloat(tripStore?.selectedTrip?.baseEndLong),
          },
        ]);
      }

      //
    } else {
      if (
        getFloat(tripStore?.selectedTrip?.baseEndLat) === 0 &&
        getFloat(tripStore?.selectedTrip?.baseStartLat) === 0
      ) {
        return setOriginDestination([
          {
            latitude: getFloat(tripStore?.selectedTrip?.startLat),
            longitude: getFloat(tripStore?.selectedTrip?.startLong),
          },
          {
            latitude: getFloat(tripStore?.selectedTrip?.endLat),
            longitude: getFloat(tripStore?.selectedTrip?.endLong),
          },
        ]);
      }
      if (getFloat(tripStore?.selectedTrip?.baseStartLat) === 0) {
        return setOriginDestination([
          {
            latitude: getFloat(tripStore?.selectedTrip?.startLat),
            longitude: getFloat(tripStore?.selectedTrip?.startLong),
          },
          {
            latitude: getFloat(tripStore?.selectedTrip?.baseEndLat),
            longitude: getFloat(tripStore?.selectedTrip?.baseEndLong),
          },
        ]);
      }
      if (getFloat(tripStore?.selectedTrip?.baseEndLat) === 0) {
        return setOriginDestination([
          {
            latitude: getFloat(tripStore?.selectedTrip?.baseStartLat),
            longitude: getFloat(tripStore?.selectedTrip?.baseStartLong),
          },
          {
            latitude: getFloat(tripStore?.selectedTrip?.endLat),
            longitude: getFloat(tripStore?.selectedTrip?.endLong),
          },
        ]);
      }

      setOriginDestination([
        {
          latitude: getFloat(tripStore?.selectedTrip?.baseStartLat),
          longitude: getFloat(tripStore?.selectedTrip?.baseStartLong),
        },
        {
          latitude: getFloat(tripStore?.selectedTrip?.baseEndLat),
          longitude: getFloat(tripStore?.selectedTrip?.baseEndLong),
        },
      ]);
    }
  };
  const onCenter = () => {
    mapRef?.current?.animateToRegion({
      latitude: props?.curLoc.lattitude,
      longitude: props?.curLoc.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  };

  const PolylineDraw = ({ start, end, color = colors.primary }) => {
    return (
      <>
        {start?.latitude && end?.latitude && (
          <Polyline
            strokeWidth={4}
            strokeColor={color}
            coordinates={[
              {
                latitude: start?.latitude,
                longitude: start?.longitude,
              },
              {
                latitude: end?.latitude,
                longitude: end?.longitude,
              },
            ]}
          />
        )}
      </>
    );
  };
  const trackLive = () => {
    return (
      <>
        {PolylineDraw(
          { ...originDestination[0] },
          {
            latitude: tripStore?.selectedTrip?.startLat,
            longitude: tripStore?.selectedTrip?.startLong,
          },
          "lightgray"
        )}
        {PolylineDraw(
          {
            latitude: tripStore?.selectedTrip?.endLat,
            longitude: tripStore?.selectedTrip?.endLong,
          },
          { ...originDestination[1] },
          "lightgray"
        )}
      </>
    );
  };
  const noRoutePolyline = () => {
    return (
      <React.Fragment>
        {/* {Route?.length === 0 &&
          PolylineDraw(
            { ...originDestination[0] },
            {
              latitude: getFloat(tripStore?.selectedTrip?.startLat),
              longitude: tripStore?.selectedTrip?.startLong,
            },
            "lightgray"
          )}
        {Route?.length === 0 &&
          PolylineDraw(
            {
              latitude: tripStore?.selectedTrip?.endLat,
              longitude: tripStore?.selectedTrip?.endLong,
            },
            {
              latitude: tripStore?.selectedTrip?.startLat,
              longitude: tripStore?.selectedTrip?.startLong,
            }
          )}
        {Route?.length === 0 &&
          PolylineDraw(
            {
              latitude: tripStore?.selectedTrip?.endLat,
              longitude: tripStore?.selectedTrip?.endLong,
            },
            { ...originDestination[1] },
            "lightgray"
          )} */}
      </React.Fragment>
    );
  };

  const isAnyBaseNull = () => {
    var data = [
      {
        latitude: tripStore?.selectedTrip?.baseStartLat,
        longitude: tripStore?.selectedTrip?.baseStartLong,
      },
      {
        latitude: tripStore?.selectedTrip?.baseEndLat,
        longitude: tripStore?.selectedTrip?.baseEndLong,
      },
    ];
    var objectArray = [];

    data.map((item) => objectArray.push(...Object.values(item)));

    var hasNull = objectArray.some((value) => value === null);

    return hasNull;
  };

  const noBaseStartToEnd = () => {
    return (
      <>
        {isAnyBaseNull() ? (
          <></>
        ) : (
          <Polyline
            strokeWidth={4}
            strokeColor={colors.primary}
            coordinates={originDestination}
          />
        )}
      </>

      // <Polyline
      //   strokeWidth={4}
      //   strokeColor={colors.primary}
      //   coordinates={originDestination}
      // />
    );
  };
  const mapReady = () => {
    if (props?.route?.length > 1) {
      props?.onMapReady && props?.onMapReady();
      // const radiusBoundaries = getBoundsOfDistance(props?.route, 50 * 1000);
      mapRef?.current?.fitToCoordinates(props?.route, {
        edgePadding: {
          right: 10,
          bottom: 10,
          left: 10,
          top: 10,
        },
      });
      setshowStraightLine(false);
    } else {
      props?.onMapReady && props?.onMapReady();
      var data = [...originDestination];

      mapRef?.current?.fitToCoordinates(data, {
        edgePadding: {
          right: 10,
          bottom: 10,
          left: 10,
          top: 10,
        },
      });
      setshowStraightLine(false);
    }
  };

  const ifInProgress = () => {
    return (
      <>
        {tripStore?.selectedTrip?.startLat &&
          tripStore?.selectedTrip?.startLong && (
            <Marker
              coordinate={{
                latitude: tripStore?.selectedTrip?.startLat,
                longitude: tripStore?.selectedTrip?.startLong,
              }}
            >
              <SVG.SVGS_E fill="#2196F3" />
              <Callout style={styles.plainView}>
                <Custom_Text text="Start Point" style={styles.pointText} />
              </Callout>
            </Marker>
          )}
        {tripStore?.selectedTrip?.endLat &&
          tripStore?.selectedTrip?.endLong && (
            <Marker
              coordinate={{
                latitude: tripStore?.selectedTrip?.endLat,
                longitude: tripStore?.selectedTrip?.endLong,
              }}
            >
              <SVG.SVGS_E fill="#DC2127" />
              <Callout style={styles.plainView}>
                <Custom_Text text="End Point" style={styles.pointText} />
              </Callout>
            </Marker>
          )}
        {originDestination[0]?.latitude !== tripStore?.selectedTrip?.startLat &&
          originDestination[0]?.latitude !== 0 &&
          originDestination[0]?.longitude !== 0 && (
            <Marker ref={SBMarker} coordinate={originDestination[0]}>
              <SVG.GreenDot />
              <Callout style={styles.plainView}>
                <Custom_Text text="Start Base" style={styles.pointText} />
              </Callout>
            </Marker>
          )}

        {originDestination[1]?.latitude !== tripStore?.selectedTrip?.endLat &&
          originDestination[1]?.latitude !== 0 &&
          originDestination[1]?.longitude !== 0 && (
            <Marker coordinate={originDestination[1]}>
              <SVG.GreenDot fill="#DC2127" />
              <Callout style={styles.plainView}>
                <Custom_Text text="End Base" style={styles.pointText} />
              </Callout>
            </Marker>
          )}
      </>
    );
  };
  return (
    <>
      {!!tripStore?.selectedTrip ? (
        <>
          {tripStore.selectedTrip.status === tripTypes[2] &&
            Route?.length == 0 && (
              <View
                style={{
                  padding: 10,
                  backgroundColor: colors.error,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Icon name="error" color={"#fff"} size={25} />
                <Custom_Text
                  text="Waiting for GPS"
                  style={{
                    color: "#fff",
                    marginLeft: 8,
                  }}
                />
              </View>
            )}
          <MapView
            onLayout={() => mapReady()}
            // loadingEnabled={true}
            onPress={props?.onPress}
            scrollEnabled={props?.scrollEnabled}
            loadingIndicatorColor={colors.primary}
            onMapLoaded={() => showStraightLine && mapReady()}
            ref={mapRef}
            customMapStyle={dark ? mapStyles : "light"}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={[styles.map, props.extraStyles]}
            onError={(e) => {
              console.log("MapView ERROR-->>>", e);
            }}
            region={{
              latitude: originDestination[0].latitude,
              longitude: originDestination[0].longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LATITUDE_DELTA,
            }}
            initialRegion={{
              latitude: 12.9716,
              longitude: 77.5946,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LATITUDE_DELTA,
            }}
          >
            {Route?.length > 0 &&
              tripStore.selectedTrip.status !== tripTypes[2] && (
                <>
                  {originDestination[0]?.latitude !==
                    tripStore?.selectedTrip?.startLat && (
                    <Marker coordinate={originDestination[0]}>
                      <SVG.GreenDot />
                      <Callout style={styles.plainView}>
                        <Custom_Text
                          text="Start Base"
                          style={styles.pointText}
                        />
                      </Callout>
                    </Marker>
                  )}
                  {originDestination[1]?.latitude !==
                    tripStore?.selectedTrip?.endLat && (
                    <Marker coordinate={originDestination[1]}>
                      <SVG.GreenDot fill="#DC2127" />
                      <Callout style={styles.plainView}>
                        <Custom_Text text="End Base" style={styles.pointText} />
                      </Callout>
                    </Marker>
                  )}
                  {originDestination[0]?.latitude !== 0 &&
                    originDestination[0]?.longitude !== 0 && (
                      <Polyline
                        strokeWidth={4}
                        strokeColor={"lightgray"}
                        coordinates={[
                          { ...originDestination[0] },
                          {
                            latitude: getFloat(Route[0].latitude),
                            longitude: getFloat(Route[0].longitude),
                          },
                        ]}
                      />
                    )}
                  {originDestination[1]?.latitude !== 0 &&
                    originDestination[1]?.longitude !== 0 && (
                      <Polyline
                        strokeWidth={4}
                        strokeColor={"lightgray"}
                        coordinates={[
                          { ...originDestination[1] },
                          {
                            latitude: getFloat(
                              Route[Route?.length - 1].latitude
                            ),
                            longitude: getFloat(
                              Route[Route?.length - 1].longitude
                            ),
                          },
                        ]}
                      />
                    )}
                </>
              )}
            {/* {!showStraightLine && ( */}
            {Route?.length > 0 ? (
              <>
                <Polyline
                  strokeWidth={5}
                  strokeColor={colors.primary}
                  coordinates={Route}
                />
                <Marker coordinate={Route[0]}>
                  <SVG.SVGS_E fill="#2196F3" />
                  <Callout style={styles.plainView}>
                    <Custom_Text text="Start Point" style={styles.pointText} />
                  </Callout>
                </Marker>

                {tripStore.selectedTrip.status !== tripTypes[2] && (
                  <Marker coordinate={Route[Route?.length - 1]}>
                    <SVG.SVGS_E fill="#DC2127" />
                    <Callout style={styles.plainView}>
                      <Custom_Text text="End Point" style={styles.pointText} />
                    </Callout>
                  </Marker>
                )}
              </>
            ) : (
              <>
                {!!tripStore?.selectedTrip?.endLong &&
                !!tripStore?.selectedTrip?.endLat &&
                !!tripStore?.selectedTrip?.startLat &&
                !!tripStore?.selectedTrip?.startLat ? (
                  <>
                    {originDestination[0]?.latitude !== 0 &&
                      originDestination[0]?.longitude !== 0 && (
                        <Polyline
                          strokeWidth={4}
                          strokeColor={"lightgray"}
                          coordinates={[
                            { ...originDestination[0] },
                            {
                              latitude: getFloat(
                                tripStore?.selectedTrip?.startLat
                              ),
                              longitude: getFloat(
                                tripStore?.selectedTrip?.startLong
                              ),
                            },
                          ]}
                        />
                      )}

                    <Polyline
                      strokeWidth={4}
                      strokeColor={colors.primary}
                      coordinates={[
                        {
                          latitude: getFloat(tripStore?.selectedTrip?.endLat),
                          longitude: getFloat(tripStore?.selectedTrip?.endLong),
                        },
                        {
                          latitude: getFloat(tripStore?.selectedTrip?.startLat),
                          longitude: getFloat(
                            tripStore?.selectedTrip?.startLong
                          ),
                        },
                      ]}
                    />
                    {originDestination[1]?.latitude !== 0 &&
                      originDestination[1]?.longitude !== 0 && (
                        <Polyline
                          strokeWidth={4}
                          strokeColor={"lightgray"}
                          coordinates={[
                            {
                              latitude: getFloat(
                                tripStore?.selectedTrip?.endLat
                              ),
                              longitude: getFloat(
                                tripStore?.selectedTrip?.endLong
                              ),
                            },
                            { ...originDestination[1] },
                          ]}
                        />
                      )}
                  </>
                ) : (
                  noBaseStartToEnd()
                )}
              </>
            )}

            {Route?.length == 0 && ifInProgress()}
            {props.children}
          </MapView>
          {props?.curLoc && (
            <View style={{ borderWidth: 1 }}>
              <TouchableOpacity
                onPress={() => onCenter()}
                style={{
                  width: scale(40),
                  height: scale(40),
                  backgroundColor: colors.SecondaryBackground,
                  position: "absolute",
                  // top: scale(screen.height / 2),
                  left: scale(20),
                  bottom: 40,
                  borderRadius: scale(40),
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 9,
                }}
              >
                <SVG.MoveLocationSVG />
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <MapView
          onLayout={() => mapReady()}
          onPress={props?.onPress}
          scrollEnabled={props?.scrollEnabled}
          loadingIndicatorColor={colors.primary}
          onMapLoaded={() => showStraightLine && mapReady()}
          ref={mapRef}
          customMapStyle={dark ? mapStyles : "light"}
          provider={PROVIDER_DEFAULT} // remove if not using Google Maps
          style={[styles.map, props.extraStyles]}
          onError={(e) => {
            console.log("MapView ERROR-->>>", e);
          }}
          region={{
            latitude: 12.9716,
            longitude: 77.5946,
            latitudeDelta: 0.04,
            longitudeDelta: 0.05,
          }}
          initialRegion={{
            latitude: 12.9716,
            longitude: 77.5946,
            latitudeDelta: 0.04,
            longitudeDelta: 0.05,
          }}
        />
      )}
    </>
  );
};

export default observer(MapComponent);
