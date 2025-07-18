import { useTheme } from "@react-navigation/native";
import Lottie from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ImageCropPicker from "react-native-image-crop-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { moderateScale, scale } from "react-native-size-matters";
import { Button, Gradient_Button } from "../../Components/Button/Button";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import Container from "../../Components/Container/Container";
import TextInput_custom from "../../Components/TextInput_custom";
import Text_Custom from "../../Components/Text_Custom";
import { uploadImageURL } from "../../Services/Actions/AuthActions";
import { imageStore } from "../../Store/AuthStore/ImageStore";
import { AlertOpenSettings, getLocation, inputValidation, isImage, showError, trackImageLocation } from "../../Utils/helper";
import { observer } from "mobx-react";
import { checkMandatoryValidation } from "../../Services/Actions/TripActions";
import { tripStore } from "../../Store/AuthStore/TripStore";
import { logCustomEvent } from "../../Utils/analytics";
import { trackImageCapture } from "../../Utils/MixpanelService";
const AddDocOdometer = (props) => {
  const { status } = props.route.params;
  const { colors } = useTheme();

  const [showImage, setShowImage] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const [image, setImage] = useState({
    path: "https://itac-qa-files.s3.ap-south-1.amazonaws.com/upload-icon-206311661704993232.png",
  });
  useEffect(() => {
    if (status === "start") {
      if (imageStore.odometer.image == "") {
        setImage({
          path: "https://itac-qa-files.s3.ap-south-1.amazonaws.com/upload-icon-206311661704993232.png",
        });
      } else {
        setImage({
          path: imageStore.odometer.image,
        });
      }
    } else if (status === "end") {
      if (imageStore?.Endodometer?.image === "") {
        setImage({
          path: "https://itac-qa-files.s3.ap-south-1.amazonaws.com/upload-icon-206311661704993232.png",
        });
      } else {
        setImage({
          path: imageStore?.Endodometer?.image,
        });
      }
    }
  }, [status]);

  useEffect(()=>{
console.log("frim addodcodomtrss")
  },[])
  const uplodeValue = async (manualReading) => {
 

    const isValid = inputValidation(manualReading);
    console.log("Is input valid?", isValid); // Output: true or false
    if (isValid) {
    if (status === "start") {
      console.log("manualReading", manualReading);
      const requestData = {
        dataName: "startOdometer",
        dataValue: manualReading,
        tripId: tripStore.selectedTrip.tripId,
      };
      var message = await checkMandatoryValidation(requestData);
      if (message === "Validation Successful") {
        imageStore.setOdometerValue(manualReading);
        console.log("from start adddocodometer");
        imageStore.setOdometerValidated(true);
        setShowImage(false);
        props.navigation.goBack();
      } else {
        showError(message);
      }
    } else {
      imageStore.setEndOdometerValue(manualReading);
      console.log("manualReading", manualReading);
      console.log(
        "imageStore.Endodometer.value",
        Number(imageStore.Endodometer.value)
      );
      console.log(
        "imageStore.odometer.value",
        Number(imageStore.odometer.value)
      );

      if (!imageStore.odometer.OdometerValidated) {
        const requestData = {
          dataName: "endOdometer",
          dataValue: manualReading,
          tripId: tripStore.selectedTrip.tripId,
        };
        var message = await checkMandatoryValidation(requestData);
        if (message === "Validation Successful") {
          console.log("from end adddocodometer");

          setShowImage(false);
          props.navigation.goBack();
        } else {
          showError(message);
        }
      } else if (
        Number(imageStore.Endodometer.value) <=
        Number(imageStore.odometer.value)
      ) {
        showError(
          "Odometer reading entered previously is " +
            imageStore.odometer.value +
            " km. Please enter a greater value to proceed"
        );
      } else {
        setShowImage(false);
        props.navigation.goBack();
      }
    }
  }
  else
  {
    showError("please enter valid number")
  }
    //props.navigation.goBack();
    //props.navigation.navigate("AddFuelMeter", { status });
  };
  const ImageAdded = () => {
    const [manualReading, setManualReading] = useState("");
    const [active, setActive] = useState(false);
    return (
      <React.Fragment>
        <View style={styles.msgContainer}>
          {/* <SVG.SuccesSVG /> */}
          <Lottie
            source={require("../../Assets/JSON/success.json")}
            autoPlay
            loop
            style={{ width: scale(20) }}
          />
          <Text_Custom
            text="Successful"
            style={[styles.heading, styles.successText]}
          />
        </View>
        <TextInput_custom
          inputProps={{ keyboardType: "decimal-pad" }}
          placeholder="Odometer Reading"
          value={manualReading}
          onChangeText={(e) => {
            if (e.length <= 6) { // Add this condition
              setManualReading(e);
              if (e.trim() !== "") {
                setActive(true);
              } else {
                setActive(false);
              }
            }
            else{
              showError("more than 6 digits not allowed")
            }
          }}
        />
        <Gradient_Button
          text="Next"
          active={active}
          disabled={manualReading == "" ? true : false}
          onPress={() => {uploadImage();uplodeValue(manualReading)}}
        />
        {/* {manualReading.trim() && <Gradient_Button text="Next" />} */}
      </React.Fragment>
    );
  };

  const styles = StyleSheet.create({
    main_container: {
      marginHorizontal: moderateScale(20),
      // marginVertical: moderateScale(50),
      flex: 1,
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
  const openCamera = () => {
    try {
      ImageCropPicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        useFrontCamera: false,
      })
        .then(async (image) => {
          setImage(image);

          setShowImage(true);
        })
        .catch((err) => {
          AlertOpenSettings(err);
          console.log("errror", err);
        });
    } catch (error) {
      console.log("IMAGE_PICKER_ERROR - ", error);
    }
  };
  const uploadImage = async () => {
  


   trackImageCapture({ ...image, screen:props.route.name});


  
  // Upload image
  await uploadImageURL({ ...image,screen:props.route.name}).then(async (res) => {
      if (res.message) {
        setUploaded(true);
        if (status === "start") {
          imageStore.setOdometerImage(res.message);
          logCustomEvent("Start Odometer Captured");
        } else if (status === "end") {
          imageStore.setEndOdometerImage(res.message);
          logCustomEvent("End Odometer Captured");
          // console.log("props.route.params",props.route.params)
          // console.log("res from docodo",res)
          //console.log("test from add docodometer",res.message)
        } else {
          imageStore.setOdometerImage("");
          imageStore.setEndOdometerImage("");
        }
      }
    });
  };
  const skip = () => {
    // if (status == "start") {
    //   imageStore.clearOdometer();
    // } else {
    //   imageStore.clearEndOdometer();
    // }
    // props.navigation.navigate("AddFuelMeter", { status });
    props.navigation.goBack();
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
              marginTop: moderateScale(50),
            }}
          >
            <Text_Custom text="Capture Odometer" style={styles.heading} />
            <Text_Custom
              text={
                !showImage
                  ? "Capture clear picture of odometer"
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
              <Image source={isImage(image.path)} style={styles.finalImage} />
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
                  onPress={() => uploadImage()}
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
                  {/* <Gradient_Button
                    text="Capture"
                    width="90%"
                    onPress={() => takePic()}
                  /> */}
                  {/* <TouchableOpacity
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
                  </TouchableOpacity> */}
                </>
              ) : (
                uploaded && <ImageAdded />
              )}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </Container>
  );
};
export default observer(AddDocOdometer);
