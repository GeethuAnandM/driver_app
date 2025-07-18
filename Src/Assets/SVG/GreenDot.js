import * as React from "react";
import Svg, { G, Circle, Defs } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function GreenDot({ fill = "#2196F3" }) {
  return (
    <Svg
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Circle cx={7} cy={7} r={7} fill="#fff" />
      <Circle cx={7} cy={7} r={5} fill={fill} />
    </Svg>
  );
}

export default GreenDot;
