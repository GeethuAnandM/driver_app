import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

function Line(props) {
  return (
    <Svg
      width={190}
      height={2}
      viewBox="0 0 180 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        stroke="url(#paint0_linear_1090_773)"
        strokeDasharray="2 2"
        d="M0 1.4873L178 1.4873"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1090_773"
          x1={146.356}
          y1={2.4873}
          x2={16.2595}
          y2={-5.30957}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#DC2127" />
          <Stop offset={1} stopColor="#34C654" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

export default Line;
