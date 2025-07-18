import analytics from '@react-native-firebase/analytics';

// Log a screen view
export const logScreenView = async (screenName) => {   
    await analytics().logScreenView({
        screen_class: screenName,
        screen_name: screenName,
    });
    console.log('Log a screen view');
}

// Log a custom event
export const logCustomEvent = (eventName, eventParams) => {
    try{
        analytics().logEvent(eventName.replace(/\s/g, "_"), eventParams);
    
        console.log(`Log ${eventName}`);
    }
    catch(err)
    {
       console.log("error in analytics",err) 

    }
    
}
