import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CommonHeader from "../../CommonHeader/CommonHeader";
import Text_Custom from "../../Text_Custom";

const NoDetailConatiner = ({ moveTo }) => {
  return (
    <>
      <CommonHeader
        title="Trip Details"
        goBack={true}
        moveTo={() => {
          moveTo();
        }}
      />
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Text_Custom text="Trip Details Not Found" />
      </View>
    </>
  );
};

export default NoDetailConatiner;

const styles = StyleSheet.create({});
