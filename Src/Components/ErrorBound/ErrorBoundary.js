import React from "react";
import { View, Text, SafeAreaView, Button } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import FontAwesome from "react-native-vector-icons/Ionicons";
import RNRestart from "react-native-restart";

export class ErrorBoundary extends React.Component {
  state = {
    error: false,
    errorMessage: "", // To store the error message
  };

  static getDerivedStateFromError(error) {
    console.log("error in tryagain", error);
    // Update state with error details
    return { error: true, errorMessage: error.toString() };
  }

  componentDidCatch(error, errorInfo) {
    console.log("error in tryagain", error);
    console.log("error in tryagain", errorInfo);
    // You can log errorInfo if needed or send it to an error tracking service
  }

  destroyAuthToken = async () => {
    // await AsyncStorage.removeItem('user_settings');
  };

  handleBackToSignIn = async () => {
    // remove user settings
    // await this.destroyAuthToken();
    // restart app
    RNRestart.Restart();
  };

  render() {
    if (this.state.error) {
      return (
        <SafeAreaView
          style={{
            flex: 1,
            padding: moderateScale(20),
            backgroundColor: "#fff",
            padding: scale(20),
          }}
        >
          <View>
            <View>
              <Text style={{ width: "100%" }}>
                <FontAwesome
                  name="ios-information-circle-outline"
                  size={60}
                  color={"black"}
                />
              </Text>
              <Text style={{ fontSize: 32 }}>Oops, Something Went Wrong</Text>
              <Text
                style={{
                  marginVertical: 10,
                  lineHeight: 23,
                  fontWeight: "500",
                }}
              >
                The app ran into a problem and could not continue. We apologise
                for any inconvenience this has caused! Press the button below to
                restart the app and sign back in. Please contact us if this
                issue persists.
              </Text>
              {/* Display the error message */}
              <Text
                style={{
                  marginVertical: 10,
                  lineHeight: 23,
                  fontWeight: "500",
                  color: "red",
                }}
              >
                {this.state.errorMessage}
              </Text>
              <Button
                title={"Try again"}
                onPress={() => this.handleBackToSignIn()}
                style={{
                  marginVertical: 15,
                }}
              />
            </View>
          </View>
        </SafeAreaView>
      );
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
