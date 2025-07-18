import { StyleSheet, Dimensions, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import Container from "../../Container/Container";
import CommonHeader from "../../CommonHeader/CommonHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { moderateScale, scale } from "react-native-size-matters";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  AlertOpenSettings,
  getLocation,
  isImage,
  trackImageLocation,
} from "../../../Utils/helper";
import { Button, Gradient_Button } from "../../Button/Button";
import Text_Custom from "../../Text_Custom";
import { useTheme } from "@react-navigation/native";
import { imageStore } from "../../../Store/AuthStore/ImageStore";
import { uploadImageURL } from "../../../Services/Actions/AuthActions";
import ImageCropPicker from "react-native-image-crop-picker";
import Lottie from "lottie-react-native";
import { observer } from "mobx-react";
import { tripStore } from "../../../Store/AuthStore/TripStore";
import { getUpdatedChecksByTripId } from "../../../Services/Actions/TripActions";
import { trackImageCapture } from "../../../Utils/MixpanelService";
const StartSelfie = (props) => {
  const { colors } = useTheme();
  const [fetchData, setFetchData] = useState(true);
  const [showImage, setShowImage] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const tripId = tripStore.selectedTrip.tripId;
  const { startSelfie } = tripStore.selectedTrip;
  const [imageAdded, setImageAdded] = useState(false); //for rendering next button to avoid reuplaoding
  const [image, setImage] = useState({
    path: "https://itac-qa-files.s3.ap-south-1.amazonaws.com/upload-icon-206311661704993232.png",
  });

  const styles = StyleSheet.create({
    main_container: {
      marginHorizontal: moderateScale(20),
      //   marginBottom: moderateScale(70),
      // flex: 1,
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
    cameraViewFinder: {
      width: Dimensions.get("screen").width - 60,
      height: scale(200),
      borderWidth: 2,
      borderColor: colors.primary1,
      borderRadius: Platform.OS == "ios" ? 20 : 0,
      marginTop: moderateScale(40),
      marginBottom: moderateScale(20),
      justifyContent: "center",
      alignItems: "center",
    },
    successText: {
      marginHorizontal: moderateScale(10),
      marginVertical: moderateScale(20),
    },
    msgContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    nextBtn: {
      marginVertical: moderateScale(20),
    },
    nextText: { fontFamily: "NunitoSans-Bold", color: colors.primary1 },
    FuelHeading: {
      fontSize: scale(12),
      fontFamily: "NunitoSans-Bold",
    },
    SubFuelHeading: {
      fontSize: scale(14),
      fontFamily: "NunitoSans-Bold",
    },
    redioBtn: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: moderateScale(10),
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
    },
    uplodeRetake: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      width: "100%",
    },
    retackBtn: {
      width: "42%",
      backgroundColor: colors.SecondaryBackground,
      borderWidth: 1,
      borderColor: colors.primary1,
      borderRadius: 5,
    },
    uplodeBtn: {
      width: "42%",
      borderRadius: 5,
    },
    finalImage: {
      width: "100%",
      height: "100%",
      borderRadius: Platform.OS == "ios" ? 20 : 0,
      resizeMode: "cover",
    },
  });

  const moveNext = async () => {
    props.navigation.navigate("AddDocStart");
    setImageAdded(false);
  };

  const ImageAdded = () => {
    const [manualReading, setManualReading] = useState("");
    const [active, setActive] = useState(false);
    const [checked, setChecked] = React.useState("low");
    return (
      <React.Fragment>
        <View style={styles.msgContainer}>
          {/* <SVG.SuccesSVG /> */}
          <Lottie
            source={require("../../../Assets/JSON/success.json")}
            autoPlay
            loop
            style={{ width: scale(20) }}
          />
          <Text_Custom
            text="Successful"
            style={[styles.heading, styles.successText]}
          />
        </View>
        <Gradient_Button
          text="Next"
          //   active={active}
          onPress={() => {
            uploadImage();
            moveNext();
          }}
        />
        {/* {manualReading.trim() && <Gradient_Button text="Next" />} */}
      </React.Fragment>
    );
  };
  const openCamera = () => {
    try {
      setImageAdded(true);
      ImageCropPicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        useFrontCamera: true,
      })
        .then(async (image) => {
          setImage(image);
          imageStore.setSelfie(image.path);
          setShowImage(true);
        })
        .catch((err) => {
          console.log(err);
          AlertOpenSettings(err);
          if (imageStore.selfie.SelfieValidated == true) {
            setImageAdded(false);
          }
        });
    } catch (error) {
      console.log("IMAGE_PICKER_ERROR - ", error);
    }
  };
  const uploadImage = async () => {
    trackImageCapture({ ...image, screen: props.route.name });

    // Upload image
    await uploadImageURL({ ...image, screen: props.route.name }).then(
      async (res) => {
        if (res.message) {
          setUploaded(true);
          imageStore.setSelfie(res.message);
          imageStore.setSelfieValidated(true);
        }
      }
    );
  };

  const skip = () => {
    props.navigation.navigate("AddDocStart");
  };
  return (
    <Container>
      <CommonHeader goBack title="Add Document" />
      <View style={styles.main_container}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginVertical: moderateScale(50),
            }}
          >
            <Text_Custom text="Capture Selfie" style={styles.heading} />
            <Text_Custom
              text={
                !showImage
                  ? "Capture clear Selfie"
                  : "Ensure image should be clear"
              }
              style={styles.Sub_heading}
            />
            <TouchableOpacity
              style={styles.cameraViewFinder}
              onPress={() => {
                openCamera();
              }}
            >
              {/* <Image source={isImage(image.path)} style={styles.finalImage} /> */}
              <Image
                source={
                  imageStore.selfie.image
                    ? isImage(imageStore.selfie.image)
                    : isImage(image.path)
                }
                style={styles.finalImage}
              />
            </TouchableOpacity>
            {!uploaded && showImage && (
              <View style={styles.uplodeRetake}>
                <Button
                  buttonStyles={styles.retackBtn}
                  titleStyles={{ color: colors.primary1 }}
                  text={"Retake"}
                  onPress={() => openCamera()}
                />
                <Button
                  buttonStyles={styles.uplodeBtn}
                  text={"Upload"}
                  onPress={() => {
                    setImageAdded(true);
                    uploadImage();
                  }}
                />
              </View>
            )}
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: moderateScale(20),
              }}
            >
              {!showImage &&
              !startSelfie &&
              !imageStore.selfie.SelfieValidated ? (
                <>
                  {/* <Gradient_Button
                    text="Capture"
                    width="90%"
                    onPress={() => takePic()}
                  /> */}
                  <TouchableOpacity
                    style={{ marginTop: moderateScale(20) }}
                    onPress={() => {
                      skip();
                      //triggerMobGps();
                    }}
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
                </>
              ) : (
                uploaded && <ImageAdded />
              )}
              {imageStore.selfie.SelfieValidated === true &&
                imageAdded === false &&
                !uploaded && <Gradient_Button text="Next" onPress={moveNext} />}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </Container>
  );
};

export default observer(StartSelfie);

const styles = StyleSheet.create({});
