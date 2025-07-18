import { useTheme } from "@react-navigation/native";
import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import { tripTypes } from "../../../Constant/constant";
import { tripStore } from "../../../Store/AuthStore/TripStore";
import Text_Custom from "../../Text_Custom";
import * as SVG from "../../../Assets/SVG";
import { isImage } from "../../../Utils/helper";
import { observer } from "mobx-react";

const ExpenseContainer = ({ onPressAddExp, onPressExp, AdvanceAmount,canAddExpense }) => {
  const { colors, dark } = useTheme();
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
    BETAvalue: {
      fontSize: scale(12),
      fontWeight: "700",
      color: colors.primary1,
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
    HeadingContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    addBillText: {
      color: colors.primary1,
      fontWeight: "700",
      fontSize: scale(12),
    },
    scrollView: {
      marginVertical: moderateScale(15),
    },
    touchable: {
      width: scale(50),
      height: scale(80),
      marginHorizontal: moderateScale(10),
    },
    image: {
      width: "100%",
      height: scale(50),
    },
    expName: {
      fontSize: scale(10),
      textAlign: "center",
    },
  });
  const { customerAmountDetails } = AdvanceAmount;
  

  return (
    
    <>
      <View >
          {/* if(  tripStore.selectedTrip.status === tripTypes[3]|| tripStore.selectedTrip.status ===tripTypes[4]  ){
    showError("sorry you can't add expense for the completed trips")
  } */}
        <View style={styles.HeadingContainer}>

          
          <Text style={styles.addBillText}>Added Bills</Text>
        
          {  !(tripStore.selectedTrip.status === tripTypes[3]|| tripStore.selectedTrip.status ===tripTypes[4])?
    (<TouchableOpacity
            style={styles.Customervalue}
            onPress={() => onPressAddExp()}
          >
            <SVG.PlusSVG />
            <Text_Custom text={"Add Expense"} style={styles.BETAvalue} />
          </TouchableOpacity>) :
         (
          canAddExpense ? (
            <TouchableOpacity
              style={styles.Customervalue}
              onPress={onPressAddExp}
            >
              <SVG.PlusSVG />
              <Text_Custom text={"Add Expense"} style={styles.BETAvalue} />
            </TouchableOpacity>
          ) : (
            <View /> // or any placeholder component or null based on your requirement
          )
         )
        }
          

          {/* <TouchableOpacity
            style={styles.Customervalue}
            onPress={() => onPressAddExp()}
          >
            <SVG.PlusSVG />
            <Text_Custom text={"Add Expense"} style={styles.BETAvalue} />
          </TouchableOpacity> */}
        </View>

        <ScrollView
          horizontal
          keyboardShouldPersistTaps={Platform.OS === "ios" ? "never" : "always"}
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
        >
          {AdvanceAmount?.customerAmountDetails?.length > 0 &&
            AdvanceAmount?.customerAmountDetails.map((item) => {
              const {
                imageUrl1,
                incomeTypeName,
                description,
                incomeTitle,
                amount,
                incomeId,
                currencyName,
                currencySymbol,
              } = item;
              return (
                <TouchableOpacity
                  style={styles?.touchable}
                  onPress={() =>
                    onPressExp({
                      imageUrl1: imageUrl1,
                      expenseTypeName: incomeTypeName,
                      description: description,
                      expenseTitle: incomeTitle,
                      amount: amount,
                      expenseId: incomeId,
                      currencyName: currencyName,
                      currencySymbol: currencySymbol,
                      canDelete: true,
                    })
                  }
                >
                  <Image
                    blurRadius={4}
                    source={isImage(imageUrl1)}
                    style={styles.image}
                  />
                  <Text_Custom
                    text={incomeTypeName}
                    numberOfLines={2}
                    style={styles.expName}
                  />
                </TouchableOpacity>
              );
            })}
          {tripStore?.selectedTrip?.expanse?.map((item) => {
            return (
              <TouchableOpacity
                key={item?.expenseDate}
                style={styles?.touchable}
                onPress={() => onPressExp(item)}
              >
                <Image
                  blurRadius={4}
                  source={isImage(item?.imageUrl1)}
                  style={styles.image}
                />
                <Text_Custom
                  text={item?.expenseTypeName}
                  numberOfLines={2}
                  style={styles.expName}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* {tripStore?.selectedTrip?.status === tripTypes[4] && (
        <View style={styles.detailCard}>
          <View style={styles.HeadingContainer}>
            <Text style={styles.addBillText}>Added Bills</Text>
            <TouchableOpacity
              style={styles.Customervalue}
              onPress={() => onPressAddExp()}
            >
              <SVG.PlusSVG />
              <Text_Custom text={"Add Expense"} style={styles.BETAvalue} />
            </TouchableOpacity>
          </View>
          {tripStore?.selectedTrip?.expanse?.length > 0 && (
            <ScrollView
              horizontal
              keyboardShouldPersistTaps={
                Platform.OS === "ios" ? "never" : "always"
              }
              showsHorizontalScrollIndicator={false}
              style={styles.scrollView}
            >
              {tripStore?.selectedTrip?.expanse?.map((item) => {
                return (
                  <TouchableOpacity
                    key={item?.expenseDate}
                    style={styles?.touchable}
                    onPress={() => onPressExp(item)}
                  >
                    <Image
                      blurRadius={4}
                      source={isImage(item?.imageUrl1)}
                      style={styles.image}
                    />
                    <Text_Custom
                      text={item?.expenseTypeName}
                      numberOfLines={2}
                      style={styles.expName}
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>
      )} */}
    </>
  );
};

export default ExpenseContainer;
