/**
 * @format
 */
import { AppRegistry, Text, Platform } from "react-native";
import PushNotification from "react-native-push-notification";
import App from "./App";
import { name as appName } from "./app.json";
import messaging from "@react-native-firebase/messaging";
import bgMessaging from "./Src/Notification/backgroundNotif";
import { exp } from "react-native-reanimated";
import ReactNativeForegroundService from "@supersami/rn-foreground-service";

ReactNativeForegroundService.register();
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
// Text.defaultProps.style = { fontFamily: "NunitoSans-BoldItalic" };

{
  Platform.OS !== "ios" &&
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {});
  AppRegistry.registerHeadlessTask(
    "RNFirebaseBackgroundMessage",
    () => bgMessaging
  );
}
AppRegistry.registerComponent(appName, () => App);
