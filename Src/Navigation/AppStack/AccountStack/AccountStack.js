import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { setItem } from "../../../Services/apiCalls";
import {
  BataAllowance,
  ChangePassword,
  EditProfileInfo,
  LicenceInfo,
  Profile,
  ProfileInfo,
  EditDriverLicense,
} from "../../..";
const Stack = createStackNavigator();
const AccountStack = () => {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        animationEnabled={true}
        initialRouteName="Profile"
        screenListeners={({ navigation }) => ({
          state: (e) => {
            try {
              console.log('state changed', e.data.state);

              setItem("lastScreen", JSON.stringify(e.data.state.routes));
            }
            catch (ex) {
              console.error("error in clearing async storage", ex);
            }
          },
        })}
      >
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ProfileInfo" component={ProfileInfo} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="BataAllowance" component={BataAllowance} />
        <Stack.Screen name="LicenceInfo" component={LicenceInfo} />
        <Stack.Screen name="EditProfileInfo" component={EditProfileInfo} />
        <Stack.Screen name="EditDriverLicense" component={EditDriverLicense} />
      </Stack.Navigator>
    </>
  );
};
export default AccountStack;
