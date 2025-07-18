import { StyleSheet, Dimensions, View, Image } from "react-native";
import React, { useState, useRef } from "react";

import { moderateScale, scale } from "react-native-size-matters";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme } from "@react-navigation/native";
import { observer } from "mobx-react";

import Container from "../../Container/Container";
import CommonHeader from "../../CommonHeader/CommonHeader";
import Text_Custom from "../../Text_Custom";
import { imageStore } from "../../../Store/AuthStore/ImageStore";


const EndSignatureArea = (props) => {
  const { colors } = useTheme();
  const signatureRef = useRef(null);
  const [isImageSaved, setIsImageSaved] = useState(false);

  const [image, setImage] = useState({
    path: "https://itac-qa-files.s3.ap-south-1.amazonaws.com/upload-icon-206311661704993232.png",
  });

 const handleImagePress=()=>{
    props.navigation.navigate("EndSignature");
    console.log("msg from signature areas");

 }
  const styles = StyleSheet.create({
    main_container: {
      marginHorizontal: moderateScale(20),
      //marginVertical: moderateScale(5),
    },
    heading: {
      fontFamily: "NunitoSans-Bold",
      fontSize: scale(20),
    },
    Sub_heading: {
      fontFamily: "NunitoSans-Regular",
      fontSize: scale(14),
      marginTop: moderateScale(5),
    },
    signatureCanvas: {
      width: Dimensions.get("screen").width - 60,
      height: scale(200),
      borderWidth: 2,
      borderColor: colors.primary1,
      borderRadius: Platform.OS == "ios" ? 20 : 0,
      marginTop: moderateScale(40),
      marginBottom: moderateScale(20),
    },
    resetButton: {
      marginTop: moderateScale(10),
      backgroundColor: colors.primary1,
      padding: moderateScale(10),
      borderRadius: moderateScale(50),
      borderTopLeftRadius: moderateScale(50),
      borderBottomLeftRadius: moderateScale(50),
      alignItems: "center",
    },
    resetButtonText: {
      fontSize: scale(14),
      color: colors.white,
      fontFamily: "NunitoSans-Bold",
    },
    nextButton: {
      marginTop: moderateScale(10),
      backgroundColor: colors.primary1,
      padding: moderateScale(10),
      borderRadius: moderateScale(50),
      borderTopRightRadius: moderateScale(50),
      borderBottomRightRadius: moderateScale(50),
      alignItems: "center",
    },
    nextButtonText: {
      fontSize: scale(14),
      color: colors.white,
      fontFamily: "NunitoSans-Bold",
    },
  });
  const skip = () => {
    props.navigation.navigate("StarFeedback");
  };

  

  

 
 

  

  return (
    <Container>
      <CommonHeader goBack title="Add Document" />
      <View style={styles.main_container}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginVertical: moderateScale(30),
          }}
        >
          <Text_Custom text="Customer Signature" style={styles.heading} />
          <Text_Custom
            text={"Capture the Signature"}
            style={styles.Sub_heading}
          />
          <TouchableOpacity onPress={handleImagePress}>
          <View style={styles.signatureCanvas}>
            <Image style={{ flex: 1 }} source={{ uri: image.path }} />
          </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
                    style={{ marginTop: moderateScale(10) }}
                    onPress={() => skip()}
                  >
                    <Text_Custom
                      text={"Skip"}
                      style={{
                        fontSize: scale(14),
                        color: colors.primary1,
                        fontFamily: "NunitoSans-Bold",
                        marginLeft:moderateScale(150),
                        
                      }}
                    />
                  </TouchableOpacity>

       
      </View>
    </Container>
  );
};

export default observer(EndSignatureArea);
