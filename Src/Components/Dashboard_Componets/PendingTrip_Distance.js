import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation, useTheme } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { moderateScale, scale } from "react-native-size-matters";
import * as SVG from "../../Assets/SVG";
import { tripStore } from "../../Store/AuthStore/TripStore";
import { authStore } from "../../Store/AuthStore/AuthStore";
import { observer } from "mobx-react";
const { width, height } = Dimensions.get("screen");

const PendingTrip_Distance = () => {
  const { colors, dark } = useTheme();
  var navigation = useNavigation();
  const styles = StyleSheet.create({
    mainContainer: {
      marginTop: -15,
      marginHorizontal: moderateScale(20),
      flexDirection: "row",
      justifyContent: "space-between",
    },
    gradientStyles: {
      padding: scale(10),
      backgroundColor: colors.primary1,
      borderRadius: scale(11),
    },
    Ptrip: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: scale(10),
    },
    PtripText: { fontSize: scale(14), color: "#fff", fontWeight: "700" },
    pendingCount: {
      backgroundColor: colors.error,
      padding: scale(4),
      borderRadius: scale(5),
      alignItems: "center",
      width: scale(30),
      height: 30,
      justifyContent: "center",
    },
    pendingCountText: {
      fontSize: scale(12),
      color: "#fff",
      fontWeight: "700",
    },
    distanceSection: {
      padding: scale(10),
      backgroundColor: colors.lightBlue,
      borderRadius: scale(11),
      width: "48%",
    },
    distanceCount: {
      fontSize: scale(14),
      color: colors.primary1,
      fontWeight: "700",
    },
    distanceTravel: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: scale(10),
    },
    distanceTravelText: {
      fontSize: scale(14),
      color: colors.primary1,
      fontWeight: "700",
    },
  });
  return (
    <View style={styles.mainContainer}>
      <View
        style={{
          width: "48%",
          backgroundColor: "#2196F3",
          borderRadius: scale(11),
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("PendingTrips")}>
          <LinearGradient
            style={styles.gradientStyles}
            start={{ x: 0.4, y: 0.25 }}
            end={{ x: 0.0, y: 1.0 }}
            colors={["#2196F3", "#0271CA"]}
          >
            <SVG.PandingTrip />
            <View style={styles.Ptrip}>
              <Text style={styles.PtripText}>Pending Trips</Text>
              <View style={styles.pendingCount}>
                <Text style={styles.pendingCountText}>
                  {tripStore.pendingTripCount}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.distanceSection}>
        <Text style={styles.distanceCount}>{authStore.totalDistance} km</Text>
        <View style={styles.distanceTravel}>
          <Text style={styles.distanceTravelText}>Distance Travelled</Text>
        </View>
      </View>
    </View>
  );
};
export default observer(PendingTrip_Distance);
