import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import Text_Custom from "../../Text_Custom";
import { moderateScale, scale } from "react-native-size-matters";
import { tripStore } from "../../../Store/AuthStore/TripStore";
import { tripTypes } from "../../../Constant/constant";
import { getFloat } from "../../../Utils/helper";
import { observer } from "mobx-react";
const TripValuesConatiner = () => {
  const { colors } = useTheme();
  const { completeTripData } = tripStore?.selectedTrip;

  const styles = StyleSheet.create({
    container: {
      justifyContent: "space-between",
    },
    Box: {
      borderWidth: 1,
      width: "48%",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: moderateScale(10),
      borderColor: colors.border,
      borderRadius: 5,
    },
    head: {
      fontSize: scale(12),
      fontFamily: "NunitoSans-Bold",
    },
    sub: {
      fontSize: scale(14),
      color: colors.primary,
      fontFamily: "NunitoSans-Bold",
      marginTop: moderateScale(5),
    },
    items: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: moderateScale(7),
    },
  });
  return (
    <>
      {tripStore.selectedTrip.status === tripTypes[3] && (
        <View style={styles.container}>
          <View style={styles.items}>
            <View style={styles.Box}>
              <Text_Custom text={"Travel Distance"} style={styles.head} />
              <Text_Custom
                text={
                  getFloat(tripStore.selectedTrip?.travelDistance) !== 0
                    ? `${getFloat(
                        tripStore.selectedTrip?.travelDistance.toFixed(2)
                      )}Km`
                    : null
                }
                style={styles.sub}
              />
            </View>
            <View style={styles.Box}>
              <Text_Custom text={"Travel Time"} style={styles.head} />
              <Text_Custom
                text={tripStore?.selectedTrip?.travelTime}
                style={styles.sub}
              />
            </View>
          </View>
          <View style={styles.items}>
            <View style={styles.Box}>
              <Text_Custom text={"Top Speed"} style={styles.head} />
              <Text_Custom
                text={
                  getFloat(tripStore?.selectedTrip?.topSpeed) !== 0
                    ? `${getFloat(
                        tripStore?.selectedTrip?.topSpeed.toFixed(2)
                      )}Km/hr`
                    : null
                }
                style={styles.sub}
              />
            </View>
            <View style={styles.Box}>
              <Text_Custom text={"Average Speed"} style={styles.head} />
              <Text_Custom
                text={
                  getFloat(tripStore?.selectedTrip?.averageSpeed) !== 0
                    ? `${getFloat(
                        tripStore?.selectedTrip?.averageSpeed?.toFixed(2)
                      )}Km/hr`
                    : null
                }
                style={styles.sub}
              />
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default observer(TripValuesConatiner);
