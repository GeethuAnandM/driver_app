import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

function LineV_SVG(props) {
  return (
    <Svg
      width={1}
      height={45}
      viewBox="0 0 1 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        stroke="url(#paint0_linear_613_181)"
        strokeDasharray="2 2"
        d="M0.5 2.18557e-8L0.499998 80"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_613_181"
          x1={-0.499998}
          y1={37}
          x2={-0.00000435944}
          y2={4}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#DC2127" />
          <Stop offset={1} stopColor="#34C654" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

export default LineV_SVG;
