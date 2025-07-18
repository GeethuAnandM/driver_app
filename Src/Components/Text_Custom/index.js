import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";

const index = ({ style, text = "-", numberOfLines }) => {
  const { colors } = useTheme();

  return (
    <View>
      <Text
        numberOfLines={numberOfLines}
        style={[
          {
            color: colors.text,
            fontFamily: "Nunito Sans",
          },
          style,
        ]}
      >
        {text !== null &&
        text !== "null" &&
        text !== "undefined" &&
        text !== undefined
          ? text
          : "-"}
      </Text>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
