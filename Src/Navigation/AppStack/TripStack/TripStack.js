import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { setItem } from "../../../Services/apiCalls";
import {
  AddBill,
  AddDoc,
  AddDocOdometer,
  AddFuelMeter,
  AddNote,
  AddSelfie,
  CancelTrip,
  StartTrip,
  Trip,
  TripDetailsScreen,
  AddDocStart,
  AddDocFinish,
  MendatoryExp,
  StartOdometer,
  StartFuel,
  StartSelfie,
  StartDocCheck,
  EndOdometer,
  EndFuel,
  EndSelfie,
  EndDocCheck,
  FullScreenMap,
  EndSignature,
  EndStarFeedback,

  AddOtp,
  AddStarFeedback,
  TripScreenFeedback,
  AddSignature,
  SignatureArea,
  EndSignatureArea,
  NavigateTrip,
  //MobileNavigation

} from "../../..";

const Stack = createStackNavigator();

const TripStack = () => {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        animationEnabled={true}
        initialRouteName="Trip"
        screenListeners={({ navigation }) => ({
          state: (e) => {
            /*try {
              console.log('state changed', e.data.state.routes);

              setItem("lastScreen", JSON.stringify(e.data.state.routes));
            }
            catch (ex) {
              console.error("error in clearing async storage", ex);
            }*/
          },
        })}
      >
        <Stack.Screen name="Trip" component={Trip} />
        <Stack.Screen name="TripDetailsScreen" component={TripDetailsScreen} />
        <Stack.Screen name="AddDocOdometer" component={AddDocOdometer} />
        <Stack.Screen name="AddFuelMeter" component={AddFuelMeter} />
        <Stack.Screen name="AddSelfie" component={AddSelfie} />
        <Stack.Screen name="AddDoc" component={AddDoc} />

        <Stack.Screen name="AddOtp" component={AddOtp} />
        <Stack.Screen name="AddSignature" component={AddSignature} />
        {/* <Stack.Screen name="SignatureArea" component={SignatureArea} />  */}
        <Stack.Screen name="AddStarFeedback" component={AddStarFeedback} />
        <Stack.Screen name="TripScreenFeedback" component={TripScreenFeedback} />
        {/* <Stack.Screen name="MobileNavigation" component={MobileNavigation} /> */}

        <Stack.Screen name="AddDocStart" component={AddDocStart} />
        <Stack.Screen name="AddDocFinish" component={AddDocFinish} />
        <Stack.Screen name="StartTrip" component={StartTrip} />


        <Stack.Screen name="AddBill" component={AddBill} />
        <Stack.Screen name="CancelTrip" component={CancelTrip} />
        <Stack.Screen name="AddNote" component={AddNote} />
        <Stack.Screen name="MendatoryExp" component={MendatoryExp} />

        <Stack.Screen name="StartOdometer" component={StartOdometer} />
        <Stack.Screen name="StartFuel" component={StartFuel} />
        <Stack.Screen name="StartSelfie" component={StartSelfie} />
        <Stack.Screen name="StartDocCheck" component={StartDocCheck} />
<Stack.Screen name="NavigateTrip" component={NavigateTrip} />
        <Stack.Screen name="EndOdometer" component={EndOdometer} />
        <Stack.Screen name="EndFuel" component={EndFuel} />
        <Stack.Screen name="EndSelfie" component={EndSelfie} />
        <Stack.Screen name="EndSignature" component={EndSignature} />
        {/* <Stack.Screen name="EndSignatureArea" component={EndSignatureArea} /> */}
        <Stack.Screen name="EndStarFeedback" component={EndStarFeedback} />

        <Stack.Screen name="EndDocCheck" component={EndDocCheck} />
        <Stack.Screen name="FullScreenMap" component={FullScreenMap} />
      </Stack.Navigator>
    </>
  );
};

export default TripStack;
