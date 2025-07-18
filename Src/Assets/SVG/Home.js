import { useTheme } from "@react-navigation/native";
import * as React from "react";
import { color } from "react-native-reanimated";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

function Home(props) {
  const { colors } = useTheme();
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={27}
      height={33}
      viewBox="0 0 27 33"
      fill="none"
      {...props}
    >
      <Path
        d="M25 13.437c0-.738-.25-1.336-.79-1.806-3.076-2.677-6.148-5.36-9.228-8.032-.929-.807-2.01-.795-2.94.014-3.027 2.634-6.048 5.274-9.08 7.901-.65.563-.963 1.256-.962 2.147.009 4.93.004 9.862.007 14.792 0 .232.008.469.056.693.246 1.132 1.14 1.85 2.299 1.852 3.04.003 6.079.001 9.118.001h9.09c1.481 0 2.426-1.001 2.427-2.566 0-5-.002-9.998.002-14.996H25z"
        fill="url(#paint0_linear_257_189)"
      />
      <Path
        d="M16.412 22H9.588C8.71 22 8 22.695 8 23.552v3.896C8 28.305 8.71 29 9.588 29h6.824C17.29 29 18 28.305 18 27.448v-3.896c0-.857-.71-1.552-1.588-1.552z"
        fill={colors.SecondaryBackground}
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_257_189"
          x1={13.5}
          y1={3}
          x2={13.5}
          y2={31}
          gradientUnits="userSpaceOnUse"
        >
          <Stop
            stopColor={props.active ? colors.inActiveTab : colors.primary1}
          />
          <Stop
            offset={1}
            stopColor={props.active ? colors.inActiveTab : colors.primary1}
          />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

export default Home;
