import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { moderateVerticalScale, scale } from "react-native-size-matters";
import CommonHeader from "../Components/CommonHeader/CommonHeader";
import Container from "../Components/Container/Container";
import TripDetail from "../Components/Dashboard_Componets/TripDetails";
import Loader from "../Components/Loader/Loader";
import Text_Custom from "../Components/Text_Custom";
import { getRecentTripList, getTripList } from "../Services/Actions/TripActions";
import { tripStore } from "../Store/AuthStore/TripStore";
import { observer } from "mobx-react";
const PendingTrips = (props) => {
  const { colors, dark } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);
  const [TripsList, setTripsList] = useState(tripStore?.pendingTrip);
  const [Loading, setLoading] = useState(false);
  const styles = StyleSheet.create({
    ScrollViewContainer: {
      paddingHorizontal: scale(20),
      paddingVertical: moderateVerticalScale(10),
      height: "90%",
      // borderWidth: 1,
      // flex: 1,
    },
    headingContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headingText: { fontSize: scale(16), fontFamily: "NunitoSans-Bold" },
    FilterBtn: {
      paddingHorizontal: scale(15),
      paddingVertical: scale(5),
      flexDirection: "row",
      backgroundColor: colors.SecondaryBackground,
      borderRadius: scale(5),
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    FilterBtnText: {
      fontSize: scale(12),
      color: colors.primary1,
      marginRight: scale(10),
    },
    dataList: {
      borderRadius: scale(10),
      borderColor: colors.cardBorder,
      marginVertical: moderateVerticalScale(0),
      backgroundColor: colors.SecondaryBackground,
      paddingVertical: moderateVerticalScale(20),
      justifyContent: "space-between",
      zIndex: 100,
      borderWidth: 1,
    },
  });
  useEffect(() => {
    const getRecentList=async()=>{
      const{recentTripList,pendingTripCount,pendingTrip}=await getRecentTripList();
      setTripsList(pendingTrip);
    }
    getRecentList();
    
  }, [props]);
  const onRefresh = React.useCallback(async () => {
    setLoading(true);
    // await getTripList().then(() => {
    //   setLoading(false);
    // });
    
 await getRecentTripList().then(() => {
      setLoading(false);
    });

  }, []);
  return (
    <Container>
      <Loader />
      <CommonHeader
        goBack
        title="Pending Trips"
        moveTo={() => props.navigation.navigate("Dashboard")}
      />
      <View style={styles.ScrollViewContainer}>
        {/* {true && ( */}
        <View style={styles.dataList}>
          {Loading ? (
            <View style={{ flex: 1, backgroundColor: "red" }}>
              <ActivityIndicator />
            </View>
          ) : (
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListEmptyComponent={
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text_Custom
                    style={{ fontSize: scale(16) }}
                    text="Pending trips are not available!"
                  />
                </View>
              }
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={TripsList}
              initialNumToRender={8}
              renderItem={({ item, index }) => {
                var border = true;
                if (TripsList?.length - 1 == index) {
                  border = false;
                }
                return (
                  <TripDetail
                    key={`${item?.uuid}${item?.onwardStartTime}`}
                    item={item}
                    border={border}
                    isTrip={false}
                  />
                );
              }}
            />
          )}
        </View>
        {/* )} */}
      </View>
    </Container>
  );
};
export default observer(PendingTrips);
const styles = StyleSheet.create({});
