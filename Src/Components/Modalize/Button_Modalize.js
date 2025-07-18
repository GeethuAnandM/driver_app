import { useTheme } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity, View, Text, ScrollView } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { moderateScale, scale } from "react-native-size-matters";
import Text_Custom from "../../Components/Text_Custom/index";

const Button_Modalize = ({ modalizeRef, handleReason }) => {
  const { colors } = useTheme();

  const closeModal = () => {
    if (modalizeRef.current) {
      modalizeRef.current.close();
    }
  };

  return (
    <Portal>
      <Modalize
        ref={modalizeRef}
        snapPoint={moderateScale(200)}
        withHandle={false}
        closeOnOverlayTap={true}
        childrenStyle={{
          backgroundColor: colors.SecondaryBackground,
          borderWidth: 1,
          borderTopColor: colors.border,
        }}
        adjustToContentHeight={true}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.container}>
            <Text_Custom text="Select the reason for not putting the customer signature" style={styles.headerText} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => handleReason('Customer Denied')} style={styles.button}>
                <Text style={styles.buttonText}>Customer Denied</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleReason('Customer Postponed')} style={styles.button}>
                <Text style={styles.buttonText}>Customer Postponed</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.singleButtonContainer}>
              <TouchableOpacity onPress={() => handleReason('Others')} style={styles.button}>
                <Text style={styles.buttonText}>Others</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modalize>
    </Portal>
  );
};

export default Button_Modalize;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    alignItems: "center",
    marginVertical: moderateScale(20),
    position: "relative",
  },
  headerText: {
    fontFamily: "NunitoSans-Bold",
    fontSize: scale(15),
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: moderateScale(15),
    width: "100%",
  },
  singleButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: moderateScale(10),
  },
  button: {
    width: moderateScale(160), // Wider button
    height: moderateScale(40), // Flatter button
    backgroundColor: "#007BFF", // Adjust the background color as needed
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(20), // Increase for rounded corners
  },
  buttonText: {
    fontSize: scale(14),
    color: "white",
    fontFamily: "NunitoSans-Bold",
  },
  closeButton: {
    position: "absolute",
    top: moderateScale(5),  // Move down slightly
    right: moderateScale(15), // Move right slightly
    zIndex: 10,
    backgroundColor: "#FF0000", // Red background for the close button
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(15),
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: scale(10),
    fontWeight: "bold",
  },
});
