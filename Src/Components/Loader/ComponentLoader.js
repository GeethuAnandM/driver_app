import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from "@react-navigation/native";
import { moderateScale, scale } from 'react-native-size-matters';

const ComponentLoader = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary || '#0000ff'} />
      <Text style={[styles.fetchingText, { color: colors.text }]}>
        Fetching!!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9', // Optional, for a light background
  },
  fetchingText: {
    marginTop: moderateScale(50),
    fontSize: scale(12), // Adjust font size for better readability
    textAlign: 'center',
  },
});

export default ComponentLoader;
