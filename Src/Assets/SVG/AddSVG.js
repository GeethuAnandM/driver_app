import { useTheme } from "@react-navigation/native";
import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";

function AddSVG(props) {
  const { colors } = useTheme();
  return (
    <Svg
      width={28}
      height={28}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        x={0.5}
        y={0.5}
        width={27}
        height={27}
        rx={3.5}
        fill={colors.SecondaryBackground}
      />
      <Path
        d="M20 14c0 .553-.048 1-.601 1H15v4.399c0 .552-.447.601-1 .601-.553 0-1-.049-1-.601V15H8.601C8.049 15 8 14.553 8 14c0-.553.049-1 .601-1H13V8.601c0-.553.447-.601 1-.601.553 0 1 .048 1 .601V13h4.399c.553 0 .601.447.601 1z"
        fill="#2196F3"
      />
      <Rect x={0.5} y={0.5} width={27} height={27} rx={3.5} stroke="#2196F3" />
    </Svg>
  );
}

export default AddSVG;
