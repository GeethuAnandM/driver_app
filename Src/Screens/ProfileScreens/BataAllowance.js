import { useTheme } from "@react-navigation/native";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import * as SVG from "../../Assets/SVG";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import Container from "../../Components/Container/Container";
import Loader from "../../Components/Loader/Loader";
import Text_Custom from "../../Components/Text_Custom";
import { getTotalBata } from "../../Services/Actions/TripActions";
import { authStore } from "../../Store/AuthStore/AuthStore";
import { tripStore } from "../../Store/AuthStore/TripStore";
const BataAllowance = () => {
  const { colors } = useTheme();
  const [Bata, setBata] = useState([]);
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const bata = await getTotalBata();

      var amount = bata?.data?.jsonData ? bata.data.jsonData : [];
      setBata(amount);
      setLoading(false);
    };
    init();
  }, []);
  return (
    <Container>
      <Loader isLoadingProps={Loading} />
      <CommonHeader goBack={true} title={"Bata Allowance"} />
      <View
        style={{
          marginHorizontal: moderateScale(20),
          marginVertical: moderateScale(20),
        }}
      >
        <View
          style={{
            borderRadius: 5,
            borderWidth: 1,
            borderColor: colors.cardBorder,

            backgroundColor: colors.SecondaryBackground,
            padding: moderateScale(20),
            marginBottom: moderateScale(15),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <SVG.MoneySvg />
              <Text_Custom
                style={{
                  marginLeft: moderateScale(10),
                  fontFamily: "NunitoSans-Bold",
                }}
                text={"Bata Received"}
              />
            </View>
            <Text
              style={{
                marginLeft: moderateScale(15),
                color: colors.primary1,
                fontFamily: "NunitoSans-Bold",
              }}
            ></Text>
          </View>
          <View
            style={{
              marginTop: 30,
            }}
          >
            {Bata.length > 0 ? (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <Text_Custom
                    style={{
                      fontFamily: "NunitoSans-Bold",
                    }}
                    text={"Currency"}
                  />
                  <Text
                    style={{
                      marginLeft: moderateScale(15),
                      color: colors.primary1,
                      fontFamily: "NunitoSans-Bold",
                    }}
                  >
                    Amount
                  </Text>
                </View>
                {Bata?.map((item) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        marginTop: 10,
                      }}
                    >
                      <Text_Custom
                        style={{
                          fontFamily: "NunitoSans-Bold",
                        }}
                        text={item?.currency}
                      />
                      <Text
                        style={{
                          marginLeft: moderateScale(15),
                          color: colors.primary1,
                          fontFamily: "NunitoSans-Bold",
                        }}
                      >
                        {item.amount}
                      </Text>
                    </View>
                  );
                })}
              </>
            ) : (
              <>
                <Text
                  style={{
                    alignSelf: "center",
                    color: colors.primary1,
                    fontFamily: "NunitoSans-Bold",
                  }}
                >
                  Bata Not Found
                </Text>
              </>
            )}
          </View>
        </View>
        <View
          style={{
            borderRadius: 5,
            borderWidth: 1,
            borderColor: colors.cardBorder,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: colors.SecondaryBackground,
            padding: moderateScale(20),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <SVG.CarSvg />
            <Text_Custom
              style={{
                marginLeft: moderateScale(10),
                fontFamily: "NunitoSans-Bold",
              }}
              text={"Total Trips"}
            />
          </View>
          <Text
            style={{
              marginLeft: moderateScale(15),
              color: colors.primary1,
              fontFamily: "NunitoSans-Bold",
            }}
          >
            {tripStore.TripCount}
          </Text>
        </View>
      </View>
    </Container>
  );
};
export default observer(BataAllowance);
const styles = StyleSheet.create({});
