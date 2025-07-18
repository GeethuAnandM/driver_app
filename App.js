import NetInfo from "@react-native-community/netinfo";
import { observer } from "mobx-react";
import React, { useEffect, useLayoutEffect, useState ,useRef} from "react";
import { Platform, Linking, PermissionsAndroid, Alert, LogBox, StyleSheet } from "react-native";
import RNBootSplash from "react-native-bootsplash";
import FlashMessage from "react-native-flash-message";
import { enableLatestRenderer } from "react-native-maps";
import { Provider as PaperProvider } from "react-native-paper";
import PushNotification from "react-native-push-notification";
import Routes from "./Src/Navigation/Routes";
import NoInternetScreen from "./Src/Screens/NoInternetScreen";
// import NoSettingsScreen from "./Src/Screens/NoSettingsScreen";
import { getDrivers } from "./Src/Services/Actions/AuthActions";
import { getExpenseByDriverID, getExpenseTypes } from "./Src/Services/Actions/ExpenseAction";
import { getAuthData, getItem, getUSER_CRED, setItem } from "./Src/Services/apiCalls";
import { authStore } from "./Src/Store/AuthStore/AuthStore";
import { loaderStore } from "./Src/Store/AuthStore/LoaderStore";
import NotifService from "./Src/Notification/notify/NotifService";
import messaging from "@react-native-firebase/messaging";
import ErrorBoundary from "./Src/Components/ErrorBound/ErrorBoundary";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

//import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { check_PERMISSIONS_STATUS, checkLocationPermissions, getAppVersion, startBackgroundTracking, updateGcmDetails } from "./Src/Utils/helper";
import analytics from '@react-native-firebase/analytics';
import { Link } from "@react-navigation/native";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";

 import { checkForUpdate, UpdateFlow } from 'react-native-in-app-updates';
import { getMixpanel, trackEvents } from "./Src/Utils/MixpanelService";
import { AppState } from 'react-native';
import CustomAlert from "./Src/Components/CustomAlert";
import { alertStore } from "./Src/Store/AuthStore/AlertStore";


