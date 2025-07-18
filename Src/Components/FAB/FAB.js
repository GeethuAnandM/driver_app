import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { scale } from "react-native-size-matters";
import Icon from "react-native-vector-icons/Entypo";

import { useTheme } from "@react-navigation/native";
const FAB = ({ onPress }) => {
  const { colors, dark } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        onPress && onPress();
      }}
      style={{
        position: "absolute",
        bottom: scale(50),
        right: scale(20),
        backgroundColor: "red",
        width: scale(50),
        height: scale(50),
        borderRadius: scale(30),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: dark ? colors.primary : colors.SecondaryBackground,
        borderWidth: 1,
        borderColor: colors.cardBorder,

        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
      }}
    >
      <Icon name="plus" color={dark ? colors.text : colors.primary} size={25} />
    </TouchableOpacity>
  );
};

export default FAB;

const styles = StyleSheet.create({});
