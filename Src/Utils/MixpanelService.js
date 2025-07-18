
// utils/mixpanelClient.js
import { Mixpanel } from "mixpanel-react-native";
import { imageStore } from "../Store/AuthStore/ImageStore";
import { getCompassDirection } from "geolib";
import { getCompleteDeviceInfo } from "./helper";

let mixpanelInstance = null;

export const getMixpanel = () => {
  if (!mixpanelInstance) {
    const trackAutomaticEvents = true;
    mixpanelInstance = new Mixpanel("87eef3dc1b717d846f7acdc499eeebf3", trackAutomaticEvents);//qa
   //s mixpanelInstance = new Mixpanel("9e560f15e39e612d2c6aa7903b39246f", trackAutomaticEvents);//prod
    mixpanelInstance.init();
    
  }
 
  return mixpanelInstance;
};
//for events
export const trackEvents=(eventName,properties)=>{
  var mixPanel=getMixpanel();
  mixPanel.track(eventName, properties);
}




//for buttonclicks
export const trackButtonClick=(text)=>{
   var mixPanel=getMixpanel();
   mixPanel.track('button clicked', {
    label: text,
   screen:imageStore.currentScreen.name

  
  });
}



//tracking screen
export const trackScreen=(currentscreen)=>{
  imageStore.setCurrentScreen(currentscreen);

  var mixPanel=getMixpanel();
  
  mixPanel.track('screen tracked', {
    screen: currentscreen
  });
}



// When the user captures an image with the camera
export  const trackImageCapture = (imageData) => {
    // Track the image capture event
  
    var mixPanel=getMixpanel();
    mixPanel.track('image captured by cameras', {
      'Image Size': imageData.size || "N/A",
      'Image Format': imageData.format || "N/A",
      'Screen': imageData.screen || "N/A",
      'latitude': imageData.lat || "N/A",   
      'longitude': imageData.long || "N/A", 
      
    });
    
    // Your existing image capture handling code
    // ...
  };
//login event
export const trackLogin=(userId,email)=>{
  var mixPanel=getMixpanel();
  mixPanel.track('Sign In', {
  'Login Method': 'Email', // or other methods like 'Google', 'Facebook', etc.
  'email':email,
  'userId':userId,
  'Success': true
});
}
//user creation
export const setUserProperties=async(userId,email,name,org)=>{
  
console.log("setuserproperties")
  var mixPanel=getMixpanel();
 console.log("userId",userId);
 console.log("email",email);
 console.log("name",name);
 console.log("org",org);
  const deviceInfo = await getCompleteDeviceInfo();
  
  mixPanel.identify(String(userId));

// Now set user properties
mixPanel.getPeople().set({
  $email: email,
  $name: name,
  org: org,
  loginTime: new Date().toISOString(),
 
  ...deviceInfo
});
}
