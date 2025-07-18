import { Modal, StyleSheet, View } from "react-native";
import React from "react";
import { moderateScale, scale } from "react-native-size-matters";
import { useTheme } from "@react-navigation/native";
import Lottie from "lottie-react-native";
import { Button } from "./Button/Button";
import Text_Custom from "./Text_Custom/";
import  BellIcon  from "../Assets/SVG/BellIcon.svg";

const CustomAlert = ({
  visible,
  setVisible,
  title ,
  message ,
  onConfirm,
  buttonText = "OK",
  showAnimation = true,
  animationSource=true,
}) => {
  const { colors, dark } = useTheme();

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: dark ? "#000000cc" : "#ffffffcc",
    },
    modalView: {
      margin: 20,
      backgroundColor: dark ? "#1c1c1e" : "#fff",
      borderRadius: 20,
      padding: moderateScale(25),
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
  });

  const handleClose = () => {
    setVisible(false);
    if (onConfirm) onConfirm();
  };

  return (
    <Modal
      statusBarTranslucent
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
        <BellIcon width={24} height={24} fill="black" /> 
            <Text_Custom
            text={title}
            style={{ fontSize: scale(18), fontWeight: "700", marginBottom: 10 }}
        />
          <Text_Custom
            text={message}
            style={{
              fontSize: scale(14),
              textAlign: "center",
              color: colors.text,
              marginBottom: moderateScale(20),
            }}
          />

          <Button
          
            text={buttonText}
            onPress={handleClose}
            buttonStyles={{
              width: "60%",
              backgroundColor: colors.primary,
            }}
          /> 
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
