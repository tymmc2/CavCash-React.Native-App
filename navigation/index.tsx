import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";

import { RootStackParamList } from "../types";
import MainStackNavigator from "./MainStackNavigator";
import StartStackNavigator from "./StartStackNavigator";

const Navigation = ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
    return (
        <NavigationContainer theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <RootNavigator />
        </NavigationContainer>
    );
};

const RootStack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
    return (
        <RootStack.Navigator mode="modal" screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="Start" component={StartStackNavigator} />
            <RootStack.Screen name="Main" component={MainStackNavigator} />
        </RootStack.Navigator>
    );
};

export default Navigation;
