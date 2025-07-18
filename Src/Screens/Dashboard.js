import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState,useCallback  } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Platform,
  Pressable,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { moderateVerticalScale, scale } from "react-native-size-matters";
import Container from "../Components/Container/Container";
import Text_Custom from "../Components/Text_Custom";
import DashboardHeader from "../Components/Dashboard_Componets/DashboardHeader";
import PendingTrip_Distance from "../Components/Dashboard_Componets/PendingTrip_Distance";
import TripDetails from "../Components/Dashboard_Componets/TripDetails";
import { observer } from "mobx-react";
import { PERMISSIONS } from "react-native-permissions";
import Loader from "../Components/Loader/Loader";
import { getDrivers, getNotification } from "../Services/Actions/AuthActions";
import { tripStore } from "../Store/AuthStore/TripStore";
import { check_PERMISSIONS_STATUS, getAppVersion, mandateUpdate } from "../Utils/helper";
import {
  getRecentTripList,
} from "../Services/Actions/TripActions";
import { ScrollView } from "react-native-gesture-handler";
import { permitStore } from "../Store/AuthStore/PermitStore";
import { useFocusEffect } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { AppState } from 'react-native';
//import { locationStore } from "../Store/AuthStore/LocationStore";
const height = Dimensions.get("screen").height;
const Dashboard = (props) => {
  const { colors, dark } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);
  const currentYear = new Date().getFullYear();
  const [TripList, setTripList] = useState(tripStore.TripList);




  useFocusEffect(
    useCallback(() => {
      const runOnFocus = async () => {
        console.log('Update on focus dashboard');
        await mandateUpdate();
        onRefresh();
        console.log('>>>>>>>>>>>>>>>>from focus');
      };
  
      runOnFocus();
  
      // Function to handle AppState changes
      const handleAppStateChange = nextAppState => {
        if (nextAppState === 'active') {
          console.log('dashboard>>>>>>>>>>>>>>>>..App came to foreground → mandateUpdate triggered');
          mandateUpdate();  // call without await (it's fine here)
        }
      };
  
      // Subscribe to AppState and notification
      const subscription = AppState.addEventListener('change', handleAppStateChange);
  
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('Notification received from listener in dashboard!', remoteMessage);
        onRefresh();
      });
  
      // Clean up both listeners on unfocus
      return () => {
        subscription.remove();
        unsubscribe();
        console.log('Listener unsubscribed');
      };
    }, [])
  );
  
  useEffect(() => {
    getDrivers().then(async () => await getNotification());
    if (Platform.OS == "android") {
      // check_PERMISSIONS_STATUS(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
      // check_PERMISSIONS_STATUS(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      //  getMobileGPS();
      check_PERMISSIONS_STATUS(PERMISSIONS.ANDROID.CAMERA);
    } else {
      check_PERMISSIONS_STATUS(PERMISSIONS.IOS.CAMERA);
      check_PERMISSIONS_STATUS(PERMISSIONS.IOS.PHOTO_LIBRARY);
    }
    onRefresh();
    console.log("from useeffct in dashboard")
    getLpcPer();
  }, []);


  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
  
    tripStore.resetStore();
    console.log("refrshing dashboard")

    const { recentTripList, pendingTripCount } = await getRecentTripList();

    tripStore.recentTrip = recentTripList;
    tripStore.pendingTripCount = pendingTripCount;

    //console.log("tripStore.recenttriplist", tripStore.recentTrip);

    permitStore.setPermitRefresh(true);

    setRefreshing(false);
  }, []);



 ;

  const getLpcPer = async () => {
    /*const locPermissionDenied = await locationPermission();
    if (locPermissionDenied) {
      const { latitude, longitude, heading } = await getCurrentLocation();
      tripStore.setCurLocation({ latitude, longitude, heading });
      // showError("Location Fetched");
    }*/
  };

  const styles = StyleSheet.create({
    containerMain: {
      paddingHorizontal: scale(20),
      paddingVertical: moderateVerticalScale(20),
      // borderWidth: 1,
      // justifyContent: "flex-end",
      flex: 1,
    },
    recentContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    viewAllBTN: {
      paddingBottom: scale(2),

      borderColor: colors.primary1,
    },
    viewAllText: {
      fontSize: scale(16),
      color: colors.primary,
      fontFamily: "NunitoSans-Bold",
    },
    flatList: {
      // height: "67%",
      borderRadius: scale(10),
      borderColor: colors.cardBorder,
      marginTop: moderateVerticalScale(20),
      backgroundColor: colors.SecondaryBackground,
      paddingVertical: moderateVerticalScale(10),
      zIndex: 100,
      justifyContent: "center",
      borderWidth: 1,
      flex: 1,
    },
  });

  return (
    <Container statusBarStyle={{ backgroundColor: colors.SecondaryBackground }}>
      <Loader />

      <DashboardHeader />
      <PendingTrip_Distance />
      <View style={styles.containerMain}>
        <View style={styles.recentContainer}>
          <Text_Custom
            text={"Recent Trips"}
            style={{ fontSize: scale(20), fontFamily: "NunitoSans-Bold" }}
          />
          <TouchableOpacity
            style={styles.viewAllBTN}
            onPress={() => {
              props.navigation.reset({
                index: 0,
                routes: [{ name: "Listing" }],
              });
            }}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>

          <TouchableOpacity></TouchableOpacity>
        </View>
        <ScrollView
          nestedScrollEnabled={true}
          scrollEnabled
          contentContainerStyle={styles.flatList}
          refreshControl={
            tripStore?.recentTrip?.length == 0 && (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            )
          }
        >
          {tripStore.recentTrip !== null && tripStore.recentTrip.length > 0 ? (
            <FlatList
              refreshing={refreshing}
              onRefresh={onRefresh}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              scrollEnabled
              contentContainerStyle={{ paddingBottom: scale(10) }}
              data={tripStore.recentTrip}
              renderItem={({ item, index }) => {
                var border = true;

                if (tripStore.recentTrip.length - 1 === index) {
                  border = false;
                }
                return <TripDetails item={item} border={border} />;
              }}
            />
          ) : (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              {tripStore.recentTrip === null ? (
                <ActivityIndicator />
              ) : (
                <Text_Custom
                  style={{ fontSize: scale(16) }}
                  text="Trips are not available for the day"
                />
              )}
            </View>
          )}
        </ScrollView>
      </View>
      <View style={{ alignItems: "center" }}>
  <Pressable
    style={{
      flexDirection: "row",
   
    }}
    onPress={() => Linking.openURL("https://cogniphi.com/")}
  >
    <Text_Custom text={`All rights reserved © ${currentYear}`} />
    <Text_Custom text={` cogniphi.com`} style={{ color: colors.primary }} />
   
  </Pressable>
  <Text_Custom text={`V${getAppVersion()}`} />

</View>

     
      
    </Container>
  );
};
export default observer(Dashboard);
