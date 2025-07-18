import {useTheme} from '@react-navigation/native';
import React from 'react';
import {View, SafeAreaView, StatusBar} from 'react-native';
import COLORS from '../../Constant/Colors';
const AppStatusBar = props => {
  const {
    backgroundColor = COLORS.statusBar,
    statusBarHeight = StatusBar.currentHeight,
    ...statusBarProps
  } = props;
  const {dark} = useTheme();
  return (
    <View
      style={{
        //height: statusBarHeight,
        backgroundColor,
      }}>
      <SafeAreaView>
        <StatusBar
          backgroundColor={backgroundColor}
          barStyle={!dark ? 'dark-content' : 'light-content'}
          {...statusBarProps}
        />
      </SafeAreaView>
    </View>
  );
};

export default AppStatusBar;
