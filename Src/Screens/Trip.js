import { useNavigation, useTheme,useFocusEffect } from "@react-navigation/native";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateVerticalScale, scale } from "react-native-size-matters";
import * as SVG from "../Assets/SVG";
import CommonHeader from "../Components/CommonHeader/CommonHeader";
import Container from "../Components/Container/Container";
import TripDetail from "../Components/Dashboard_Componets/TripDetails";
import ScrollToIndexFlatlist from "../Components/Flatlist_Custom/ScrollToIndexFlatlist";
import Loader from "../Components/Loader/Loader";
import FilterModal from "../Components/Modals/FilterModal";
import Searchbar from "../Components/SearchBar/Searchbar";
import { tripTypes } from "../Constant/constant";
import { getTripList } from "../Services/Actions/TripActions";
import { loaderStore } from "../Store/AuthStore/LoaderStore";
import { tripStore } from "../Store/AuthStore/TripStore";
import {
  checkIsRecurring,
  checkPerformance,
  FilterByDate,
  filterByisRecurring,
  tripStatusFilter,
} from "../Utils/helper";
import { isNumeric } from "../Utils/validator";
import Text_Custom from "../Components/Text_Custom";
import CustomRefreshFlatlist from "../Components/Flatlist_Custom/CustomRefreshFlatlist";

let data = ["All", "Not Started", "In Progress", "Completed", "Cancelled"];

const Trip = (props) => {
  const { colors, dark } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [TripsList, setTripsList] = useState(tripStore.TripList);
  var nav = useNavigation();
  const [filterTabData, setFilterTabData] = useState(tripStore.TripList);
  const [activeTab, setActiveTab] = useState({ name: data[0], index: 0 });
  const [Loading, setLoading] = useState(false);
  var currwntInd = 0;

  useEffect(() => {
    setTripsList(tripStatusFilter(activeTab?.name));

    // if (props.route?.params?.trip == 1) {
    //   filterList({ name: tripTypes[props.route.params.trip] });
    //   setActiveTab({ name: data[1], index: 1 });
    // } else {
    //   filterList({ name: tripTypes[0] });
    //   // setActiveTab({ name: data[0], index: 0 });
    // }
  }, [props.route.params]);

  useEffect(() => {
   
    onRefresh();
    return () => {
      setTripsList(tripStore.TripList);
    };
  }, []);

   
  useFocusEffect(
    React.useCallback(() => {
      onRefresh();
      console.log("focusing trip listing");
      return () => {
        setTripsList(tripStore.TripList);
      };
      
    }, [])
  );
  


  const filterList = (item) => {
    setActiveTab(item);
    currwntInd = item.index;

    // setActiveTab({ name: item.name, index: item.index });
    setTripsList(tripStatusFilter(item.name));
    // setFilterTabData(tripStatusFilter(item.name));
    loaderStore.setIsLoading(false);
  };

  const filterModalTypes = (item) => {
    const isRecurring = checkIsRecurring(item.TripType);
    const performance = checkPerformance(item.Performance);
    var listFilter = filterByisRecurring(
      filterTabData,
      "category",
      isRecurring
    );
    var newList = filterByisRecurring(listFilter, "performance", performance);
    var dateFilter = FilterByDate(newList, item.dateFrom, item.dateTo);
    tripStore.setTripList(dateFilter);
    // setTripsList(dateFilter);
    setTripsList(tripStatusFilter(activeTab.name));
  };

  const resetFilter = () => {
    tripStore.setTripList(filterTabData);
    setTripsList(tripStatusFilter(activeTab.name));
  };

  const onSearch = (value, activeProp) => {
    var SearchId = TripsList;
    if (value.trim() !== "") {
      if (tripStore.activeTab.name !== "All") {
        if (isNumeric(value)) {
          SearchId = TripsList?.filter((e) => {
            if (e.status === tripStore.activeTab.name) {
              var tripId = e?.uuid?.toString();
              return tripId?.includes(value);
            }
          });
        } else {
          SearchId = TripsList?.filter((e) => {
            if (e.status === tripStore.activeTab.name) {
              var tripName = e?.tripName?.toLowerCase();
              var formatedValue = value?.toLowerCase();
              return tripName?.includes(formatedValue);
            }
          });
        }
        return setTripsList(SearchId);
      } else {
        if (isNumeric(value)) {
          SearchId = TripsList?.filter((e) => {
            var tripId = e?.uuid?.toString();
            return tripId?.includes(value);
          });
        } else {
          SearchId = TripsList?.filter((e) => {
            var tripName = e?.tripName?.toLowerCase();
            var formatedValue = value?.toLowerCase();
            return tripName?.includes(formatedValue);
          });
        }
        return setTripsList(SearchId);
      }
    } else {
      setTripsList(tripStatusFilter(tripStore.activeTab.name));
    }
  };

  const styles = StyleSheet.create({
    ScrollViewContainer: {
      paddingHorizontal: scale(20),
      paddingTop: moderateVerticalScale(5),
      height: "76%",
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
      // paddingVertical: moderateVerticalScale(20),
      justifyContent: "space-between",
      zIndex: 100,
      borderWidth: 1,
    },
  });

  const onRefresh = React.useCallback(async () => {
    setLoading(true);
    tripStore.setTripList([]);
    await getTripList().then(() => {
      setActiveTab({ name: data[0], index: 0 });

      setTripsList(tripStatusFilter(data[0]));
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Loader />
      <FilterModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        filterModalTypes={filterModalTypes}
        resetFilter={resetFilter}
      />
      <Container>
        <CommonHeader
          RightIcon={
            <TouchableOpacity
              style={styles.FilterBtn}
              onPress={() => setModalVisible(true)}
            >
              <SVG.FilterSVG />
            </TouchableOpacity>
          }
        />
        <View style={{ height: scale(50) }}>
          <ScrollToIndexFlatlist
            currentActiveTab={props?.route?.params?.trip == 1 ? true : false}
            data={tripTypes}
            onPress={filterList}
            activeTab={activeTab}
            setActiveTab={(d) => {
              tripStore.setActiveTab({ name: d.name, index: d.index });
              setActiveTab({ name: d.name, index: d.index });
            }}
          />
          {/* <TabFilter filterList={filterList} /> */}
        </View>
        <Searchbar onSearch={onSearch} activeTab={activeTab} />
        <View style={styles.ScrollViewContainer}>
          <View style={styles.dataList}>
            {Loading ? (
              <View>
                <ActivityIndicator />
              </View>
            ) : (
              <>
                {!TripsList?.length > 0 ? (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      height: "90%",
                    }}
                  >
                    <Text_Custom text="No Trip Found" />
                  </View>
                ) : (
                  <>
                    <FlatList
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      data={TripsList}
                      initialNumToRender={8}
                      renderItem={({ item, index }) => {
                        var border = true;
                        if (TripsList.length - 1 == index) {
                          border = false;
                        }
                        return (
                          <TripDetail
                            key={`${item.uuid}${item.onwardStartTime}`}
                            item={item}
                            border={border}
                            isTrip={true}
                          />
                        );
                      }}
                    />

                    {/* <CustomRefreshFlatlist
                      data={TripsList}
                      renderItem={({ item, index }) => {
                        var border = true;
                        if (TripsList.length - 1 == index) {
                          border = false;
                        }
                        return (
                          <TripDetail
                            key={`${item.uuid}${item.onwardStartTime}`}
                            item={item}
                            border={border}
                            isTrip={true}
                          />
                        );
                      }}
                    /> */}
                  </>
                )}
              </>
            )}
          </View>
        </View>
      </Container>
    </>
  );
};
export default observer(Trip);
