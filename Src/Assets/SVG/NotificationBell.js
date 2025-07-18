import { useTheme } from "@react-navigation/native";
import * as React from "react";
import Svg, { Path, Circle } from "react-native-svg";

function NotificationBell(props) {
  const { colors } = useTheme();
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={27}
      height={27}
      viewBox="0 0 27 27"
      fill="none"
      {...props}
    >
      <Path
        d="M22.5 19.125h2.25v2.25H2.25v-2.25H4.5V11.25a9 9 0 1118 0v7.875zm-12.375 4.5h6.75v2.25h-6.75v-2.25z"
        fill={colors.text}
      />
      {props.showNotification && (
        <Circle cx={22.5} cy={4.5} r={4.5} fill="#EF3131" />
      )}
    </Svg>
  );
}

export default NotificationBell;
