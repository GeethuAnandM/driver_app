import { useTheme } from "@react-navigation/native";
import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SearchSVG(props) {
  const { colors } = useTheme();
  return (
    <Svg
      width={15}
      height={15}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M14 14l-2.99-2.996M12.666 7A5.667 5.667 0 111.333 7a5.667 5.667 0 0111.334 0v0z"
        stroke={colors.text}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default SearchSVG;
