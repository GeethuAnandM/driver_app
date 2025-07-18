import Lottie from "lottie-react-native";

import React from "react";
import { StyleSheet, View } from "react-native";
import { Portal } from "react-native-portalize";
import { scale } from "react-native-size-matters";
import { loaderStore } from "../../Store/AuthStore/LoaderStore";

const Loader = ({ isLoadingProps = false }) => {
  return (
    <>
      {isLoadingProps && loaderStore.isLoading && (
        <Portal>
          <View style={[StyleSheet.absoluteFill, styles.loader]}>
            <Lottie
              source={require("../../Assets/loader.json")}
              autoPlay
              loop
              style={{ width: scale(120) }}
            />
          </View>
        </Portal>
      )}
      {isLoadingProps && (
        <Portal>
          <View style={[StyleSheet.absoluteFill, styles.loader]}>
            <Lottie
              source={require("../../Assets/loader.json")}
              autoPlay
              loop
              style={{ width: scale(120) }}
            />
          </View>
        </Portal>
      )}
    </>
  );
};

export default Loader;

const styles = StyleSheet.create({
  loader: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0,1, 1)",
    zIndex: 999999999999,
  },
});
