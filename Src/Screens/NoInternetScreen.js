import Lottie from "lottie-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { scale } from "react-native-size-matters";
import Text_Custom from "../Components/Text_Custom";
import { observer } from "mobx-react";
const NoInternetScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fefefe",
      }}
    >
      <Lottie
        source={require("../Assets/JSON/noNet.json")}
        autoPlay
        loop
        style={{ width: scale(190) }}
      />
      <Text_Custom text="Ooops!" style={styles.Oopstext} />
      <Text_Custom
        text="No Internet connection found."
        style={styles.NOInternettext}
      />
      <Text_Custom text="Check your connection" style={styles.connectiontext} />
    </View>
  );
};
export default observer(NoInternetScreen);
const styles = StyleSheet.create({
  Oopstext: {
    fontSize: scale(22),
    textAlign: "center",
  },
  NOInternettext: { fontSize: scale(16), textAlign: "center" },
  connectiontext: { fontSize: scale(16), textAlign: "center" },
});
