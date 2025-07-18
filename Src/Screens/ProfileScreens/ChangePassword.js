import { useNavigation, useTheme } from "@react-navigation/native";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ActivityIndicator } from "react-native-paper";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Ionicon from "react-native-vector-icons/Ionicons";
import * as yup from "yup";
import * as SVG from "../../Assets/SVG";
import { Gradient_Button } from "../../Components/Button/Button";
import Container from "../../Components/Container/Container";
import EmailContainer from "../../Components/Profile_Components/ChangePassComp/EmailContainer";
import TextInput_custom from "../../Components/TextInput_custom";
import Text_Custom from "../../Components/Text_Custom";
import { getValidated, updatePassword, verifyUser } from "../../Services/Actions/AuthActions";
import { getItem, getUSER_CRED, setItem } from "../../Services/apiCalls";
import { authStore } from "../../Store/AuthStore/AuthStore";
import { loaderStore } from "../../Store/AuthStore/LoaderStore";
import { changePasswordSchema, logout, showError } from "../../Utils/helper";
import {
  PASS_PHONE,
  PASS_REGEX,
  VALIDATE_TYPE,
  validateEmail,
  validatePhone,
} from "../../Utils/validator";
const Header = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  return (
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
      <TouchableOpacity
        style={{ width: "10%" }}
        onPress={() => navigation.goBack()}
      >
        <SVG.BackSVG />
      </TouchableOpacity>
      <View style={{ width: "80%", alignItems: "center" }}>
        <SVG.securePhoneSVG />
        <Text_Custom
          text={"Change Password"}
          style={{
            fontSize: scale(16),
            fontFamily: "NunitoSans-Bold",
            marginTop: 15,
          }}
        />
      </View>
    </View>
  );
};
const ChangePassword = (props) => {
  const { navigation } = props;
  const { colors } = useTheme();
  const [stepOne, setStepOne] = React.useState(0);
  const [stepInput, setStepInput] = useState("+0 000 000 0000");
  const [username, setusername] = useState("");
  const styles = StyleSheet.create({
    card: {
      marginHorizontal: moderateScale(20),
      marginVertical: moderateScale(20),
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
      // marginLeft: moderateScale(10),
      fontSize: scale(12),
      fontFamily: "NunitoSans-Bold",
    },
    textInputContainer: {
      marginBottom: moderateScale(10),
    },
    FP_Detail: {
      fontSize: scale(13),
      maxWidth: scale(320),
      marginHorizontal: moderateScale(20),
      marginVertical: moderateScale(20),
      alignSelf: "center",
      // fontFamily: "NunitoSans",
      // fontWeight: '700',
    },
    OTP_Container: {
      justifyContent: "space-evenly",
      marginVertical: verticalScale(1),
    },
    otp: { width: "15%" },
    otpInput: {
      width: "100%",
      height: scale(30),
    },
    otpError: {
      textAlign: "center",
      color: colors.error,
      fontSize: scale(12),
      marginTop: moderateScale(12),
    },
    borderStyleHighLighted: {
      borderColor: colors.primary,
    },
    underlineStyleBase: {
      width: 42,
      height: 44,
      borderRadius: 10,
      borderBottomWidth: 1,
      //
    },
    underlineStyleHighLighted: {
      borderColor: colors.primary,
    },
    Confirn_email: {
      color: colors.primary,
      fontWeight: "600",
    },
    Otp_ChangeResend: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    BackToSignin: {
      color: colors.primary,
      textAlign: "center",
      fontWeight: "600",
      marginTop: moderateScale(25),
      fontSize: scale(12),
    },
    ResendCode: {
      textAlign: "center",
      fontWeight: "600",
      marginTop: moderateScale(25),
      fontSize: scale(12),
    },
  });
  useEffect(() => {
    const init = async () => {
      const username = await getUSER_CRED();

      setusername(username.username);
    };
    init();
  }, []);
  const OTPContainer = () => {
    const [count, setCount] = useState(60);
    const [disableresend, setDisableresend] = useState(true);
    var Finalcode = authStore.userData.otp.otp;
    const [errorOtp, setErrorOtp] = useState("");
    const [OTP, setOTP] = useState();
    const [resendCount, setResendCount] = useState(0);
    const [showReset, setShowReset] = useState(true);
    const [resendLoader, setresendLoader] = useState(false);
    useEffect(() => {
      Keyboard.dismiss();
    }, []);
    useEffect(() => {
      loaderStore.setIsLoading(false);
      if (stepOne === 1) {
        let myInterval = setInterval(() => {
          if (count > 0) {
            setCount(count - 1);
          }
          if (count == 0) {
            setDisableresend(false);
          }
        }, 1000);
        return () => {
          clearInterval(myInterval);
        };
      }
    });
    const confirm = () => {
      setStepOne(3);
    };
    const otpCheck = (value) => {
      if (Number(value) === Number(Finalcode)) {
        confirm();
      } else if (Number(value) !== Number(Finalcode)) {
        if (!value) {
          setErrorOtp("OTP is required");
        } else {
          setErrorOtp("Invalid OTP");
        }
      }
    };
    const resendOtp = async () => {
      setresendLoader(true);
      // await verifyUser({ mobile: stepInput });
      // setCount(60);
      // setDisableresend(true);
      loaderStore.setIsLoading(true);
      setResendCount(resendCount + 1);
      if (resendCount >= 2) {
        Alert.alert("Resend otp limit exceeded");
        setShowReset(false);
        setresendLoader(false);
      } else {
        const isPhoneNumber = PASS_PHONE.test(stepInput);  
        const validationType = isPhoneNumber ? "phoneNumber" : "emailId"; 
         const message = await getValidated(VALIDATE_TYPE,stepInput);
         console.log("message",message)
         
         if (message=="") {
          
           await verifyUser({
             [validationType === "phoneNumber" ? "mobile" : "email_address"]: stepInput
           })
            .then((res) => {
              setCount(60);
              setDisableresend(true);
              loaderStore.setIsLoading(false);
              setresendLoader(false);
            })
            .catch((err) => {});
        } 
      }
    };
    return (
      <>
        <Text style={[styles.FP_Detail, { color: colors.text }]}>
          Enter the 6 digit verification code that has been sent to{" "}
          <Text style={[styles.FP_Detail, styles.Confirn_email]}>
            {stepInput}
          </Text>{" "}
          to reset your password.
        </Text>
        <View style={styles.card}>
          <View style={styles.textInputContainer}>
            <View style={styles.textIconContainer}>
              {/* <SVG.LockSVG /> */}
              <Text_Custom text="OTP" style={styles.text} />
            </View>
            <View style={styles.OTP_Container}>
              <OTPInputView
                style={[styles.otpInput]}
                pinCount={6}
                // code={'5555'} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                onCodeChanged={(code) => {
                  setOTP(code);
                  if (code.length < 4) {
                    setErrorOtp("");
                  }
                }}
                autoFocusOnLoad
                codeInputFieldStyle={[
                  styles.underlineStyleBase,
                  errorOtp && { borderColor: colors.error },
                  { color: colors.text },
                ]}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                placeholderCharacter={"-"}
                placeholderTextColor={colors.placeholder}
                // onCodeFilled={(code) => {
                //   otpCheck(code);
                // }}
              />
              <Text style={styles.otpError}>{errorOtp}</Text>
            </View>
          </View>
          <Gradient_Button
            text={"Continue"}
            onPress={() => {
              otpCheck(OTP);
            }}
          />
          <View style={styles.Otp_ChangeResend}>
            <TouchableOpacity onPress={() => setStepOne(0)}>
              <Text style={styles.BackToSignin}>Change number/Email?</Text>
            </TouchableOpacity>
            {showReset && (
              <>
                {!resendLoader ? (
                  <TouchableOpacity
                    onPress={() => resendOtp()}
                    disabled={disableresend}
                  >
                    <Text
                      style={[
                        styles.ResendCode,
                        {
                          color: !disableresend
                            ? colors.primary
                            : colors.border,
                        },
                      ]}
                    >
                      Resend code{count !== 0 && ` (${count})`}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View
                    style={{
                      width: 50,
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <ActivityIndicator size={12} color={colors.primary} />
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </>
    );
  };
  const NewPassword = () => {
    const [NewPass, setNewPass] = useState("");
    const [ERROR_PASS, setERROR_PASS] = useState({ show: false, msg: "" });
    const [ERROR_CPASS, setERROR_CPASS] = useState({ show: false, msg: "" });
    const [passwordType, setPasswordType] = useState(false);
    const [confirmSecure, setConfirmSecure] = useState(false);
    const [confirmPass, setConfirmPass] = useState("");
    const [LoadingPass, setLoadingPass] = useState(false);
    const changePassword = async (values) => {
    
      var oldPassword=await getItem("password");
      console.log("oldpassw",oldPassword)
      if(oldPassword!==values.password){
        
        setLoadingPass(true);
        console.log("values on onchange",stepInput)
        const isPhoneNumber = PASS_PHONE.test(stepInput);  
        const validationType = isPhoneNumber ? "phoneNumber" : "emailId"; 
        
         const message = await getValidated (VALIDATE_TYPE,stepInput);
         console.log("message",message)
         
         if (message=="") {
          setLoadingPass(false);
          var res = await updatePassword({
            [validationType === 'phoneNumber' ? 'mobile' : 'email_address']: stepInput,
            password: values.password,
          });
          if (res.code == 200) {
            setLoadingPass(false);
   
            setItem("password",values.password)
           // navigation.navigate("Profile");
           logout();
          } else {
            showError(res.message);
          }
        } 
      }
      else{
        showError("new password must be different from previous used password")
      }
     
    };
   
    
    return (
      <>
        <Text style={[styles.FP_Detail, { color: colors.text }]}>
          Your new password must be different from previous used password.{"\n"}
          
        </Text>
        <Text style={{ fontSize: 14, color: colors.primary, marginLeft: 30 ,marginBottom:moderateScale(2)}}>
        Changing your password will log you out !
  </Text>
        <View style={styles.card}>
          
          <Formik
            enableReinitialize={true}
            validationSchema={changePasswordSchema}
            initialValues={{ password: "", confirmPassword: "" }}
            onSubmit={(values) => {
              changePassword(values);
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isValid,
              dirty,
            }) => (
              <>
                <View style={styles.textInputContainer}>
                  <View style={styles.textIconContainer}>
                    {/* <SVG.LockSVG /> */}
                    <Text_Custom text="Password" style={styles.text} />
                  </View>
                  <TextInput_custom
                    onBlur={handleBlur("password")}
                    onChangeText={handleChange("password")}
                    ERROR_MSG={{
                      show: touched.password ? errors.password : "",
                      msg: touched.password ? errors.password : "",
                    }}
                    value={values.password}
                    secureTextEntry={!passwordType}
                    placeholder={"New Password"}
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
                <View style={styles.textInputContainer}>
                  <View style={styles.textIconContainer}>
                    {/* <SVG.LockSVG /> */}
                    <Text_Custom text="Confirm Password" style={styles.text} />
                  </View>
                  <TextInput_custom
                    value={values.confirmPassword}
                    onBlur={handleBlur("confirmPassword")}
                    onChangeText={handleChange("confirmPassword")}
                    ERROR_MSG={{
                      show: touched.confirmPassword
                        ? errors.confirmPassword
                        : "",
                      msg: touched.confirmPassword
                        ? errors.confirmPassword
                        : "",
                    }}
                    secureTextEntry={!confirmSecure}
                    placeholder={"Confirm Password"}
                    Icon={
                      <TouchableOpacity
                        onPress={() => setConfirmSecure(!confirmSecure)}
                      >
                        <Ionicon
                          name={confirmSecure ? "eye" : "eye-off"}
                          style={styles.searchIcon}
                          size={scale(20)}
                          color={colors.placeholder}
                        />
                      </TouchableOpacity>
                    }
                  />
                </View>
                <Gradient_Button
                  // disabled={!isValid}
                  // active={isValid}
                  text={"Save"}
                  disable={LoadingPass}
                  onPress={handleSubmit}
                />
              </>
            )}
          </Formik>
        </View>
      </>
    );
  };
  return (
    <Container>
      <KeyboardAwareScrollView
        //keyboardShouldPersistTaps={Platform.OS === "ios" ? "never" : "always"}
        showsVerticalScrollIndicator={false}
      >
        {/* <ScrollView
        keyboardShouldPersistTaps={"always"}
        showsVerticalScrollIndicator={false}
      > */}
        <Header />
        {stepOne === 0 && (
          <EmailContainer
            setStepOne={setStepOne}
            stepInput={stepInput}
            setStepInput={setStepInput}
            username={username}
          />
        )}
        {stepOne === 1 && <OTPContainer />}
        {stepOne === 3 && <NewPassword />}
        {/* </ScrollView> */}
      </KeyboardAwareScrollView>
    </Container>
  );
};
export default ChangePassword;
