import { useNavigation, useTheme } from "@react-navigation/native";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { moderateScale, scale } from "react-native-size-matters";
import ScrollToIndexFlatlist from "../../Components/Flatlist_Custom/ScrollToIndexFlatlist";
import Searchbar from "../../Components/SearchBar/Searchbar";
import Text_Custom from "../../Components/Text_Custom";
import { expensesTypes } from "../../Constant/constant";
import { authStore } from "../../Store/AuthStore/AuthStore";
import { expenseStore } from "../../Store/AuthStore/ExpenseStore";
import {
  formatedDateTime,
  showBorder,
  searchByFields,
} from "../../Utils/helper";
import moment from "moment";
import { isNumeric } from "../../Utils/validator";
const TripExpenseList = (props) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = React.useState(false);
  const [activeTab, setActiveTab] = useState({
    name: expensesTypes[0],
    index: 0,
  });
  const [driverExpenses, setDriverExpenses] = useState([
    ...expenseStore.filterTripsExp,
  ]);

  useEffect(() => {
    setActiveTab({
      name: expensesTypes[0],
      index: 0,
    });
    expenseStore.setActiveTab({
      name: expensesTypes[0],
      index: 0,
    });
    setDriverExpenses([...expenseStore.filterTripsExp]);
    return () => {
      setDriverExpenses();
    };
  }, [props]);
  useEffect(() => {
    setDriverExpenses([...expenseStore.filterTripsExp]);
  }, [expenseStore]);
  const styles = StyleSheet.create({
    mainConatiner: {
      backgroundColor: colors.SecondaryBackground,
      borderRadius: 10,
      borderColor: colors.cardBorder,
      borderWidth: 1,
      paddingVertical: moderateScale(5),
      borderWidth: 1,
    },
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: moderateScale(15),
      margin: moderateScale(10),
      borderBottomColor: colors.border,
    },
    itemContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      // padding: moderateScale(10),
    },
    heading: {
      fontSize: scale(16),
      // fontFamily: "NunitoSans",
    },
    textContainer: {
      marginLeft: moderateScale(15),
    },
    subHeadingtext: {
      fontSize: scale(10),
      // fontFamily: "NunitoSans",
    },
    price: {
      color: colors.primary,
      fontSize: scale(16),
      fontFamily: "NunitoSans-Bold",
    },
    tripIDText: {
      color: colors.primary,
      fontFamily: "NunitoSans-Bold",
      fontSize: scale(16),
      textAlign: "right",
    },
    tripDateText: {
      color: colors.placeholder,
      paddingTop: moderateScale(5),
      fontSize: scale(12),
    },
    tripNameText: {
      fontFamily: "NunitoSans-Bold",
      fontSize: scale(16),
      // textTransform: "capitalize",
    },
  });
  const moveToExpense = async (item) => {
    if (
      item.tripId == null &&
      item.tripId == undefined &&
      item.vehicleId == null &&
      item.vehicleId == undefined
    ) {
      navigation.navigate("ExpenseDetails", { expense: item });
    } else {
      navigation.navigate("ExpenseList", {
        tripId: item.tripId,
        vehicleId: item.vehicleId,
      });
    }
  };
  const filterDriverExpenses = (item) => {
    // setDriverExpenses([]);
    if (item.index === 0) {
      setDriverExpenses(expenseStore.filterTripsExp);
    } else if (item.index === 1) {
      setDriverExpenses(expenseStore.filterVehicleExp);
    } else if (item.index === 2) {
      setDriverExpenses(expenseStore.filterGeneralExp);
    } else if (item.index === 3) {
      setDriverExpenses(expenseStore.filterGeneralExp);
    }
  };
  const getTypeName = (item) => {
    if (item.tripId !== null && item.tripId !== undefined) {
      return item.tripName;
    } else if (item.vehicleId !== null && item.vehicleId !== undefined) {
      return item.licensePlate;
    } else {
      return item.expenseTitle;
    }
  };
  const getType = (item) => {
    if (item.tripId !== null && item.tripId !== undefined) {
      return "Trip";
    } else if (item.vehicleId !== null && item.vehicleId !== undefined) {
      return "Vehicle";
    } else {
      return "Expense";
    }
  };
  const formatUtc = (datetime) => {
    if (!datetime) return "";  // Or return "-" or "N/A" — whatever fallback you want
  
    return moment(datetime, "YYYY-MM-DD HH:mm:ss")
      .utc()
      .format("DD-MM-YYYY");
  };
  
  
  
  const getTypeIDName = (item) => {
    if (item.tripId !== null && item.tripId !== undefined) {
      return item.uuId;
    } else if (item.vehicleId !== null && item.vehicleId !== undefined) {
      return item.vehicleId;
    } else {
      return `${item.currencySymbol} ${item.amount}`;
    }
  };
  const RenderList = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[
          styles.container,
          {
            borderBottomWidth: showBorder(driverExpenses, index),
          },
        ]}
        onPress={() => moveToExpense(item)}
      >
        <View style={{ width: "40%" }}>
          <Text_Custom
            numberOfLines={1}
            text={getType(item) + " " + "Name"}
            style={styles.tripNameText}
          />
          <Text_Custom
            text={
              getType(item) === "Expense" ? "Amount" : `${getType(item)} Id`
            }
            style={styles.tripDateText}
          />

          <Text_Custom text="Expense Date" style={styles.tripDateText} />
        </View>
        <View style={{ width: "60%" }}>
          <Text_Custom
            numberOfLines={1}
            text={getTypeName(item)}
            style={[styles.tripNameText, { textAlign: "right" }]}
          />
          <Text_Custom
            text={getTypeIDName(item)}
            style={[styles.tripDateText, { textAlign: "right" }]}
          />
          <Text_Custom
            text={formatUtc(item.expenseDate, "date")}
            style={[styles.tripDateText, { textAlign: "right" }]}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const filterPersons = function (arr, input) {
    const results = arr?.filter(function (p) {
      if (input.length == 0) return false;
      return (p.licensePlate + " " + p.vehicleId).match(new RegExp(input, "i"));
    });
    return results;
  };
  const onSearch = (value, i) => {
    var SearchId = driverExpenses;
    if (expenseStore?.activeTab?.index === 0) {
      if (value.trim() !== "") {
        SearchId = searchByFields(driverExpenses, value, ["tripName", "uuId"]);

        return setDriverExpenses(SearchId);
      } else {
        setDriverExpenses([...expenseStore.filterTripsExp]);
      }
    }
    if (expenseStore?.activeTab?.index === 1) {
      if (value.trim() !== "") {
        SearchId = searchByFields(expenseStore.filterVehicleExp, value, [
          "licensePlate",
          "vehicleId",
        ]);

        return setDriverExpenses(SearchId);
      } else {
        setDriverExpenses([...expenseStore.filterVehicleExp]);
      }
    }
    if (expenseStore?.activeTab?.index === 2) {
      if (value.trim() !== "") {
        SearchId = searchByFields(expenseStore?.filterGeneralExp, value, [
          "expenseTitle",
        ]);

        return setDriverExpenses(SearchId);
      } else {
        setDriverExpenses([...expenseStore.filterGeneralExp]);
      }
    }
  };

  const getSearchPlaceholder = () => {
    var index = expenseStore.activeTab.index;
    switch (index) {
      case 0:
        return "Search Trip Name & ID";
      case 1:
        return "Search Vehicle Name & ID";
      case 2:
        return "Search Expense Name";
      default:
        return "";
    }
  };
  return (
    <>
      <View style={{ height: scale(50) }}>
        <ScrollToIndexFlatlist
          data={expensesTypes}
          onPress={(i) => filterDriverExpenses(i)}
          activeTab={activeTab}
          setActiveTab={(v) => {
            expenseStore.setActiveTab(v);
            setActiveTab(v);
          }}
        />
        {/* <TabFilter filterList={filterList} /> */}
      </View>

      {activeTab && (
        <Searchbar
          onSearch={onSearch}
          activeTab={activeTab}
          placeholder={getSearchPlaceholder()}
        />
      )}
      {driverExpenses.length > 0 && (
        <View
          style={{
            paddingHorizontal: moderateScale(20),
            paddingVertical: moderateScale(10),
            height: "80%",
          }}
        >
          <View style={styles.mainConatiner}>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={props.onRefresh}
                />
              }
              showsVerticalScrollIndicator={false}
              data={driverExpenses}
              renderItem={RenderList}
            />
          </View>
        </View>
      )}
    </>
  );
};
export default observer(TripExpenseList);