LogBox.ignoreAllLogs();
const App = observer(() => {
  const [uuid, setUUID] = useState(null);
  const[askedProminent,setAskedProminent]=useState(null);
  let notfy;
  const [Splash, setSplash] = React.useState(true);
  // const [appState, setAppState] = useState(AppState.currentState);
  const [netInfo, setNetInfo] = useState({
    details: {},
    isConnected: true,
    isInternetReachable: true,
    isWifiEnabled: false,
    type: "none",
  });

  let boolLocationApproxGranted = false;
  let boolLocationFineGranted = false;
  let boolLocationBackGranted = false;
  let boolCameraGranted = false;
  let boolInternetGranted = false;
  let boolMediaGranted = false;
  let boolNotificationGranted = false;
  let boolEXTReadGranted = false;
  let boolEXTWriteGranted = false;

  let backgroundStartTime = null; 

  const AlertProminentDisclosure =  async() => {
    var askedForProminent=await getItem("askedProminent");
     
    if(askedForProminent==null){
      await setItem('askedProminent', 'true');
   
      Alert.alert(
             null,
              "ITAC collects location data to enable the background tracking while in trip even when the app is closed or not in use",
         
        [
          {
            text: 'Accept',
            style: 'destructive',
            onPress:  () => {
              if (Platform.OS === 'ios') {
                //Linking.openURL('app-settings:');
              } else {
                //Linking.openSettings();
             
                 requestPermissions();
              }
              // Resolve with true when 'Accept' is pressed
            },
          },
          {
            text: 'Deny',
            onPress: () => {
            
               requestPermissions()
              // Resolve with false when 'Deny' is pressed
            },
            style: 'cancel',
          },
        ],
        { cancelable: false } // Prevents the user from dismissing the alert by tapping outside it
      );
    }
   
  };
  
  const AlertOpenSettings = async (permissionName) => {
    Alert.alert(
      `🚨 Enable ${permissionName}`,
      "Enable all the app permissions.",
      [
        {
          text: "Open Settings",
          style: "destructive",
          onPress: () => {
            if (Platform.OS === "ios") {
              Linking.openURL("app-settings:");
            } else {
              Linking.openSettings();
            }
          },
        }
      ]
    );
  };

  const requestPermissions = async () => {
    try {

    
      
      if (Platform.OS === 'android') {
     


        // Notification Access Permission
        {
          try {
            const permissionNotificationGranted = check_PERMISSIONS_STATUS(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
           
            boolNotificationGranted = true;
          }
          catch (error) {
          
            boolNotificationGranted = false;
            AlertOpenSettings(`Notification Permission`);
          }
        }

        // Camera Access Permission
        {
          const permissionCameraGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Access Permission',
              message:
                'ITAC App needs access to Camera Access Permission ' +
                'so you can take photos like Odometer, Selfi etc.',
              // buttonNeutral: 'Ask Me Later',
              // buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (permissionCameraGranted === PermissionsAndroid.RESULTS.GRANTED) {
        
            boolCameraGranted = true;
          } else {
          
            boolCameraGranted = false;requestPermissionsaskedProminent
            AlertOpenSettings(`Camera Access Permission`)
          }
        }
        // Approx Location Permission
        {
          try {
            // Using Android Native
            // const permissionLocationApproxGranted = check_PERMISSIONS_STATUS(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
            // boolLocationApproxGranted = true;

            // Using React Native
            {
              const permissionLocationApproxGranted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                {
                  title: 'Approx Location Permission',
                  message:
                    'ITAC App needs access to Approx Location Permission ' +
                    'so you can continue even no mobile signal.',
                  // buttonNeutral: 'Ask Me Later',
                  // buttonNegative: 'Cancel',
                  buttonPositive: 'OK',
                },
              );
              if (permissionLocationApproxGranted === PermissionsAndroid.RESULTS.GRANTED) {
             
                boolLocationApproxGranted = true;
              } else {
             
                boolLocationApproxGranted = false;
                AlertOpenSettings(`Approx Location Permission`)
              }
            }
          }
          catch (error) {
         
            boolLocationApproxGranted = false;
            AlertOpenSettings(`Approx Location Permission`)
          }
        }

        // Fine Location Permission        
        {
          try {
            // Using Android Native
            //   const permissionLocationFineGranted = check_PERMISSIONS_STATUS(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            //   boolLocationFineGranted = true;

            // Using React Native
            {
              const permissionLocationFineGranted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                  title: 'Fine Location Permission',
                  message:
                    'ITAC App needs access to Fine Location Permission ' +
                    'so you can be accurate when mobile signal is avilable.',
                  // buttonNeutral: 'Ask Me Later',
                  // buttonNegative: 'Cancel',
                  buttonPositive: 'OK',
                },
              );
              if (permissionLocationFineGranted === PermissionsAndroid.RESULTS.GRANTED) {
              
                boolLocationFineGranted = true;
              } else {
               
                boolLocationFineGranted = false;
                AlertOpenSettings(`Fine Location Permission`)
              }
            }
          }
          catch (error) {
            
            boolLocationFineGranted = false;
            AlertOpenSettings(`Fine Location Permission`)
          }
        }

        // Media Access Permission
        {
          const permissionMediaGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_MEDIA_LOCATION,
            {
              title: 'Media Access Permission',
              message:
                'ITAC App needs access to Media Access Permission ' +
                'so you can share your Documents like Odometer, Customer Signature etc.',
              // buttonNeutral: 'Ask Me Later',
              // buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (permissionMediaGranted === PermissionsAndroid.RESULTS.GRANTED) {
          
            boolMediaGranted = true;
          } else {
          
            boolMediaGranted = false;
            AlertOpenSettings(`Media Access Permission`)
          }
        }       
       

        // Background Location Permission
        {
          try {
            // Using Android Native
            const permissionLocationBackGranted = check_PERMISSIONS_STATUS(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
            boolLocationBackGranted = true;

            // Using React Native
            {
              const permissionLocationBackGranted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
                {
                  title: 'Background Location Permission',
                  message:
                    'ITAC App needs access to Background Location Permission ' +
                    'so you can be accurate even App runs in Background.',
                  // buttonNeutral: 'Ask Me Later',
                  // buttonNegative: 'Cancel',
                  buttonPositive: 'OK',
                },
              );
              if (permissionLocationBackGranted === PermissionsAndroid.RESULTS.GRANTED) {
             
                boolLocationFineGranted = true;
              } else {
              
                boolLocationFineGranted = false;
                AlertOpenSettings(`Background Location Permission`)
              }
            }
          }
          catch (error) {
          
            boolLocationBackGranted = false;
            AlertOpenSettings(`Background Location Permission`)
          }
        }

        // Storage Read Permission
        {
          try {
            const permissionEXTReadGranted = check_PERMISSIONS_STATUS(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
            boolEXTReadGranted = true;
          }
          catch (error) {
           
            boolEXTReadGranted = false;
            AlertOpenSettings(`Storage Read Permission`);
          }
        }

        // Storage Write Permission
        {
          try {
            const permissionEXTWriteGranted = check_PERMISSIONS_STATUS(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
            boolEXTWriteGranted = true;
          }
          catch (error) {
        
            boolEXTWriteGranted = false;
            AlertOpenSettings(`Storage Write Permission`);
          }
        }
      }

    } catch (err) {
     
      Alert.alert(`🚨 Ensure Settings > App Settings > All Permissions Enabled`);

      boolLocationApproxGranted = false;
      boolLocationFineGranted = false;
      boolLocationBackGranted = false;
      boolCameraGranted = false;
      boolInternetGranted = false;
      boolMediaGranted = false;
      boolNotificationGranted = false;
      boolEXTReadGranted = false;
      boolEXTWriteGranted = false;
    }

    if (
      boolLocationApproxGranted
      && boolLocationFineGranted
      && boolLocationBackGranted
      && boolCameraGranted
      && boolInternetGranted
      && boolMediaGranted
      && boolNotificationGranted
      && boolEXTReadGranted
      && boolEXTWriteGranted
    ) { return true; }
    else { return false; }
  };
  const appStateRef = useRef(AppState.currentState);
  const handleAppStateChange = async (nextAppState) => {
    console.log("nextAppStatessss",nextAppState)
    var prevState = appStateRef.current;
    appStateRef.current = nextAppState;
    console.log("prevStatessss",prevState)
    const currentTime = Date.now();

    // 🔔 Fire update check only on resume from background
    // if (prevState === "background" && nextAppState === "active") {
    //   console.log("Resumed from background – checking for updatesssss");
    //   await  mandateUpdate().catch(console.warn);
    // }

    /* ---------------- existing analytics & timers ---------------- */
    if (nextAppState === "active") {
      prevState="active";
      console.log("App is in foregroundssss!");

      // Retrieve stored background start time
      const storedTime = await AsyncStorage.getItem("backgroundStartTime");
      if (storedTime) {
        const timeSpentInBackground = currentTime - parseInt(storedTime, 10);
        console.log(`App was in the background for ${timeSpentInBackground} ms`);
        trackEvents("App Resumed", { duration_ms: timeSpentInBackground });
        await AsyncStorage.removeItem("backgroundStartTime");
      } else {
        trackEvents("App Resumed");
      }
    } else if (nextAppState === "background") {
      console.log("App moved to the background!");
      await AsyncStorage.setItem("backgroundStartTime", currentTime.toString());
      trackEvents("App Moved to Background");
    } else if (nextAppState === "inactive") {
      console.log("App is inactive (maybe switching tasks)");
      trackEvents("App Became Inactive");
    }
  };

  
// useEffect(() => {
//   getData().catch(console.warn); // run once on launch
// }, []);

  useEffect(() => {
    getMixpanel();
   
    trackEvents("App launched")
    console.log("dufiudhfdsh");
  
    // Initialize Firebase Analytics
    analytics().setAnalyticsCollectionEnabled(true);
  
    const init = async () => {
      AlertProminentDisclosure();
      notfy = new NotifService(onRegister, onNotif);
      loaderStore?.setIsLoading(true);
      
      var token = await getAuthData();
      var userAuthData = await getUSER_CRED();
      if (userAuthData !== null) authStore?.setAuthData(userAuthData);
  
      if (token?.driver_id) {
        await getDrivers().then((res) => expenseInit(token?.driver_id));
        authStore.setLogin(true);
      }
    };
  
    init().finally(async () => {
      await RNBootSplash.hide({ fade: true });
      loaderStore.setIsLoading(false);
    //  await  mandateUpdate().catch(console.warn);
      await appUpdate();
    });
  
    // Move AppState Listener here
    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      console.log("Removing AppState listener");
      subscription.remove();
    };
  
  }, []);
  const createChannels = () => {
    PushNotification.createChannel({
      channelId: "test",
      channelName: "channel name",
    });
  };
  useLayoutEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetInfo(state);
      // if (state.isConnected && !state.isInternetReachable) {
      //   Toast.show('Internet connection is too slow.!!');
      // }
    });
    // Unsubscribe
    return () => {
      unsubscribe();
    };
  }, []);

  

  const expenseInit = async (id) => {
    await getExpenseTypes();
    await getExpenseByDriverID(id);
  };
  const onRegister = async (token) => {
    try {

      
      const FCM = await getItem("FCM");
   
      if (FCM === null) {
        await setItem("FCM", {
          registerToken: token.token,
          fcmRegistered: true,
        });
        return true;
      }
    } catch (e) {
     
    }
  };
  // async function mandateUpdate() {
  //   try {
  //    console.log("mandateUpdatelauncchhhhh>>>>>>>>>>>>>>>>>>>>")
  //     await checkForUpdate(UpdateFlow.IMMEDIATE);
  //   //  const data = await checkForUpdate(UpdateFlow.IMMEDIATE)

  //   } catch (e) {
  //     // Handle error
  //   }
  // }

  const onNotif = (notif) => {
    //Alert.alert(notif.title, notif.message);
    notfy.localNotif(notif);
  };
  const appUpdate = async () => {
  
    var driverLogin = await getAuthData();
    if (driverLogin !== null) {
      var storedVersion = await AsyncStorage.getItem("appVersion");
      if (storedVersion == null) {
        var gcmResponse = await updateGcmDetails();
      }
      else {
        var appVersion = getAppVersion();
        var appVersionAlreadyExists = storedVersion.replace(/^"(.*)"$/, '$1');
        if (appVersion !== appVersionAlreadyExists) {
          // Update GCM details
          var gcmResponse = await updateGcmDetails();

        } else {
         
        }
      }
    }
    else {
     
    }
  };

  const handlePerm = (perms) => {
    Alert.alert("Permissions", JSON.stringify(perms));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <PaperProvider>
          {
            !netInfo?.isInternetReachable ? (
              <NoInternetScreen />
            ) : (
              <>
                <Routes />
                <FlashMessage position="top" />
              </>
            )
          }
          {/* // title, message, confirmText = "OK", onConfirm = null */}
          {alertStore.visible && (
  <CustomAlert
    visible={alertStore.visible}
    setVisible={() => alertStore.hide()}
    title={alertStore.title}
    message={alertStore.message}
    buttonText={alertStore.confirmText}
    onConfirm={alertStore.onConfirm}
  />
)}

      
   
        </PaperProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
});

const styles = StyleSheet.create({});

export default App;
