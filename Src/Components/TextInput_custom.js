import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import COLORS from "../Constant/Colors";

import { useTheme } from "@react-navigation/native";
import { observer } from "mobx-react";

const TextInput_custom = ({
  placeholder = "Email or Phone Number",
  placeholderTextColor,
  onChangeText,
  ERROR_MSG = { show: false, msg: "" },
  errorMsgStyles,
  textInputStyles,
  containerStyles,
  secureTextEntry = false,
  Icon,
  value,
  inputProps,
  onBlur,
  inputStylesProps,
  editable = true,
  onFocus,
 // fromExpense,
}) => {
  var { colors } = useTheme();

  return (
    <View style={[styles.containerStyles, containerStyles]}>
      <View
        style={[
          styles.inputContainer,
          inputStylesProps,
          {
            backgroundColor: colors.inputBackground,
            borderColor: ERROR_MSG.show ? colors.error : colors.border,
          },
        ]}
      >
        <TextInput
          editable={editable}
          {...inputProps}
          onBlur={onBlur && onBlur}
          autoCapitalize="none"
          onFocus={onFocus}
          secureTextEntry={secureTextEntry}
          style={[
            styles.input,
            textInputStyles,
            {
              color: colors.text,
              width: Icon ? "90%" : "100%",
            },
          ]}

          placeholder={placeholder}
          value={value}
          placeholderTextColor={
            placeholderTextColor ? placeholderTextColor : colors.placeholder
          }
          onChangeText={(e) => {
            onChangeText(e);
          }}
        />
        {Icon && Icon}
      </View>

      {ERROR_MSG.msg && (
        <Text style={[styles.errorMsg, errorMsgStyles]}>{ERROR_MSG.msg}</Text>
      )}
    </View>
  );
};

export default observer(TextInput_custom);

const styles = StyleSheet.create({
  input: {
    height: moderateScale(50),

    fontSize: scale(14),
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    borderColor: "#CAD7E2",
    borderWidth: 1,
    borderRadius: scale(5),
    paddingHorizontal: moderateScale(15),
    marginBottom: verticalScale(5),
    alignItems: "center",
    justifyContent: "space-between",
  },
  containerStyles: { marginBottom: verticalScale(10) },
  errorMsg: {
    color: COLORS.errorRed,
    fontSize: scale(12),
    textTransform: "capitalize",
  },
});
