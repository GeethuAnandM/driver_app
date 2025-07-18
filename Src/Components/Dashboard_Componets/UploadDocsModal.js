import { useTheme } from "@react-navigation/native";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { scale } from "react-native-size-matters";
import { loaderStore } from "../../Store/AuthStore/LoaderStore";
import { Gradient_Button } from "../Button/Button";
import Loader from "../Loader/Loader";
import Text_Custom from "../Text_Custom";
const UploadDocsModal = ({
  modalVisible,
  setModalVisible,
  Skip,
  upload,
  skipLoader = false,
}) => {
  const { colors, dark } = useTheme();
  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      //   alignItems: "center",

      backgroundColor: dark ? "#000001d9" : "#ffffffd9",
    },
    modalView: {
      margin: 10,
      padding: 20,
      backgroundColor: colors.SecondaryBackground,
      borderRadius: 20,
      //   paddingTop: moderateScale(15),

      //   paddingBottom: moderateScale(25),
      //   paddingHorizontal: moderateScale(20),
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
      height: scale(150),
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: dark ? "#000001d9" : "#ffffffd9",
    },
    modal: {
      width: 155,
      height: 300,
      backgroundColor: "red",
    },
  });

  return (
    // <Modal
    //   statusBarTranslucent={true}
    //   animationType="slide"
    //   transparent={true}
    //   visible={modalVisible}
    //   onDismiss={() => {
    //     setModalVisible(!modalVisible);
    //   }}
    //   onRequestClose={() => {
    //     setModalVisible(!modalVisible);
    //   }}
    // >

    // </Modal>

    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <TouchableOpacity
        style={styles.modalContainer}
        onPress={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableOpacity
          // style={styles.modal}
          onPress={() => console.log("do nothing")}
          activeOpacity={1}
        >
          {/* <View style={styles.centeredView}> */}
          <View style={styles.modalView}>
            <Text_Custom
              text={"Do you want to upload documents"}
              style={{ fontSize: scale(16) }}
            />
            <Gradient_Button
              width="60%"
              text="Upload"
              onPress={() => upload()}
            />

            {!skipLoader ? (
              <TouchableOpacity onPress={() => Skip()}>
                <Text_Custom
                  text={"Skip"}
                  style={{
                    color: colors.primary1,
                    fontSize: scale(14),
                    fontFamily: "NunitoSans-Bold",
                  }}
                />
              </TouchableOpacity>
            ) : (
              <ActivityIndicator />
            )}
          </View>
          {/* </View> */}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default UploadDocsModal;
