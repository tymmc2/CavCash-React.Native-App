import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import { SettingsViewParamList } from "../types";
import SettingsView from "../screens/settings-view/SettingsView";
import AccountSettings from "../screens/settings-view/AccountSettings";
import { ModifyFunds } from "../screens/signin/WebViews";

const SettingsViewStack = createStackNavigator<SettingsViewParamList>();

const SettingsViewNavigator = () => {
    // Local state variables
    const [header, setHeader] = React.useState(null);

    return (
        <SettingsViewStack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#e05d4d",
                },
                headerTitleStyle: {
                    fontSize: 20,
                },
                headerTintColor: "#fff",
            }}>
            <SettingsViewStack.Screen
                name="SettingsView"
                component={SettingsView}
                options={{ headerTitle: "Settings", headerLeft: null }}
            />
            <SettingsViewStack.Screen
                name="AccountSettings"
                component={AccountSettings}
                options={{ headerTitle: "Account" }}
            />
            <SettingsViewStack.Screen
                name="ModifyFunds"
                component={ModifyFunds}
                options={{ headerTitle: "Funds" }}
            />
        </SettingsViewStack.Navigator>
    );
};

export default SettingsViewNavigator;
