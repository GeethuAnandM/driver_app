import { useTheme } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from "react-native-size-matters";
import TextTicker from "react-native-text-ticker";
import { tripStore } from "../../../Store/AuthStore/TripStore";
import {
  formatedDateTime,
  statusBackground,
  statusTextColor,
} from "../../../Utils/helper";
import Text_Custom from "../../Text_Custom";
import { observer } from "mobx-react";

const AboutTrip = () => {
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
    valueContainer: { alignItems: "flex-end" },
    value: {
      fontSize: scale(12),
      fontWeight: "700",
      color: colors.text,
    },
    tripType: {
      backgroundColor: colors.primary1,
      borderRadius: 50,
      paddingVertical: scale(5),
      paddingHorizontal: moderateScale(20),
      alignItems: "center",
    },
    tripTypeText: {
      fontWeight: "700",
      color: "#fff",
    },
    tripStatus: {
      backgroundColor: "#FFEAC0",
      borderRadius: 3,
      paddingVertical: scale(5),
      paddingHorizontal: moderateScale(12),
      alignItems: "center",
    },
    tripStatusText: {
      fontWeight: "700",
      color: "#FFAA2B",
    },
    tripStatusBtn: {
      borderRadius: scale(50),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors[statusBackground(tripStore.selectedTrip?.status)],
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateVerticalScale(5),
    },
    tripUpdateText: {
      color: colors[statusTextColor(tripStore.selectedTrip?.status)],
      fontSize: scale(14),
      fontFamily: "NunitoSans-Bold",
    },
  });

  return (
    <View style={styles.detailCard}>
      <View style={styles.cardItems}>
        <Text_Custom text={"Trip Name & ID"} style={styles.key} />
        <View
          style={[
            styles.valueContainer,
            {
              width: scale(180),
            },
          ]}
        >
          <TextTicker
            style={[styles.value]}
            duration={5000}
            loop
            bounce
            repeatSpacer={50}
            marqueeDelay={3000}
          >
            {`${tripStore.selectedTrip?.tripName} (${tripStore.selectedTrip?.uuid})`}
          </TextTicker>
        </View>
      </View>
      <View style={styles.cardItems}>
        <Text_Custom text={"License Plate Number"} style={styles.key} />
        <View style={styles.valueContainer}>
          <Text_Custom
            numberOfLines={1}
            text={`${tripStore.selectedTrip?.licensePlate}`}
            style={styles.value}
          />
        </View>
      </View>
      <View style={styles.cardItems}>
        <Text_Custom text={"Vehicle Insurance Expiry"} style={styles.key} />
        <View style={styles.valueContainer}>
          <Text_Custom
            text={`${
              tripStore?.selectedTrip?.insurances !== null &&
              tripStore?.selectedTrip?.insurances?.length !== 0 &&
              tripStore?.selectedTrip?.insurances !== undefined
                ? formatedDateTime(
                    tripStore?.selectedTrip?.insurances[0]?.insuranceExpiryDate,
                    "date"
                  )
                : "-"
            }`}
            style={styles.value}
          />
        </View>
      </View>
      <View style={styles.cardItems}>
        <Text_Custom text={"Vehicle Type"} style={styles.key} />
        <View style={styles.valueContainer}>
          <Text_Custom
            text={`${tripStore.selectedTrip?.vehicleType}`}
            style={styles.value}
          />
        </View>
      </View>
      <View style={styles.cardItems}>
        <Text_Custom text={"Trip Type"} style={styles.key} />
        <View style={styles.tripType}>
          <Text_Custom
            text={`${tripStore.selectedTrip?.category}`}
            style={styles.tripTypeText}
          />
        </View>
      </View>
      <View style={[styles.cardItems, { marginBottom: 0 }]}>
        <Text_Custom text={"Trip Status"} style={styles.key} />
        <View style={[styles.tripStatusBtn]}>
          <Text_Custom
            text={`${tripStore.selectedTrip?.status}`}
            style={styles.tripUpdateText}
          />
        </View>
      </View>
    </View>
  );
};

export default observer(AboutTrip);
