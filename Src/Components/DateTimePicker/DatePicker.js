import { useTheme } from "@react-navigation/native";
import moment from "moment";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { moderateScale, scale } from "react-native-size-matters";
import * as SVG from "../../Assets/SVG";
const DatePicker = ({
  date,
  setDate,
  placeholderTextColor,
  type = "date",
  title = "Date",
  placeholder = "Date",
  conatinerStyles,
  maxDate,
  minDate,
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
    var dateTime =
      type === "date"
        ? moment(date).format("YYYY-MM-DD")
        : type === "time"
        ? moment(date).format("h:mm a")
        : date;
    setDate(dateTime);
    hideDatePicker();
  };
  const styles = StyleSheet.create({
    mainContainer: {
      width: "48%",
      justifyContent: "space-between",

      borderBottomWidth: 1,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: moderateScale(10),
      backgroundColor: colors.inputBackground,
    },
    textInput: {
      flexDirection: "row",

      alignItems: "center",

      color: colors.background,

      justifyContent: "space-around",
    },
    text: {
      flex: 1,
      height: moderateScale(50),

      fontSize: scale(14),
      fontWeight: "600",
      letterSpacing: 0.1,

      color: colors.text,
      borderRadius: 14,
    },
    heading: {
      color: "#6C6C6C",
      fontSize: scale(10),
    },
  });
  return (
    <View style={[styles.mainContainer, conatinerStyles]}>
      <TouchableOpacity onPress={() => showDatePicker()}>
        <View style={[styles.textInput]}>
          <TextInput
            returnKeyType="done"
            placeholderTextColor={
              placeholderTextColor ? placeholderTextColor : colors.placeholder
            }
            placeholder={placeholder}
            style={styles.text}
            onChangeText={(value) => setDate(value)}
            editable={false}
            value={date}
          />

          {type !== "time" ? <SVG.CalenderSVG /> : <SVG.TimeSVG />}
        </View>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={type}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={maxDate && new Date(maxDate)}
        minimumDate={minDate && new Date(minDate)}
      />
    </View>
  );
};

export default DatePicker;
