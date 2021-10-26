import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import { StartStackParamList } from "../types";
import SigninView from "../screens/signin/SigninView";
import {
    LegalView,
    PrivacyView,
    ResetPassword,
    SignUpView,
    TermsView,
} from "../screens/signin/WebViews";

const StartStack = createStackNavigator<StartStackParamList>();

const StartStackNavigator = () => (
    <StartStack.Navigator
        screenOptions={{
            headerShown: false,
            headerStyle: {
                backgroundColor: "#e05d4d",
            },
            headerTitleStyle: {
                fontSize: 20,
            },
            headerTintColor: "#fff",
        }}>
        <StartStack.Screen name="Root" component={SigninView} />
        <StartStack.Screen
            name="SignUp"
            component={SignUpView}
            options={{ headerShown: true, title: "Sign up" }}
        />
        <StartStack.Screen
            name="Reset"
            component={ResetPassword}
            options={{ headerShown: true, title: "Reset" }}
        />
        <StartStack.Screen
            name="Legal"
            component={LegalView}
            options={{ headerShown: true, title: "Legal" }}
        />
        <StartStack.Screen
            name="Privacy"
            component={PrivacyView}
            options={{ headerShown: true, title: "Privacy Policy" }}
        />
        <StartStack.Screen
            name="Terms"
            component={TermsView}
            options={{ headerShown: true, title: "Terms of Service" }}
        />
    </StartStack.Navigator>
);

export default StartStackNavigator;
