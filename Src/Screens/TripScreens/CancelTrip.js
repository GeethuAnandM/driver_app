import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { moderateScale, scale,verticalScale } from "react-native-size-matters";
import { Button } from "../../Components/Button/Button";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import Container from "../../Components/Container/Container";
import Text_Custom from "../../Components/Text_Custom";
import { tripTypes } from "../../Constant/constant";
import { tripStore } from "../../Store/AuthStore/TripStore";
import { addNote, updateTripStatus } from "../../Services/Actions/TripActions";
import { showError, showSuccess } from "../../Utils/helper";

import { observer } from "mobx-react";
const CancelTrip = (props) => {
  const [TripId, setTripId] = useState(props.route.params);
  const [Note, setNote] = useState("");
  const { colors } = useTheme();
  const [height, setHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cancel, setCancel] = useState(false);

  
  const Cancel = async () => {
      setCancel(true);
    if(Note==""){
      showError("please mention the reason to cancel the trip")
    }
    else{
      console.log("cancelllinnghhhhhhh")
      setLoading(true);
      const body = {
        applyForRecurring: true,
        note: Note,
        status: tripTypes[4],
        tripId: TripId.tripID,
      };
      await addNote(Note, "Reason for cancellation",TripId.tripID)
        .then(async (res) => {
          if (res.status) {
            await updateTripStatus(body).then((res) => {
              showSuccess("Trip has been cancelled");
              tripStore.setTripStatus("status", tripTypes[4]);
              setLoading(false);
              props.navigation.navigate("TripDetailsScreen", {
                trip: { tripId: TripId.tripID },
              });
            });
            // props.navigation.navigate("TripDetailsScreen", {
            //   trip: { tripId: TripId.tripID },
            // });
          }
        })
        .catch((err) => {
          console.log("SOMETHING wents WRONG with notes");
        });
    }
    
  };

  return (
    <Container>
      <CommonHeader goBack={true} title={"Cancel Trip"} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: moderateScale(50) }}
        style={{
          backgroundColor: colors.SecondaryBackground,
          borderRadius: 10,
          borderColor: colors.cardBorder,
          borderWidth: 1,
          margin: moderateScale(20),
          paddingHorizontal: moderateScale(12),
          paddingTop: moderateScale(20),
          // paddingVertical: moderateScale(20),
        }}
      >
        <Text_Custom
          text="Reason for cancel trip"
          style={{ fontSize: scale(16), fontFamily: "NunitoSans-Bold" }}
        />
        <View
          style={{
            borderColor: "#CAD7E2",
            //borderWidth: 1,
            borderRadius: scale(5),
            // paddingHorizontal: moderateScale(15),
            // height: scale(190),
            marginVertical: moderateScale(20),
            // justifyContent: "flex-start",
          }}
        >
          {/* <TextInput
            multiline={true}
            numberOfLines={10}
            maxLength={255}
            value={Note}
            onChangeText={(e) => setNote(e)}
            placeholder={"Text Here"}
          /> */}
          <TextInput
            multiline={true}
            numberOfLines={10}
            maxLength={255}
            returnKeyType="done"
            keyboardType="web-search"
            placeholderTextColor={colors.placeholder}
            placeholder={"Text Here"}
            style={{
              fontSize: scale(14),
              fontWeight: "600",
              borderColor: cancel && Note === '' ? 'red' : 'black', // Conditionally set border color
             // borderWidth:  cancel && Note === '' ? 1 : 0, // Conditionally set border width
              borderWidth:  1 ,
              color: colors.text,
              height: Math.max(50, height),
            }}
            onContentSizeChange={(event) => {
              setHeight(event.nativeEvent.contentSize.height);
            }}
            onChangeText={(e) => {
              setNote(e);
            }}
          />
             {(Note==""&& cancel) && (
                      <Text_Custom
                        text="Reason required!"
                        style={{
                          color: colors.error,
                          fontSize: scale(12),
                          textTransform: "capitalize",
                        
                          marginTop: verticalScale(5),
                        }}
                      />
                    )} 
        </View>
       
        <Button
          onPress={() => Cancel()}
          disabled={loading}
          text={loading ? "Loading..." : "Cancel trip"}
          buttonStyles={{ backgroundColor: colors.error }}
        />
      </ScrollView>
    </Container>
  );
};
export default observer(CancelTrip);
const styles = StyleSheet.create({});