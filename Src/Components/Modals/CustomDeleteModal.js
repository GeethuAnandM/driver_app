import { Modal, StyleSheet, Text, View } from "react-native";
import React from "react";
import Text_Custom from "..//Text_Custom/";
import { Button, Gradient_Button } from "../Button/Button";
import { moderateScale, scale } from "react-native-size-matters";
import { useTheme } from "@react-navigation/native";
import Lottie from "lottie-react-native";

const CustomDeleteModal = (props) => {
  const { colors, dark } = useTheme();
  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      //   alignItems: "center",
      // backgroundColor: "red",
      backgroundColor: dark ? "#000001d9" : "#ffffffd9",
    },
    modalView: {
      margin: 20,
      backgroundColor: colors.SecondaryBackground,
      borderRadius: 20,

      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      justifyContent: "space-evenly",
      padding: moderateScale(25),
    },
  });
  return (
    <Modal
      statusBarTranslucent={true}
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={() => {
        props.setModalVisible(!props.modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Lottie
            source={require("../../Assets/JSON/delete.json")}
            autoPlay
            loop
            style={{ width: scale(80) }}
          />
          <Text_Custom
            text={"You are about to delete the bill"}
            style={{ fontSize: scale(16), fontWeight: "700" }}
          />
          {/* <Text_Custom
            text={"This will be delete your bill. Are you sure?"}
            style={{
              fontSize: scale(12),
              fontWeight: "600",
              color: colors.placeholder,
            }}
          /> */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              marginTop: moderateScale(20),

              width: "100%",
            }}
          >
            <Button
              buttonStyles={{
                width: "40%",
                backgroundColor: "#DEDEDE",
                borderWidth: 1,
                borderColor: "#DEDEDE",
              }}
              titleStyles={{ color: "#000000" }}
              text={"Cancel"}
              onPress={() =>
                props?.onCancel
                  ? props.onCancel()
                  : props.setModalVisible(!props.modalVisible)
              }
            />
            <Button
              buttonStyles={{
                width: "40%",
                backgroundColor: colors.error,
              }}
              text={"Delete"}
              onPress={() => props.onDelete()}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomDeleteModal;

const styles = StyleSheet.create({});
