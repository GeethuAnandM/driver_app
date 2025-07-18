import { useTheme} from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from "react-native-size-matters";
import TextTicker from "react-native-text-ticker";
import { tripStore } from "../../../Store/AuthStore/TripStore";
import {
 
  statusBackground,
  statusTextColor,
} from "../../../Utils/helper";
import Text_Custom from "../../Text_Custom";
import { observer } from "mobx-react";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";


import { getpermitdetails } from "../../../Services/Actions/TripActions";

import RNFetchBlob from "rn-fetch-blob";
import { permitStore } from "../../../Store/AuthStore/PermitStore";
const PermitDetails = (props) => {
  const { colors, dark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [permit, setPermit] = useState([]);
  const [refresh, setRefresh] = useState([]);
  const [responseBody, setResponseBody] = useState([]);
  const vehicleId = tripStore.selectedTrip.vehicleId;
  const enabledBlueColor = colors.primary; // Dark blue
  const disabledBlueColor = "#696969"; // Dim blue


  const isLeftArrowDisabled = currentIndex === 0;
 


  const isRightArrowDisabled = currentIndex === responseBody.length - 1;
  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? responseBody.length - 1 : prevIndex - 1
    );
  };
  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % responseBody.length);
  };
  const downloadFile = (url, filename) => {
    const dirs = RNFetchBlob.fs.dirs;

    // Get the file extension from the URL
    const fileExtension = url.split(".").pop();

    // Append the file extension only if it doesn't already exist in the filename
    const finalFilename = filename.endsWith(`.${fileExtension}`)
      ? filename
      : `${filename}.${fileExtension}`;

    const fileDest = `${dirs.DownloadDir}/${finalFilename}`;

    RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: fileDest,
        description: "File download",
      },
      ios: { fileCache: true },
    })
      .fetch("GET", url)
      .then((res) => {
        // File successfully downloaded
        console.log("Permit File downloaded to:", res.path());
      })
      .catch((error) => {
        // Error during download
        console.error("Error downloading Permitfile:", error);
      });
  };

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return "";

    const dateOnly = dateTimeString.split(" ")[0];
    return dateOnly;
  };

  const styles = StyleSheet.create({
    detailCard: {
      backgroundColor: colors.SecondaryBackground,
      padding: moderateScale(10),
      borderRadius: scale(10),
      borderColor: colors.cardBorder,
      borderWidth: 1,
      marginBottom: moderateScale(15),
    },
    cardItems: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: moderateScale(8),
      alignItems: "center",
    },
    key: { fontSize: scale(12), color: "#8C8C8C", fontWeight: "600" },
    valueContainer: { alignItems: "flex-end" },
    value: {
      fontSize: scale(12),
      fontWeight: "700",
      color: colors.text,
    },
    tripType: {
      backgroundColor: colors.primary1,
      borderRadius: 50,
      paddingVertical: scale(5),
      paddingHorizontal: moderateScale(20),
      alignItems: "center",
    },
    tripTypeText: {
      fontWeight: "700",
      color: "#fff",
    },
    tripStatus: {
      backgroundColor: "#FFEAC0",
      borderRadius: 3,
      paddingVertical: scale(5),
      paddingHorizontal: moderateScale(12),
      alignItems: "center",
    },
    tripStatusText: {
      fontWeight: "700",
      color: "#FFAA2B",
    },
    tripStatusBtn: {
      borderRadius: scale(50),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors[statusBackground(tripStore.selectedTrip?.status)],
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateVerticalScale(5),
    },
    tripUpdateText: {
      color: colors[statusTextColor(tripStore.selectedTrip?.status)],
      fontSize: scale(14),
      fontFamily: "NunitoSans-Bold",
    },
    nextButton: {
      backgroundColor: "blue",
      padding: 10,
      borderRadius: 100,

      marginTop: 20,
      width: 100,
      height: 30,
      marginLeft: moderateScale(230),
    },
    nextButtonText: {
      color: "white",
      fontSize: 10,

      fontWeight: "bold",
    },
    arrowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
      marginBottom: 1,
    },
    arrowButton: {
      width: 40,
      alignItems: "center",
      justifyContent: "center",
    },
   
    disabledArrow: {
      opacity: 0.5,
    },
    redText: {
      color: "red",
    },
    headingTop: {
      color: colors.primary1,
      fontWeight: "700",
      fontSize: scale(12),
      marginLeft: moderateScale(10),
    },
  });

 
  const { permitRefresh } = permitStore;

  
  function isDateExpired(dateString) {
    const permitExpiryDate = new Date(dateString); 
    const currentDate = new Date(); 
    const currentYear = currentDate.getUTCFullYear();
    const currentMonth = currentDate.getUTCMonth();
    const currentDay = currentDate.getUTCDate();
    const currentDateWithoutTime = new Date(
      Date.UTC(currentYear, currentMonth, currentDay)
    );
   
    return permitExpiryDate < currentDateWithoutTime;
  }

  const fetchPermitDetails = async (vehicleId) => {
    try {
      const response = await getpermitdetails(vehicleId);   
      const permitData = response.permits;
      setResponseBody(permitData);
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {    
    setCurrentIndex(0);
    fetchPermitDetails(vehicleId);
  }, [vehicleId]);

  useEffect(() => {
    if (permitRefresh.verified) {
      setResponseBody([]);
      permitStore.setPermitRefresh(false);
      fetchPermitDetails(vehicleId);
    }
    
  }, [permitRefresh.verified]);

  const handleDownload = () => {
    const url = responseBody[currentIndex]?.permitDocument;
    const fileExtension = url.split(".").pop();
    const filename = `permitdoc.${fileExtension}`;
    downloadFile(url, filename);
  };

  return (
    <View style={styles.detailCard}>
      <Text style={styles.headingTop}>Permit Information</Text>
      {responseBody.length > 0 ? (
        <View style={styles.detailCard}>
          {/* Permit Name */}

          <View style={styles.cardItems}>
            <Text_Custom text={"Permit Name"} style={styles.key} />
            <View
              style={[
                styles.valueContainer,
                {
                  width: scale(180),
                },
              ]}
            >
              {responseBody[currentIndex]?.permitName ? (
                <TextTicker
                  style={[styles.value]}
                  repeatSpacer={50}
                  marqueeDelay={3000}
                >
                  {responseBody[currentIndex]?.permitName}
                </TextTicker>
              ) : (
                <TextTicker
                  style={[styles.value]}
                  repeatSpacer={50}
                  marqueeDelay={3000}
                >
                  {"-"}
                </TextTicker>
              )}
            </View>
          </View>

          {/* Permit Number */}
          <View style={styles.cardItems}>
            <Text_Custom text={"Permit Number"} style={styles.key} />
            <View style={styles.valueContainer}>
              {responseBody[currentIndex]?.permitNumber ? (
                <Text_Custom
                  numberOfLines={1}
                  text={responseBody[currentIndex]?.permitNumber}
                  style={styles.value}
                />
              ) : (
                <Text_Custom text="-" style={styles.value} />
              )}
            </View>
          </View>

          <View style={styles.cardItems}>
            <Text_Custom text={"Permit Type"} style={styles.key} />
            <View style={styles.valueContainer}>
              {responseBody[currentIndex]?.permitType ? (
                <Text_Custom
                  numberOfLines={1}
                  text={responseBody[currentIndex]?.permitType}
                  style={styles.value}
                />
              ) : (
                <Text_Custom text="-" style={styles.value} />
              )}
            </View>
          </View>

          <View style={styles.cardItems}>
            <Text_Custom text={"Permit Documents"} style={styles.key} />
            <View style={styles.valueContainer}>
              {responseBody[currentIndex]?.permitDocument ? (
                <TouchableOpacity onPress={handleDownload}>
                  <Icon name="download" size={20} color="green" />
                </TouchableOpacity>
              ) : (
                <Text_Custom text="-" style={styles.value} />
              )}
            </View>
          </View>

          <View style={styles.cardItems}>
            <Text_Custom text={"Permit Expiry Date"} style={styles.key} />
            <View style={styles.valueContainer}>
              {responseBody[currentIndex]?.permitExpiryDate ? (
                <Text_Custom
                  numberOfLines={1}
                  text={formatDate(
                    responseBody[currentIndex]?.permitExpiryDate
                  )}
                  style={[
                    styles.value,

                    isDateExpired(
                      formatDate(responseBody[currentIndex]?.permitExpiryDate)
                    )
                      ? styles.redText
                      : null,
                  ]}
                />
              ) : (
                <Text_Custom text="-" style={styles.value} />
              )}
            </View>
          </View>

          <View style={styles.arrowContainer}>
            <TouchableOpacity
              style={[
                styles.arrowButton,
                isLeftArrowDisabled && styles.disabledArrow,
              ]}
              onPress={handlePrevClick}
              disabled={isLeftArrowDisabled}
            >
              <Icon
                name="angle-left"
                size={20}
                color={
                  isLeftArrowDisabled ? disabledBlueColor : enabledBlueColor
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.arrowButton,
                isRightArrowDisabled && styles.disabledArrow,
              ]}
              onPress={handleNextClick}
              disabled={isRightArrowDisabled}
            >
              <Icon
                name="angle-right"
                size={20}
                color={
                  isRightArrowDisabled ? disabledBlueColor : enabledBlueColor
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
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
            Permits are not added
          </Text>
        </View>
      )}
    </View>
  );
};
export default observer(PermitDetails);
