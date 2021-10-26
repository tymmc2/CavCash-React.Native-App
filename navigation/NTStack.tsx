import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import { NewTransactionParamList } from "../types";
import NTPageOne from "../screens/new-transaction/NTPageOne";
import NTPageTwo from "../screens/new-transaction/NTPageTwo";
import NTPageThree from "../screens/new-transaction/NTPageThree";

const NTStack = createStackNavigator<NewTransactionParamList>();

const NTNavigator = () => (
    <NTStack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: "#e05d4d",
            },
            headerTitleStyle: {
                fontSize: 20,
            },
            headerTintColor: "#fff",
        }}>
        <NTStack.Screen
            name="NTPageOne"
            component={NTPageOne}
            options={{ headerTitle: "Send money", headerLeft: null }}
        />
        <NTStack.Screen name="NTPageTwo" component={NTPageTwo} options={{ headerTitle: "" }} />
        <NTStack.Screen
            name="NTPageThree"
            component={NTPageThree}
            options={{ headerTitle: "Finalize" }}
        />
    </NTStack.Navigator>
);

export default NTNavigator;
