import { useTheme } from "@react-navigation/native";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { Gradient_Button } from "../Button/Button";
import { getValidated, verifyUser } from "../../Services/Actions/AuthActions";
import { authStore } from "../../Store/AuthStore/AuthStore";
import { PASS_PHONE, VALIDATE_TYPE, validateEmail, validatePhone } from "../../Utils/validator";
import { loaderStore } from "../../Store/AuthStore/LoaderStore";

const OTPContainer = ({ setStepOne, stepOne, stepInput }) => {
  const { colors, dark } = useTheme();

  const [count, setCount] = useState(60);
  const [disableresend, setDisableresend] = useState(true);
  var Finalcode = authStore?.userData?.otp?.otp;
  const [errorOtp, setErrorOtp] = useState("");
  const [OTP, setOTP] = useState();
  const [resendCount, setResendCount] = useState(0);
  const [showReset, setShowReset] = useState(true);
  const [resendLoader, setresendLoader] = useState(false);
  useEffect(() => {
    Keyboard.dismiss();
  }, []);

  useEffect(() => {
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
  const resendOtp = async () => {
    setResendCount(resendCount + 1);
    setresendLoader(true);
    loaderStore?.setIsLoading(true);
    if (resendCount >= 2) {
      Alert.alert("Resend otp limit exceeded");
      setShowReset(false);
      setresendLoader(false);
    } else {
      //const isPhoneNumber = /^\+?[0-9]{10,15}$/.test(stepInput); 
     
      const isPhoneNumber =PASS_PHONE.test(stepInput); 
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

  const styles = StyleSheet.create({
    FP_Detail: {
      textAlign: "center",
      fontSize: scale(13),
      maxWidth: 340,
      marginBottom: moderateScale(5),
      alignSelf: "center",
    },
    OTP_Container: {
      justifyContent: "space-evenly",
      marginVertical: verticalScale(20),
    },
    Otp_ChangeResend: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    otp: { width: "15%" },
    otpInput: {
      width: "100%",
      height: 100,
    },
    otpError: {
      textAlign: "center",
      color: colors.error,
      fontSize: scale(12),
    },

    underlineStyleBase: {
      width: 42,
      height: 44,
      borderRadius: 10,
      borderBottomWidth: 1,
    },

    underlineStyleHighLighted: {
      borderColor: colors.primary,
    },
    Confirn_email: {
      color: colors.primary,
      fontWeight: "600",
    },
    BackToSignin: {
      color: colors.primary,
      textAlign: "center",
      fontWeight: "600",
      marginTop: moderateScale(25),
      fontSize: scale(14),
    },
    ResendCode: {
      textAlign: "center",
      fontWeight: "600",
      marginTop: moderateScale(25),
      fontSize: scale(14),
    },

    input: {
      height: moderateScale(50),
      borderRadius: scale(5),
      marginVertical: verticalScale(20),
      paddingHorizontal: moderateScale(15),
      borderColor: "#CAD7E2",
      borderWidth: 1,
      fontSize: scale(12),
      fontWeight: "600",
      color: colors.text,
    },
  });
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
  return (
    <>
      <Text style={[styles.FP_Detail, { color: colors.text }]}>
        Enter the 6 digit verification code that has been sent to{" "}
        <Text style={[styles.FP_Detail, styles.Confirn_email]}>
          {stepInput}
        </Text>{" "}
        to reset your password.
      </Text>
      <View style={styles.OTP_Container}>
        <OTPInputView
          style={[styles.otpInput]}
          pinCount={6}
          // code={'5555'} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
          onCodeChanged={(code) => {
            setOTP(code);
            if (code?.length < 4) {
              setErrorOtp("");
            }
          }}
          autoFocusOnLoad={true}
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
                      color: !disableresend ? colors.primary : colors.border,
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
    </>
  );
};

export default OTPContainer;
