import { useTheme } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { moderateScale, scale } from "react-native-size-matters";
import Text_Custom from "../../Components/Text_Custom/index";
const Custom_Modalize = ({ modalizeRef, openCamera, openGallery,openFilePicker }) => {
  const { colors, dark } = useTheme();
  // useEffect(() => {
  //   onOpen();
  // }, []);

  return (
    <Portal>
      <Modalize
        ref={modalizeRef}
        snapPoint={moderateScale(200)}
        withHandle={false}
        closeOnOverlayTap={true}
        childrenStyle={{
          backgroundColor: colors.SecondaryBackground,
          borderWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <View
          style={{
            // justifyContent: "center",
            alignItems: "center",
            marginVertical: moderateScale(20),
          }}
        >
          <Text_Custom
            text="Select Source"
            style={{ fontFamily: "NunitoSans-Bold", fontSize: scale(18) }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              marginVertical: moderateScale(15),
              width: "100%",
              // paddingVertical: moderateScale(40),
            }}
          >
            <TouchableOpacity
              onPress={openCamera && openCamera}
              style={{
                width: 120,
                height: 60,

                alignItems: "center",
              }}
            >
              <Image
                source={require("../../Assets/chooseCamera.png")}
                style={{
                  width: 60,
                  height: 60,
                }}
              />
              <Text_Custom
                text="Open Camera"
                style={{
                  fontSize: scale(12),
                  marginVertical: moderateScale(10),
                }}
              />
            </TouchableOpacity>

             {openFilePicker?( <TouchableOpacity
              onPress={openFilePicker && openFilePicker}
              style={{
                width: 120,
                height: 60,

                alignItems: "center",
              }}
            >
              <Image
                source={require("../../Assets/fileIcon.png")}
                style={{
                  width: 60,
                  height: 60,
                }}
              />
              <Text_Custom
                text="Open FileManager"
                style={{
                  fontSize: scale(12),
                  marginVertical: moderateScale(10),
                }}
              />
            </TouchableOpacity>
):(
  <TouchableOpacity
  onPress={openGallery && openGallery}
  style={{
    width: 120,
    height: 60,

    alignItems: "center",
  }}
>
  <Image
    source={require("../../Assets/chooseGallery.png")}
    style={{
      width: 60,
      height: 60,
    }}
  />
  <Text_Custom
    text="Open Gallery"
    style={{
      fontSize: scale(12),
      marginVertical: moderateScale(10),
    }}
  />
</TouchableOpacity>

)}
           



















            


           
          </View>
        </View>
      </Modalize>
    </Portal>
  );
};

export default Custom_Modalize;

const styles = StyleSheet.create({});
