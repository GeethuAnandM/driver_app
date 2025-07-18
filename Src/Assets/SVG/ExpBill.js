import * as React from "react";
import Svg, { Path } from "react-native-svg";

function ExpBill(props) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.167 16.417a2.75 2.75 0 01-2.75 2.75H3.583a2.75 2.75 0 01-2.75-2.75V1.75a.917.917 0 011.526-.685L5.875 4.19l3.516-3.125a.917.917 0 011.218 0l3.516 3.125 3.516-3.125a.917.917 0 011.526.685v14.667zm-8.25-.917a.917.917 0 100-1.833h-5.5a.917.917 0 000 1.833h5.5zm4.583-3.667c0 .507-.41.917-.916.917H5.417a.917.917 0 110-1.833h9.166c.507 0 .917.41.917.916zM14.584 10a.917.917 0 100-1.833H5.417a.917.917 0 100 1.833h9.166z"
        fill="#2196F3"
      />
    </Svg>
  );
}

export default ExpBill;
