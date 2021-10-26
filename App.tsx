import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { AsyncStorage } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { createStore, compose, applyMiddleware } from "redux";
import { Provider as ReduxProvider, useSelector } from "react-redux";
import thunk from "redux-thunk";
import { offline } from "@redux-offline/redux-offline";
import offlineConfig from "@redux-offline/redux-offline/lib/defaults";
import { SERVER_ADDRESS, MASTER_KEY } from "@env";
import SplashScreen from "react-native-splash-screen";
import messaging from "@react-native-firebase/messaging";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import rootReducer from "./redux/reducers/rootReducer";
import Alert from "./components/custom/alert";
import Loader from "./components/custom/loader";

/**
 * Main React.Native Application function.
 */
export default function App() {
    // Hooks
    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();

    // Remove splash screen on finished loading.
    useEffect(() => {
        try {
            requestUserPermission();
            SplashScreen.hide();
        } catch {
            console.log("no splash");
        }
    }, []);

    // Get FCM information.
    useEffect(() => {
        messaging().registerDeviceForRemoteMessages();
        messaging()
            .subscribeToTopic("transactions")
            .then(() => console.log("Subscribed to topic!"));

        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log(
                "Notification caused app to open from background state:",
                remoteMessage.notification
            );
        });

        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log(
                        "Notification caused app to open from quit state:",
                        remoteMessage.notification
                    );
                }
            });
    }, []);

    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();

        if (authStatus) {
            console.log("Authorization status:", authStatus);
        }
    }

    const store = createStore(rootReducer, compose(offline(offlineConfig), applyMiddleware(thunk)));

    useEffect(() => {
        console.log("Current server address: " + SERVER_ADDRESS);
        AsyncStorage.setItem("browserid", MASTER_KEY);
    }, []);

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <ReduxProvider store={store}>
                <PaperProvider>
                    <Navigation colorScheme={colorScheme} />
                    <StatusBar />
                    <Overlay />
                </PaperProvider>
            </ReduxProvider>
        );
    }
}

const Overlay = () => {
    const alert = useSelector(state => state.alerts.currentAlert);
    const loader = useSelector(state => state.alerts.currentLoader);
    return (
        <>
            <Alert {...alert} />
            <Loader {...loader} />
        </>
    );
};
