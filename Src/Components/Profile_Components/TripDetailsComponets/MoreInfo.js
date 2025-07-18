import { useTheme } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
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
import NavigationSvg from "../../../Assets/SVG/NavigationSvg";

import StyleCommon from "../../../Styles/StyleCommon";


const MoreInfo = () => {

  const { colors, dark } = useTheme();
  const Navigation = useNavigation();
  const [reportToNumber, setReportToNumber] = useState([]);
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
    Address: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: moderateScale(10),
     
      alignItems: "center",
  
      borderColor: colors.border,
      paddingBottom: moderateScale(15),
    },
    CustomerItems: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: moderateScale(5),
      
      alignItems: "center",
      //borderBottomWidth: 1,
      borderColor: colors.border,
      //paddingBottom: moderateScale(15),
    },
    Customervalue: {
      borderColor: colors.primary1,
      borderWidth: 1,
      paddingHorizontal: moderateScale(3),
      paddingVertical: moderateScale(6),
      marginHorizontal:moderateScale(10),
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
      flexDirection: "row",
      justifyContent: "space-between", // Add this
      alignItems: "center",
     
      
    },
    columnContainer: {
      flexDirection: "column",
      width: "100%",
      height: "100%",
      alignItems: "flex-start", // You can adjust alignment based on your design
      justifyContent: "flex-start",
    },
    linkText: {
      color: 'blue',
      textDecorationLine: 'underline',
    },
  });
  const moveTiDocUpload = (url) => {
    Navigation.navigate(url);
  };
  const openInMaps = (googlemapUrl) => {
    
    Linking.openURL(googlemapUrl)
      .catch((err) => console.error('An error occurred', err));
  };

  useEffect(() => {
    const reportToNumber = tripStore?.selectedTrip?.customerData?.reportToNumber;
  
    if (typeof reportToNumber === "string" && reportToNumber.trim() !== "") {
      // Split the string into an array using commas as the delimiter
      let numbersArray = reportToNumber.split(",");
  
      // Trim each element to remove leading and trailing whitespaces
      numbersArray = numbersArray.map((number) => number.trim());
  
      // Take only the first two elements
      const firstTwoNumbers = numbersArray.slice(0, 2);
  
      setReportToNumber(firstTwoNumbers);
      console.log("firstTwoNumbers", firstTwoNumbers);
    }
  }, [tripStore?.selectedTrip?.customerData?.reportToNumber]);
  
  return (
    <>
      {tripStore.selectedTrip?.customerData ? (
        <View >
          <Text style={styles.headingTop}>Passenger Information</Text>

          <View style={styles.addressContainer}>
            <Text_Custom text={"Report To"} style={styles.CustomerAddresskey} />
            <View style={[styles.CustomerItems]}>
              <View style={{ width: "50%" }}>
                <Text_Custom
                  text={`${tripStore?.selectedTrip?.customerData?.reportToName}`}
                  style={styles.CustomerName}
                />
              </View>
              <View style={styles.columnContainer}>
                {reportToNumber.map((phoneNumber, index) => (
                  <View
                    key={index}
                    style={[
                      styles.rowContainer,
                      index < reportToNumber.length - 1 && { marginBottom: 10 },
                    ]}
                  >
                    <SVG.CallSVG />
                    <TouchableOpacity
                      style={styles.Customervalue}
                      onPress={() => Linking.openURL(`tel:${phoneNumber}`)}
                    >
                      <Text_Custom
                        text={`+91 ${phoneNumber}`}
                        style={styles.BETAvalue}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <View style={[styles.CustomerItems]}>
            <View style={{ width: "70%" }}>
              {tripStore.selectedTrip?.customerData?.reportToAddress && (

                <View style={[styles.Address]}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.addressContainer}>
                      <Text_Custom text={"Address"} style={styles.CustomerAddresskey} />
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {/* <Text_Custom text={tripStore.selectedTrip.customerData.reportToAddress} style={styles.CustomerAddress} /> */}
                        <Text_Custom text={tripStore.selectedTrip.customerData.reportToAddress} style={StyleCommon.CustomerAddressDefault} />
                        {tripStore.selectedTrip.googleMapUrl && (
                          <TouchableOpacity onPress={() => openInMaps(tripStore.selectedTrip.googleMapUrl)}>
                            <SVG.NavigationSvg />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                </View>

              )}
            </View>
          
          </View>
          <View style={[styles.CustomerItems]}>
            <View style={{ width: "70%" ,height:"150%"}}>
             

                <View style={[styles.Address]}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.addressContainer}>
                      <Text_Custom text={"Time to Report"} style={styles.CustomerAddresskey} />
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {/* <Text_Custom text={tripStore.selectedTrip.reportingTime} style={styles.CustomerAddress} /> */}
                      <Text_Custom text={tripStore.selectedTrip.reportingTime} style={StyleCommon.CustomerAddressDefault} />
                      </View>
                    </View>
                  </View>
                </View>

           
            </View>
          
          </View>


         
        </View>
      ) : (
        <View style={styles.detailCard}>
          <Text style={styles.headingTop}>Passenger Details</Text>
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
          Passenger details are not provided.
          </Text>
        </View>
      )}
    </>
  );
};

export default MoreInfo;
