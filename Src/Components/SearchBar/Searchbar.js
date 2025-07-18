import { useTheme } from "@react-navigation/native";
import React, { useCallback, useEffect } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { acc } from "react-native-reanimated";
import { moderateScale, scale } from "react-native-size-matters";
import * as SVG from "../../Assets/SVG";
const Searchbar = ({
  onSearch,
  activeTab,
  placeholder = "Search Trip Name or Id",
}) => {
  const { colors } = useTheme();
  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 500);
    };
  };

  const handleChange = (value) => {
    onSearch(value, activeTab);
  };

  const optimizedFn = useCallback(debounce(handleChange), []);

  return (
    <View
      style={{
        marginHorizontal: moderateScale(20),
        marginVertical: moderateScale(10),
        paddingHorizontal: moderateScale(15),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.SecondaryBackground,
        height: scale(40),
        // width: "100%",
      }}
    >
      <TextInput
        onChangeText={(e) => optimizedFn(e)}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        style={{
          fontFamily: "NunitoSans-Bold",
          fontSize: scale(14),
          //paddingHorizontal: moderateScale(15),
          width: "90%",
          color: colors.text,
        }}
      />
      <SVG.SearchSVG />
    </View>
  );
};

export default Searchbar;

const styles = StyleSheet.create({});
