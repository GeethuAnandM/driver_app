import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from "react-native-size-matters";
import * as SVG from "../Assets/SVG";
import Container from "../Components/Container/Container";
import EmailContainer from "../Components/ForgotPasswordComp/EmailContainer";
import NewPassword from "../Components/ForgotPasswordComp/NewPassword";
import OTPContainer from "../Components/ForgotPasswordComp/OTPContainer";
import COLORS from "../Constant/Colors";
const ForgotPasswordScreen = (props) => {
  const { navigation } = props;
  const { colors } = useTheme();
  const [stepOne, setStepOne] = React.useState(0);
  const [stepInput, setStepInput] = useState("+0 000 000 0000");
  return (
    <Container statusBarStyle={{ backgroundColor: colors.primaryBackground1 }}>
      <View style={styles.upper}>
        <SVG.LoginLogo />
        <Image
          source={require("../Assets/forgotPass.png")}
          style={styles.imageView}
        />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : ""}
        keyboardShouldPersistTaps={true}
      >
        <ScrollView contentContainerStyle={{ paddingTop: scale(10) }}>
          <View
            style={[
              styles.lower,
              {
                backgroundColor: colors.SecondaryBackground,
                borderColor: colors.cardBorder,
              },
              styles.shadow,
            ]}
          >
            {stepOne === 0 && (
              <EmailContainer
                setStepOne={setStepOne}
                setStepInput={setStepInput}
              />
            )}
            {stepOne === 1 && (
              <OTPContainer
                stepOne={stepOne}
                setStepOne={setStepOne}
                stepInput={stepInput}
              />
            )}
            {stepOne === 3 && <NewPassword stepInput={stepInput} />}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};
export default ForgotPasswordScreen;
const styles = StyleSheet.create({
  main: {
    // backgroundColor:"red"
    // backgroundColor: COLORS.white,
  },
  imageView: {
    width: scale(208),
    height: scale(208),
    marginTop: moderateScale(40),
  },
  scrollView: {
    marginHorizontal: 20,
  },
  FP_Heading: {
    fontSize: scale(24),
    fontWeight: "700",
    textAlign: "center",
    color: COLORS.primaryBlue,
    marginBottom: moderateScale(30),
  },
  FP_Detail: {
    textAlign: "center",
    fontSize: scale(13),
    maxWidth: 340,
    marginBottom: moderateScale(5),
    alignSelf: "center",
    // fontWeight: '700',
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
    color: COLORS.errorRed,
    fontSize: scale(12),
  },
  borderStyleHighLighted: {
    borderColor: COLORS.primaryBlue,
  },
  underlineStyleBase: {
    width: 42,
    height: 44,
    borderRadius: 10,
    borderBottomWidth: 1,
    //
  },
  underlineStyleHighLighted: {
    borderColor: COLORS.primaryBlue,
  },
  Confirn_email: {
    color: COLORS.primaryBlue,
    fontWeight: "600",
  },
  BackToSignin: {
    color: COLORS.primaryBlue,
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
    fontWeight: "700",
    marginVertical: verticalScale(4),
  },
  upper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginVertical: moderateScale(30),
  },
  lower: {
    // flex: 1.5,
    borderWidth: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    justifyContent: "flex-end",
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(30),
    paddingBottom: Platform.OS == "ios" ? moderateScale(50) : moderateScale(20),
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10.65,
    elevation: 25,
  },
  shadow_svg: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.39,
    shadowRadius: 15.65,
    elevation: 7,
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
    // marginTop: 20,
    color: COLORS.dark,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    paddingVertical: moderateVerticalScale(15),
    borderRadius: scale(40),
  },
  btnText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: scale(16),
  },
});
