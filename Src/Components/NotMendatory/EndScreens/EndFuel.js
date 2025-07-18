import { useNavigation, useTheme } from "@react-navigation/native";
import Lottie from "lottie-react-native";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import ImageCropPicker from "react-native-image-crop-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RadioButton } from "react-native-paper";
import { moderateScale, scale } from "react-native-size-matters";
import { uploadImageURL } from "../../../Services/Actions/AuthActions";
import { imageStore } from "../../../Store/AuthStore/ImageStore";
import { tripStore } from "../../../Store/AuthStore/TripStore";
import { trackImageCapture } from "../../../Utils/MixpanelService";
import { logCustomEvent } from "../../../Utils/analytics";
import {
  AlertOpenSettings,
  isImage
} from "../../../Utils/helper";
import { Button, Gradient_Button } from "../../Button/Button";
import CommonHeader from "../../CommonHeader/CommonHeader";
import Container from "../../Container/Container";
import Text_Custom from "../../Text_Custom";
const EndFuel = (props) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const tripId = tripStore.selectedTrip.tripId;
  const [showImage, setShowImage] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [imageAdded, setImageAdded] = useState(false); //for rendering next button to avoid reuplaoding
  const [image, setImage] = useState({
    path: "https://itac-qa-files.s3.ap-south-1.amazonaws.com/upload-icon-206311661704993232.png",
  });
  const { endFuel } = tripStore.selectedTrip;
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
      borderRadius: 20,
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
      paddingHorizontal: moderateScale(10),
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
      borderRadius: 20,
      resizeMode: "cover",
    },
  });
  const moveNext = async () => {
    navigation.navigate("EndSelfie");
    setImageAdded(false);
  };
  const uplodeValue = async (checked) => {
    imageStore.setEndFuelmeterValue(checked);
    imageStore.setEndFuelValidated(true);
    setShowImage(false);
    await moveNext();
    // await getUpdatedChecksOnSkip(tripId,"end","EndSelfie",navigation);

    // props.navigation.navigate("EndSelfie");
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
        <View
          style={{
            backgroundColor: colors.SecondaryBackground,
            paddingHorizontal: moderateScale(15),
            paddingVertical: moderateScale(20),
            width: "100%",
            borderRadius: 10,
            marginBottom: moderateScale(20),
          }}
        >
          <Text_Custom text="Fuel Reading" style={styles.FuelHeading} />
          <View style={{ marginVertical: moderateScale(10) }}>
            <View style={styles.redioBtn}>
              <Text_Custom text={"Low Fuel"} style={styles.SubFuelHeading} />
              <RadioButton.Android
                uncheckedColor="#D9D9D9"
                color={colors.primary}
                value="low"
                status={checked === "low" ? "checked" : "unchecked"}
                onPress={() => setChecked("low")}
              />
            </View>
            <View style={styles.redioBtn}>
              <Text_Custom text={"Medium Fuel"} style={styles.SubFuelHeading} />
              <RadioButton.Android
                uncheckedColor="#D9D9D9"
                color={colors.primary}
                value="medium"
                status={checked === "medium" ? "checked" : "unchecked"}
                onPress={() => setChecked("medium")}
              />
            </View>
            <View
              style={[
                styles.redioBtn,
                { borderBottomWidth: 0, paddingBottom: 0 },
              ]}
            >
              <Text_Custom text={"High Fuel"} style={styles.SubFuelHeading} />
              <RadioButton.Android
                uncheckedColor="#D9D9D9"
                color={colors.primary}
                value="high"
                status={checked === "high" ? "checked" : "unchecked"}
                onPress={() => setChecked("high")}
              />
            </View>
          </View>
        </View>
        <Gradient_Button
          text="Next"
          //   active={active}
          onPress={() => {
            uploadImage();
            uplodeValue(checked);
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
        useFrontCamera: false,
      })
        .then(async (image) => {
          setImage(image);
          imageStore.setEndFuelmeterImage(image.path);
          setShowImage(true);
        })
        .catch((err) => {
          console.log(err);
          AlertOpenSettings(err);
          if (imageStore.EndFuelmeter.EndFuelValidated == true) {
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
          imageStore.setEndFuelmeterImage(res.message);
          logCustomEvent("End Fuel Captured");
        }
      }
    );
  };

  const skip = async () => {
    navigation.navigate("EndSelfie");
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
            <Text_Custom text="Capture Fuel Reading" style={styles.heading} />
            <Text_Custom
              text={
                !showImage
                  ? "Capture clear picture of fuel gauge"
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
                  imageStore.EndFuelmeter.image
                    ? isImage(imageStore.EndFuelmeter.image)
                    : isImage(image.path)
                }
                style={styles.finalImage}
              />
            </TouchableOpacity>
            {showImage && !uploaded && (
              <View style={styles.uplodeRetake}>
                <Button
                  buttonStyles={styles.retackBtn}
                  titleStyles={{ color: colors.primary1 }}
                  text={"Retake"}
                  onPress={() => {
                    openCamera();
                  }}
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
              {!showImage ? (
                <>
                  {/* only show Skip if user hasn’t started endFuel & endFuel isn’t validated */}
                  {!endFuel && !imageStore.EndFuelmeter.EndFuelValidated && (
                    <TouchableOpacity
                      style={{ marginTop: moderateScale(20) }}
                      onPress={() => skip()}
                    >
                      <Text_Custom
                        text="Skip"
                        style={{
                          fontSize: scale(14),
                          color: colors.primary1,
                          fontFamily: "NunitoSans-Bold",
                        }}
                      />
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                // once an image is up, show the “added” state
                uploaded && <ImageAdded />
              )}

              {/* only show Next when fuel is validated & you haven’t just added an image */}
              {imageStore.EndFuelmeter.EndFuelValidated && !imageAdded && (
              <Gradient_Button text="Next" onPress={() => moveNext()} />
            )}
            </View>

           
          </View>
        </KeyboardAwareScrollView>
      </View>
    </Container>
  );
};

export default observer(EndFuel);

const styles = StyleSheet.create({});
