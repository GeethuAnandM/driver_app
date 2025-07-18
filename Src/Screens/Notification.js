import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Platform } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import CommonHeader from "../Components/CommonHeader/CommonHeader";
import Container from "../Components/Container/Container";
import Loader from "../Components/Loader/Loader";
import CustomNotification from "../Components/Notifications/CustomNotification";
import Custom_Text from "../Components/Text_Custom";
import { getNotification } from "../Services/Actions/AuthActions";
import { authStore } from "../Store/AuthStore/AuthStore";
const Notification = () => {
  const styles = StyleSheet.create({
    Heading: {
      fontFamily: "NunitoSans-Bold",
      fontSize: scale(18),
    },
    subHeading: {
      textAlign: "center",
      fontSize: scale(14),
    },
    noNotificationContainer: {
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      marginHorizontal: moderateScale(25),
    },
    version: {
      marginBottom: 1,
      marginTop: "auto",

      // top: 100,
    },
    main: {
      borderWidth: 1,
      backgroundColor: "red",
      height: "100%",
    },
  });
  const [loader, setloader] = useState(false);
  useEffect(() => {
    setloader(true);
    getNotification().then((res) => {
      setloader(false);
      return;
    });
  }, []);

  return (
    <Container>
      <CommonHeader goBack title="Notification" />
      <Loader isLoadingProps={loader} />
      {authStore?.notification?.length === 0 ? (
        <View style={styles.noNotificationContainer}>
          <View>
            <Custom_Text text="No Notification Yet" style={styles.Heading} />
          </View>
          <Custom_Text
            text="When you get notificatons, they'll shown up here"
            style={styles.subHeading}
          />
        </View>
      ) : (
        <View style={styles.noNotificationContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={authStore.notification}
            keyExtractor={(item) => item.notificationDate}
            renderItem={(item) => <CustomNotification item={item} />}
          />
        </View>
      )}

      <Custom_Text
        text="Version: 1.44"
        style={[styles.subHeading, styles.version]}
      />
    </Container>
  );
};

export default observer(Notification);
