import { useNavigation, useTheme } from "@react-navigation/native";
import OTPInputView from "@twotalltotems/react-native-otp-input";


import { tripStore } from "../../Store/AuthStore/TripStore";
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


import { ActivityIndicator } from "react-native-paper";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";


import * as SVG from "../../Assets/SVG";
import { Gradient_Button } from "../../Components/Button/Button";
import Container from "../../Components/Container/Container";


import Text_Custom from "../../Components/Text_Custom";


import { imageStore } from "../../Store/AuthStore/ImageStore";

import { showError, showSuccess } from "../../Utils/helper";

import { getOtp, postOtpValidated } from "../../Services/Actions/TripActions";
import { logCustomEvent } from "../../Utils/analytics";
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
          text={"Enter OTP"}
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
const AddOtp = (props) => {
  const OTPContainer = () => {
    const selectTrip = tripStore.selectedTrip;
    const { status } = props.route.params;

    const { colors, dark } = useTheme();

    const navigation = useNavigation();
    const [errorOtp, setErrorOtp] = useState("");
    const [verificationCode, setVerificationCode] = useState();

    const [resendCount, setResendCount] = useState(0);
    const [showReset, setShowReset] = useState(true);
    const [resendLoader, setResendLoader] = useState(false);
    const [otp, setOtp] = useState("");
    const [count, setCount] = useState(300);
    const [disableresend, setIsResendDisabled] = useState(true);
    const [disableGenerateOtp, setDisableGenerateOtp] = useState(false);
    const [timer, setTimer] = useState(300);
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
      blueText: {
        color: colors.primary,
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
      Keyboard.dismiss();
    }, []);
    useEffect(() => {
      let interval;
      if (disableGenerateOtp) {
        if (count > 0) {
          setIsResendDisabled(true);
          interval = setInterval(() => {
            setCount(count - 1);
          }, 1000);
        } else {
          clearInterval(interval);
          setDisableGenerateOtp(true);
          setIsResendDisabled(false);
          setVerificationCode("");
          showError("Time out");
        }
      }
      return () => clearInterval(interval);
    }, [disableGenerateOtp, count]);
    const handleOTPChange = (otp) => {
      setOtp(otp);
      // imageStore.setOtpValue(otp);
      
    };

    const postOtpValidation = async (status) => {
      try {
        let requestBody={};
      
           requestBody = {
            driverId: tripStore.selectedTrip.driverId,
            tripId: tripStore.selectedTrip.tripId,
           
            isStartOtp: status === "start" ? true : false,
            isValidated: true,
          };
       
        
        await postOtpValidated(requestBody);
      } catch (error) {
        console.error("API error in otp vlaidated in addotp:", error);
      }
    };

    const getOtpGenerate = async (type) => {
      try {
        let requestData = {};
       
          requestData = {
            driverId: selectTrip.driverId,
            tripId: selectTrip.tripId,
            //isResend: false,
            isResend: type === "generate" ? false : true
          };
       

        const response = await getOtp(requestData);
        return response;
      } catch (error) {
        console.error("API error:", error);
      }
    };
    

    // for generating
    const generateOtp = async(type) => {
      try {
        if (disableGenerateOtp === false) {
          if(selectTrip.customerData !==undefined){
            var response = await getOtpGenerate(type);
            console.log("response from otp", response);
  
            const otp = response.otp;
            setVerificationCode(otp);
            setDisableGenerateOtp(true);
          
            console.log("Fetched otp from AddOtp:", otp);
          }
          else{
            showError("Customer Information Required");
          }
         
        }
      } catch (error) {
        console.error("API error:", error);
      }
    };

    const resendOtp = async(type) => {
      try {
        if (count == 0) {
          if (resendCount < 5) {
            setResendLoader(true);

            var response = await getOtpGenerate(type);
            const otp = response.otp;
            setVerificationCode(otp);
            console.log("otp from resend", otp);

            setTimeout(() => {
          
              setTimer(300);
              setCount(300);

          
              setIsResendDisabled(false);

             
              setResendCount(resendCount + 1);

             
              setResendLoader(false);
            }, 2000); 
          } else {
            showError("You have reached the maximum resend attempts.");
          }
        }
      } catch (error) {
        console.error("API error:", error);
      }
    };

    const verifyOtp = (otp) => {
      if (otp == "") {
        setErrorOtp("OTP is required");
      }
      if (otp !== "" && otp.length < 6) {
        setErrorOtp("Enter valid OTP");
      }

    
      if (otp.length === 6) {
      
        if (otp === verificationCode) {
          if (status === "start") {
           
            imageStore.setOtp(true);
           
            postOtpValidation("start");
            showSuccess("Otp Verified");
            logCustomEvent("Start Otp Verified");
          } else if (status === "end") {
          
            imageStore.setEndOTP(true);
           
            postOtpValidation("end");
            showSuccess("Otp Verified");
            logCustomEvent("End Otp Verified");
          } else {
            imageStore?.EndOtp?.verified;
          }

          navigation.goBack();
        } else {
         

          setErrorOtp("Enter valid otp");
        
        }
      } else {
        console.log("wher is otp");
      }
    };

    const customer_mailId = tripStore.selectedTrip.customerData?.email;
    return (
      <>
        {disableGenerateOtp && (
          <Text style={[styles.FP_Detail, { color: colors.text }]}>
            Enter the 6 digit verification code that has been sent to{" "}
            <Text style={styles.blueText}>{customer_mailId}</Text>
            <Text style={[styles.FP_Detail, styles.Confirn_email]}>
              {/* Content for the Confirn_email style */}
            </Text>{" "}
            {/* to reset your password. */}
          </Text>
        )}

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
                onCodeChanged={handleOTPChange}
                autoFocusOnLoad={true}
                codeInputFieldStyle={[
                  styles.underlineStyleBase,
                  errorOtp && { borderColor: colors.error },
                  { color: colors.text },
                ]}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                placeholderCharacter={"-"}
                placeholderTextColor={colors.placeholder}
              />
              <Text style={styles.otpError}>{errorOtp}</Text>
            </View>
          </View>
          <Gradient_Button
            text={"Continue"}
            onPress={() => {
              verifyOtp(otp);
            }}
          />
          <View style={styles.Otp_ChangeResend}>
            <TouchableOpacity
              onPress={() => generateOtp("generate")}
              disabled={disableGenerateOtp}
            >
              <Text
                style={[
                  styles.ResendCode,
                  {
                    color: !disableGenerateOtp ? colors.primary : colors.border,
                  },
                ]}
              >
                Generate OTP
              </Text>
            </TouchableOpacity>
            {showReset && (
              <>
                {!resendLoader ? (
                  <TouchableOpacity
                    onPress={() => resendOtp("resend")}
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

  return (
    <Container>
      <Header />

      <OTPContainer />
    </Container>
  );
};
export default AddOtp;
