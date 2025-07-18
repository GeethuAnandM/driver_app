import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { Dimensions, Image, Modal, StyleSheet, View } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import {
  deleteExpenseById,
  getExpenseforTrip,
} from "../../../Services/Actions/ExpenseAction";
import { authStore } from "../../../Store/AuthStore/AuthStore";
import { tripStore } from "../../../Store/AuthStore/TripStore";
import { isImage } from "../../../Utils/helper";
import { Button } from "../../Button/Button";
import CustomDeleteModal from "../../Modals/CustomDeleteModal";
import Text_Custom from "../../Text_Custom";
const { width, height } = Dimensions.get("screen");
const OpenImageModal = ({ imageModal, imageSelected, setImageModal }) => {
  const { colors, dark } = useTheme();
  const [show, setShow] = useState(false);
  const {
    imageUrl1,
    expenseTypeName,
    description,
    expenseTitle,
    amount,
    expenseId,
    currencyName,
    currencySymbol,
    canDelete = false,
  } = imageSelected;

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",

      backgroundColor: dark ? "#000001d9" : "#ffffffd9",
    },
    modalView: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 90,
      marginHorizontal: moderateScale(15),
      justifyContent: "center",
    },

    containerStyles: {
      marginVertical: moderateScale(10),
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
    },
    mainConatiner: {
      backgroundColor: colors.SecondaryBackground,
      borderRadius: 10,
      borderColor: colors.cardBorder,
      borderWidth: 1,
      paddingHorizontal: moderateScale(10),
      justifyContent: "center",
    },
    imageContainer: {
      height: "40%",
      backgroundColor: colors.SecondaryBackground,
      borderRadius: 10,
    },
    image: {
      width: "100%",
      height: "100%",
      borderRadius: 10,
      borderColor: colors.cardBorder,
      borderWidth: 1,
    },
    expenseTypeName: {
      color: colors.primary,
      fontSize: scale(14),
      fontFamily: "NunitoSans-Bold",
      textAlign: "right",
      width: scale(120),
    },
    title: { fontSize: scale(14) },
    textContainer: {
      flexDirection: "row",
      padding: moderateScale(10),
      justifyContent: "space-between",
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
    },
    button: {
      // marginHorizontal: moderateScale(15),
      backgroundColor: colors.SecondaryBackground,
      borderWidth: 1,
      borderColor: colors.error,
      marginTop: moderateScale(20),
    },
    button2: {
      // marginHorizontal: moderateScale(15),
      backgroundColor: colors.error,
      borderWidth: 1,
      borderColor: colors.error,
      marginTop: moderateScale(20),
    },
    titleStyles: {
      color: colors.error,
    },
  });

  const DeleteSelecetedExp = async () => {
    try {
      var del = await deleteExpenseById(imageSelected);

      var expanse = await getExpenseforTrip(tripStore.selectedTrip.tripId);
      tripStore.setSelectedTrip({ ...tripStore.selectedTrip, expanse });
      setShow(false);
      setImageModal(false);
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <Modal
      statusBarTranslucent={true}
      animationType="slide"
      transparent={true}
      visible={imageModal}
      onRequestClose={() => {
        setImageModal(false);
      }}
    >
      <CustomDeleteModal
        modalVisible={show}
        setModalVisible={setShow}
        onDelete={DeleteSelecetedExp}
      />
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.mainConatiner}>
            <View style={styles.imageContainer}>
              <Image source={isImage(imageUrl1)} style={styles.image} />
            </View>
            <View style={styles.textContainer}>
              <Text_Custom text="Expense Type" style={styles.title} />
              <Text_Custom
                text={expenseTypeName}
                style={styles.expenseTypeName}
              />
            </View>
            <View style={styles.textContainer}>
              <Text_Custom text="Title" style={styles.title} />
              <Text_Custom
                text={expenseTitle}
                style={[styles.expenseTypeName, { width: scale(220) }]}
                numberOfLines={3}
              />
            </View>
            <View style={[styles.textContainer, { borderBottomWidth: 0 }]}>
              <Text_Custom text="Amount" style={styles.title} />
              <Text_Custom
                text={currencySymbol + " " + amount}
                style={styles.expenseTypeName}
              />
            </View>

            <Button
              buttonStyles={styles.button}
              titleStyles={styles.titleStyles}
              text={"Close"}
              onPress={() => setImageModal(false)}
            />
            {!canDelete && (
              <Button
                buttonStyles={styles.button2}
                // titleStyles={styles.titleStyles}
                text={"Delete"}
                onPress={() => setShow(true)}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OpenImageModal;
