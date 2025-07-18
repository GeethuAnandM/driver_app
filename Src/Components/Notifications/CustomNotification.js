import { useTheme } from "@react-navigation/native";
import { observer } from "mobx-react";
import moment, { months } from "moment";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import * as SVG from "../../Assets/SVG";
import Text_Custom from "../Text_Custom";
// import Swipeable from "react-native-gesture-handler/Swipeable";
import { Badge } from "react-native-paper";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AppleStyleSwipeableRow from "../Swipable/AppleStyleSwipeableRow";
import {
  getNotification,
  markAsRead,
} from "../../Services/Actions/AuthActions";
import { formatedActualDateTime, filterArrayByDate } from "../../Utils/helper";
Icon;
const CustomNotification = ({ item }) => {
  const { colors } = useTheme();

  let row = [];
  let prevOpenedRow;
  const styles = StyleSheet.create({
    title: {
      paddingVertical: 20,
    },
    titleText: {
      fontSize: scale(15),
      fontFamily: "NunitoSans-Bold",
    },
    main: {
      borderWidth: 1,
      paddingVertical: 15,
      backgroundColor: colors.background,
      borderRadius: 10,
      borderColor: colors.cardBorder,
    },
    head: {
      borderWidth: 1,
      paddingVertical: 15,
      backgroundColor: colors.background,
      borderRadius: 10,
      borderColor: colors.cardBorder,
      paddingHorizontal: moderateScale(10),
    },
    container: {
      flexDirection: "row",
    },
    emoji: {
      width: "18%",
    },
    Textcontent: {
      width: "82%",
      paddingHorizontal: moderateScale(10),
    },
    bottomBorder: {
      borderBottomWidth: 1,
      width: "80%",
      marginHorizontal: 5,
      borderColor: colors.border,
      alignSelf: "center",
    },
  });
  const NotificationIconByType = (type) => {
    switch (type) {
      case 1:
        return <SVG.CarServiceSVG />;
      case 2:
        return <SVG.RoundCalendar />;
      case 3:
        return <SVG.User />;
      default:
        return <SVG.CarServiceSVG />;
    }
  };

  const showDate = () => {
    var notifyDate = item?.item?.notificationDate.toLowerCase();
    if ("today" === notifyDate) {
      return "Today";
    } else if ("yesterday" === notifyDate) {
      return "Yesterday";
    } else {
     //return moment(notifyDate).format("DD MMM YYYY");
     //return moment(notifyDate, "DD-MM-YYYY").format("DD-MM-YYYY");

     return moment(notifyDate, "DD-MM-YYYY").format("DD-MMM-YYYY");

    
    }
  };
  const onSwipe = async (item) => {
    await markAsRead(item.alertId);
    await getNotification();
  };
  const todayNoti = (date) => {
    var notifyDate = item?.item?.notificationDate.toLowerCase();
    if (notifyDate === "today") {
      var now = moment(new Date()); //todays date
      // var now = moment("2023-02-13 16:30:00"); //todays date
      var end = moment(date); // another date
      var duration = moment.duration(now.diff(end));
      var hours = duration.asHours().toFixed(0);
      var min = duration.asMinutes().toFixed(0);
      if (hours < 1) {
        if (min > 1) return Math.abs(min) + " min ago";
        else "now";
      }
      return Math.abs(hours) + " hours ago";
    } else {
      return formatedActualDateTime(date);
    }
  };
  const renderItem = ({ item, index }) => {
    return (
      <AppleStyleSwipeableRow onSwipe={() => onSwipe(item)}>
        <View
          key={item?.timeOfAlert + item?.alertId}
          style={{
            backgroundColor: colors.SecondaryBackground,
            borderRadius: 10,
            borderColor: colors.cardBorder,
            borderWidth: 1,
          }}
        >
          <View style={styles.head}>
            <View style={styles.container}>
              <View style={styles.emoji}>
                <SVG.CarServiceSVG />
                <Badge
                  visible={!item.isRead}
                  size={scale(10)}
                  style={{ position: "absolute" }}
                />
              </View>
              <View style={styles.Textcontent}>
                <Text_Custom text={item?.title} style={styles.titleText} />

                <Text_Custom
                  text={item?.message}
                  style={{
                    color: colors.placeholder,
                    fontFamily: "NunitoSans-Regular",
                    fontSize: scale(12),
                  }}
                />

                <View style={{ flexDirection: "row" }}>
                  <View style={{ marginTop: moderateScale(3) }}>
                    <SVG.ClockSvg />
                  </View>
                  <Text
                    style={{
                      paddingHorizontal: moderateScale(5),
                      color: "#B0B0B0",
                    }}
                  >
                    {todayNoti(item?.timeOfAlert, item?.title)}
                  </Text>
                </View>
              </View>
            </View>
            {/* {item?.item?.list?.length - 1 !== index && (
              <View style={styles.bottomBorder}></View>
            )} */}
          </View>
        </View>
      </AppleStyleSwipeableRow>
    );
  };
  const deleteItem = ({ item, index }) => {};
  return (
    <GestureHandlerRootView>
      <View style={styles.title}>
        <Text_Custom text={showDate()} style={styles.titleText} />
      </View>
      <View style={styles.main}>
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          ItemSeparatorComponent={() => (
            <View style={styles.bottomBorder}></View>
          )}
          data={item?.item?.list}
          renderItem={(v) =>
            renderItem(v, () => {
              deleteItem(v);
            })
          }
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default observer(CustomNotification);
