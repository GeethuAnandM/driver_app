// Import necessary modules

import { getAppVersion } from './helper';
import { Alert, Linking } from 'react-native';
import VersionCheck from 'react-native-version-check';
import { checkForForceUpdate } from './versionCheck';

// Mock the required functions
//Mock getAppVersion() from hepler.js
jest.mock('./helper', () => ({
  getAppVersion: jest.fn(),
}));

//Mock getLatestVersion and getPlaystoreUrl methods from react-native-version-check
jest.mock('react-native-version-check', () => ({
  getLatestVersion: jest.fn(),
  getPlayStoreUrl: jest.fn(),
}));

//Mock alert and Linking functionalities from react native
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
  Linking: {
    openURL: jest.fn(),
  },
}));

describe('unit test for checkForForceUpdate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

// testcase:1:if the app version is less than playstore version 
  test('1.should prompt an update when the current app version is less than the Play Store version', async () => {
     // Arrange: Set up the mock return values

  
     VersionCheck.getLatestVersion.mockResolvedValue('2.0.0');//playstore version 

     getAppVersion.mockReturnValue('1.0.0');//app version   
     const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.cogniphi';//playstore url
    VersionCheck.getPlayStoreUrl.mockResolvedValue(playStoreUrl);//playstoreurl

    // Act: Call the function
    await checkForForceUpdate();
   
  // Assert: Check if the correct functions were called with the right parameters
    expect(Alert.alert).toHaveBeenCalledWith(
      'Update Required',
      'A new version of the app is available. Please update to continue using the app.',
      [{ text: 'Update Now', onPress: expect.any(Function) }],
      { cancelable: false }
    );
  });

// testcase:2:when 'updatenow 'button pressed 
   
  test('2.should open Play Store URL when "Update Now" is pressed', async () => {
    // Arrange: Set up the mock return values
    VersionCheck.getLatestVersion.mockResolvedValue('2.0.0');//playstore version
    getAppVersion.mockReturnValue('1.0.0');//app version
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.cogniphi';//playstore url
    VersionCheck.getPlayStoreUrl.mockResolvedValue(playStoreUrl);


    // Act: Call the function
    await checkForForceUpdate();

   //mocking the update press 
    const alertCall = Alert.alert.mock.calls[0][2];
    const updateNowButton = alertCall.find((button) => button.text === 'Update Now');
    
        updateNowButton.onPress();

    // Assert: Check if Linking.openURL was called with the correct URL
    expect(Linking.openURL).toHaveBeenCalledWith(playStoreUrl);
  });

// testcase:3:current app verison is same as playstore version
  test('3.should not prompt an update when the current version is up-to-date', async () => {
    // Arrange: Set up the mock return values
   VersionCheck.getLatestVersion.mockResolvedValue('1.0.0');
    getAppVersion.mockReturnValue('1.0.0');

    // Act: Call the function
    await checkForForceUpdate();

    // Assert: Check that Alert.alert was not called
   // The test verifies if this mock function(aler.alert) was called, based on the logic in checkForForceUpdate.
    expect(Alert.alert).not.toHaveBeenCalled();
  });


  // testcase:4:current app verison is same as playstore version
  test('4.should not prompt an update when the current version is up-to-date', async () => {
    // Arrange: Set up the mock return values
   VersionCheck.getLatestVersion.mockResolvedValue('1.0.0');
    getAppVersion.mockReturnValue('2.0.0');

    // Act: Call the function
    await checkForForceUpdate();

    // Assert: Check that Alert.alert was not called
   // The test verifies if this mock function(aler.alert) was called, based on the logic in checkForForceUpdate.
    expect(Alert.alert).not.toHaveBeenCalled();
  });


// testcase:4:if some error occurs 
test('4.should handle errors gracefully', async () => {
    // Arrange: Set up the mock return values
    VersionCheck.getLatestVersion.mockRejectedValue(new Error('Network error'));

    // Act: Call the function
    await checkForForceUpdate();

    // Assert: Check that Alert.alert was not called
    expect(Alert.alert).not.toHaveBeenCalled();
  });
});
