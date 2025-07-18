import React from "react";
import { ForgotPasswordScreen, Login } from "../../index";
const AuthStack = (Stack) => {
  return (
    <>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
      />
    </>
  );
};
export default AuthStack;
