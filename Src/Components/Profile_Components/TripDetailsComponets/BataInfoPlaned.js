import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import { tripTypes } from "../../../Constant/constant";
import { getBataTripByTripID } from "../../../Services/Actions/TripActions";
import { authStore } from "../../../Store/AuthStore/AuthStore";
import { tripStore } from "../../../Store/AuthStore/TripStore";
import { getFloat, getNumber } from "../../../Utils/helper";
import Text_Custom from "../../Text_Custom";

const BataInfoPlaned = ({ AdvanceAmount }) => {
  const { colors, dark } = useTheme();
  const styles = StyleSheet.create({
    detailCard: {
      backgroundColor: colors.SecondaryBackground,
      padding: moderateScale(10),
      borderRadius: scale(10),
      borderColor: colors.cardBorder,
      borderWidth: 1,
      marginBottom: moderateScale(15),
    },
    cardItems: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: moderateScale(8),
      alignItems: "center",
    },
    key: { fontSize: scale(12), color: "#8C8C8C", fontWeight: "600" },

    BETAkey: { fontSize: scale(14), fontWeight: "700" },
    BETAvalue: {
      fontSize: scale(12),
      fontWeight: "700",
      color: colors.primary1,
    },
  });

  return (
    <>
      {tripStore.selectedTrip.status !== tripTypes[3] && (
        <View >
          <View style={styles.cardItems}>
            <Text_Custom
              text={"Amount Received From Customer"}
              style={styles.BETAkey}
            />
            <Text_Custom
              text={`${tripStore?.selectedTrip?.currencySymbol} ${getNumber(
                AdvanceAmount?.customerAmount
              )}`}
              style={styles.BETAvalue}
            />
          </View>
          <View style={styles.cardItems}>
            <Text_Custom text={"Advance Amount"} style={styles.BETAkey} />
            <Text_Custom
              text={`${tripStore?.selectedTrip?.currencySymbol} ${getNumber(
                AdvanceAmount?.advanceAmount
              )}`}
              style={styles.BETAvalue}
            />
          </View>
          <View style={styles.cardItems}>
            <Text_Custom text={"Planned Bata Amount"} style={styles.BETAkey} />
            <Text_Custom
              text={
                tripStore.selectedTrip.plannedBataAmount === null
                  ? "-"
                  : `${tripStore?.selectedTrip?.currencySymbol} ${getFloat(
                      tripStore.selectedTrip.plannedBataAmount?.toFixed(2)
                    )}`
              }
              style={styles.BETAvalue}
            />
          </View>
        </View>
      )}
    </>
  );
};

export default BataInfoPlaned;
