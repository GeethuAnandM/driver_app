import {useTheme} from '@react-navigation/native';
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function BackSVG(props) {
  const {colors} = useTheme();
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={11}
      height={19}
      viewBox="0 0 11 19"
      fill="none"
      {...props}>
      <Path
        d="M3.225 9.474c.19.136.308.197.398.287 2.28 2.256 4.556 4.517 6.84 6.77.41.405.637.86.496 1.435-.234.959-1.39 1.35-2.179.745-.101-.078-.19-.171-.282-.261L.57 10.59c-.761-.755-.759-1.486.007-2.246L8.527.46c.47-.465 1.033-.581 1.588-.335.528.234.844.755.807 1.336-.025.394-.223.697-.499.97-2.274 2.248-4.543 4.5-6.816 6.75-.082.082-.187.143-.382.292z"
        fill={colors.text}
      />
    </Svg>
  );
}

export default BackSVG;
