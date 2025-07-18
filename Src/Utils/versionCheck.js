import { getAppVersion } from "./helper";
import { Alert, Linking} from "react-native";
import VersionCheck from 'react-native-version-check';


// method for checking forceupdate
export const checkForForceUpdate = async () => {
    try {
      //getting playstoreversion
      const playStoreVersion = await VersionCheck.getLatestVersion({
        provider: 'playStore',
        packageName: 'com.cogniphi',
        ignoreErrors: true,
      });
      console.log("playStoreVersion", playStoreVersion);

      //getting current  appcurrent version
      const currentAppVersion = getAppVersion();
      console.log("current_AppVersions", currentAppVersion);
      
      //checking app version greater than playstore version
      if (currentAppVersion < playStoreVersion) {
        console.log("currentAppVersion < playStoreVersion");
       
        //getting playstore url 
        const playStoreUrl = await VersionCheck.getPlayStoreUrl({ packageName: 'com.cogniphi' });
        console.log("playStoreUrl", playStoreUrl);
  
        //showing alert 
        Alert.alert(
          'Update Required',
          'A new version of the app is available. Please update to continue using the app.',
          [
            {
              text: 'Update Now',
              onPress: () => {
                Linking.openURL(playStoreUrl);
              },
            },
          ],
          { cancelable: false }
        );
       
      } else {
        console.log("App is up-to-date; proceed with the app");
       
      }
    } catch (error) {
      console.error('Error checking app version:', error);
    }
  };