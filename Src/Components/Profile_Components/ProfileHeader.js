import { useNavigation, useTheme } from "@react-navigation/native";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import * as SVG from "../../Assets/SVG";
import { getDrivers } from "../../Services/Actions/AuthActions";
import { authStore } from "../../Store/AuthStore/AuthStore";
import { isImage } from "../../Utils/helper";
import Text_Custom from "../Text_Custom";
const ProfileHeader = ({ goBack = false, name, id }) => {
  const navigation = useNavigation();
  const { colors, dark } = useTheme();
  useEffect(() => {
    const init = async () => {
      await getDrivers();
    };
    init();
  }, []);
  const Fname =
    authStore.driverData?.firstName == undefined
      ? ""
      : authStore.driverData?.firstName;
  const Mname =
    authStore.driverData?.middleName === undefined ||
    authStore.driverData?.middleName === null ||
    authStore.driverData?.middleName === ""
      ? ""
      : ` ${authStore.driverData?.middleName}`;
  const Lname =
    authStore.driverData?.lastName == undefined ||
    authStore.driverData?.lastName === null ||
    authStore.driverData?.lastName === ""
      ? ""
      : ` ${authStore.driverData?.lastName}`;
  const styles = StyleSheet.create({
    tripId: {
      fontSize: scale(14),
      fontFamily: "NunitoSans-Bold",
      color: dark ? colors.text : "#A5A5A5",
      marginBottom: moderateScale(10),
    },
    statusButton: {
      backgroundColor: "#34C654",
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(5),
      borderRadius: scale(5),
    },
    statusButtonText: {
      fontSize: scale(14),
      fontFamily: "NunitoSans-Bold",
      color: "#fff",
    },
  });
  return (
    <View
      style={{
        // height: '30%',
        backgroundColor: colors.SecondaryBackground,
        paddingHorizontal: moderateScale(20),
        flexDirection: "row",
        paddingTop: moderateScale(10),
        paddingBottom: moderateScale(20),
      }}
    >
      <View style={{ width: "10%" }}>
        {goBack && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <SVG.BackSVG />
          </TouchableOpacity>
        )}
      </View>
      <View style={{ width: "80%", alignItems: "center" }}>
        <Image
          source={isImage(authStore.driverData?.image)}
          style={{ width: 85, height: 85, borderRadius: 7 }}
        />
        <Text_Custom
          text={`${Fname}${Mname}${Lname}`}
          numberOfLines={2}
          style={{
            fontSize: scale(16),
            fontFamily: "NunitoSans-Bold",
            marginTop: moderateScale(10),
            textAlign: "center",
            textTransform: "capitalize",
          }}
        />
        <Text_Custom text={id} style={styles.tripId} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "55%",
          }}
        >
          <Text_Custom
            text={"Status"}
            style={{ fontSize: scale(14), fontFamily: "NunitoSans-Bold" }}
          />
          <TouchableOpacity style={styles.statusButton}>
            <Text style={styles.statusButtonText}>Online</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default observer(ProfileHeader);

const styles = StyleSheet.create({});
