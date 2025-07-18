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
import { CreateExpenseforTrip } from "../../Services/Actions/ExpenseAction";
import { expenseStore } from "../../Store/AuthStore/ExpenseStore";
import { imageStore } from "../../Store/AuthStore/ImageStore";

import { tripStore } from "../../Store/AuthStore/TripStore";
import { AlertOpenSettings, inputValidation, isImage, showError, showSuccess } from "../../Utils/helper";
import { observer } from "mobx-react";
const MendatoryExp = (props) => {
  const { status } = props.route.params;
  const { colors } = useTheme();
  const cameraRef = useRef(null);
  const [showImage, setShowImage] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [CameraType, setCameraType] = useState("");
  const [image, setImage] = useState({
    path: "https://itac-qa-files.s3.ap-south-1.amazonaws.com/upload-icon-206311661704993232.png",
  });
  const [DevicesBack, setDevicesBack] = useState();
  //   useEffect(() => {
  //     expenseStore.changeExpense(props?.route?.params?.typeId);
  //   }, [props]);
  
  
  useEffect(() => {
   
    if (imageStore.expense.length!==0) {
      imageStore.expense.map((item) => {  
        if (item.typeId === props?.route?.params[0]?.typeId) {
          if (item.image === "") {
            setImage({
              path: "https://itac-qa-files.s3.ap-south-1.amazonaws.com/upload-icon-206311661704993232.png",
            });
          } else {
            setImage({
              path: item.image,
            });
          }
        }
         // You might want to return the item if needed.
      });
    } else {
      setImage({
        path: "https://itac-qa-files.s3.ap-south-1.amazonaws.com/upload-icon-206311661704993232.png",
      });
    }
  }, [props]);
  
  const uplodeValue = async (manualReading) => {

    const hasDecimalOrDotAtEnd = /\.+$/.test(manualReading);

      if (!hasDecimalOrDotAtEnd) {

    var expObject = {
      amount: manualReading,
      expenseType: props?.route?.params, //props from addDocfinish
      expImage: image,
      picture: image,
      title: "Trip Expense",
      trip: tripStore?.selectedTrip,
    };
    await CreateExpenseforTrip(expObject);
    setShowImage(false);
    var expense = expenseStore.changeExpense(props?.route?.params[0]?.typeId);
    console.log(
      "mendatory array from expense store in mendatory exppense",
      expenseStore.mendatoryExpense
    );
    //console.log("expense returning from ",expense)
    // console.log("from mendatory to expensestore typeid",props?.route?.params[0]?.typeId)
    // console.log("from mendatory to expensestore typeid",props?.route?.params[0]?.typeId)
    props.navigation.goBack();
  }
  else{
    showError("please enter valid number ")
  }

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
          placeholder="Bill Amount"
          value={manualReading}
          onChangeText={(e) => {
            const { isValid, message } = inputValidation(e, "expenseBill");
            
            if (isValid === true || e === "") {
              console.log("onchane")
              // Input is valid, update state accordingly
              setManualReading(e);
              setActive(e.trim() !== "");
            } else {
              // Input is not valid, handle the error
              showError(message); // Pass the error message to your error handling function
             
            }
          }}
          
        />
        <Gradient_Button
          text="Next"
          active={active}
          disabled={manualReading == "" ? true : false}
          onPress={() => uplodeValue(manualReading)}
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
          console.log(err);
        });
    } catch (error) {
      console.log("IMAGE_PICKER_ERROR - ", error);
    }
  };
  const uploadImage = async () => {
    console.log("props from mendatory expense", props.route.params);
    await uploadImageURL(image).then((res) => {
      if (res.message) {
        setUploaded(true);
        console.log("status from mandator expense", props.route.params);
        setImage({ path: res.message });
        imageStore.setExpenseImage(
          res.message,
          props?.route?.params[0]?.typeId
        );
        console.log("Expenseimage", imageStore.expense);
      }
    });
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
            <Text_Custom text="Capture Bill" style={styles.heading} />
            <Text_Custom
              text={
                !showImage
                  ? "Capture clear picture of Bill"
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
              {!showImage ? <></> : uploaded && <ImageAdded />}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </Container>
  );
};

export default observer(MendatoryExp);

const styles = StyleSheet.create({});
