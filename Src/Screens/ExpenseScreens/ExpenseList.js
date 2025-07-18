import { useTheme } from "@react-navigation/native";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import * as SVG from "../../Assets/SVG";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import Container from "../../Components/Container/Container";
import Loader from "../../Components/Loader/Loader";
import CustomDeleteModal from "../../Components/Modals/CustomDeleteModal";
import Text_Custom from "../../Components/Text_Custom";
import {
  deleteExpenseById,
  getExpenseforTrip,
} from "../../Services/Actions/ExpenseAction";
import { authStore } from "../../Store/AuthStore/AuthStore";
import { expenseStore } from "../../Store/AuthStore/ExpenseStore";
import { loaderStore } from "../../Store/AuthStore/LoaderStore";
import { showBorder } from "../../Utils/helper";
const ExpenseList = (props) => {
  const { colors } = useTheme();
  const [longPress, setLongPress] = useState();
  const [loader, setloader] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [expTitle, setExpTitle] = useState("Trip");

  useEffect(() => {
    props.navigation.addListener("focus", async () => init());
    // init();
  }, [props]);
  const init = async () => {
    const { tripId, vehicleId } = props.route?.params;
    var id = tripId ? tripId : vehicleId;
    var newexp = await getExpenseforTrip(id);
    if (tripId !== null) {
      setExpTitle("Trip");
      var newARR = newexp.filter((e) => e.tripId === id);
      if (newARR?.length > 0) {
        expenseStore.setDriverSelectedExpense(newARR);
      } else {
        props.navigation.goBack();
      }
    } else if (vehicleId !== null) {
      setExpTitle("Vehicle");

      var newARR = expenseStore.driverExpense.filter((e) => e.vehicleId === id);
      if (newARR?.length > 0) {
        // setExpTitle("General");

        expenseStore.setDriverSelectedExpense(newARR);
      } else {
        props.navigation.goBack();
      }
    } else if (vehicleId === null && tripId === null) {
      expenseStore.setDriverSelectedExpense([]);
    }
  };
  const styles = StyleSheet.create({
    mainConatiner: {
      backgroundColor: colors.SecondaryBackground,
      borderRadius: 10,
      borderColor: colors.cardBorder,
      borderWidth: 1,
      // paddingVertical: moderateScale(10),
    },
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: moderateScale(15),
      // width: "100%",
      // borderWidth: 1,
      paddingRight: moderateScale(15),
      // margin: moderateScale(10),
      // borderBottomWidth: 1,
    },
    itemContainer: {
      flexDirection: "row",
      // justifyContent: "space-between",
      alignItems: "center",
      // borderWidth: 1,
      width: "70%",
      padding: moderateScale(10),
    },
    heading: {
      fontSize: scale(16),
      textTransform: "capitalize",

      //   fontFamily: "NunitoSans-Bold",
    },
    textContainer: {
      marginLeft: moderateScale(15),
      width: "90%",
    },
    subHeadingtext: {
      fontSize: scale(10),
      color: colors.placeholder,
      // borderWidth: 1,
      // fontFamily: "NunitoSans",
    },
    price: {
      color: colors.primary,
      fontSize: scale(16),
      fontFamily: "NunitoSans-Bold",

      width: "100%",
    },
  });
  const moveToExpense = async (item) => {
    setLongPress(null);
    props.navigation.navigate("ExpenseDetails", { expense: item });
  };
  const expenseIconByType = (type) => {
    switch (type) {
      case 1:
        return <SVG.CarServiceSVG />;
      case 2:
        return <SVG.TollTaxSVG />;
      case 3:
        return <SVG.FoodSVG />;
      case 4:
        return <SVG.CarServiceSVG />;
      default:
        return <SVG.FoodSVG />;
    }
  };
  const onCancel = () => {
    setLongPress(null);
    setShow(false);
    setSelectedItem({});
  };
  const deleteExp = async (item) => {
    setSelectedItem(item);
    setLongPress(null);
    setShow(true);
    // await deleteExpenseById(item).then((res) => {
    //   init();
    // });
  };
  const onDelete = async () => {
    await deleteExpenseById(selectedItem).then((res) => {
      init();
      onCancel();
    });
  };
  const RenderList = ({ item, index }) => {
    return (
      <View
        style={[
          {
            // backgroundColor: longPress == index ? "red" : "blue",
            borderBottomColor: colors.border,
            borderBottomWidth: showBorder(
              expenseStore.driverSelectedExpense,
              index
            ),
          },
        ]}
      >
        {longPress == index && (
          <TouchableOpacity
            onPress={() => {
              setLongPress(null);
            }}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(181, 222, 255, 0.8)",
              zIndex: 9999,
              // opacity: 0.7,
              top: 0,
              left: 0,
              right: 0,
              justifyContent: "center",
              alignItems: "flex-end",
              paddingRight: moderateScale(20),
            }}
          >
            <TouchableOpacity
              onPress={() => {
                deleteExp(item);
              }}
            >
              <SVG.DeleteEXPSvg />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.container]}
          onLongPress={() => setLongPress(index)}
          onPress={() => moveToExpense(item)}
        >
          <View style={styles.itemContainer}>
            <View>{expenseIconByType(item.expenseTypeId)}</View>
            <View style={styles.textContainer}>
              <Text_Custom
                text={item.expenseTitle}
                style={styles.heading}
                numberOfLines={2}
              />
              <Text_Custom
                text={item.expenseTypeName}
                style={styles.subHeadingtext}
              />
            </View>
          </View>
          <Text_Custom
            text={item.currencySymbol + item.amount}
            style={styles.price}
          />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <Container>
      <Loader isLoadingProps={loaderStore.isLoading} />
      <CommonHeader title={`${expTitle} Expenses`} goBack />
      <CustomDeleteModal
        modalVisible={show}
        setModalVisible={setShow}
        onCancel={onCancel}
        onDelete={onDelete}
      />
      {expenseStore.driverSelectedExpense.length > 0 && (
        <View
          style={{
            flex: 1,
            paddingHorizontal: moderateScale(20),
            paddingVertical: moderateScale(25),
          }}
        >
          <View style={styles.mainConatiner}>
            <FlatList
              data={expenseStore.driverSelectedExpense}
              renderItem={RenderList}
            />
          </View>
        </View>
      )}
    </Container>
  );
};
export default observer(ExpenseList);
