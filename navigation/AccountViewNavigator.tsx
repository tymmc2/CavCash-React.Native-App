import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import AccountView from "../screens/account-view/AccountView";
import { AccountViewParamList } from "../types";
import TransactionsView from "../screens/account-view/TransactionsView";
import TransactionDetail from "../screens/account-view/TransactionDetail";

const AccountViewStack = createStackNavigator<AccountViewParamList>();

const AccountViewNavigator = () => (
    <AccountViewStack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: "#e05d4d",
            },
            headerTitleStyle: {
                fontSize: 20,
            },
            headerTintColor: "#fff",
        }}>
        <AccountViewStack.Screen
            name="AccountView"
            component={AccountView}
            options={{ headerTitle: "Home", headerLeft: null }}
        />
        <AccountViewStack.Screen
            name="TransactionsView"
            component={TransactionsView}
            options={{ headerTitle: "Transactions" }}
        />
        <AccountViewStack.Screen
            name="TransactionDetail"
            component={TransactionDetail}
            options={{ headerTitle: "Details" }}
        />
    </AccountViewStack.Navigator>
);

export default AccountViewNavigator;
