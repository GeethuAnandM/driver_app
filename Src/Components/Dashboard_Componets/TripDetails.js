import React, { memo } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation, useTheme } from "@react-navigation/native";

import moment from "moment";
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from "react-native-size-matters";
import TextTicker from "react-native-text-ticker";
import * as SVG from "../../Assets/SVG";
import Text_Custom from "../../Components/Text_Custom";
import { getPerformance } from "../../Utils/helper";
import { getpermitdetails } from "../../Services/Actions/TripActions";

const { width, height } = Dimensions.get("screen");
const TripDetail = (props) => {
  const Navigation = useNavigation();
  const { colors, dark } = useTheme();

  const styles = StyleSheet.create({
    detailsContainer: {
      borderBottomWidth: props.border ? 1 : 0,
      borderBottomColor: dark ? "#2B2B2B" : "#E9EFF3",
      backgroundColor: colors.background,
    },
    nameContainer: {
      marginVertical: moderateScale(10),
      paddingHorizontal: moderateScale(10),
    },
    nameText: {
      color: colors.text,
      fontSize: scale(16),
      fontFamily: "NunitoSans-Bold",
      marginRight: moderateScale(10),
      // textTransform: "capitalize",
    },
    tripDateContainer: {
      flexDirection: "row",

      justifyContent: "space-between",
    },
    tripStartText: {
      color: dark ? colors.text : colors.placeholder,
      fontSize: scale(12),
      fontFamily: "NunitoSans-Bold",
      marginTop: moderateScale(10),
    },
    tripDate: {
      color: colors.text,
      fontSize: scale(14),
      fontFamily: "NunitoSans-Bold",
      // marginTop: moderateScale(10),
    },
    tripStatusText: {
      color: dark ? colors.text : colors.placeholder,
      fontSize: scale(12),
      fontFamily: "NunitoSans-Bold",
      marginTop: moderateScale(10),
      alignSelf: "flex-end",
    },
    tripStatusBtn: {
      backgroundColor:
        (props.item.status == "Completed" && colors.completed) ||
        (props.item.status == "In Progress" && colors.inProgress) ||
        (props.item.status == "Cancelled" && colors.cancel) ||
        (props.item.status == "Not Started" && colors.notStarted),
      marginTop: moderateScale(10),
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateVerticalScale(5),
      borderRadius: scale(6),
    },
    tripUpdateText: {
      color:
        (props.item.status == "Completed" && colors.completedText) ||
        (props.item.status == "In Progress" && colors.inProgressText) ||
        (props.item.status == "Cancelled" && colors.cancelText) ||
        (props.item.status == "Not Started" && colors.notStartedText),
      fontSize: scale(14),
      fontFamily: "NunitoSans-Bold",
    },
  });
  

  const TripDateSplit = ({ date = "", isRecurring = false }) => {
    var dateValue = moment.utc(date).local().format("DD-MM-YYYY");
    var timeValue = moment.utc(date).local().format("hh:mm A");

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: moderateScale(10),
        }}
      >
        {isRecurring && (
          <View style={{ marginRight: moderateScale(5) }}>
            <SVG.Recurring />
          </View>
        )}
        <Text_Custom style={styles.tripDate} text={dateValue} />
        <Text_Custom text=" | " style={styles.tripDate} />
        <Text_Custom style={styles.tripDate} text={timeValue} />
      </View>
    );
  };
  return (
    <View style={styles.detailsContainer}>
      
      <TouchableOpacity
        style={styles.nameContainer}
    
        onPress={() => {
          //console.log("items from tripdetial props",{trip: props.item, isTrip: props.isTrip})
           //getpermitdetails(34);
          Navigation.navigate("Listing", {
            screen: "TripDetailsScreen",
            params: { trip: props.item, isTrip: props.isTrip,status:"start",startTime: new Date().getTime(),tripUuid:props.item.uuid},
            
          });
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "60%",
              // borderWidth: 1,
            }}
          >
            <TextTicker
              duration={5000}
              loop
              bounce
              repeatSpacer={50}
              marqueeDelay={3000}
              style={styles.nameText}
            >
              {`${props.item.tripName} | ${props.item.uuid}`}

              
             
            </TextTicker>
           



            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "40%",
              }}
            >
              {getPerformance(props.item.performance) ? (
                <SVG.OnTimeSVG />
              ) : (
                <SVG.DelaySVG />
              )}
              <Text_Custom
                text={
                  getPerformance(props.item.performance) ? "On Time" : "Delay"
                }
                style={{
                  fontSize: scale(12),
                  // color: "#34C654",
                  marginLeft: moderateScale(5),
                  fontFamily: "NunitoSans-Bold",
                }}
              />
            </View>
          </View>
          <Text
            style={{
              fontSize: scale(12),
              color: colors.primary1,
              marginLeft: moderateScale(5),
              fontFamily: "NunitoSans-Bold",
            }}
          >
            {props.item.category}
          </Text>
        </View>

        <View style={styles.tripDateContainer}>
          <View>
            <Text style={styles.tripStartText}>Trip Start</Text>
            <View
              style={{
                paddingVertical: moderateVerticalScale(5),
              }}
            >
              {/* <Text style={styles.tripDate}>{props.item.onwardStartTime}</Text> */}

              <TripDateSplit
                date={props?.item?.onwardStartTime}
                isRecurring={props?.item?.isRecurring}
              />
            </View>
          </View>

          <View
            style={{
              alignSelf: "flex-end",
            }}
          >
            <Text style={styles.tripStatusText}>Status</Text>
            <View style={styles.tripStatusBtn}>
              <Text style={styles.tripUpdateText}>{props.item.status}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default memo(TripDetail);
