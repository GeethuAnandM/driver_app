import { useTheme } from "@react-navigation/native";
import React, { useRef } from "react";
import { View, TouchableOpacity } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import * as SVG from "../../Assets/SVG";
import { authStore } from "../../Store/AuthStore/AuthStore";
import { tripStore } from "../../Store/AuthStore/TripStore";
import { getNumber } from "../../Utils/helper";
import Text_Custom from "../Text_Custom";
export default MenuComponent = (props) => {
  const { containerStyles, showMenu, toggleMenu, children, onClickOutside } =
    props;
  const ref = useRef(null);
  const { colors, dark } = useTheme();

  return (
    showMenu && (
      <View
        style={[
          {
            paddingHorizontal: moderateScale(10),
            paddingVertical: moderateScale(5),

            borderRadius: 8,
            position: "absolute",

            top: scale(65),
            right: scale(20),
            zIndex: 1,
            backgroundColor: colors.lightBlue,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.15,
            shadowRadius: 9.84,

            elevation: 5,
          },
          containerStyles,
        ]}
      >
        <View>
          <TouchableOpacity
            onPress={() => {
              props.onPress(0);
            }}
            style={{
              marginVertical: moderateScale(10),
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <SVG.ExpanceSVG />
            <Text_Custom
              text="Add Expense"
              style={{ marginLeft: moderateScale(10), color: "black" }}
            />
          </TouchableOpacity>
          <View style={{ borderTopColor: "#BDDAF1", borderTopWidth: 1 }} />
          <View
            style={{
              marginVertical: moderateScale(10),
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <SVG.AdvanceAmount />
            <Text_Custom
              text={`Advance  ${authStore?.driverData?.currency} ${getNumber(
                tripStore.selectedTrip?.advanceAmount
              )}`}
              style={{ marginLeft: moderateScale(10), color: "black" }}
            />
          </View>
        </View>
      </View>
    )
  );
};
