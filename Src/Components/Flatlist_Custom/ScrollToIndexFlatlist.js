import { useTheme } from "@react-navigation/native";
import { observer } from "mobx-react";
import React, { useRef, useState } from "react";
import { Animated, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from "react-native-size-matters";
import { tripStore } from "../../Store/AuthStore/TripStore";
import Text_Custom from "../Text_Custom";
const ScrollToIndexFlatlist = ({
  data,
  onPress,
  currentActiveTab = false,
  activeTab,
  setActiveTab,
}) => {
  const { colors, dark } = useTheme();
  const tabOffsetValue = useRef(null);
  const [tabWidth, setTabWidth] = useState([]);

  const selectTab = (props) => {
    tabOffsetValue.current?.scrollToIndex({
      index: props.index,
      animated: true,
      viewPosition: 0.5,
    });

    setActiveTab({ name: props.name, index: props.index });
  };

  return (
    <>
      <FlatList
        horizontal
        ref={tabOffsetValue}
        initialScrollIndex={activeTab.index}
        showsHorizontalScrollIndicator={false}
        style={{
          borderBottomColor: !dark ? "#E9EFF3" : colors.cardBorder,
          borderBottomWidth: 1,
          marginHorizontal: moderateScale(20),

          // marginVertical: moderateScale(5),
        }}
        data={data}
        contentContainerStyle={{
          height: scale(35),
          marginTop: moderateVerticalScale(20),
        }}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item, index }) => {
          return (
            <>
              <TouchableOpacity
                onPress={() => {
                  // loaderStore.setIsLoading(true);
                  onPress && onPress({ name: item, index: index });
                  selectTab({ name: item, index: index });
                }}
                style={{
                  marginHorizontal: moderateScale(15),
                  flexDirection: "column",

                  height: scale(30),
                }}
                onLayout={(event) => {
                  var { x, y, width } = event.nativeEvent.layout;

                  setTabWidth([...tabWidth, width + 25]);
                }}
              >
                <Text_Custom
                  text={item}
                  style={{
                    color:
                      activeTab.index == index ? colors.primary1 : colors.text,
                    // borderBottomColor:colors.primary1,
                    // borderBottomWidth:activeTab.index == index?3:0,
                    fontFamily: "NunitoSans-Bold",
                    fontSize: scale(14),
                  }}
                />
                {activeTab.index == index && (
                  <Animated.View
                    style={{
                      width: tabWidth[index],
                      height: 3,
                      backgroundColor: colors.primary1,
                      position: "absolute",
                      top: scale(26),
                      left: -12,
                      borderRadius: 20,
                    }}
                  />
                )}
              </TouchableOpacity>
            </>
          );
        }}
      />
    </>
  );
};

export default observer(ScrollToIndexFlatlist);

const styles = StyleSheet.create({});
