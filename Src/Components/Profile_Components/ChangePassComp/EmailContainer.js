import { useTheme } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import * as yup from "yup";
import { getValidated, verifyUser } from "../../../Services/Actions/AuthActions";
import { PASS_PHONE, VALIDATE_TYPE, isRegisteredUser, validateEmail, validatePhone } from "../../../Utils/validator";
import { Gradient_Button } from "../../Button/Button";
import TextInput_custom from "../../TextInput_custom";
import Text_Custom from "../../Text_Custom";
import { loginValidationSchema, showError } from "../../../Utils/helper";

const EmailContainer = ({ setStepInput, stepInput, setStepOne, username }) => {
  const { colors } = useTheme();
  const [Email_phone, setEmail_phone] = useState("");
  const [ERROR, setERROR] = useState({ show: false, msg: "" });
  const [Loading, setLoading] = useState(false);

  const changeStep = async (value) => {

    if (await isRegisteredUser(value)) {
    setLoading(true);
    Keyboard.dismiss();
    console.log("values on onchange",value)
  
    const isPhoneNumber = PASS_PHONE.test(value);  
    const validationType = isPhoneNumber ? "phoneNumber" : "emailId"; 
     const message = await getValidated(VALIDATE_TYPE,value);
     console.log("message",message)
     
     if (message=="") {
      
      await verifyUser({
        [validationType === "phoneNumber" ? "mobile" : "email_address"]: value
      })
        .then((res) => {
          setLoading(false);
          setStepInput(value);
          setStepOne(1);
        })
        .catch((err) => {
          setLoading(false);
        });
      setLoading(false);
    } 
    else {
      setERROR({ show: true, msg: "Invalid email or phone number" });
      setLoading(false);
    }
  }
  else{
    showError("Enter your registered emailId/phonenumber")
  }

  };

  


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
      //fontFamily: "NunitoSans",
      // fontWeight: '700',
    },
  });
  return (
    <>
      <Text_Custom
        style={styles.FP_Detail}
        text={
          "Please enter your Phone number or Email. We’ll send you a confirmation code. We use it to ensure the security of our users."
        }
      />
      <View style={styles.card}>
        <Formik
          enableReinitialize={true}
          validationSchema={loginValidationSchema}
          initialValues={{ email: username }}
          onSubmit={(values) => {
            changeStep(values.email);
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
          }) => (
            <>
              <View style={styles.textInputContainer}>
                <View style={styles.textIconContainer}>
                  {/* <SVG.LockSVG /> */}
                  <Text_Custom
                    text="Enter Email or Phone Number"
                    style={styles.text}
                  />
                </View>
                <TextInput_custom
                  // editable={false}
                  containerStyles={{ marginBottom: moderateScale(5) }}
                  ERROR_MSG={{
                    show: touched.email ? errors.email : "",
                    msg: touched.email ? errors.email : "",
                  }}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  placeholder={"Email or Phone Number"}
                  onChangeText={handleChange("email")}
                />
              </View>
              <Gradient_Button
                text={"Continue"}
                onPress={handleSubmit}
                disabled={Loading}
                disable={Loading}
              />
            </>
          )}
        </Formik>
      </View>
    </>
  );
};

export default EmailContainer;

const styles = StyleSheet.create({});
