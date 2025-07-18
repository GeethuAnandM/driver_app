import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      width={15}
      height={15}
      viewBox="0 0 10 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G clipPath="url(#clip0_4806_857)" fill="#B0B0B0">
        <Path d="M6.781 6.358L5.387 5.312v-2.13a.387.387 0 10-.775 0v2.324c0 .122.058.237.155.31l1.55 1.161a.385.385 0 00.542-.078.387.387 0 00-.078-.541z" />
        <Path d="M5 .475c-2.757 0-5 2.242-5 5 0 2.757 2.243 5 5 5s5-2.243 5-5c0-2.758-2.243-5-5-5zM5 9.7A4.23 4.23 0 01.775 5.475 4.23 4.23 0 015 1.249a4.23 4.23 0 014.225 4.226A4.23 4.23 0 015 9.7z" />
      </G>
      <Defs>
        <ClipPath id="clip0_4806_857">
          <Path fill="#fff" transform="translate(0 .475)" d="M0 0H10V10H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default SvgComponent
