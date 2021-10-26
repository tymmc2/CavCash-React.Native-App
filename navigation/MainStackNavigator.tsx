import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { MainStackParamList } from "../types";
import NewTransactionButton from "../components/custom/nav/NewTransactionButton";
import AccountViewNavigator from "./AccountViewNavigator";
import NTNavigator from "./NTStack";
import SettingsViewNavigator from "./SettingsViewNavigator";

const MainStack = createBottomTabNavigator<MainStackParamList>();

const MainStackNavigator = () => {
    // Hooks
    const colorScheme = useColorScheme();

    return (
        <MainStack.Navigator
            initialRouteName="Home"
            tabBarOptions={{
                showLabel: false,
                style: {
                    backgroundColor: Colors[colorScheme].secondaryBackground,
                },
                activeTintColor: Colors[colorScheme].tint,
            }}>
            <MainStack.Screen
                name="Home"
                component={AccountViewNavigator}
                options={{
                    tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
                }}
            />
            <MainStack.Screen
                name="NewTransaction"
                component={NTNavigator}
                options={{
                    tabBarIcon: () => <NewTransactionButton />,
                }}
            />
            <MainStack.Screen
                name="Settings"
                component={SettingsViewNavigator}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons
                            size={30}
                            style={{ marginBottom: -3 }}
                            name="settings"
                            color={color}
                        />
                    ),
                }}
            />
        </MainStack.Navigator>
    );
};

const TabBarIcon = (props: { name: string; color: string }) => {
    return <MaterialCommunityIcons size={30} style={{ marginBottom: -3 }} {...props} />;
};

export default MainStackNavigator;
