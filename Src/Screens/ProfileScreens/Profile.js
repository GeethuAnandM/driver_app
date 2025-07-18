import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import * as SVG from "../../Assets/SVG";
import { Gradient_Button } from "../../Components/Button/Button";
import Container from "../../Components/Container/Container";
import ProfileHeader from "../../Components/Profile_Components/ProfileHeader";
import Text_Custom from "../../Components/Text_Custom";
import {
  clearUserData,
  getAuthData,
  removeItem,
} from "../../Services/apiCalls";
import messaging from "@react-native-firebase/messaging";
import { authStore } from "../../Store/AuthStore/AuthStore";
import { expenseStore } from "../../Store/AuthStore/ExpenseStore";
import { imageStore } from "../../Store/AuthStore/ImageStore";
import { tripStore } from "../../Store/AuthStore/TripStore";
import { observer } from "mobx-react";
import {signOut } from "../../Services/Actions/AuthActions";
import { logout } from "../../Utils/helper";
const Profile = (props) => {
  const { colors, dark } = useTheme();
  const [userData, setUserData] = useState({});
  const currentYear = new Date().getFullYear();
  useEffect(() => {
    const init = async () => {
      var token = await getAuthData();
      setUserData(token.userDetail);
    };
    init();
  }, []);

  const styles = StyleSheet.create({
    settingsMenu: {
      backgroundColor: colors.SecondaryBackground,
      borderRadius: scale(10),
      borderColor: colors.cardBorder,
      flexDirection: "row",
      padding: moderateScale(15),
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: scale(15),
    },
    text: {
      fontSize: scale(16),
      fontFamily: "NunitoSans-Bold",
      paddingLeft: scale(10),
    },
  });

  const SettingItemContainer = ({ icon, title = "Title", moveTo }) => {
    return (
      <TouchableOpacity
        style={styles.settingsMenu}
        onPress={() => {
          moveTo && props.navigation.navigate(moveTo);
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ justifyContent: "center" }}>{icon}</View>
          <Text_Custom text={title} style={styles.text} />
        </View>
        <SVG.RightArrow />
      </TouchableOpacity>
    );
  };

 
  
  return (
    <Container>
      <ProfileHeader
        name={`${userData?.first_name} ${userData?.last_name}`}
        id={`#${userData?.driverId}`}
      />
      <ScrollView
        style={{
          marginHorizontal: moderateScale(20),
          marginTop: moderateScale(20),
        }}
        showsVerticalScrollIndicator={false}
      >
        <SettingItemContainer
          icon={<SVG.userIcon />}
          title={"Profile Settings"}
          moveTo={"ProfileInfo"}
        />
        <SettingItemContainer
          icon={<SVG.ShieldSVG />}
          title={"Change Password"}
          moveTo={"ChangePassword"}
        />
        <SettingItemContainer
          icon={<SVG.walletSVG />}
          title={"Bata Allowance"}
          moveTo={"BataAllowance"}
        />
        <SettingItemContainer
          icon={<SVG.licenceSVG />}
          title={"License Information"}
          moveTo={"LicenceInfo"}
        />
      </ScrollView>
      <View style={{ margin: moderateScale(20) }}>
        <Gradient_Button
          text={"Log Out"}
          onPress={() => logout()}
          logo={<SVG.LogoutSVG />}
        />
      </View>

      <Pressable
        style={{
          alignSelf: "center",
          flexDirection: "row",
        }}
        onPress={() => Linking.openURL("https://cogniphi.com/")}
      >
        <Text_Custom text={`All rights reserved © ${currentYear}`} />
        <Text_Custom text={` cogniphi.com`} style={{ color: colors.primary }} />
      </Pressable>
    </Container>
  );
};
export default observer(Profile);
