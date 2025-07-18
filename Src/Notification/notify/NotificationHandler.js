import PushNotification from "react-native-push-notification";

import { MARK_AS_READ } from "../../Services/urls";
import { markAsRead, markNoteAsRead } from "../../Services/Actions/AuthActions";
import { alertStore } from "../../Store/AuthStore/AlertStore";
import { tripStore } from "../../Store/AuthStore/TripStore";




class NotificationHandler {
  async onNotification(notification) {
    console.log("Notification received:", notification);

    const notificationId = notification.data?.notificationId;
    const title = notification.data?.title;
    const rawBody = notification.data?.body;
    
    console.log("notificationId", notificationId);
    console.log("body of notification", rawBody);
    
    let parsedBody = [];
    let tripId = null;
    if(title === "Trip Note Updated" || title === "Trip Updated"){
    console.log("title",title)
      try {
        parsedBody = JSON.parse(rawBody);
      } catch (e) {
        console.error("❌ Failed to parse notification body JSON:", e);
      }
      
      const isValidParsedBody = Array.isArray(parsedBody);
      if (!isValidParsedBody) {
        console.warn("⚠️ Notification body is not a valid JSON array.");
        return;
      }
      
      // Extract trip ID if present
      if (title === "Trip Note Updated" || title === "Trip Updated") {
        tripId = parsedBody.find(item => item.path === "/trip")?.value;
      }
      
      // Function to show alert
      const showAlert = async ({ alertTitle, message, extraAction }) => {
        alertStore.show({
          title: alertTitle,
          message: message || "No update available",
          confirmText: "OK",
          onConfirm: async () => {
            try {
              await markAsRead(notificationId);
              if (typeof extraAction === 'function') await extraAction();
              console.log("✅ Notification marked as read");
            } catch (err) {
              console.error("❌ Failed to mark notification as read", err);
            }
          }
        });
      };
      
      // Trip Note Updated handler
      if (title === "Trip Note Updated" && tripId === tripStore.selectedTrip?.tripId) {
        console.log("notesval",parsedBody)
        const notesValue = parsedBody.find(item => item.path === "/note")?.value || "Note updated";

   
        showAlert({
          alertTitle: `Trip Note Updated (${tripStore.selectedTrip?.uuid})`,
          message: notesValue,
          extraAction: () => markNoteAsRead(tripId)
        });
      }
      
      // Trip Updated handler
      
      else if (title === "Trip Updated" && tripId === tripStore.selectedTrip?.tripId) {
        const formatLabel = (path) => {
          const key = path.split("/").pop() || "";
          return key
            .replace(/([A-Z])/g, ' $1') // Split camelCase
            .replace(/_/g, ' ')         // Replace underscores
            .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize words
        };
      
        const message = parsedBody
          .filter(item => item.path !== "/trip")
          .map(item => `${formatLabel(item.path)}: ${item.value}`)
          .join("\n");
      
        showAlert({
          alertTitle: `Trip Updated (${tripStore.selectedTrip?.uuid})`,
          message
        });
      }
      
      // Other
      else {
        console.log("someother");
      }
      
    }
    else{
      console.log("someother notification")
    }
    
    // Safely parse JSON body
   
  


   

    // 👇 Show an alert when notification comes
    // Alert.alert(
    //   notification.title || "Notification",
    //   notification.message || "You have a new message",
    //   [{ text: "OK", onPress: () => {console.log("OK Pressed");
    //   markAsRead(notificationId )} }],
    //   { cancelable: true }
    // );

    if (typeof this._onNotification === "function") {
      this._onNotification(notification);
    }
  }


  onRegister(token) {
    if (typeof this._onRegister === "function") {
      this._onRegister(token);
    }
  }

  onAction(notification) {
    console.log("Action clicked:", notification.action);
    if (notification.action === "Yes") {
      PushNotification.invokeApp(notification);
    }
  }

  onRegistrationError(err) {
    console.log("Registration error:", err);
  }

  attachRegister(handler) {
    this._onRegister = handler;
  }

  attachNotification(handler) {
    this._onNotification = handler;
  }
}
 

const handler = new NotificationHandler();

PushNotification.configure({
  onRegister: handler.onRegister.bind(handler),
  onNotification: handler.onNotification.bind(handler),
  onAction: handler.onAction.bind(handler),
  onRegistrationError: handler.onRegistrationError.bind(handler),
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});

export default handler;
