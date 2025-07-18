import { StyleSheet, Dimensions, Image, View } from "react-native";
import React, { useState, useRef } from "react";
import { moderateScale, scale } from "react-native-size-matters";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme, useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react";
import SignatureCapture from "react-native-signature-capture"; // Refer: https://www.npmjs.com/package/react-native-signature-capture
import Container from "../../Container/Container";
import CommonHeader from "../../CommonHeader/CommonHeader";
import Text_Custom from "../../Text_Custom";
import { imageStore } from "../../../Store/AuthStore/ImageStore";
import { getUpdatedChecksOnSkip, postSignature, uploadSignature } from "../../../Services/Actions/TripActions";
import { getCurrentDateTime, showError, showSuccess } from "../../../Utils/helper";
import { tripStore } from "../../../Store/AuthStore/TripStore";
import { Button } from "../../Button/Button";
import { setItem } from "../../../Services/apiCalls";
import Button_Modalize from "../../Modalize/Button_Modalize";

const EndSignature = (props) => {

  const { status } = props.route.params;
  const navigation = useNavigation();
  const { colors } = useTheme();
  const signatureRef = useRef(null);
  const [isSignatureDrawn, setIsSignatureDrawn] = useState(false);
  const selectTrip = tripStore.selectedTrip;
  const tripId = tripStore.selectedTrip.tripId;
  const [saveClicked, SetSaveClicked] = useState(false);
  const modalizeRef = useRef(null);

  const styles = StyleSheet.create({
    main_container: {
      marginHorizontal: moderateScale(20)
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
    signatureCanvas: {
      width: Dimensions.get("screen").width - 60,
      height: scale(200),
      borderWidth: 2,
      borderColor: colors.primary1,
      borderRadius: 20,
      overflow: "hidden",
      marginTop: moderateScale(40),
      marginBottom: moderateScale(20),
      justifyContent: "center"
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
      color: '#000', // Changed to black
      marginBottom: 10, // Adjust spacing as needed
    },
  });

  const moveNext = async (message) => {
    console.log("🚨 imageStore.EndSignature.isDenied", imageStore.EndSignature.isDenied);
    if (status === "prompt") {
      props.navigation.navigate("EndOdometer", { status: "prompt" });
    } else {
      await getUpdatedChecksOnSkip(
        tripId,
        "end",
        "EndStarFeedback",
        navigation
      );
    }
    console.log("🚨 next");
  };

  const _signatureOnDragEvent = async () => {
    try {

      if (!saveClicked) {
        //const result = await signatureRef.current.saveImage();
        setIsSignatureDrawn(true);
      } else {
        if (!isSignatureDrawn) {
          //const result = await signatureRef.current.saveImage();
          setIsSignatureDrawn(true);
        }
      }
    } catch (err) {
      console.error("🚨 _signatureOnDragEvent: error:", err);
    }
  };

  const _signatureOnSaveEvent = async (signature) => {
    try {
      imageStore.clearEndSignature();
      const signatureImage = signature.encoded;
      imageStore.setEndSignatureImage(signatureImage);
      await setItem("imageStore", imageStore);
      console.info("🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨");
      console.info("🚨 _signatureOnSaveEvent: signature:", signature);
      console.info("🚨 _signatureOnSaveEvent: signatureImage:", signatureImage);
      console.info("🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨");
    } catch (err) {
      console.error("🚨 _signatureOnSaveEvent: error:", err);
    }
  };

  const handleSaveButton = async () => {
    try {
      SetSaveClicked(true);
      if (imageStore.EndSignature.image !== "") {
        uploadImage(imageStore.EndSignature.image)
        imageStore.setEndSignature(true);
        setIsSignatureDrawn(true);
      }
      else {
        if (isSignatureDrawn == true) {
          if (signatureRef.current) {
            const result = await signatureRef.current.saveImage();
            uploadImage(imageStore.EndSignature.image)
            imageStore.setEndSignature(true);
            setIsSignatureDrawn(true);
          }
        } else {
          await callModalaize();
          SetSaveClicked(false);
        }
      }
    } catch (error) {
      console.error("🚨 handleSaveButton: error:", error);
    }
  };

  const uploadImage = async (signatureImage) => {
    await uploadSignature(signatureImage).then((res) => {
      console.log("🚨 res from uploadImage in addsignature ", res);
      if (res.message) {
        imageStore.setEndSignatureImageUrl(res.message);
        console.log("🚨 url sig", res.message);
        var currentTime = getCurrentDateTime();
        console.log("🚨 currentTime from sign", currentTime)
        uploadSignatureUrl(res.message, currentTime);
        imageStore.setEndSignatureTime(currentTime);
        moveNext();
        showSuccess("🚨 Signature saved successfully")
      }
    });
  };

  const uploadSignatureUrl = async (url, time) => {
    console.log("🚨 uploadSignatureUrl", url);
    console.log("🚨 time of uplaoding signture", time);
    console.log("🚨 sign url", url)
    const requestData = { // Include any data you want to send in the request body      
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
          signatureRef.current.resetImage();
          imageStore.setEndSignatureImage("");
          await setItem("imageStore", imageStore);
          setIsSignatureDrawn(false);
        }
        else {
          showError("can't reset saved signature")
        }
      }
    }
    catch (err) {
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
    await getUpdatedChecksOnSkip(tripId, "end", "EndStarFeedback", navigation);
  };

  const callModalaize = async () => {
    modalizeRef.current?.open();
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

  return (
    <Container>
      {status === "prompt" ? (
        <CommonHeader fromEndSignature title="Add Document" />
      ) : (
        <CommonHeader goBack title="Add Document" />
      )}
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
          ) : (<Text_Custom
            text={"Capture the Signature"}
            style={styles.Sub_heading}
          />)}
          <View style={styles.signatureCanvas}>

            {
              <SignatureCapture
                style={{ flex: 1 }}
                ref={signatureRef}
                onSaveEvent={_signatureOnSaveEvent}
                onDragEvent={_signatureOnDragEvent}
                saveImageFileInExtStorage={false}
                showNativeButtons={false}
                showTitleLabel={false}
                viewMode={"portrait"} />
            }

            {
              imageStore.EndSignature.image !== "" && (

                <Image
                  style={{
                    position: "absolute",//don't affect the position of other elements and are placed relative to their closest positioned ancestor (or the entire screen if none).
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  source={{
                    uri: `data:image/png;base64,${imageStore.EndSignature.image}`,
                  }}  //  the image will overlay the canvas where the signature is captured. Here’s how you can ensure users can still draw on top of the image:
                />

              )
            }

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
          {!status === "prompt" && (
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
