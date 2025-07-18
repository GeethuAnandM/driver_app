import React from "react";
import { setItem } from "../../../Services/apiCalls";
import { createStackNavigator } from "@react-navigation/stack";
import {
  AddExpBill,
  Expense,
  ExpenseList,
  ExpenseDetails,
  EditExpenseDetails,
  ModalScreen,
} from "../../..";

const Stack = createStackNavigator();

const ExpensesStack = () => {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        animationEnabled={true}
        initialRouteName="TripExpenses"
        screenListeners={({ navigation }) => ({
          state: (e) => {
            try {
              console.log('state changed', e.data.state);

              setItem("lastScreen", JSON.stringify(e.data.state.routes));
            }
            catch (ex) {
              console.error("error in clearing async storage", ex);
            }
          },
        })}
      >
        <Stack.Screen name="TripExpenses" component={Expense} options={{}} />
        <Stack.Screen name="AddExpBill" component={AddExpBill} />
        <Stack.Screen name="ExpenseList" component={ExpenseList} />
        <Stack.Screen name="ExpenseDetails" component={ExpenseDetails} />
        <Stack.Screen
          name="EditExpenseDetails"
          component={EditExpenseDetails}
        />

        <Stack.Group screenOptions={{ presentation: "modal" }}>
          <Stack.Screen name="MyModal" component={ModalScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </>
  );
};

export default ExpensesStack;
