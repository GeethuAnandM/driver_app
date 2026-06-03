import { useNavigation, useTheme } from "@react-navigation/native";
import Lottie from "lottie-react-native";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import ImageCropPicker from "react-native-image-crop-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { moderateScale, scale } from "react-native-size-matters";
import { uploadImageURL } from "../../../Services/Actions/AuthActions";
import { imageStore } from "../../../Store/AuthStore/ImageStore";
import { tripStore } from "../../../Store/AuthStore/TripStore";
import { trackImageCapture } from "../../../Utils/MixpanelService";
import { AlertOpenSettings, isImage } from "../../../Utils/helper";
import { Button, Gradient_Button } from "../../Button/Button";
import CommonHeader from "../../CommonHeader/CommonHeader";
import Container from "../../Container/Container";
import Text_Custom from "../../Text_Custom";
const EndSelfie = (props) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [showImage, setShowImage] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [imageAdded, setImageAdded] = useState(false); //for rendering next button to avoid reuplaoding
  const [image, setImage] = useState({
    path: "https://itac-qa-files.s3.ap-south-1.amazonaws.com/upload-icon-206311661704993232.png",
  });
  const { endSelfie } = tripStore.selectedTrip;
  const tripId = tripStore.selectedTrip.tripId;
  const [fetchData, setFetchData] = useState(true);
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

  const move = async () => {
    navigation.navigate("EndStarFeedback");
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
            move();
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
        //useFrontCamera: true,
      })
        .then(async (image) => {
          setImage(image);
          imageStore.setEndSelfie(image.path);
          setShowImage(true);
        })
        .catch((err) => {
          AlertOpenSettings(err);
          if (imageStore.EndSelfie.EndSelfieValidated == true) {
            setImageAdded(false);
          }
          console.log(err);
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
          imageStore.setEndSelfie(res.message);
          imageStore.setEndSelfieValidated(true);
        }
      }
    );
  };

  // const fetchUpdatedChecks = async (tripId) => {
  //   try {

  //     const response = await getUpdatedChecksByTripId(tripId);
  //     // console.log("response from planedtripcontainer for updtaedchecks:", response); // Log the response
  //     tripStore.setUpdatedSelectedTrip(response);
  //     skip();
  //     //console.log("updatedselected trip",tripStore.updatedSelectedTrip)
  //   } catch (error) {
  //     console.error("from fetchUpdatedChecks in PlannedTrip start :", error);
  //   }
  // };

  const skip = async () => {
    console.log("sldfkfldfldsfj")
    navigation.navigate("EndStarFeedback");
    
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
            <Text_Custom text="Capture Tripsheet" style={styles.heading} />
            <Text_Custom
              text={
                !showImage
                  ? "Capture clear image of tripsheet"
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
                  imageStore.EndSelfie.image
                    ? isImage(imageStore.EndSelfie.image)
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
              !endSelfie &&
              !imageStore.EndSelfie.EndSelfieValidated ? (
                <>
                  {/* <Gradient_Button
        text="Capture"
        width="90%"
        onPress={() => takePic()}
      /> */}
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
                </>
              ) : (
                uploaded && <ImageAdded />
              )}

              {imageStore.EndSelfie.EndSelfieValidated === true &&
                imageAdded === false &&
                !uploaded && <Gradient_Button text="Next" onPress={move} />}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </Container>
  );
};

export default observer(EndSelfie);

const styles = StyleSheet.create({});
