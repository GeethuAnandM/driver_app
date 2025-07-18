import {useTheme} from '@react-navigation/native';
import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

function Profile_svg(props) {
  const {colors} = useTheme();
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={27}
      viewBox="0 0 24 27"
      fill="none"
      {...props}>
      <G
        clipPath="url(#clip0_257_232)"
        fill={props.active ? colors.primary1 : colors.inActiveTab}>
        <Path d="M11.31 27c-.424-.049-.849-.092-1.272-.147a13.085 13.085 0 01-4.49-1.437c-2.242-1.192-4.027-2.885-5.384-5.04-.198-.315-.219-.596-.05-.935 1.229-2.484 3.17-4.074 5.847-4.75.212-.053.428-.083.642-.129.421-.09.784.028 1.131.275 1.383.982 2.93 1.42 4.616 1.345 1.281-.057 2.514-.37 3.546-1.131.772-.57 1.516-.545 2.346-.313 2.344.657 4.113 2.062 5.357 4.153.53.891.547.905-.022 1.768-1.4 2.121-3.22 3.78-5.499 4.91a13.484 13.484 0 01-5.28 1.395c-.06.004-.117.024-.177.036H11.31zM11.992 14.022c-3.82 0-6.982-3.184-6.97-7.02C5.031 3.16 8.161.01 11.981 0c3.82-.011 6.977 3.156 6.982 7.005.005 3.842-3.15 7.017-6.972 7.016v.001z" />
      </G>
      <Defs>
        <ClipPath id="clip0_257_232">
          <Path fill="#fff" d="M0 0H24V27H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default Profile_svg;
