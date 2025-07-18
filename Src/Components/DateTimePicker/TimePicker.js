import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { useTheme } from "@react-navigation/native";
import { scale } from "react-native-size-matters";

export default DatePicker = ({
  date,
  setDate,
  tillToday,
  type = "date",
  title = "Date",
}) => {
  const { colors } = useTheme();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDate(date);
    hideDatePicker();
  };
  const styles = StyleSheet.create({
    textInput: {
      flexDirection: "row",
      // height: verticalScale(62),
      backgroundColor: colors.SecondaryBackground,
      alignItems: "center",
      // // paddingLeft: moderateScale(20),

      // marginTop: 20,
      color: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: "#C8C8C8",

      justifyContent: "space-around",
    },
    text: {
      // marginLeft: moderateScale(15),
      flex: 1,
      fontSize: scale(12),
      letterSpacing: 0.1,
      width: "100%",
      color: colors.background,
      borderRadius: 14,
      backgroundColor: colors.SecondaryBackground,
    },
    heading: {
      color: "#6C6C6C",
      fontSize: scale(10),
      fontFamily: "NunitoSans-Bold",
    },
  });
  return (
    <View style={{ width: "45%" }}>
      <Text style={styles.heading}>{title}</Text>
      <TouchableOpacity onPress={showDatePicker}>
        <View style={[styles.textInput]}>
          <TextInput
            keyboardType="Text"
            returnKeyType="done"
            placeholderTextColor={colors.placeholder}
            placeholder="Enter Date"
            style={styles.text}
            onChangeText={(value) => setDate(value)}
            editable={false}
            value={`${date}`}
          />

          {type === "date" ? <Icon.Calendar /> : <Icon.ClockDatePiker />}
        </View>
      </TouchableOpacity>

      <DateTimePickerModal
        tillToday
        isVisible={isDatePickerVisible}
        mode={type}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={new Date()}
      />
    </View>
  );
};
