import * as React from 'react';
import Svg, {Rect} from 'react-native-svg';

function BurgerMenu(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={23}
      height={17}
      viewBox="0 0 23 17"
      fill="none"
      {...props}>
      <Rect
        x={7}
        width={16}
        height={3}
        rx={1.5}
        fill={props.fill ? props.fill : '#000'}
      />
      <Rect
        y={7}
        width={23}
        height={3}
        rx={1.5}
        fill={props.fill ? props.fill : '#000'}
      />
      <Rect
        x={7}
        y={14}
        width={16}
        height={3}
        rx={1.5}
        fill={props.fill ? props.fill : '#000'}
      />
    </Svg>
  );
}

export default BurgerMenu;
