import { useNavigation, useTheme } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Ionicon from "react-native-vector-icons/Ionicons";
import * as yup from "yup";
import { getValidated, updatePassword } from "../../Services/Actions/AuthActions";
import { changePasswordSchema, showError } from "../../Utils/helper";
import {
  PASS_PHONE,
  PASS_REGEX,
  VALIDATE_TYPE,
  validateEmail,
  validatePhone,
} from "../../Utils/validator";
import { Gradient_Button } from "../Button/Button";
import TextInput_custom from "../TextInput_custom";
import Text_Custom from "../Text_Custom";
import { getItem } from "../../Services/apiCalls";
const NewPassword = ({ stepInput }) => {
  const { colors, dark } = useTheme();
  var navigation = useNavigation();

  const [passwordType, setPasswordType] = useState(false);
  const [confirmSecure, setConfirmSecure] = useState(false);

  const [LoadingPass, setLoadingPass] = useState(false);

 

  const changePassword = async (values) => {
    console.log("value is resetas",values)
    var oldPassword=await getItem("password");
    console.log("oldpassw",oldPassword)
    if(oldPassword!==values.password){
      setLoadingPass(true);
    console.log("values on onchange",stepInput)
      //const isPhoneNumber = /^\+?[0-9]{10,15}$/.test(stepInput);  
 
      const isPhoneNumber =PASS_PHONE.test(stepInput); 
      const validationType = isPhoneNumber ? "phoneNumber" : "emailId"; 
       const message = await getValidated(VALIDATE_TYPE,stepInput);
      
       console.log("message",message)
       console.log("validationType",validationType)
       
       if (message=="") {
      setLoadingPass(false);
      var res = await updatePassword({
        [validationType === 'phoneNumber' ? 'mobile' : 'email_address']: stepInput,
        // email_address: stepInput,
        password: values.password,
      });

      if (res?.code == 200) {
        setLoadingPass(false);
        // Alert.alert(res.message);
        navigation.navigate("Login");
      } else {
        showError(res?.message);
      }
    } 
  }
  else{
    showError(" Your new password must be different from previous used password.")
  }
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

    underlineStyleHighLighted: {
      borderColor: colors.primary,
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
          <Text_Custom style={styles.FP_Heading} text={"Reset password"} />
          <Text style={[styles.FP_Detail, { color: colors.text }]}>
            Your new password must be different from previous used password.
          </Text>
          <TextInput_custom
            containerStyles={{
              marginVertical: verticalScale(20),
            }}
            ERROR_MSG={{
              show: touched?.password ? errors?.password : "",
              msg: touched?.password ? errors?.password : "",
            }}
            onBlur={handleBlur("password")}
            secureTextEntry={!passwordType}
            placeholder={"New Password"}
            value={values?.pass}
            onChangeText={handleChange("password")}
            // onChangeText={(value) => {
            //   // setERROR_PASS({ show: false, msg: "" });
            //   // setNewPass(value);
            // }}
            Icon={
              <TouchableOpacity onPress={() => setPasswordType(!passwordType)}>
                <Ionicon
                  name={passwordType ? "eye" : "eye-off"}
                  style={styles.searchIcon}
                  size={scale(20)}
                  color={colors.placeholder}
                />
              </TouchableOpacity>
            }
          />
          <TextInput_custom
            containerStyles={{ marginBottom: moderateScale(15) }}
            secureTextEntry={!confirmSecure}
            // onChangeText={(e) => {
            //   setConfirmPass(e);
            //   setERROR_CPASS({ show: false, msg: "" });
            // }}
            onBlur={handleBlur("confirmPassword")}
            value={values?.confirmPassword}
            onChangeText={handleChange("confirmPassword")}
            placeholder={"Confirm Password"}
            ERROR_MSG={{
              show: touched?.confirmPassword ? errors?.confirmPassword : "",
              msg: touched?.confirmPassword ? errors?.confirmPassword : "",
            }}
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
          <Gradient_Button
            // disabled={!isValid}
            // active={isValid}
            text={"Continue"}
            disable={LoadingPass}
            onPress={handleSubmit}
          />
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.BackToSignin}>Back to Signin?</Text>
          </TouchableOpacity>
        </>
      )}
    </Formik>
  );
};

export default NewPassword;
