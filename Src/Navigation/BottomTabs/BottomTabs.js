import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useRef } from "react";
import * as SVG from "../../Assets/SVG";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useTheme } from "@react-navigation/native";
import {
  Animated,
  Dimensions,
  Keyboard,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { scale } from "react-native-size-matters";
import { Dashboard } from "../../index";
import AccountStack from "../AppStack/AccountStack/AccountStack";
import ExpensesStack from "../AppStack/ExpensesStack/ExpensesStack";
import TripStack from "../AppStack/TripStack/TripStack";
import { apiGet, getItem } from "../../Services/apiCalls";
import { setItem } from "../../Services/apiCalls";
import { tripStore } from "../../Store/AuthStore/TripStore";
import { imageStore } from "../../Store/AuthStore/ImageStore";
import { expenseStore } from "../../Store/AuthStore/ExpenseStore";
import ReactNativeCallBack from "../../Utils/gpsService";
import { requestLocationPermission } from "../../Utils/gpsHelper";
import { GET_TRIP_BY_TRIP_ID } from "../../Services/urls";
Icon.loadFont();
const BottomTab = createBottomTabNavigator();
function MyTabBar({ state, descriptors, navigation }) {
  const animatedRef = useRef(null);
  const scrollY = new Animated.Value(0);
  const translateY = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, -60],
  });
  const { colors, dark } = useTheme();
  const navigation2 = useNavigation();
  const tabOffsetValue = useRef(new Animated.Value(0)).current;
  const animateTab = (index) => {
    Animated.spring(tabOffsetValue, {
      toValue: getWidth() * index,
      useNativeDriver: true,
    }).start();
  };
  const [showTab, setShowTab] = React.useState(true);

  useEffect(() => {
    const getFromAsync = async () => {
      try {

        // Retrieve last screen route from AsyncStorage
        var storedScreen = await getItem("lastScreen");
        //if (storedScreen) {
        // console.log("Last screen route in AsyncStorage if storedscree ther:", storedScreen);
        // Ensure the stored screen route contains route information
        // var lastRoute = JSON.parse(storedScreen);
        //console.log("Last route in stored screen:", lastRoute);
        // Extract route name and params


        var trip = await getItem("selectedTrip");
        if (trip != null) {
          var updatedSelectedTrip = await getItem("updatedSelectedTrip");
          //tripStore.selectedTrip = trip;
          tripStore.setSelectedTrip(trip);

          tripStore.setUpdatedSelectedTrip(updatedSelectedTrip);
          var permissionGranted = await requestLocationPermission();
          if (permissionGranted) {
            console.log("permissionGranted");

            try {
              //await getGpsPackets();
              ReactNativeCallBack.startService(tripStore.selectedTrip.tripId, tripStore.selectedTrip.driverId, tripStore.selectedTrip.vehicleId, response => {
                console.log(`Created a new event with id ${response}`);
              },);
            }
            catch (err) {
              console.log("err", err);
            }


          }

          console.log(" tripStore.selectedTrip from bottom_background", tripStore.selectedTrip)
          // tripStore.updatedSelectedTrip = trip;
          var imageStorefromAsync = await getItem("imageStore");
          console.log("🚨imageStore from bottom tab", imageStorefromAsync);

          var mendatoryExpense = await getItem("mendatoryExpense");
          if (mendatoryExpense != null) {
            console.log("mendatoryExpense!=null")
            expenseStore.mendatoryExpense = mendatoryExpense;
          }


          var newMendatoryExpense = await getItem("newMendatoryExpense");
          if (newMendatoryExpense != null) {
            console.log("newMendatoryExpense!=null")
            expenseStore.newMendatoryExpense = newMendatoryExpense;
          }

          var expenseIsAdded = await getItem("expenseIsAdded");
          if (expenseIsAdded != null) {
            console.log("expenseIsAdded!=null")
            expenseStore.ExpenseIsAdded = expenseIsAdded;
          }

          for (const [key, value] of Object.entries(imageStorefromAsync)) {

            imageStore[key] = value;
          }
          console.log("selcted trip from async in bottomtab", trip);
        }

        if (storedScreen) {

          const tripDetails = await apiGet(
            `${GET_TRIP_BY_TRIP_ID}${trip.tripId}`
          )
          if (tripDetails.status === "Completed" || tripDetails.status === "Cancelled") {

            navigation.navigate("Dashboard");
          } 
          else{
            var lastRoute = JSON.parse(storedScreen);
            console.log("Last route in stored screen:", lastRoute);
            console.log("last tab : ", lastRoute[0].name);
  
            //iterate through last route json array
            lastRoute.map((item) => (
              navigation.navigate(lastRoute[0].name.indexOf("Trip") >= 0 ? "Listing" : lastRoute[0].name, {
                screen: item.name,
                params: item.params,
              })
            ));
          }
         
        }

        // }
      } catch (error) {
        console.error("Error occurred while fetching from AsyncStorage:", error);
      }

    };
    getFromAsync();
  }, []);


  useEffect(() => {
    animateTab(state.index);
  }, [state.index]);
  useEffect(() => {
    const Subs = Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
    return () => {
      Subs.remove();
    };
  }, []);
  const _keyboardDidShow = () => {
    setShowTab(false);
    scrollY.setValue(-100);
  };
  const _keyboardDidHide = () => {
    setShowTab(true);
    scrollY.setValue(0);
  };
  return (
    <>
      {showTab && (
        <>
          <Animated.View
            style={{
              flexDirection: "row",
              paddingHorizontal: 10,
              marginBottom: Platform.OS == "ios" ? 20 : 0,
              backgroundColor: colors.SecondaryBackground,
              height: 60,
              // position: "absolute",
              // bottom: 0,
              // left: 0,
              // right: 0,
              // transform: [{ translateY }],
            }}
          >
            <Animated.View
              style={{
                width: getWidth() - scale(40),
                height: 3,
                backgroundColor: colors.primary1,
                position: "absolute",
                bottom: 60,
                // Horizontal Padding = 20...
                left: scale(30),
                borderRadius: 30,
                transform: [{ translateX: tabOffsetValue }],
              }}
            />
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                    ? options.title
                    : route.name;
              const isFocused = state.index === index;
              const onPress = () => {
                animateTab(index);
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                  // The `merge: true` option makes sure that the params inside the tab screen are preserved
                  navigation2.navigate({ name: route.name, merge: true });
                  if (route.name === "Trip") {
                    navigation2.navigate("Trip", {
                      screen: "Trip",
                    });
                  } else {
                    //navigation2.popToTop();
                  }
                }
              };
              const onLongPress = () => {
                navigation.emit({
                  type: "tabLongPress",
                  target: route.key,
                });
              };
              return (
                <TouchableOpacity
                  key={label}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={() => onPress()}
                  onLongPress={() => onLongPress()}
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginVertical: 10,
                  }}
                >
                  <View>{isFocused ? options.iconInActive : options.icon}</View>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        </>
      )}
    </>
  );
}
function getWidth() {
  let width = Dimensions.get("screen").width;
  // Horizontal Padding = 20...
  width = width - scale(20);
  // Total five Tabs...
  return width / 4;
}
const BottomTabs = () => {
  const { colors, dark } = useTheme();
  return (
    <>
      <BottomTab.Navigator
        tabBar={(tabsProps) => <MyTabBar {...tabsProps} />}
        screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}
        options={{ tabBarHideOnKeyboard: true }}
        initialRouteName="Dashboard"
      /*screenListeners={({ navigation }) => ({
        state: (e) => {
          try {
            console.log('state changed', e.data.state.history[e.data.state.history.length-1].key.split("-")[0]);

            setItem("lastTab", e.data.state.history[e.data.state.history.length-1].key.split("-")[0]);
          }
          catch (ex) {
            console.error("error in setting async storage", ex);
          }
        },
      })}*/
      /*screenListeners={({route}) => ({ // listener receives navigation, route
        tabPress: () => {
          try{
          if(route.name === "Dashboard")
            removeItem("lastScreen");
          }
          catch(ex){
            console.error("error in clearing async storage", ex);
          }
        },
      })}*/
      >
        <BottomTab.Screen
          name="Dashboard"
          options={{
            tabBarHideOnKeyboard: true,
            icon: <SVG.Home active={true} />,
            iconInActive: <SVG.Home active={false} />,
          }}
          component={Dashboard}
        />
        <BottomTab.Screen
          name="Listing"
          options={{
            icon: <SVG.Listing active={true} />,
            iconInActive: <SVG.Listing active={false} />,
          }}
          component={TripStack}
        />
        <BottomTab.Screen
          name="TripExpenses"
          options={{
            icon: <SVG.Expense_svg active={true} />,
            iconInActive: <SVG.Expense_svg active={false} />,
          }}
          component={ExpensesStack}
        />
        <BottomTab.Screen
          name="Profile"
          options={{
            tabBarHideOnKeyboard: true,
            icon: <SVG.Profile_svg active={false} />,
            iconInActive: <SVG.Profile_svg active={true} />,
          }}
          component={AccountStack}
        />
      </BottomTab.Navigator>
    </>
  );
};
export default BottomTabs;
