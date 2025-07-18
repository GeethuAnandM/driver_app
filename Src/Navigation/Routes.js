import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { observer } from "mobx-react";
import React from "react";
import { useColorScheme } from "react-native";
import { Host } from "react-native-portalize";
import { authStore } from "../Store/AuthStore/AuthStore";
import AppStack from "./AppStack/AppStack";
import AuthStack from "./AuthStack/AuthStack";
import { getScreen, trackScreen } from "../Utils/MixpanelService";
//LogBox.ignoreAllLogs();
const Stack = createNativeStackNavigator();
const myLight = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primaryBackground1: "#F5F5F5",
    primaryBackground2: "#F5F5F5",
    cardBorder: "#ffffff",
    SecondaryBackground: "#fff",
    background: "#ffffff",
    border: "rgba(202, 215, 226, 0.67)",
    card: "rgb(255, 255, 255)",
    gradientStart: "#2196F3",
    gradientEnd: "#0271CA",
    notification: "rgb(255, 59, 48)",
    primary1: "#2196F3",
    lightBlue: "#DBEFFF",
    text: "#000000",
    error: "#EF3131",
    placeholder: "rgba(0, 0, 0, 0.5)",
    inputBackground: "#ffffff",
    inActiveTab: "#9CB7CD",
    notStartedText: "#FFAA2B",
    notStarted: "#FFEAC0",
    inProgressText: "#2196F3",
    inProgress: "#E9F6FF",
    completedText: "#3BBB57",
    completed: "#96FFA0",
    cancelText: "#DC2127",
    cancel: "#FFAFAF",
  },
};
const myDark = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primaryBackground1: "#000000",
    primaryBackground2: "#151515",
    SecondaryBackground: "#151515",
    cardBorder: "#1E1E1E",
    background: "#000000",
    border: "#303030",
    card: "rgb(255, 255, 255)",
    gradientStart: "#2196F3",
    gradientEnd: "#0271CA",
    notification: "rgb(255, 59, 48)",
    primary1: "#2196F3",
    lightBlue: "#DBEFFF",
    text: "#FFFFFF",
    error: "#EF3131",
    placeholder: "#8f8d8d",
    inputBackground: "#1c1a1a",
    inActiveTab: "#9CB7CD",
    notStartedText: "#FFAA2B",
    notStarted: "#FFEAC0",
    inProgressText: "#2196F3",
    inProgress: "#E9F6FF",
    completedText: "#3BBB57",
    completed: "#96FFA0",
    cancelText: "#DC2127",
    cancel: "#FFAFAF",
  },
};
export default Routes = observer(() => {
  const scheme = useColorScheme();
//   <NavigationContainer
//   onStateChange={(state) => {
//     if (state) {
//       const currentRoute = state.routes[state.index].name;
//       trackScreen(currentRoute); // Track screen changes
//     }
//   }}
// >
const getActiveRouteName = (state) => {
  if (!state || !state.routes || state.index == null) {
    return null;
  }

  let route = state.routes[state.index];

  // Recursively dive into nested navigators
  while (route.state && route.state.index != null) {
    route = route.state.routes[route.state.index];
  }

  return route.name; // Get the final active screen name
};
  return (
    <NavigationContainer theme={scheme === "dark" ? myLight : myLight}
    onStateChange={(state) => {
      const currentScreen = getActiveRouteName(state);
      if (currentScreen) {
        trackScreen(currentScreen); // Track the correct screen in Mixpanel
      }
    }}>
      <Host>
        <Stack.Navigator
          headerMode={false}
          animationEnabled={true}
          screenOptions={{
            headerShown: false,
          }}
        >
          {authStore?.userData?.islogin ? AppStack(Stack) : AuthStack(Stack)}
          
        </Stack.Navigator>
      </Host>
    </NavigationContainer>
  );
});
