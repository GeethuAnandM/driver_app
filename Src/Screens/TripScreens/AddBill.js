import { useTheme } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { moderateScale, scale } from "react-native-size-matters";
import * as SVG from "../../Assets/SVG";
import { Button, Gradient_Button } from "../../Components/Button/Button";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import Container from "../../Components/Container/Container";
import TextInput_custom from "../../Components/TextInput_custom";
import Text_Custom from "../../Components/Text_Custom";
import { isImage } from "../../Utils/helper";
const AddBill = (props) => {
  const { colors } = useTheme();
  const cameraRef = useRef(null);
  const [showImage, setShowImage] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [CameraType, setCameraType] = useState("");
  const [image, setImage] = useState();
  const [DevicesBack, setDevicesBack] = useState();
  useEffect(() => {
    getDevices();
  }, []);
  const getDevices = async () => {
    const perm = await Camera.requestCameraPermission()
      .then(async (res) => {
        if (res == "authorized") {
          const devices = await Camera.getAvailableCameraDevices();
          setCameraType(devices[0]?.devices[0]);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
    // return devices[0].devices[0];
  };
  useLayoutEffect(() => {
    setDevicesBack(devices.back);
  }, [devices]);
  const uplodeImage = () => {
    props.navigation.goBack();
  };
  const ImageAdded = () => {
    const [manualReading, setManualReading] = useState("");
    const [active, setActive] = useState(false);
    return (
      <React.Fragment>
        <View style={styles.msgContainer}>
          <SVG.SuccesSVG />
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
            setManualReading(e);
            if (e.trim() !== "") {
              setActive(true);
            } else {
              setActive(false);
            }
          }}
        />
        <Gradient_Button
          text="Next"
          active={active}
          onPress={() => uplodeImage()}
        />
        {/* {manualReading.trim() && <Gradient_Button text="Next" />} */}
      </React.Fragment>
    );
  };
  const takePic = async () => {
    const photo = await cameraRef.current.takePhoto();
    if (Platform.OS == "ios") {
      setImage(photo);
      setShowImage(true);
    } else {
    }
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
            <View style={styles.cameraViewFinder}>
              {showImage && (
                <Image source={isImage(image.path)} style={styles.finalImage} />
              )}
            </View>
            {showImage && !uploaded && (
              <View style={styles.uplodeRetake}>
                <Button
                  buttonStyles={styles.retackBtn}
                  titleStyles={{ color: colors.primary1 }}
                  text={"Retake"}
                  onPress={() => {
                    setShowImage(false);
                    setUploaded(false);
                  }}
                />
                <Button
                  buttonStyles={styles.uplodeBtn}
                  text={"Upload"}
                  onPress={() => {
                    uplodeImage();
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
              {DevicesBack && !showImage ? (
                <>
                  <Gradient_Button
                    text="Capture"
                    width="90%"
                    onPress={() => takePic()}
                  />
                  <TouchableOpacity
                    style={{ marginTop: moderateScale(20) }}
                    onPress={() => props.navigation.goBack()}
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
              ) : null}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </Container>
  );
};
export default AddBill;
