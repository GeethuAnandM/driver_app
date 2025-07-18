import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function FilterSVG(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={17}
      height={12}
      viewBox="0 0 17 12"
      fill="none"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 5.167a2.5 2.5 0 10-2.421-3.125H1a.625.625 0 000 1.25h2.579A2.501 2.501 0 006 5.167zm4.375-2.5c0-.345.28-.625.625-.625h5a.625.625 0 110 1.25h-5a.625.625 0 01-.625-.625zm3.046 7.291a2.501 2.501 0 110-1.25H16a.625.625 0 110 1.25h-2.579zM.375 9.333c0-.345.28-.625.625-.625h5a.625.625 0 010 1.25H1a.625.625 0 01-.625-.625z"
        fill="#2196F3"
      />
    </Svg>
  );
}

export default FilterSVG;
