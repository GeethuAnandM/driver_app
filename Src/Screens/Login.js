import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Pressable,
} from "react-native";
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from "react-native-size-matters";
import Ionicon from "react-native-vector-icons/Ionicons";
import * as SVG from "../Assets/SVG";
import Container from "../Components/Container/Container";
import COLORS from "../Constant/Colors";
import { useTheme } from "@react-navigation/native";
import { Formik } from "formik";
import { Checkbox } from "react-native-paper";
import * as yup from "yup";
import { Gradient_Button } from "../Components/Button/Button";
import TextInput_custom from "../Components/TextInput_custom";
import Text_Custom from "../Components/Text_Custom";
import { signIn } from "../Services/Actions/AuthActions";
import { getAuthData, getItem, getUSER_CRED,setItem } from "../Services/apiCalls";
import { getAppVersion, loginValidationSchema, showError, updateGcmDetails } from "../Utils/helper";
import { validateEmail, validatePhone } from "../Utils/validator";
import { observer } from "mobx-react";
import AsyncStorage from '@react-native-async-storage/async-storage';


import { postUuid } from "../Services/Actions/TripActions";
import { authStore } from "../Store/AuthStore/AuthStore";
const { height, width } = Dimensions.get("window");
const Login = (props) => {
  const { navigation } = props;
  const { colors, dark } = useTheme();
  const [checked, setChecked] = React.useState(false);
  const [passwordType, setPasswordType] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [ERROR_EMAIL, setERROR_EMAIL] = useState({ show: false, msg: "" });
  const [ERROR_PASS, setERROR_PASS] = useState({ show: false, msg: "" });
  const [loading, setLoading] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(undefined);
  
  const userDataExist = async () => {
    return getUSER_CRED();
  };
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardWillShow", () => {
      setKeyboardStatus(0.3);
    });
    const hideSubscription = Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardStatus(1);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  useEffect(() => {
    const initial = async () => {
      var userCred = await getUSER_CRED();
      if (userCred?.password) {
        setPassword(userCred?.password);
        setChecked(true);
      }
      if (userCred?.username) {
        setEmail(userCred?.username);
        setChecked(true);
      }
    };
    initial();
  }, []);
  async function getOrCreateUUID() {
    let uuid = await AsyncStorage.getItem('deviceUUID');
  
    // Generate a new UUID
    if (!uuid) {
      uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
  
      await AsyncStorage.setItem('deviceUUID', uuid);
    }
  
    return uuid;
  }
  
  const Login = async (values) => {
    console.log("staart >>>>>>>>>>>logn");
    setLoading(true);
    if (values?.password) {
      const res = await signIn(values?.email, values?.password, checked);
      
      console.log("res from login", res);
      if (res.driverId) {
        console.log("res.driver_id", res);
        await setItem("registeredPhone", res.phoneNumber);

        await setItem("registeredEmail", res.email);

        const uuid = await getOrCreateUUID();

        const requestBody = {
          driverId: res.driverId,
          uuidNumber: uuid,
        };
        var responseUUId = await postUuid(requestBody);

        var gcmResponse = await updateGcmDetails();
        console.log("updategcmdetails Response from login", gcmResponse);

        console.log("end???????");
        setLoading(false);

        //authstore.setLogin(true)means app navigate to APPStack as per in </Routes>
        authStore.setLogin(true);
      }
      setLoading(false);
    }
  };
  const styles = StyleSheet.create({
    main: {},
    scrollView: {
      marginHorizontal: 20,
    },
    password: {
      width: "90%",
      paddingHorizontal: moderateScale(15),
      fontSize: scale(12),
      fontWeight: "600",
      // marginTop: 20,
      color: COLORS.dark,
    },
    textInput: {
      flexDirection: "row",
      height: moderateScale(45),
      backgroundColor: COLORS.white,
      borderRadius: 5,
      alignItems: "center",
      // paddingLeft: moderateScale(20),
      borderWidth: 1,
      borderColor: "#CAD7E2",
      elevation: 1,
    },
    searchInput: {
      marginLeft: moderateScale(15),
      flex: 1,
      fontSize: scale(16),
      letterSpacing: 0.1,
      width: "100%",
      color: COLORS.dark,
      borderRadius: 14,
      backgroundColor: COLORS.white,
    },
    logoContainer: {
      alignSelf: "center",
      justifyContent: "center",
      position: "absolute",
      top: scale(20),
      alignItems: "center",
      zIndex: 9999,
    },
    logoContainerText: {
      fontSize: scale(20),
      fontFamily: "NunitoSans-Bold",
      marginVertical: verticalScale(4),
    },
    upper: {
      flex: 2,
      opacity: 0.2,
      // alignItems: 'center',
    },
    lower: {
      // flex: 1.5,
      backgroundColor: colors.SecondaryBackground,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      justifyContent: "flex-end",
      paddingHorizontal: moderateScale(20),
      paddingTop: moderateScale(30),
      paddingBottom:
        Platform.OS == "ios" ? moderateScale(50) : moderateScale(20),
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.25,
      shadowRadius: 10.65,
      elevation: 25,
    },
    input: {
      height: moderateScale(50),
      borderRadius: scale(5),
      marginVertical: verticalScale(4),
      paddingHorizontal: moderateScale(15),
      borderColor: "#CAD7E2",
      borderWidth: 1,
      fontSize: scale(12),
      fontWeight: "600",
      // marginTop: 20,
      color: COLORS.dark,
    },
    passwordViewContainer: {
      marginTop: moderateScale(15),
    },
    forgotContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: verticalScale(10),
      alignItems: "center",
      fontSize: scale(16),
    },
    button: {
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: moderateVerticalScale(15),
      borderRadius: scale(40),
    },
    btnText: {
      color: COLORS.white,
      fontFamily: "NunitoSans-Bold",
      fontSize: scale(16),
    },
    rememberText: {
      color: "#2196F3",
      fontSize: scale(14),
    },
    ForgotText: {
      color: "#2196F3",
      fontSize: scale(14),
    },
    Check: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
  
  return (
    <Container
      contentContainerStyle={styles.main}
      statusBarStyle={{ backgroundColor: colors.primaryBackground1 }}
    >
      <View style={styles.logoContainer}>
        <Text_Custom style={styles.logoContainerText} text={"Welcome to"} />
        <SVG.LoginLogo />
      </View>
      <View
        style={[
          styles.upper,
          {
            opacity: keyboardStatus,
          },
        ]}
      >
        {!dark ? <SVG.LoginUpper /> : <SVG.Dark_LoginUpper />}
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : ""}
        keyboardShouldPersistTaps={true}
      >
        <ScrollView
          contentContainerStyle={{ paddingTop: scale(10) }}
          keyboardShouldPersistTaps={"always"}
        >
          <Formik
            enableReinitialize={true}
            validationSchema={loginValidationSchema("fromLogin")}
            initialValues={{ email: email, password: password }}
            onSubmit={(values) => Login(values)}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isValid,
            }) => (
              <View style={[styles.lower]}>
                <View>
                  <TextInput_custom
                    ERROR_MSG={{
                      show: touched?.email ? errors?.email : "",
                      msg: touched?.email ? errors?.email : "",
                    }}
                    value={values?.email}
                    onBlur={handleBlur("email")}
                    onChangeText={handleChange("email")}
                  />
                  <TextInput_custom
                    containerStyles={{ marginBottom: moderateScale(5) }}
                    ERROR_MSG={{
                      show: touched.password ? errors.password : "",
                      msg: touched.password ? errors.password : "",
                    }}
                    secureTextEntry={!passwordType}
                    placeholder={"Password"}
                    value={values?.password}
                    onBlur={handleBlur("password")}
                    onChangeText={handleChange("password")}
                    Icon={
                      <TouchableOpacity
                        onPress={() => setPasswordType(!passwordType)}
                      >
                        <Ionicon
                          name={passwordType ? "eye" : "eye-off"}
                          style={styles.searchIcon}
                          size={scale(20)}
                          color={colors.placeholder}
                        />
                      </TouchableOpacity>
                    }
                  />
                </View>
                <View style={styles.forgotContainer}>
                  <View style={styles.Check}>
                    <View>
                      <Checkbox.Android
                        uncheckedColor={colors.placeholder}
                        color={colors.primary}
                        status={checked ? "checked" : "unchecked"}
                        onPress={() => {
                          setChecked(!checked);
                        }}
                      />
                    </View>
                    <Text style={styles.rememberText}>Remember me</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("ForgotPasswordScreen")}
                  >
                    <Text style={styles.ForgotText}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>
                <Gradient_Button
                  text={"Login"}
                  onPress={handleSubmit}
                  disable={loading}
                  disabled={loading}
                />
                    
              {/* Privacy Policy  */}
                <Pressable
                  style={{
                    alignSelf: "center",
                    flexDirection: "row",
                    marginTop: 15,
                  }}
                  onPress={() => Linking.openURL("http://13.233.175.113/privacy-policy")}
                >
                  <Text_Custom
                    text={`Privacy Policy`}
                    style={{ color: "#000", fontWeight: "700" }}
                    
                  />
                                {/* <Text_Custom
  text={`V${getAppVersion()}`}
 
/> */}
                </Pressable>
                <Text_Custom
  text={`V${getAppVersion()}`}
  style={{ marginLeft: moderateScale(140) }}
/>

              {/* Privacy Policy  */}
                    
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};
export default observer(Login);
