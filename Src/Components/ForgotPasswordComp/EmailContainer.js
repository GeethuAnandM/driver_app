import { useNavigation, useTheme } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import * as yup from "yup";
import { getValidated, verifyUser } from "../../Services/Actions/AuthActions";
import { PASS_PHONE, VALIDATE_TYPE, isRegisteredUser, validateEmail, validatePhone } from "../../Utils/validator";
import { Gradient_Button } from "../Button/Button";
import TextInput_custom from "../TextInput_custom";
import Text_Custom from "../Text_Custom";
import { loginValidationSchema, showError } from "../../Utils/helper";

const EmailContainer = ({ setStepOne, setStepInput }) => {
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const [ERROR, setERROR] = useState({ show: false, msg: "" });
  const [Loading, setLoading] = useState(false);
  const changeStep = async (value) => {
    
    // if (await isRegisteredUser(value)) {
    setLoading(true);
   console.log("values on onchange",value)
   //const isPhoneNumber = /^\+?[0-9]{10,15}$/.test(value);  
   const isPhoneNumber =PASS_PHONE.test(value);
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
          showError("User not found")
          setLoading(false);
        });
      setLoading(false);
    } 
     else {
      setERROR({ show: true, msg: "Invalid email or phone number" });
      setLoading(false);
    }
  // }
  // else
  // {
  //   showError("Enter your registered email/phonenumber")

  //   }
  };


  const styles = StyleSheet.create({
    FP_Heading: {
      fontSize: scale(24),
      fontWeight: "700",
      textAlign: "center",
      color: colors.primary,
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

    BackToSignin: {
      color: colors.primary,
      textAlign: "center",
      fontWeight: "600",
      marginTop: moderateScale(25),
      fontSize: scale(14),
    },
  });

  return (
    <>
      <Text_Custom style={styles.FP_Heading} text={"Forgot password"} />
      <Text_Custom
        style={styles.FP_Detail}
        text={
          "Please enter your Phone number or Email. We’ll send you a confirmation code. We use it to ensure the security of our users."
        }
      />
      <Formik
      
        enableReinitialize={true}
        validationSchema={loginValidationSchema}
        initialValues={{ email: "" }}
        onSubmit={(values) => {
          console.log("values for onSubmit",values)
          changeStep(values?.email);
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
            <TextInput_custom
              onChangeText={handleChange("email")}
              containerStyles={{
                marginVertical: verticalScale(20),
              }}
              value={values.email}
              ERROR_MSG={{
                show: touched?.email ? errors?.email : "",
                msg: touched?.email ? errors?.email : "",
              }}
              onBlur={handleBlur("email")}
            />
            <Gradient_Button
              text={"Continue"}
              onPress={handleSubmit}
              disabled={Loading}
              disable={Loading}
            />
          </>
        )}
      </Formik>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.BackToSignin}>Back to Signin?</Text>
      </TouchableOpacity>
    </>
  );
};

export default EmailContainer;
