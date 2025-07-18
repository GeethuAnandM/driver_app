import { useTheme } from "@react-navigation/native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { tripTypes } from "../../../Constant/constant";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import { tripStore } from "../../../Store/AuthStore/TripStore";
import * as SVG from "../../../Assets/SVG";
import Text_Custom from "../../Text_Custom";
import { imageStore } from "../../../Store/AuthStore/ImageStore";
import { feedbackStore } from "../../../Store/AuthStore/FeedbackStore";
import Icon from "react-native-vector-icons/Feather";

import StyleCommon from "../../../Styles/StyleCommon";

const CustomerInfo = () => {
  const { colors, dark } = useTheme();
  const Navigation = useNavigation();
  //const{status}=tripStore.selectedTrip.status;
  const styles = StyleSheet.create({
    detailCard: {
      backgroundColor: colors.SecondaryBackground,
      padding: moderateScale(10),
      borderRadius: scale(10),
      borderColor: colors.cardBorder,
      borderWidth: 1,
      marginBottom: moderateScale(15),
    },
    headingTop: {
      color: colors.primary1,
      fontWeight: "700",
      fontSize: scale(12),
    },
    CustomerItems: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: moderateScale(10),
      alignItems: "center",
      borderBottomWidth: 1,
      borderColor: colors.border,
      paddingBottom: moderateScale(15),
    },
    Customervalue: {
      borderColor: colors.primary1,
      borderWidth: 1,
      paddingHorizontal: moderateScale(3),
      paddingVertical: moderateScale(6),
      borderRadius: 5,
      flexDirection: "row",
      width: "40%",
      justifyContent: "space-around",
      alignItems: "center",
    },
    CustomerName: {
      fontSize: scale(14),
      fontWeight: "600",
    },
    addressContainer: {
      // paddingVertical: moderateScale(10),
    },
    CustomerAddresskey: {
      marginVertical: moderateScale(10),
      fontSize: scale(12),
      fontWeight: "700",
      color: colors.primary1,
    },
    // CustomerAddress: {
    //   // width: "100%",
    //   fontSize: scale(14),
    //   // fontWeight: "600",
    //   fontFamily: "NunitoSans-Regular",
    // },
    BETAvalue: {
      fontSize: scale(12),
      fontWeight: "700",
      color: colors.primary1,
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between', // Add this
      alignItems: 'center',
    },
    linkText: {
      color: 'blue',
      textDecorationLine: 'underline',
    },
  });
  const moveTiDocUpload = (url) => {
    Navigation.navigate(url);


  };

  return (
    <>
      {tripStore.selectedTrip?.customerData ? (
        <View>
          <Text style={styles.headingTop}>Customer Information</Text>
          <View style={[styles.CustomerItems]}>
            <View style={{ width: "50%" }}>
              <Text_Custom
                text={`${tripStore?.selectedTrip?.customerData?.name}`}
                style={styles.CustomerName}
              />
            </View>
            <SVG.CallSVG />
            <TouchableOpacity
              style={styles.Customervalue}
              onPress={() =>
                Linking.openURL(
                  `tel:${tripStore?.selectedTrip?.customerData?.phone}`
                )
              }
            >
              <Text_Custom
                text={`+91 ${tripStore.selectedTrip?.customerData?.phone !== undefined
                    ? tripStore.selectedTrip?.customerData?.phone
                    : "-"
                  }`}
                style={styles.BETAvalue}
              />
            </TouchableOpacity>

          </View>
         
            <View style={styles.addressContainer}>
              <Text_Custom text={"Address"} style={styles.CustomerAddresskey} />
              <Text_Custom
                text={`${tripStore.selectedTrip?.customerData?.address}`}
                // style={styles.CustomerAddress}
                style={StyleCommon.CustomerAddressDefault} 
              />
            </View>
          
            <View style={styles.addressContainer}>
            <Text_Custom text={"Ordered By"} style={styles.CustomerAddresskey} />
            <Text_Custom
              text={tripStore.selectedTrip?.customerData?.orderBy}
              // style={styles.CustomerAddress}
              style={StyleCommon.CustomerAddressDefault} 
            />
          </View>




        

          {tripStore.selectedTrip?.status === tripTypes[3] && (

            <View style={styles.rowContainer}>
              <Text_Custom text={"Customer Feedback"} style={styles.CustomerAddresskey} />

              {tripStore.selectedTrip?.completeTripData?.tripEndRating !== "" ? (

                <Icon
                  name={"check-circle"}
                  size={scale(20)}
                  color={colors.completedText}
                />

              ) : (
                <TouchableOpacity onPress={() => moveTiDocUpload("TripScreenFeedback")}>

                  <Icon
                    name={"chevron-right"}
                    size={scale(20)}
                    color={colors.text}
                  />
                </TouchableOpacity>
              )}

            </View>


          )}


        </View>
      ) : (
        <View style={styles.detailCard}>
          <Text style={styles.headingTop}>Customer Information</Text>
          <Text
            style={[
              styles.headingTop,
              {
                textAlign: "center",
                color: colors.placeholder,
                paddingVertical: moderateScale(20),
              },
            ]}
          >
            Customers are not added
          </Text>
        </View>
      )}
    </>
  );
};

export default CustomerInfo;
