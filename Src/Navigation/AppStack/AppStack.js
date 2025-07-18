import React from "react";
// import Notification from "../../Screens/Notification";
// import NavigateTrip from "../../Screens/TripScreens/NavigateTrip";
import BottomTabs from "../BottomTabs/BottomTabs";
import { Notification, NavigateTrip, PendingTrips } from "../../index";
const AppStack = (Stack) => {
  return (
    <>
      <Stack.Screen name="Bottom" component={BottomTabs} />
      {/* <Stack.Screen name="NavigateTrip" component={NavigateTrip} /> */}
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="PendingTrips" component={PendingTrips} />
      {/* <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="Profile" component={Profile} /> */}
    </>
  );
};
export default AppStack;
