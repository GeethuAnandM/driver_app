import { StyleSheet, Dimensions, View, Image } from "react-native";
import React, { useState } from "react";

import Container from "../../Container/Container";
import CommonHeader from "../../CommonHeader/CommonHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { moderateScale, scale } from "react-native-size-matters";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AlertOpenSettings, getLocation, inputValidation, isImage, showError, trackImageLocation } from "../../../Utils/helper";
import { Button, Gradient_Button } from "../../Button/Button";
import Text_Custom from "../../Text_Custom";
import { useNavigation, useTheme } from "@react-navigation/native";
import TextInput_custom from "../../TextInput_custom";
import { imageStore } from "../../../Store/AuthStore/ImageStore";
import { uploadImageURL } from "../../../Services/Actions/AuthActions";
import ImageCropPicker from "react-native-image-crop-picker";
import Lottie from "lottie-react-native";
import { observer } from "mobx-react";
import { tripStore } from "../../../Store/AuthStore/TripStore";
import {
  checkMandatoryValidation,
  getBataTripByTripID,
  getUpdatedChecksByTripId,
  getUpdatedChecksOnSkip,
} from "../../../Services/Actions/TripActions";
import { logCustomEvent } from "../../../Utils/analytics";
import { trackImageCapture } from "../../../Utils/MixpanelService";
const EndOdometer = (props) => {
  
  const navigation = useNavigation();
  const { colors } = useTheme();
  const tripId = tripStore.selectedTrip.tripId;
  const [showImage, setShowImage] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [image, setImage] = useState({
    path: "https://itac-qa-files.s3.ap-south-1.amazonaws.com/upload-icon-206311661704993232.png",
  });
  const [imageAdded, setImageAdded] = useState(false);//for rendering next button to avoid reuplaoding
  const {
    endOdometer,
    
  } = tripStore.selectedTrip;
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

  const uplodeValue = async (manualReading) => {
   
      try{
       
        await fetchStartOdometerValue();
        const isValid = inputValidation(manualReading);
        console.log("Is input valid?", isValid); // Output: true or false
        if (isValid) {
        imageStore.setEndOdometerValue(manualReading);
        if (!imageStore.odometer.OdometerValidated) {
          const requestData = {
            dataName: "endOdometer",
            dataValue: manualReading,
            tripId: tripStore.selectedTrip.tripId,
          };
          
          var message = await checkMandatoryValidation(requestData);
          if (message === "Validation Successful") {
            imageStore.setEndOdometerValidated(true);
            console.log("from end odometer");
    
            setShowImage(false);
           await moveNext();
           
          } else {
            showError(message);
          }
        } else if (
          Number(imageStore.Endodometer.value) <= Number(imageStore.odometer.value)
        ) {
          console.log(" Number(imageStore.Endodometer.value) <= Number(imageStore.odometer.value)")
          showError(
            "Odometer reading entered previously is " +
              imageStore.odometer.value +
              " km. Please enter a greater value to proceed"
          );
        } else {
          setShowImage(false);
          imageStore.setEndOdometerValidated(true);
          await moveNext();
    
        
        }
      }
      else{
        showError("please enter valid number")
      }
      }
      catch(err){
      console.log("error from odometer value",err)

      }
           
     
  
  };



  const fetchStartOdometerValue=async()=>{
    try{
      const response = await getBataTripByTripID(tripId);
      var completeTripData = response[0];
      var startOdometerValue=completeTripData.tripStartOdoMeterReading;
      imageStore.setOdometerValue(startOdometerValue);
  
    }
    catch(error){
      console.log("error in fetchStartOdometerValue",error)
    }
   


  }


  const moveNext=async()=>{
    props.navigation.navigate("EndFuel");
    // await getUpdatedChecksOnSkip(tripId, "end", "EndFuel", navigation);
    setImageAdded(false)

  }
  const ImageAdded = () => {
    const [manualReading, setManualReading] = useState("");
    const [active, setActive] = useState(false);
    // setImageAdded(true);//for rendering a next arrow button for avoiding reuplaoding
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
        <TextInput_custom
          inputProps={{ keyboardType: "decimal-pad" ,autoFocus: true}}
          placeholder="Odometer Reading"
          value={manualReading}
          onChangeText={(e) => {
            if (e.length <= 6) { 
              setManualReading(e);
              if (e.trim() !== "") {
                setActive(true);
              } else {
                setActive(false);
              }
            }
            else
            {
              showError("more than 6 digits not allowed")
            }
          }}
        />
        <Gradient_Button
          text="Next"
          active={active}
          disabled={manualReading == "" ? true : false}
          onPress={() =>{uploadImage(); uplodeValue(manualReading)}}
        />
        {/* {manualReading.trim() && <Gradient_Button text="Next" />} */}
      </React.Fragment>
    );
  };
  const openCamera = () => {
    try {
      setImageAdded(true)//for showing next button for avoiding reuplaoding 
      ImageCropPicker.openCamera({
        width: 300,
        height: 400,
        useFrontCamera: false,
        cropping: true,
      })
        .then(async (image) => {
          setImage(image);
          imageStore.setEndOdometerImage(image.path)
          setShowImage(true);
        })
        .catch((err) => {
          AlertOpenSettings(err);
          if(imageStore.Endodometer.EndOdometerValidated==true){
            setImageAdded(false)
          }
         
          console.log(err);
        });
    } catch (error) {
      console.log("IMAGE_PICKER_ERROR - ", error);
    }
  };
  const uploadImage = async () => {
   

   trackImageCapture({ ...image,screen:props.route.name });


  
  // Upload image
  await uploadImageURL({ ...image,screen:props.route.name }).then(async (res) => {
      if (res.message) {
        setUploaded(true);
        imageStore.setEndOdometerImage(res.message);
        logCustomEvent("End Odometer Captured");
      } else {
        imageStore.setEndOdometerImage("");
      }
    });
  };

  

  const skip = async () => {
    // await getUpdatedChecksOnSkip(tripId, "end", "EndFuel", navigation);

    props.navigation.navigate("EndFuel");
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
              {/* <Image source={isImage(image.path)} style={styles.finalImage} /> */}
              <Image source={imageStore.Endodometer.image ? isImage(imageStore.Endodometer.image) : isImage(image.path)} style={styles.finalImage} />


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
                  onPress={() =>{  setImageAdded(true); uploadImage()}}
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
                 {!endOdometer && !imageStore.Endodometer.EndOdometerValidated &&  (
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
                </>
              ) : (
                uploaded && <ImageAdded />
              )}
              {
                imageStore.Endodometer.EndOdometerValidated === true && imageAdded == false ? (
                  <Gradient_Button
                    text="Next"
                    // active={active}
                    // disabled={manualReading == "" ? true : false}
                    onPress={() => moveNext()}
                  />
                ) : null
              }
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </Container>
  );
};

export default observer(EndOdometer);

const styles = StyleSheet.create({});
