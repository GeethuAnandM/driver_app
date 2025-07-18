import {useTheme} from '@react-navigation/native';
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function RightArrow(props) {
  const {colors} = useTheme();
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={8}
      height={14}
      viewBox="0 0 8 14"
      fill="none"
      {...props}>
      <Path
        d="M5.655 7.018c-.139-.093-.224-.135-.29-.196C3.708 5.278 2.053 3.73.392 2.189c-.298-.277-.463-.588-.36-.981C.2.55 1.04.283 1.614.698c.074.053.139.117.205.179l5.766 5.378c.554.516.552 1.016-.005 1.536L1.8 13.185c-.342.318-.75.397-1.155.229-.383-.16-.613-.517-.587-.914.018-.27.162-.477.363-.664 1.654-1.538 3.304-3.08 4.957-4.618.06-.056.136-.099.278-.2z"
        fill={colors.text}
      />
    </Svg>
  );
}

export default RightArrow;
