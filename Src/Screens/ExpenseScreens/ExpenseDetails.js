import { useTheme } from "@react-navigation/native";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import { Button } from "../../Components/Button/Button";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import Container from "../../Components/Container/Container";
import Loader from "../../Components/Loader/Loader";
import Text_Custom from "../../Components/Text_Custom";
import {
  deleteExpenseById,
  getExpenseByID,
} from "../../Services/Actions/ExpenseAction";
import * as SVG from "../../Assets/SVG";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomDeleteModal from "../../Components/Modals/CustomDeleteModal";
import { isImage } from "../../Utils/helper";
import { authStore } from "../../Store/AuthStore/AuthStore";
const ExpenseDetails = (props) => {
  const { colors } = useTheme();
  const [expDetails, setExpDetails] = useState({});
  const {
    imageUrl1,
    expenseTypeName,
    description,
    expenseTitle,
    amount,
    expenseId,
    currencyName,
    currencySymbol,
    insertedBy,
  } = expDetails;

  const styles = StyleSheet.create({
    mainConatiner: {
      backgroundColor: colors.SecondaryBackground,
      borderRadius: 10,
      borderColor: colors.cardBorder,
      borderWidth: 1,
      paddingVertical: moderateScale(10),
      marginVertical: moderateScale(20),
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
      marginHorizontal: moderateScale(15),
      backgroundColor: colors.SecondaryBackground,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    titleStyles: {
      color: colors.primary,
    },
  });
  const [loader, setloader] = useState(false);
  const [show, setShow] = useState(false);
  const [isGeneral, setIsGeneral] = useState(false);
  const onEdit = () => {
    props.navigation.navigate("EditExpenseDetails", {
      expense: expDetails,
    });
  };
  const onDelete = async () => {
    await deleteExpenseById(expDetails).then((res) => {
      setShow(false);
      props.navigation.goBack();
    });
  };
  useEffect(() => {
    const init = async () => {
      setloader(true);
      var id = props.route.params.expense.expenseId;
      await getExpenseByID(id).then((res) => {
        setExpDetails(res);
        console.log(
          "🚀 ~ file: ExpenseDetails.js:106 ~ awaitgetExpenseByID ~ res:",
          res
        );

        if (res.vehicleId === null && res.tripId === null) {
          setIsGeneral(true);
        }
        setloader(false);
      });
    };
    init();
    // setloader(false);
  }, [props]);
  return (
    <Container>
      <Loader isLoadingProps={loader} />
      <CustomDeleteModal
        modalVisible={show}
        setModalVisible={setShow}
        onDelete={onDelete}
      />
      <CommonHeader
        title="Expense Details"
        goBack
        RightIcon={
          <>
            {insertedBy === authStore?.driverData?.driverId && (
              <>
                {expenseTypeName !== "advance" && (
                  <TouchableOpacity
                    onPress={() => setShow(true)}
                    style={{ alignItems: "flex-end" }}
                  >
                    <Icon
                      name={"delete"}
                      size={scale(20)}
                      color={colors.error}
                    />
                  </TouchableOpacity>
                )}
              </>
            )}
          </>
        }
      />
      <View
        style={{
          paddingHorizontal: moderateScale(20),
          paddingVertical: moderateScale(25),
        }}
      >
        <View style={styles.imageContainer}>
          <Image source={isImage(imageUrl1)} style={styles.image} />
        </View>
        <View style={styles.mainConatiner}>
          <View style={styles.textContainer}>
            <Text_Custom text="Expense Type" style={styles.title} />
            <Text_Custom
              text={expenseTypeName}
              style={[styles.expenseTypeName, { width: scale(200) }]}
            />
          </View>
          <View style={styles.textContainer}>
            <Text_Custom text={"Title"} style={styles.title} />
            <Text_Custom
              text={expenseTitle}
              numberOfLines={3}
              style={[styles.expenseTypeName, { width: scale(220) }]}
            />
          </View>
          <View
            style={[
              styles.textContainer,
              { borderBottomWidth: 0, paddingBottom: moderateScale(30) },
            ]}
          >
            <Text_Custom text="Amount" style={styles.title} />
            <Text_Custom
              text={currencySymbol + " " + amount}
              style={styles.expenseTypeName}
            />
          </View>
          {insertedBy === authStore?.driverData?.driverId && (
            <>
              {expenseTypeName?.toLowerCase() !== "advance" && (
                <Button
                  buttonStyles={styles.button}
                  titleStyles={styles.titleStyles}
                  text={"Edit Details"}
                  onPress={() => onEdit()}
                />
              )}
            </>
          )}
        </View>
      </View>
    </Container>
  );
};
export default observer(ExpenseDetails);
