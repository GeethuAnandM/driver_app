import messaging from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import { getItem, setItem } from "../services/storageServices";

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    // GetFCMToken();
  }
}

async function GetFCMToken() {
  let fcmToken = await getItem("fcmToken");
  if (!fcmToken) {
    try {
      const FCM = await messaging().getToken();
      if (FCM) {
        console.log("NEW TOKEN", FCM);

        await setItem("fcmToken", FCM);
      }
    } catch (error) {
      console.log("error", error);
    }
  } else {
    let oldToken = await getItem("fcmToken");
  }
}
export async function NotificationListner() {
  messaging()
    .getInitialNotification()
    .then(async (remoteMessage) => {
      if (remoteMessage) {
        // notifyService.localNotif(remoteMessage);
        // showToast(
        //   'getInitialNotification:' +
        //     'Notification caused app to open from quit state',
        // );
      }
    });

  messaging().onNotificationOpenedApp((remoteMessage) => {
    // notifyService.localNotif(remoteMessage);
  });

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        // notifyService.localNotif(remoteMessage);
      }
    });

  messaging().onMessage(async (remoteMessage) => {
    notifyService.localNotif(remoteMessage);
  });
}
const ShowNotification = (remoteMessage) => {
  const details = {
    channelId: "test",
    title: remoteMessage.notification.title,
    message: remoteMessage.notification.body,
  };
  PushNotification.localNotification(details);
};
