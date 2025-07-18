import { useTheme } from "@react-navigation/native";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { moderateVerticalScale, scale, moderateScale } from "react-native-size-matters";
import Text_Custom from "../Text_Custom";
import { logCustomEvent } from "../../Utils/analytics";
import { getMixpanel, trackButtonClick } from "../../Utils/MixpanelService";
const mixpanel = getMixpanel();
export const Gradient_Button = ({
  text = "TITLE",
  onPress,
  disable = false,
  logo,
  width = "100%",
  disabled = false,
  active = true,
  buttonStyles,
}) => {
  const { colors, dark } = useTheme();
  const styles = StyleSheet.create({
    button: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.primary1,
      paddingVertical: moderateVerticalScale(10),
      borderRadius: scale(40),
      // borderWidth: 1,
    },
    btnText: {
      fontFamily: "NunitoSans-Bold",
      fontSize: scale(16),
    },
  });
  return (
    <TouchableOpacity
      onPress={() => { onPress && onPress();
          trackButtonClick(text);
        // logCustomEvent(text)
       
          }}
      disabled={disabled}
      style={[{ width }, buttonStyles]}
    >
      <LinearGradient
        colors={
          active
            ? [colors.gradientStart, colors.gradientEnd]
            : ["#9D9D9D", "#9D9D9D"]
        }
        style={styles.button}
      >
        {!disable ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {logo && <View style={{ marginRight: scale(5) }}>{logo}</View>}
            <Text_Custom
              style={[styles.btnText, !dark && { color: "#fff" }]}
              text={text}
            />
          </View>
        ) : (
          <ActivityIndicator color={"#fff"} size={scale(22)} />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export const Submit_Button = ({
  text = "TITLE",
  onPress,
  disable = false,
  logo,
  width = "80%",
  disabled = false,
  active = true,
  buttonStyles,
}) => {
  const { colors, dark } = useTheme();
  const styles = StyleSheet.create({
    button: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.primary1,
      paddingVertical: moderateVerticalScale(10),
      marginLeft: moderateScale(60),
      borderRadius: scale(40),
      // borderWidth: 1,
    },
    btnText: {
      fontFamily: "NunitoSans-Bold",
      fontSize: scale(16),
    },
  });
  return (
    <TouchableOpacity
      onPress={() => { onPress && onPress(); 
        trackButtonClick(text);
        // logCustomEvent(text); 
      }}
      disabled={disabled}
      style={[{ width }, buttonStyles]}
    >
      <LinearGradient
        colors={
          active
            ? [colors.gradientStart, colors.gradientEnd]
            : ["#9D9D9D", "#9D9D9D"]
        }
        style={styles.button}
      >
        {!disable ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {logo && <View style={{ marginRight: scale(5) }}>{logo}</View>}
            <Text_Custom
              style={[styles.btnText, !dark && { color: "#fff" }]}
              text={text}
            />
          </View>
        ) : (
          <ActivityIndicator color={"#fff"} size={scale(22)} />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export const Button = ({
  text = "TITLE",
  onPress,
  buttonStyles,
  titleStyles,
  disabled = false,
  active = true,
  disable = false,
}) => {
  const { colors, dark } = useTheme();
  const styles = StyleSheet.create({
    button: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.primary1,
      paddingVertical: moderateVerticalScale(10),
      borderRadius: scale(40),
    },
    btnText: {
      color: "#fff",
      fontFamily: "NunitoSans-Bold",
      fontSize: scale(16),
    },
  });
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyles]}
      disabled={disabled}
      onPress={() => { onPress && onPress(); console.log("buttonCliked??????????????/etst>>>>>>..")
      trackButtonClick(text);
      // console.log("mixpanel",mixpanel)
      // mixpanel.track('Button Clicked', {
      //   'Button Name': text,
        
      // });
      //logCustomEvent(text); 

       }}
    >
      {!disable ? (
        <Text_Custom style={[styles.btnText, titleStyles]} text={text} />
      ) : (
        <ActivityIndicator color={"#fff"} size={scale(22)} />
      )}
    </TouchableOpacity>
  );
};
