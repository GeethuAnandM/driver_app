import { useNavigation, useTheme } from "@react-navigation/native";
import { observer } from "mobx-react";
import React, { useRef, useState } from "react";
import { Alert, Dimensions, Image, StyleSheet, View ,Modal} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { moderateScale, scale } from "react-native-size-matters";

//For Below packages Refer: https://www.npmjs.com/package/react-native-signature-canvas
import SignatureCanvas from "react-native-signature-canvas";
import { AirbnbRating } from "react-native-ratings";
import {
  postFeedback,
  postSignature,
  uploadSignature
} from "../../../Services/Actions/TripActions";
import { setItem } from "../../../Services/apiCalls";
import { imageStore } from "../../../Store/AuthStore/ImageStore";
import { tripStore } from "../../../Store/AuthStore/TripStore";
import { trackImageCapture } from "../../../Utils/MixpanelService";
import {
  getCurrentDateTime,
  getLocation,
  showError,
  showSuccess,
} from "../../../Utils/helper";
import { Button } from "../../Button/Button";
import CommonHeader from "../../CommonHeader/CommonHeader";
import Container from "../../Container/Container";
import Button_Modalize from "../../Modalize/Button_Modalize";
import Text_Custom from "../../Text_Custom";

const EndSignature = (props, { text, onOK }) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [isSignatureDrawn, setIsSignatureDrawn] = useState(false);
  const selectTrip = tripStore.selectedTrip;
  // const tripId = tripStore.selectedTrip.tripId;
  const [saveClicked, SetSaveClicked] = useState(false);
  const modalizeRef = useRef(null);
  const { customerSignatureValidation } = tripStore.selectedTrip;
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingShown, setRatingShown] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingError, setRatingError] = useState("");
   const { driverId, tripId, customerId } = tripStore.selectedTrip;
  const styles = StyleSheet.create({
    main_container: {
      marginHorizontal: moderateScale(20),
    },
    heading: {
      fontFamily: "NunitoSans-Bold",
      fontSize: scale(20),
    },
    Sub_heading: {
      fontFamily: "NunitoSans-Regular",
      fontSize: scale(14),
      marginTop: moderateScale(5),
    },
    signatureCanvasView: {
      width: Dimensions.get("screen").width - 60,
      height: scale(200),
      borderWidth: 2,
      borderColor: colors.primary1,
      borderRadius: 20,
      overflow: "hidden",
      marginTop: moderateScale(40),
      marginBottom: moderateScale(20),
      justifyContent: "center",
    },
    signatureImage: {
      resizeMode: "stretch",
      width: Dimensions.get("screen").width - 60,
      height: scale(200),
      borderWidth: 0,
      borderColor: colors.primary1,
      borderRadius: 20,
      overflow: "hidden",
      marginTop: moderateScale(40),
      marginBottom: moderateScale(20),
      justifyContent: "center",
    },
    retackBtn: {
      width: "40%",
      backgroundColor: colors.SecondaryBackground,
      borderWidth: 1,
      borderColor: colors.primary1,
      borderRadius: 5,
    },
    uplodeBtn: {
      width: "40%",
      borderRadius: 5,
    },
    uplodeRetake: {
      flexDirection: "row", // Set flexDirection to 'row' to arrange children horizontally
      alignItems: "center", // Optional: Align items vertically in the center
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",

      marginBottom: moderateScale(20),
      paddingHorizontal: moderateScale(20),
    },
    captureTime: {
      fontSize: 14,
      color: "#000", // Changed to black
      marginBottom: 10, // Adjust spacing as needed
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    
    ratingModal: {
      width: "85%",
      backgroundColor: "#fff",
      borderRadius: 20,
      padding: moderateScale(20),
      alignItems: "center",
    },
    
    thumbButton: {
      marginTop: moderateScale(20),
      backgroundColor: colors.primary1,
      width: moderateScale(60),
      height: moderateScale(60),
      borderRadius: moderateScale(30),
      justifyContent: "center",
      alignItems: "center",
    },
    
    thumbText: {
      fontSize: scale(28),
      color: "#fff",
    },
  });

  //🚨 🚨 🚨 🚨 react-native-signature-canvas: START 🚨 🚨 🚨 🚨
  let signatureRef = useRef({});
  // Called after ref.current.readSignature() reads a non-empty base64 string
  const handleOK = async (signatureNewBase64) => {
    try {
      let signatureNew = signatureNewBase64.replace(
        "data:image/png;base64,",
        ""
      );
      let signatureOld = imageStore.EndSignature.image;
      if (isSignatureDrawn == false) {
        console.info("🚨 handleOK: Prompt");
        if (signatureOld !== "") {
          console.info("🚨 handleOK: Called: Old Exists");
          Alert.alert(
            null,
            "Already Signature exists which will be deleted. Are you sure ?",
            [
              {
                text: "Take New",
                style: "destructive",
                onPress: () => {
                  if (Platform.OS === "ios") {
                    //Linking.openURL('app-settings:');
                  } else {
                    setIsSignatureDrawn(true);
                    imageStore.setEndSignatureImage(signatureNew);
                    setItem("imageStore", imageStore);
                    console.info("🚨 handleOK: Taken New");
                  }
                },
              },
              {
                text: "Save Old",
                style: "cancel",
                onPress: () => {
                  signatureRef.current.clearSignature();
                  setIsSignatureDrawn(true);
                  console.info("🚨 handleOK: Save Old");
                  handleSaveButton();
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          setIsSignatureDrawn(true);
          imageStore.setEndSignatureImage(signatureNew);
          await setItem("imageStore", imageStore);
          console.info("🚨 handleOK: First Time");
        }
      } else {
        imageStore.setEndSignatureImage(signatureNew);
        await setItem("imageStore", imageStore);
        console.info("🚨 handleOK: Default");
      }
    } catch (err) {
      console.error("🚨 handleOK: error:", err);
    }
  };

  // Called after ref.current.readSignature() reads an empty string
  const handleEmpty = async () => {
    try {
      // console.info("🚨 handleEmpty: Empty");
    } catch (err) {
      console.error("🚨 handleEmpty: error:", err);
    }
  };

  // Called after ref.current.clearSignature()
  const handleClear = async () => {
    try {
      console.info("🚨 handleClear: success");
    } catch (err) {
      console.error("🚨 handleClear: error:", err);
    }
  };

  // Called on Begin of stroke
  const handleBegin = async () => {
    try {
      console.info("🚨 handleBegin");
  
      if (!imageStore.EndFeedback.DriverFeedback) {
       
        setShowRatingModal(true);
      }
    } catch (err) {
      console.error("🚨 handleEnd: error:", err);
    }
  };
  // Called after end of stroke
  const handleEnd = async () => {
    try {
      let readSignature = signatureRef.current.readSignature();
    } catch (err) {
      console.error("🚨 handleEnd: error:", err);
    }
  };

  // Called after ref.current.getData()
  const handleData = async (data) => {
    try {
      console.info("🚨 handleData: data:", data);
    } catch (err) {
      console.error("🚨 handleData: error:", err);
    }
  };

  //🚨 🚨 🚨 🚨 react-native-signature-canvas: END 🚨 🚨 🚨 🚨

  const moveNext = async (message) => {
    console.log(
      "🚨 imageStore.EndSignature.isDenied",
      imageStore.EndSignature.isDenied
    );
    navigation.navigate("EndOdometer");

    console.log("🚨 next");
  };

  const handleSaveButton = async () => {
    try {
      if (saveClicked == true) {
        showError("Signature already saved");
      } else {
        if (imageStore.EndSignature.image !== "") {
          uploadImage(imageStore.EndSignature.image);
          imageStore.setEndSignature(true);
          setIsSignatureDrawn(true);
          SetSaveClicked(true);
        } else {
          if (isSignatureDrawn == true) {
            if (signatureRef.current) {
              const result = await signatureRef.current.readSignature();
              uploadImage(imageStore.EndSignature.image);
              imageStore.setEndSignature(true);
              setIsSignatureDrawn(true);
              SetSaveClicked(true);
            }
          } else {
          showError("Signature required")
            SetSaveClicked(false);
          }
        }
      }
    } catch (error) {
      console.error("🚨 handleSaveButton: error:", error);
    }
  };

  const uploadImage = async (signatureImage) => {
    const location = await getLocation();
    console.log("Retrieved Location:", location);

    trackImageCapture({
      screen: props.route.name,
      lat: location.latitude,
      long: location.longitude,
    });

    await uploadSignature(
      signatureImage,
      location.latitude,
      location.longitude,
      props.route.name,
      tripId
    ).then((res) => {
      console.log("🚨 res from uploadImage in addsignature ", res);
      if (res.message) {
        imageStore.setEndSignatureImageUrl(res.message);
        console.log("🚨 url sig", res.message);
        var currentTime = getCurrentDateTime();
        console.log("🚨 currentTime from sign", currentTime);
        uploadSignatureUrl(res.message, currentTime);
        imageStore.setEndSignatureTime(currentTime);
        moveNext();
        showSuccess("🚨 Signature saved successfully");
      }
    });
  };

  const uploadSignatureUrl = async (url, time) => {
    console.log("🚨 uploadSignatureUrl", url);
    console.log("🚨 time of uplaoding signture", time);
    console.log("🚨 sign url", url);
    const requestData = {
      // Include any data you want to send in the request body
      driverId: selectTrip.driverId,
      tripId: selectTrip.tripId,
      signatureTime: time,
      image: url,
    };
    await postSignature(requestData).then((res) => {
      console.log("🚨 res from uploadSignature in addsignature", res);
    });
  };

  const handleResetButton = async () => {
    try {
      if (signatureRef.current) {
        if (!imageStore.EndSignature.verified) {
          signatureRef.current.clearSignature();
          imageStore.setEndSignatureImage("");
          await setItem("imageStore", imageStore);
          setIsSignatureDrawn(false);
        } else {
          showError("can't reset saved signature");
        }
      }
    } catch (err) {
      console.error("🚨 handleResetButtonerror:", err);
    }
  };

  const handleNextButton = () => {
    if (!imageStore.EndSignature.imageUrl == "") {
      moveNext(imageStore.EndSignature.imageUrl); // Perform actions for the Next button
      console.log("🚨 Next button clicked");
    }
  };

  const skip = async () => {
    navigation.navigate("EndOdometer");
    // await getUpdatedChecksOnSkip(tripId, "end", "EndStarFeedback", navigation);
  };

  const callModalaize = async () => {
   // modalizeRef.current?.open();
  };

  const handleReason = async (reason) => {
    console.log("🚨 Reason selected:", reason);
    const requestData = {
      // Include any data you want to send in the request body
      driverId: selectTrip.driverId,
      tripId: selectTrip.tripId,
      notUpdatingReason: reason,
    };
    imageStore.setSignatureDenied(true);
    await postSignature(requestData).then((res) => {
      console.log("🚨 res from uploadSignature in addsignature", res);
    });
    // Perform any additional actions based on the reason
    modalizeRef.current?.close(); // Close the modal after selecting the reason
    moveNext();
  };


const handleRating = (selectedRating) => {
  console.log("rate", selectedRating);
  setRating(selectedRating);
  setRatingError("");
};



  const handleSubmitFeedback = async () => {
    try {
      if (!rating) {
        setRatingError("Please select a rating before continuing");
        return;
      }
  
      const requestBody = {
        driverId: driverId,
        tripId: tripId,
        rating: rating,
        comments: "",
        feedback: "",
        insertedBy: "Customer",
        createdBy: driverId,
        customerId: customerId,
      };
  
      console.log("🚨customer Feedback Request:", requestBody);
  
      const response = await postFeedback(requestBody);
  
      console.log("🚨 customer Feedback Response:", response);
  
      imageStore.setDriverFeedback(true);
      setShowRatingModal(false);
  
    } catch (error) {
      console.error("🚨 Feedback Submit Error:", error);
      showError("Failed to submit feedback");
    }
  };





  return (
    
   
    
    <Container>

<Modal
      visible={showRatingModal}
      transparent
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.ratingModal}>

        <Text_Custom
  text={"How was your experience?"}
  style={{
    fontFamily: "NunitoSans-Bold",
    fontSize: scale(18),
    textAlign: "center",
    marginBottom: moderateScale(8),
  }}
/>

<Text_Custom
  text={"Please rate the service before signing"}
  style={{
    fontFamily: "NunitoSans-Regular",
    fontSize: scale(13),
    textAlign: "center",
    color: "#7A7A7A",
    marginBottom: moderateScale(20),
  }}
/>

<AirbnbRating
  count={5}
  defaultRating={0}
  size={32}
  showRating={false}
  onFinishRating={handleRating}
/>

{ratingError ? (
  <Text_Custom
    text={ratingError}
    style={{
      color: "#E53935",
      fontSize: scale(12),
      marginTop: moderateScale(10),
      textAlign: "center",
      fontFamily: "NunitoSans-Regular",
    }}
  />
) : null}

<Button
  buttonStyles={[
    styles.uplodeBtn,
    {
      width: "90%",
      marginTop: moderateScale(20),
    },
  ]}
  text={"Submit"}
  onPress={handleSubmitFeedback}
/>
        </View>
      </View>
    </Modal>


      <CommonHeader goBack title="Add Document" />
      {/* {status === "prompt" ? (
        <CommonHeader fromEndSignature title="Add Document" />
      ) : (
        <CommonHeader goBack title="Add Document" />
      )}  */}
      <View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginVertical: moderateScale(30),
          }}
        >
          <Text_Custom text="Customer Signature" style={styles.heading} />
          {imageStore.EndSignature.capturedTime !== "" ? (
            <Text_Custom
              text={`Captured at: ${imageStore.EndSignature.capturedTime}`} // Example time format
              style={styles.captureTime}
            />
          ) : (
            <Text_Custom
              text={"Capture the Signature"}
              style={styles.Sub_heading}
            />
          )}
          <View style={styles.signatureCanvasView}>
            <SignatureCanvas
              ref={signatureRef}
              onEnd={handleEnd}
              onOK={handleOK}
              onBegin={handleBegin}
              onEmpty={handleEmpty}
              onClear={handleClear}
              onGetData={handleData}
              autoClear={false}
              descriptionText={""}
              imageType="image/png"
            />
            {imageStore.EndSignature.image !== "" &&
              (isSignatureDrawn == false || saveClicked == true) && (
                <Image
                  style={styles.signatureImage}
                  source={{
                    uri: `data:image/png;base64,${imageStore.EndSignature.image} `,
                  }}
                />
              )}
          </View>

          <View style={[styles.uplodeRetake, styles.row]}>
            <Button
              buttonStyles={[styles.retackBtn, { marginRight: 20 }]}
              titleStyles={{ color: colors.primary1 }}
              text={"Reset"}
              onPress={() => {
                handleResetButton();
              }}
            />
            {!imageStore.EndSignature.imageUrl == "" ? (
              <Button
                buttonStyles={styles.uplodeBtn}
                text={"Next"}
                onPress={() => handleNextButton()}
              />
            ) : (
              <Button
                buttonStyles={styles.uplodeBtn}
                text={"Save"}
                onPress={() => handleSaveButton()}
              />
            )}
          </View>

          <Button_Modalize
            modalizeRef={modalizeRef}
            handleReason={handleReason}
          />
          {!customerSignatureValidation &&
            imageStore.EndSignature.imageUrl === "" && (
              <TouchableOpacity
                style={{ marginTop: moderateScale(20) }}
                onPress={() => skip()}
              >
                <Text_Custom
                  text={"Skip"}
                  style={{
                    fontSize: scale(14),
                    color: colors.primary1,
                    fontFamily: "NunitoSans-Bold",
                  }}
                />
              </TouchableOpacity>
            )}
        </View>
      </View>
    </Container>
  );
};

export default observer(EndSignature);
