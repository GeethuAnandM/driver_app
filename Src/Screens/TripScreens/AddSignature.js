import { StyleSheet, Dimensions, View, Image } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Container from "../../Components/Container/Container";
import { moderateScale, scale } from "react-native-size-matters";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme, useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react";
import SignatureCapture from "react-native-signature-capture";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import Text_Custom from "../../Components/Text_Custom";
import { imageStore } from "../../Store/AuthStore/ImageStore";
import { tripStore } from "../../Store/AuthStore/TripStore";
import {
  postSignature,
  uploadSignature,
} from "../../Services/Actions/TripActions";
import { getCurrentDateTime, getLocation, showError, showSuccess, trackImageLocation } from "../../Utils/helper";
import EndSignature from "../../Components/NotMendatory/EndScreens/EndSignature";
import { Button } from "../../Components/Button/Button";
import Button_Modalize from "../../Components/Modalize/Button_Modalize";
import { setItem } from "../../Services/apiCalls";
import SignatureCanvas from 'react-native-signature-canvas';
import { trackImageCapture } from "../../Utils/MixpanelService";
// import{uploadSignature}from "../../Services/Actions/AuthActions";
const AddSignature = (props) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const signatureRef = useRef(null);

  const [isImageSaved, setIsImageSaved] = useState(false);
  const [image, setImage] = useState();
  const [result, setResult] = useState();
  const [isResult, setIsResult] = useState(false);

  const [isSignatureDrawn, setIsSignatureDrawn] = useState(false);
  const [resendDisable, setResendDisable] = useState(false);
  const selectTrip = tripStore.selectedTrip;
  const [saveClicked, SetSaveClicked] = useState(false);
  const modalizeRef = useRef(null);
  const styles = StyleSheet.create({
    main_container: {
      marginHorizontal: moderateScale(20),

      //marginVertical: moderateScale(5),
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
      justifyContent: "center",
      //alignItems: "center",
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
      justifyContent: "center"
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
  });
 
  

  
  const moveNext = (message) => {
    props.navigation.navigate("AddDocFinish");

   

    //console.log("skipping in end signature");
  };

 
   const handleOK = async (signatureNewBase64) => {
    try {
      let signatureNew = signatureNewBase64.replace("data:image/png;base64,", "");
      let signatureOld = imageStore.EndSignature.image;
      if (isSignatureDrawn == false) {
        console.info("🚨 handleOK: Prompt");
        if (signatureOld !== "") {
          console.info("🚨 handleOK: Called: Old Exists");
          
        } else {
          setIsSignatureDrawn(true);
          imageStore.setEndSignatureImage(signatureNew);
          await setItem("imageStore", imageStore);
          console.info("🚨 handleOK: First Time");
        }
      }
      else {
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
    } catch (err) {
      console.error("🚨 handleEnd: error:", err);
    }
  };
  // Called after end of stroke
  const handleEnd = async () => {
    try {
      console.log("handleend");
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

  // The SignatureCapture component saves the signature and internally triggers the onSaveEvent callback,
  // passing in the result object containing information about the saved signature.

  
  const handleSaveButton = async () => {
   // console.log(".........")
  
 
    if(imageStore.EndSignature.verified ){
     // console.log("again save");
     showError("Signature already saved");
      //  uploadImage(imageStore.EndSignature.image)
      //  imageStore.setEndSignature(true);
      // setIsSignatureDrawn(true);
    }
    else{
   
        if (imageStore.EndSignature.image!=="") {
          if (signatureRef.current) {
            try {
              const result = await signatureRef.current.readSignature();
              uploadImage(imageStore.EndSignature.image)
              imageStore.setEndSignature(true);
              setIsSignatureDrawn(true);
              SetSaveClicked(true);

            } catch (error) {
              console.error("Error saving signature:", error);
            }
          }
        } else {
        //  await  callModalaize();
          //SetSaveClicked(false);
          showError("Signature Required");
        }

      
    }
  
   
  };

 
  const uploadImage = async (signatureImage) => {
   
    const location = await getLocation();
    console.log("Retrieved Location:", location);

     trackImageCapture({ screen:props.route.name, lat: location.latitude, long: location.longitude });
 

   
   
    
    await uploadSignature(signatureImage,location.latitude, location.longitude,props.route.name).then((res) => {
     // console.log("res from uploadImage in addsignature ", res);
      if (res.message) {
        imageStore.setEndSignatureImageUrl(res.message);
      //  console.log("url sig",res.message)
      var currentTime=getCurrentDateTime();
    
      //console.log("currentTime from sign",currentTime)
        uploadSignatureUrl(res.message, currentTime);
        imageStore.setEndSignatureTime(currentTime);
        moveNext();
         
         showSuccess("Signature saved successfully")
      }
    });
  };

  const uploadSignatureUrl = async (url,time) => {
    //console.log("result",result);
    const requestData = {
      // Include any data you want to send in the request body
      driverId: selectTrip.driverId,
      tripId: selectTrip.tripId,
      signatureTime:time,
      image: url,
    };
    await postSignature(requestData).then((res) => {
      console.log("res from uploadSignature in addsignature", res);
    });
  };
 


 
  const handleResetButton = async() => {
    // console.log("props from sign",props)
    try{
    // console.log(">>>>>>")
  
       if (signatureRef.current) {
        // console.log("...........<<<<<")
        if(!imageStore.EndSignature.verified){
          signatureRef.current.clearSignature();
       imageStore.setEndSignatureImage("");
       await setItem("imageStore",imageStore);
       //console.log(".....resttingggg......<<<<<")
       setIsSignatureDrawn(false);
        }
        else{
         showError("can't reset saved signature")
        }
       }
    
    
 
    
    }
    catch(err){
    // console.log("error>>>>>",err)
    }
  
    
     
   };

  const customerSignatureValidation =
    tripStore.updatedSelectedTrip.customerSignatureValidation;

  return (
    <Container>
      <CommonHeader goBack title="Add Document" />
      
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
      ):( <Text_Custom
        text={"Capture the Signature"}
        style={styles.Sub_heading}
      />)}

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
            {
              (imageStore.EndSignature.image !== "") && (isSignatureDrawn == false || saveClicked == true) && (
                <Image
                  style={styles.signatureImage}
                  source={{
                    uri: `data:image/png;base64,${imageStore.EndSignature.image} `,
                  }}
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
            <Button
              buttonStyles={styles.uplodeBtn}
              text={"Save"}
              onPress={() => handleSaveButton()}
            />
          </View>

        
        </View>
      </View>
    </Container>
  );
};

export default observer(AddSignature);
