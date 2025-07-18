import { StyleSheet } from 'react-native'
import { moderateScale, scale } from "react-native-size-matters";

// let toggleFontSize = async () => {
//     alert('Hi');
// };
// let toggleUpperCase = async () => {
//     alert('Bye');
// };

// return (<view>
//     <TouchableOpacity
//         onPress={() => toggleFontSize()}
//         style={{ marginRight: moderateScale(15) }}
//     >
//         <View>
//             <SVG.PlusSVG />
//         </View>
//     </TouchableOpacity>

//     <TouchableOpacity
//         onPress={() => toggleUpperCase()}
//         style={{ marginRight: moderateScale(15) }}
//     >
//         <SVG.BackSVG />
//     </TouchableOpacity>
// </view>);


export default StyleSheet.create({
    CustomerAddressDefaultOld: {
        // width: "100%",
        fontSize: scale(14),
        // textTransform: 'uppercase',
        // fontWeight: "600",
        fontFamily: "NunitoSans-Regular",
    },
    CustomerAddressDefault: {
        // width: "100%",
        fontSize: scale(16),
        textTransform: 'uppercase',
        fontWeight: 'bold',
        // fontWeight: "600",
        fontFamily: "NunitoSans-Regular",
    },
    CustomerAddressMedium: {
        // width: "100%",
        fontSize: scale(20),
        // fontWeight: "600",
        fontFamily: "NunitoSans-Regular",
    },
    CustomerAddressLarge: {
        // width: "100%",
        fontSize: scale(24),
        // fontWeight: "600",
        fontFamily: "NunitoSans-Regular",
    },
    CustomerAddressUnUsed: {
        fontSize: scale(12),
        fontWeight: "600",
        fontFamily: "NunitoSans-Bold",
        marginVertical: moderateScale(5),
    }
});