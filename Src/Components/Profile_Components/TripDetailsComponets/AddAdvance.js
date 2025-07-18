import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button } from "../../Button/Button";
import TextInput_custom from "../../TextInput_custom";
import Text_Custom from "../../Text_Custom";

import { useTheme } from "@react-navigation/native";
import { observer } from "mobx-react-lite";
import { moderateScale, scale,verticalScale } from "react-native-size-matters";
import { authStore } from "../../../Store/AuthStore/AuthStore";
import { Checkbox } from "react-native-paper";
import { tripStore } from "../../../Store/AuthStore/TripStore";
import { imageStore } from "../../../Store/AuthStore/ImageStore";
import { showError } from "../../../Utils/helper";
import { getOrgLevelSettings } from "../../../Services/Actions/TripActions";

const AddAdvance = ({ makePayment, saveAdvance, colors ,totalDistance}) => {
  const [advAmount, setAdvAmount] = useState();

  const [ERROR, setERROR] = useState({ show: false, msg: "" });
  const { dark } = useTheme();
  const tripId=tripStore.selectedTrip.tripId;
  const [inStationChecked, setInStationChecked] = useState(false);
  let orgId=tripStore.selectedTrip.orgId;
  const [outStationChecked, setOutStationChecked] = useState(false);
  const styles = StyleSheet.create({
    textInputContainer: {
      marginVertical: moderateScale(20),
    },

    text: {
      marginLeft: 50, // Add spacing to the left of the text (adjust the value as needed)
      fontSize: scale(13),
      color: 'black',
      fontWeight: 'bold',
      fontFamily: "NunitoSans-Bold",
    },
    checkboxContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: verticalScale(10),
      alignItems: "center",
      fontSize: scale(16),
    },
    CheckboxLabel: {
      color: "#2196F3",
      fontSize: scale(14),
    },

    Check: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
  const handleIsChecked = async () => {
    try {
      const response = await getOrgLevelSettings();
      if (response?.inOutStationValidation && !inStationChecked && !outStationChecked) {
        //showError("Check the Box for OutStation or InStation")

        alert("Mark Outstation or InStation.");
        return;
      }
      else{
        console.log("outststion",outStationChecked,"instation",inStationChecked)
        {inStationChecked ? imageStore.setInStationChecked(true):imageStore.setInStationChecked(false)}


        console.log("imageSt.inStationChecked",imageStore.InStationChecked.verified,"it is set");


      }
      saveAdvance(advAmount);
    } catch (error) {
      console.error('Error fetching org level settings:', error);
    }

  }

  // const totalDistance=tripStore.updatedSelectedTrip.totalDistance;
  const roundedDistance = Math.round(totalDistance * 100) / 100;
  //const roundedDistance =totalDistance ;
  return (
    <View
      style={{
        marginHorizontal: moderateScale(30),
        marginBottom: moderateScale(30),
      }}
    >
      {/* {orgId=="1"? console.log("orgid  ",orgId): console.log("no org ",)} */}
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.checkboxContainer}>
          <View style={styles.Check}>
            <View>

              <Checkbox.Android
                uncheckedColor={colors.placeholder}
                color={colors.primary}
                status={inStationChecked ? 'checked' : 'unchecked'}
                onPress={() => {
                  setInStationChecked(!inStationChecked);
                  setOutStationChecked(false);
                  console.log("instation checked");
                  // console.log("seel frm ",tripStore.selectedTrip);


                  //console.log("outststion",outStationChecked,"instation",inStationChecked)
                }}
              />
            </View>
            <Text style={styles.CheckboxLabel}>InStation</Text>
          </View>
        </View>

        <View style={styles.checkboxContainer}>
          <View style={styles.Check}>
            <View>
              <Checkbox.Android
                uncheckedColor={colors.placeholder}
                color={colors.primary}
                status={outStationChecked ? 'checked' : 'unchecked'}
                onPress={() => {
                  setOutStationChecked(!outStationChecked);
                  setInStationChecked(false);
                  console.log("outstation checked");
                  //console.log("outststion",outStationChecked,"instation",inStationChecked)

                }}
              />
            </View>
            <Text style={styles.CheckboxLabel}>OutStation</Text>
          </View>
        </View>
      </View>

      <Text_Custom
        text="Amount Received From Customer"
        style={{
          fontSize: scale(18),
          fontFamily: "NunitoSans-Bold",
        }}
      />
      <>
        <View style={styles.textInputContainer}>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <TextInput_custom
              containerStyles={{
                // height: scale(40),
                width: "80%",
              }}
              ERROR_MSG={ERROR}
              value={advAmount}
              inputProps={{ keyboardType: "number-pad" }}
              textInputStyles={{ height: scale(40) }}
              placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
              placeholder={"Enter Amount"}
              onChangeText={(value) => {
                // ✅ Remove any invalid characters immediately (only digits and one dot allowed)
                const invalidCharRegex = /[^0-9.]/;
                if (invalidCharRegex.test(value)) {
                  setERROR({
                    show: true,
                    msg: "Only numbers and decimal point allowed",
                  });
                  return;
                }
              
                // ✅ Prevent multiple decimals
                const parts = value.split('.');
                let integerPart = parts[0];
                let decimalPart = parts[1] || '';
              
                if (parts.length > 2) {
                  setERROR({
                    show: true,
                    msg: "Only one decimal point is allowed",
                  });
                  return;
                }
              
                // ✅ Empty input resets everything
                if (value.trim() === "") {
                  setAdvAmount('');
                  setERROR({
                    show: false,
                    msg: "",
                  });
                  return;
                }
              
                // Initialize error variables (dynamic)
                let errorMsg = "";
                if (integerPart.length > 5) {
                  errorMsg = "Amount must be less than 6 digits before decimal";
                } else if (decimalPart.length > 2) {
                  errorMsg = "Only 2 decimal places allowed";
                } else {
                  const numberValue = parseFloat(value);
                  if (isNaN(numberValue) || numberValue <= 0) {
                    errorMsg = "Amount must be greater than 0";
                  }
                }
              
                // Set value and error dynamically
                setAdvAmount(value);
              
                if (errorMsg !== "") {
                  setERROR({
                    show: true,
                    msg: errorMsg,
                  });
                } else {
                  setERROR({
                    show: false,
                    msg: "",
                  });
                }
              }}
              
            />

            <View
              style={{
                paddingHorizontal: moderateScale(20),
                paddingVertical: moderateScale(10),
                backgroundColor: colors.primary1,
                borderRadius: 5,
                height: scale(40),
              }}
            >
              <Text_Custom
                text={authStore?.driverData?.currency}
                style={{
                  color: "#fff",
                  fontSize: scale(16),
                  fontFamily: "NunitoSans-Regular",
                }}
              />
            </View>
          </View>
          {/* const roundedDistance = Math.round(totalDistance * 100) / 100; */}
          <View>
            {/* text={`${distance}Kms`} */}
            <Text style={styles.text}>Traveled Distance :  {` ${roundedDistance} Kms`}</Text>

          </View>
        </View>
        <Button
          text={"Continue"}

          onPress={() => {
            handleIsChecked();
            // console.log("outststion",outStationChecked,"instation",inStationChecked)
            // {inStationChecked ? imageStore.setInStationChecked(true):imageStore.setInStationChecked(false)}


            // console.log("imageSt.inStationChecked",imageStore.InStationChecked.verified,"it is set");


            // saveAdvance(advAmount);
          }}

          buttonStyles={{ backgroundColor: "#2196F3" }}
          disabled={ERROR.show}
        />
        {/* <Gradient_Button
            text="Submit"
            disable={ERROR.show}
            onPress={() => saveAdvance(advAmount)}
            // buttonStyles={{}}
          /> */}
        {/* <Gradient_Button text="Submit" onPress={() => saveAdvance()} /> */}
      </>
      {/* <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          marginVertical: moderateScale(10),
        }}
      >
        <TouchableOpacity
          onPress={() => {
            makePayment();
          }}
        >
          <Text_Custom
            text={"Skip"}
            style={{
              color: colors.primary1,
              fontSize: scale(14),
              fontFamily: "NunitoSans-Regular",
            }}
          />
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default observer(AddAdvance);
