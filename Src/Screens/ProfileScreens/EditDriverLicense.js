import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  ScrollView,
  Keyboard,
  Linking,
  Platform,
} from "react-native";
import React, { useRef, useState } from "react";
import { findDriver } from "../../Utils/validator";
import Custom_Modalize from "../../Components/Modalize/Custom_Modalize";
import { authStore } from "../../Store/AuthStore/AuthStore";
import { imageStore } from "../../Store/AuthStore/ImageStore";
import moment from "moment";
import {
  updateLicanceData,
  uploadImageURL,
} from "../../Services/Actions/AuthActions";
import ImageCropPicker from "react-native-image-crop-picker";
import { moderateScale, scale } from "react-native-size-matters";
import { useTheme } from "@react-navigation/native";
import Text_Custom from "../../Components/Text_Custom";
import { AlertOpenSettings, isImage } from "../../Utils/helper";
import TextInput_custom from "../../Components/TextInput_custom";
import DatePicker from "../../Components/DateTimePicker/DatePicker";
import { Gradient_Button, Button } from "../../Components/Button/Button";
import Container from "../../Components/Container/Container";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { observer } from "mobx-react";
const EditDriverLicense = (props) => {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    imageContainer: {
      height: scale(200),
      backgroundColor: colors.SecondaryBackground,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: moderateScale(15),
    },
    image: {
      width: "100%",
      height: "100%",
      borderRadius: 10,
      borderColor: colors.cardBorder,
      borderWidth: 1,
    },
    textIconContainer: {
      flexDirection: "row",
      marginBottom: moderateScale(10),
      alignItems: "center",
    },
    text: {
      marginLeft: moderateScale(10),
      fontSize: scale(12),
      fontFamily: "NunitoSans-Bold",
    },
    textInputContainer: {
      marginBottom: moderateScale(10),
      width: "100%",
    },
  });
  const [licenceNo, setLicenceNo] = useState(authStore.lpNumber);
  const [image, setImage] = useState(imageStore.licenceImage);
  const modalizeRef = useRef(null);
  const [disable, setdisable] = useState(false);
  const closePikerModal = () => {
    modalizeRef.current?.close();
  };
  const openImagePiker = () => {
    Keyboard.dismiss();
    modalizeRef.current?.open();
  };
  const [licenceExpDate, setLicenceExpDate] = useState(
    moment(authStore.lpExpDate).format("YYYY-MM-DD")
  );
  const Cancel = () => {
    props.navigation.goBack();
  };
  const save = async () => {
    if (licenceExpDate.trim() == "") {
      return Alert.alert("License expiry date is required");
    } else if (licenceNo.trim() == "") {
      return Alert.alert("License number is required");
    } else if (imageStore.licenceImage == "") {
      return Alert.alert("License image is required");
    } else {
      setdisable(true);
      var status = await updateLicanceData({
        licenceNo,
        licenceExpDate,
        image,
      }).then((res) => {
        if (res == true) {
          setdisable(false);
          // setIsDriverFound(res);
          props.navigation.navigate("LicenceInfo");
        }
      });
      setdisable(false);
    }
  };
  const uplodeImage = async (image) => {
    var url = await uploadImageURL(image.path).then((res) => {
      if (res.message) {
        setImage(res.message);
        // imageStore.setLicenceImage(res.message);
        // setUploaded(true);
        // setModalVisible(false);
      }
    });
  };
  const openCamera = () => {
    try {
      ImageCropPicker.openCamera({
        width: 520,
        height: 420,
        cropping: true,
        useFrontCamera: false,
      })
        .then(async (image) => {
          closePikerModal();
          uplodeImage(image);
        })
        .catch((err) => {
          closePikerModal();
          console.log("CAMERA ERROR", err);
          AlertOpenSettings(err);
        });
    } catch (error) {
      closePikerModal();

      console.log("IMAGE_PICKER_ERROR - ", error);
    }
  };
  const openGallery = () => {
    try {
      ImageCropPicker.openPicker({
        width: 520,
        height: 420,
        cropping: true,
      })
        .then(async (image) => {
          uplodeImage(image);
          closePikerModal();
        })
        .catch((err) => {
          closePikerModal();
          console.log(err);
          AlertOpenSettings(err);
        });
    } catch (error) {
      closePikerModal();
      console.log("IMAGE_PICKER_ERROR - ", error);
    }
  };
  return (
    <Container>
      <CommonHeader title="Edit License" goBack />
      <KeyboardAwareScrollView
        //keyboardShouldPersistTaps={Platform.OS === "ios" ? "never" : "always"}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: moderateScale(20),
        }}
      >
        {/* <ScrollView
        keyboardShouldPersistTaps={"always"}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          // flexGrow: 1,
          padding: moderateScale(20),
        }}
      > */}
        <View>
          <Text_Custom
            style={{
              fontSize: scale(16),
              fontFamily: "NunitoSans-Bold",
              marginBottom: moderateScale(15),
            }}
            text={"Edit License"}
          />
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => openImagePiker()}
          >
            {image !== "" ? (
              <Image source={isImage(image)} style={styles.image} />
            ) : (
              <SVG.NoImageSvg />
            )}
            <View
              style={{
                position: "absolute",
                backgroundColor: colors.primary,
                paddingHorizontal: moderateScale(15),
                paddingVertical: moderateScale(4),
                borderRadius: 5,
                right: 10,
                top: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text_Custom text="Change" style={{ color: "#fff" }} />
            </View>
          </TouchableOpacity>
          <View
            style={{
              // height: "100%",
              borderRadius: 5,
              borderWidth: 1,
              borderColor: colors.cardBorder,
              paddingVertical: moderateScale(15),
              backgroundColor: colors.SecondaryBackground,
              paddingHorizontal: moderateScale(10),
              marginBottom: moderateScale(15),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={styles.textInputContainer}>
                <View style={styles.textIconContainer}>
                  <Text_Custom text="License Number" style={styles.text} />
                </View>
                <TextInput_custom
                  inputProps={{ keyboardType: "number-pad" }}
                  containerStyles={{ marginBottom: moderateScale(5) }}
                  placeholder={"License Number"}
                  value={licenceNo}
                  onChangeText={(value) => {
                    // authStore.setLpNumber(value);
                    setLicenceNo(value);
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: moderateScale(15),
              }}
            >
              <View style={styles.textInputContainer}>
                <View style={styles.textIconContainer}>
                  <Text_Custom text="License Expiry Date" style={styles.text} />
                </View>
                <DatePicker
                  conatinerStyles={{
                    width: "100%",
                    justifyContent: "center",
                  }}
                  date={moment(licenceExpDate).format("DD-MM-YYYY")}
                  placeholder={"Select Date"}
                  minDate={new Date()}
                  setDate={(v) => {
                    setLicenceExpDate(v);
                  }}
                />
              </View>
            </View>
            <Gradient_Button
              disabled={disable}
              text="Update"
              onPress={() => {
                save();
              }}
            />
            {findDriver() && (
              <Button
                onPress={() => {
                  Cancel(); // imageStore.setLicenceImage("");
                }}
                text="Cancel"
                buttonStyles={{
                  backgroundColor: colors.error,
                  marginTop: moderateScale(20),
                }}
              />
            )}
          </View>
        </View>
        <Custom_Modalize
          modalizeRef={modalizeRef}
          openCamera={openCamera}
          openGallery={openGallery}
        />
        {/* </ScrollView> */}
      </KeyboardAwareScrollView>
    </Container>
  );
};
export default observer(EditDriverLicense);
