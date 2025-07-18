import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import * as SVG from "../../Assets/SVG";
import { Gradient_Button } from "../../Components/Button/Button";
import Container from "../../Components/Container/Container";
import Loader from "../../Components/Loader/Loader";
import ProfileHeader from "../../Components/Profile_Components/ProfileHeader";
import TextInput_custom from "../../Components/TextInput_custom";
import Text_Custom from "../../Components/Text_Custom";
import { getAuthData } from "../../Services/apiCalls";
import { loaderStore } from "../../Store/AuthStore/LoaderStore";
import { observer } from "mobx-react";
const ProfileInfo = (props) => {
  const { colors, dark } = useTheme();
  const [isEdit, setIsEdit] = useState(false);
  const [userData, setUserData] = useState({});
  useEffect(() => {
    const init = async () => {
      var token = await getAuthData();
      setUserData(token.userDetail);
    };
    init();
  }, []);
  const styles = StyleSheet.create({
    card: {
      marginHorizontal: moderateScale(20),
      marginVertical: moderateScale(25),
      backgroundColor: colors.SecondaryBackground,
      borderColor: colors.cardBorder,
      borderRadius: 5,
      paddingVertical: moderateScale(20),
      paddingHorizontal: moderateScale(20),
    },
    textIconContainer: {
      flexDirection: "row",
      marginBottom: moderateScale(10),
      alignItems: "center",
    },
    text: {
      marginLeft: moderateScale(10),
      fontSize: scale(12),
      fontFamily: "NunitoSans-Bold",
    },
    textInputContainer: {
      marginBottom: moderateScale(10),
    },
  });
  const UserInfo = ({
    Title = "Phone",
    value = `+91 8435492115`,
    borderNBottom = true,
  }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: moderateScale(15),
          borderBottomColor: dark ? "#2B2B2B" : "#E9EFF3",
          borderBottomWidth: borderNBottom ? 1 : 0,
        }}
      >
        <Text_Custom
          text={Title}
          style={{ fontSize: scale(16), fontFamily: "NunitoSans-Bold" }}
        />
        <Text
          style={{
            fontSize: scale(14),
            fontFamily: "NunitoSans-Bold",
            color: colors.primary1,
          }}
        >
          {value}
        </Text>
      </View>
    );
  };
  const ViewUserInfo = () => {
    return (
      <View style={{ margin: moderateScale(20) }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text_Custom
            text={"Profile Information"}
            style={{ fontSize: scale(16), fontFamily: "NunitoSans-Bold" }}
          />
          <TouchableOpacity
            onPress={() => props.navigation.navigate("EditProfileInfo")}
          >
            <Text
              style={{
                fontSize: scale(14),
                fontFamily: "NunitoSans-Bold",
                color: colors.primary1,
                paddingBottom: scale(2),
              }}
            >
              Edit
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            borderRadius: 5,
            borderColor: colors.cardBorder,
            borderWidth: 1,
            backgroundColor: colors.SecondaryBackground,
            marginVertical: moderateScale(15),
            paddingHorizontal: moderateScale(15),
            paddingVertical: moderateScale(10),
          }}
        >
          <UserInfo Title="Phone" value={`${userData?.phoneNumber}`} />
          <UserInfo Title="Email" value={`${userData?.email}`} />
          {/* <UserInfo
            Title="Address"
            value="141-2, vijay nagar, Indore "
            borderNBottom={false}
          /> */}
        </View>
      </View>
    );
  };
  const EditUserInfo = () => {
    return (
      <View style={{ margin: moderateScale(20) }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text_Custom
            text={"Profile Information"}
            style={{ fontSize: scale(16), fontFamily: "NunitoSans-Bold" }}
          />
        </View>
        <View
          style={{
            borderRadius: 5,
            borderColor: colors.cardBorder,
            borderWidth: 1,
            backgroundColor: colors.SecondaryBackground,
            marginVertical: moderateScale(15),
            paddingHorizontal: moderateScale(15),
            paddingVertical: moderateScale(10),
          }}
        >
          <View style={styles.textInputContainer}>
            <View style={styles.textIconContainer}>
              <SVG.PhoneSVG />
              <Text_Custom style={styles.text} text="Phone Number" />
            </View>
            <TextInput_custom
              placeholder=""
              containerStyles={{ marginBottom: moderateScale(5) }}
              // ERROR_MSG={ERROR_OLD}
              // secureTextEntry={oldPassSecure}
              // placeholder={"Phone Number"}
              onChangeText={(value) => {
                // setERROR_OLD({ show: false, msg: "" });
              }}
            />
          </View>
          <View style={styles.textInputContainer}>
            <View style={styles.textIconContainer}>
              <SVG.EmailSVG />
              <Text_Custom style={styles.text} text="Email Address" />
            </View>
            <TextInput_custom
              placeholder=""
              containerStyles={{ marginBottom: moderateScale(5) }}
              // ERROR_MSG={ERROR_OLD}
              // secureTextEntry={oldPassSecure}
              // placeholder={"Email Address"}
              onChangeText={(value) => {
                // setERROR_OLD({ show: false, msg: "" });
              }}
            />
          </View>
          <View style={styles.textInputContainer}>
            <View style={styles.textIconContainer}>
              <SVG.LocationSVG />
              <Text_Custom style={styles.text} text="Address" />
            </View>
            <TextInput_custom
              inputProps={{ multiline: true }}
              placeholder=""
              textInputStyles={{
                height: scale(60),
                justifyContent: "flex-start",
              }}
              containerStyles={{ marginBottom: moderateScale(5) }}
              // ERROR_MSG={ERROR_OLD}
              // secureTextEntry={oldPassSecure}
              // placeholder={"Email Address"}
              onChangeText={(value) => {
                // setERROR_OLD({ show: false, msg: "" });
              }}
            />
          </View>
          <Gradient_Button
            text={"Save Profile"}
            onPress={() => setIsEdit(!isEdit)}
          />
        </View>
      </View>
    );
  };
  return (
    <Container>
      <ScrollView
        keyboardShouldPersistTaps={Platform.OS === "ios" ? "never" : "always"}
        showsVerticalScrollIndicator={false}
      >
        {/* <Loader isLoadingProps={loaderStore.isLoading} /> */}
        <ProfileHeader
          goBack={true}
          name={`${userData?.first_name} ${userData?.last_name}`}
          id={`#${userData?.driverId}`}
        />
        <View>{isEdit ? <EditUserInfo /> : <ViewUserInfo />}</View>
      </ScrollView>
    </Container>
  );
};
export default observer(ProfileInfo);
const styles = StyleSheet.create({});
