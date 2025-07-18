import React from "react";
import { Svg, Rect, Circle } from "react-native-svg";

function OtpSVG({ fill = "#2196F3" }) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Rect x="5" y="5" width="38" height="38" rx="6" ry="6" fill="#fff" stroke="#000" strokeWidth="1.5" />
      <Rect x="8" y="8" width="10" height="10" rx="1" ry="1" fill={fill} />
      <Rect x="20" y="8" width="10" height="10" rx="1" ry="1" fill={fill} />
      <Rect x="32" y="8" width="10" height="10" rx="1" ry="1" fill={fill} />
      <Rect x="8" y="20" width="10" height="10" rx="1" ry="1" fill={fill} />
      <Rect x="20" y="20" width="10" height="10" rx="1" ry="1" fill={fill} />
      <Rect x="32" y="20" width="10" height="10" rx="1" ry="1" fill={fill} />
      <Rect x="8" y="32" width="10" height="10" rx="1" ry="1" fill={fill} />
      <Rect x="20" y="32" width="10" height="10" rx="1" ry="1" fill={fill} />
      <Rect x="32" y="32" width="10" height="10" rx="1" ry="1" fill={fill} />
    </Svg>
  );
}

export default OtpSVG;
