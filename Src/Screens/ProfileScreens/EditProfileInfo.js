import { useTheme } from "@react-navigation/native";
import { Formik } from "formik";
import { observer } from "mobx-react";
import React, { useLayoutEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ImageCropPicker from "react-native-image-crop-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";
import { moderateScale, scale } from "react-native-size-matters";
import * as yup from "yup";
import * as SVG from "../../Assets/SVG";
import { Button, Gradient_Button } from "../../Components/Button/Button";
import Container from "../../Components/Container/Container";
import Loader from "../../Components/Loader/Loader";
import Custom_Modalize from "../../Components/Modalize/Custom_Modalize";
import TextInput_custom from "../../Components/TextInput_custom";
import Text_Custom from "../../Components/Text_Custom";
import { updateUserInfo } from "../../Services/Actions/AuthActions";
import { getAuthData } from "../../Services/apiCalls";
import { authStore } from "../../Store/AuthStore/AuthStore";
import { loaderStore } from "../../Store/AuthStore/LoaderStore";
import { AlertOpenSettings, isImage } from "../../Utils/helper";
const EditProfileInfo = (props) => {
  const { colors, dark } = useTheme();
  //const [picture, setPicture] = useState(authStore.driverData?.image);
  const [image, setImage] = useState({
    path: authStore.driverData?.image,
  });
  // const [userData, setUserData] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");

  const [Loading, setLoading] = useState(false);
  const nameRef = useRef();
  const modalizeRef = useRef(null);
  useLayoutEffect(() => {
    const init = async () => {
      var token = await getAuthData();
      var dData = authStore.driverData;

      // setUserData(dData);
      authStore.setFullName({
        FirstName: dData?.firstName,
        LastName: dData?.lastName,
        MiddleName: dData?.middleName,
      });
      // setFirstName(dData?.firstName);
      // setLastName(dData?.lastName);
      // setMiddleName(dData?.middleName);
    };
    init();
  }, []);
  const checkPermission = () => {
    Keyboard.dismiss();

    let checkData =
      Platform.OS == "android"
        ? PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION
        : PERMISSIONS.IOS.PHOTO_LIBRARY;
    check(checkData).then((res) => {
      if (RESULTS.GRANTED == res || RESULTS.LIMITED == res) {
        // handleImage();
        modalizeRef.current?.open();
      } else {
        request(checkData).then((res) => {
          if (RESULTS.GRANTED == res || RESULTS.LIMITED == res) {
            // handleImage();
            modalizeRef.current?.open();
          } else {
            AlertOpenSettings();
          }
        });
      }
    });
  };
  const closePikerModal = () => {
    setFirstName(authStore?.fullname?.FirstName);
    setLastName(authStore?.fullname?.LastName);

    setMiddleName(authStore?.fullname?.MiddleName);
    modalizeRef.current?.close();
  };
  const openCamera = () => {
    try {
      ImageCropPicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        useFrontCamera: true,
      })
        .then(async (image) => {
          closePikerModal();
          setImage(image);
        })
        .catch((err) => {
          closePikerModal();

          console.log("openCamera", err);
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
        width: 500,
        height: 500,
        cropping: true,
      })
        .then(async (image) => {
          setImage(image);
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
  const styles = StyleSheet.create({
    card: {
      marginHorizontal: moderateScale(20),
      marginVertical: moderateScale(25),
      backgroundColor: colors.SecondaryBackground,
      borderColor: colors.cardBorder,
      borderRadius: 5,
      paddingVertical: moderateScale(20),
      paddingHorizontal: moderateScale(20),
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
    },
    tripId: {
      fontSize: scale(14),
      fontFamily: "NunitoSans-Bold",
      color: dark ? colors.text : "#A5A5A5",
      marginBottom: moderateScale(10),
    },
    statusButton: {
      backgroundColor: "#34C654",
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(5),
      borderRadius: scale(5),
    },
    statusButtonText: {
      fontSize: scale(14),
      fontFamily: "NunitoSans-Bold",
      color: "#fff",
    },
  });
  const updateUserProfile = async () => {
    var values = authStore?.fullname;
    setLoading(true);
    await updateUserInfo({ ...values, image }).then((res) => {
      if (res.message) {
        setLoading(false);
        props.navigation.goBack();
      }
    });
    setLoading(false);
  };
  const EditUserInfo = observer(() => {
    const [firstNameError, setFirstNameError] = useState({
      show: "",
      msg: "",
    });

    const [LastNameError, setLastNameError] = useState({
      show: "",
      msg: "",
    });
    return (
      <View style={{ margin: moderateScale(20) }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text_Custom
            text={"Profile Information"}
            style={{ fontSize: scale(16), fontFamily: "NunitoSans-Bold" }}
          />
        </View>
        <View
          style={{
            borderRadius: 5,
            borderColor: colors.cardBorder,
            borderWidth: 1,
            backgroundColor: colors.SecondaryBackground,
            marginVertical: moderateScale(15),
            paddingHorizontal: moderateScale(15),
            paddingVertical: moderateScale(10),
          }}
        >
          <>
            <View style={styles.textInputContainer}>
              <View style={styles.textIconContainer}>
                <SVG.userIcon />
                <Text_Custom style={styles.text} text="First Name" />
              </View>
              <TextInput_custom
                placeholder="First Name"
                containerStyles={{ marginBottom: moderateScale(5) }}
                ERROR_MSG={firstNameError}
                value={authStore?.fullname?.FirstName}
                onBlur={() => {
                  if (authStore?.fullname?.FirstName === "") {
                    setFirstNameError({
                      show: true,
                      msg: "First name is required",
                    });
                  }
                }}
                onChangeText={(e) => {
                  authStore.setFname(e);
                  setFirstNameError({
                    show: false,
                    msg: "",
                  });
                }}
              />
            </View>
            <View style={styles.textInputContainer}>
              <View style={styles.textIconContainer}>
                <SVG.userIcon />
                <Text_Custom style={styles.text} text="Middle Name" />
              </View>
              <TextInput_custom
                placeholder="Middle Name"
                containerStyles={{ marginBottom: moderateScale(5) }}
                // ERROR_MSG={{
                //   show: errors.MiddleName,
                //   msg: errors.MiddleName,
                // }}
                value={authStore?.fullname?.MiddleName}
                // onBlur={handleBlur("MiddleName")}
                onChangeText={(e) => authStore.setMname(e)}
              />
            </View>
            <View style={styles.textInputContainer}>
              <View style={styles.textIconContainer}>
                <SVG.userIcon />
                <Text_Custom style={styles.text} text="Last Name" />
              </View>
              <TextInput_custom
                placeholder="Last Name"
                containerStyles={{ marginBottom: moderateScale(5) }}
                ERROR_MSG={LastNameError}
                onBlur={() => {
                  if (authStore?.fullname?.LastName === "") {
                    setLastNameError({
                      show: true,
                      msg: "Last name is required",
                    });
                  }
                }}
                value={authStore?.fullname?.LastName}
                // onBlur={handleBlur("LastName")}
                onChangeText={(e) => {
                  authStore.setLname(e);
                  setLastNameError({
                    show: false,
                    msg: "",
                  });
                }}
              />
            </View>
            <Gradient_Button
              disabled={firstNameError.show || LastNameError?.show}
              active={!firstNameError.show && !LastNameError?.show}
              text={"Update Profile"}
              onPress={updateUserProfile}
            />
            <Button
              text="Cancel"
              onPress={() => {
                props.navigation.goBack();
              }}
              buttonStyles={{
                backgroundColor: colors.error,
                marginTop: moderateScale(10),
              }}
            />
          </>
        </View>
      </View>
    );
  });

  {
    /* <Formik
            validationSchema={loginValidationSchema}
            initialValues={authStore.fullname}
            onSubmit={(values) => updateUserProfile(values)}
            validate={(e) => {
              console.log("fname", e);
              authStore.setFullName(e);
            }}
            // onChangeText={(e) => console.log("e ->", e)}
          >
            {({
              validateField,
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isValid,
            }) => (
              <>
                <View style={styles.textInputContainer}>
                  <View style={styles.textIconContainer}>
                    <SVG.userIcon />
                    <Text_Custom style={styles.text} text="First Name" />
                  </View>
                  <TextInput_custom
                    placeholder="First Name"
                    containerStyles={{ marginBottom: moderateScale(5) }}
                    ERROR_MSG={{
                      show: errors.FirstName,
                      msg: errors.FirstName,
                    }}
                    value={values.FirstName}
                    onBlur={handleBlur("FirstName")}
                    onChangeText={handleChange("FirstName")}
                  />
                </View>
                <View style={styles.textInputContainer}>
                  <View style={styles.textIconContainer}>
                    <SVG.userIcon />
                    <Text_Custom style={styles.text} text="Middle Name" />
                  </View>
                  <TextInput_custom
                    placeholder="Middle Name"
                    containerStyles={{ marginBottom: moderateScale(5) }}
                    ERROR_MSG={{
                      show: errors.MiddleName,
                      msg: errors.MiddleName,
                    }}
                    value={values.MiddleName}
                    onBlur={handleBlur("MiddleName")}
                    onChangeText={handleChange("MiddleName")}
                  />
                </View>
                <View style={styles.textInputContainer}>
                  <View style={styles.textIconContainer}>
                    <SVG.userIcon />
                    <Text_Custom style={styles.text} text="Last Name" />
                  </View>
                  <TextInput_custom
                    placeholder="Last Name"
                    containerStyles={{ marginBottom: moderateScale(5) }}
                    ERROR_MSG={{ show: errors.LastName, msg: errors.LastName }}
                    value={values.LastName}
                    onBlur={handleBlur("LastName")}
                    onChangeText={handleChange("LastName")}
                  />
                </View>
                <Gradient_Button
                  disabled={Loading}
                  text={"Update Profile"}
                  onPress={handleSubmit}
                />
                <Button
                  text="Cancel"
                  onPress={() => {
                    props.navigation.goBack();
                  }}
                  buttonStyles={{
                    backgroundColor: colors.error,
                    marginTop: moderateScale(10),
                  }}
                />
              </>
            )}
          </Formik> */
  }

  return (
    <Container>
      <KeyboardAwareScrollView
        //keyboardShouldPersistTaps={Platform.OS === "ios" ? "never" : "always"}
        showsVerticalScrollIndicator={false}
      >
        {/* <ScrollView
          keyboardShouldPersistTaps={Platform.OS === "ios" ? "never" : "always"}
          showsVerticalScrollIndicator={false}
        > */}
        <Loader isLoadingProps={Loading} />
        <View
          style={{
            // height: '30%',
            backgroundColor: colors.SecondaryBackground,
            paddingHorizontal: moderateScale(20),
            flexDirection: "row",
            paddingTop: moderateScale(10),
            paddingBottom: moderateScale(20),
          }}
        >
          <View style={{ width: "10%" }}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <SVG.BackSVG />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => checkPermission()}
            style={{
              width: "80%",
              alignItems: "center",
              marginTop: moderateScale(20),
            }}
          >
            <Image
              source={isImage(image.path)}
              style={{ width: 120, height: 120, borderRadius: 7 }}
            />
            <View style={{ marginTop: moderateScale(-10) }}>
              <SVG.EditProfileImage />
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <EditUserInfo />
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
export default observer(EditProfileInfo);
const styles = StyleSheet.create({});
