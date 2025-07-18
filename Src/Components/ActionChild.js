import React from "react";

import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-eva-icons";
import LinearGradient from "react-native-linear-gradient";
const ActionChild = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        padding: 10,
      }}
    >
      <View
        style={{
          width: "90%",
          height: Platform.OS === "ios" ? "20%" : "25%",
          backgroundColor: "#404040",
          borderRadius: 20,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            height: "90%",
            width: "30%",
            // backgroundColor: 'black',
            padding: 15,
            alignSelf: "center",
          }}
        >
          <Image
            source={require("../Assets/21458-NTQL9F.png")}
            style={{
              width: "100%",
              height: "100%",
            }}
          ></Image>
        </View>
        <View
          style={{
            height: "100%",
            width: "70%",
            paddingVertical: 20,
          }}
        >
          <Text
            style={{
              fontWeight: "300",
              textTransform: "uppercase",
              fontSize: 12,
              color: "white",
            }}
          >
            Connected Device
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingTop: 10,
            }}
          >
            <Text
              style={{
                fontWeight: "900",
                textTransform: "uppercase",
                fontSize: 12,
                color: "white",
                paddingRight: 5,
              }}
            >
              NoiseFit Evolve 2
            </Text>
            <Icon name={"flash"} fill={"#1b9be3"} width={15} height={15} />
            <Text
              style={{
                fontWeight: "900",
                textTransform: "uppercase",
                fontSize: 12,
                color: "white",
              }}
            >
              92%
            </Text>
          </View>
          <Text
            style={{
              fontWeight: "300",
              paddingTop: 5,
              fontSize: 10,
              color: "white",
            }}
          >
            Last Synced at: 12:52 PM,14 Mar 2022
          </Text>
          <Text
            style={{
              fontWeight: "300",
              paddingTop: 5,
              fontSize: 10,
              color: "white",
            }}
          >
            Firmware version :4.3.308B.53
          </Text>

          <LinearGradient
            colors={["#21b9db", "#1e6575", "#1b3b42"]}
            style={{ width: "90%", borderRadius: 50, marginVertical: 10 }}
          >
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                padding: 12,
              }}
            >
              <Text
                style={{
                  fontWeight: "700",

                  fontSize: 14,
                  color: "white",
                }}
              >
                Unpair
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};

export default ActionChild;

const styles = StyleSheet.create({});
