import React, { useState, useEffect } from "react";
import { Button } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { ScrollView } from "react-native";

import Col from "../../components/custom/col/Col";
import AccountCell from "../../components/settings/account-cell/AccountCell";
import SettingGroup from "../../components/settings/setting-group/SettingGroup";
import SettingCell from "../../components/settings/setting-cell/SettingCell";
import useColorScheme from "../../hooks/useColorScheme";
import Colors from "../../constants/Colors";
import { updateSetting } from "../../redux/actions/settings";
import { loggedOut } from "../../redux/actions/userInfo";
import { clearList } from "../../redux/actions/transactions";

/**
 * Settings page with all settings available.
 * 
 * @param props properties for this view
 */
const SettingsView = (props: { navigation: any }) => {
    // Hooks
    const dispatch = useDispatch();
    const colorScheme = useColorScheme();

    // Redux state variables
    const rem = useSelector(state => state.settings.saveLogin);

    // Local state variables
    const [rememberMe, setRemember] = useState(useSelector(state => state.settings.saveLogin));
    const [notifs, setNotifs] = useState(useSelector(state => state.settings.notifications));

    /**
     * Signs the current user out of their session.
     */
    const signOut = () => {
        dispatch(loggedOut());
        dispatch(clearList());
        props.navigation.reset({ index: 0, routes: [{ name: "Main" }] });
    };

    /**
     * Updates the remember me setting in the redux state.
     */
    const updateRememberMe = () => {
        setRemember((previousState: boolean) => {
            dispatch(updateSetting({ name: "saveLogin", value: !previousState }));
            return !previousState;
        });
    };

    /**
     * Updates the notifications setting in the redux state. (Not implemented)
     */
    const updateNotifs = () => {
        setNotifs((previousState: boolean) => {
            dispatch(updateSetting({ name: 'notifications', value: !previousState }));
            return !previousState;
        });
    }

    return (
        <ScrollView
            style={{ flex: 1, padding: 15, backgroundColor: Colors[colorScheme].background }}>
            <SettingGroup title="ACCOUNT SETTINGS">
                <AccountCell navigation={props.navigation} />
            </SettingGroup>
            <SettingGroup title="APP SETTINGS">
                <SettingCell
                    name="Save login info"
                    state={rememberMe}
                    onChange={updateRememberMe}
                />
            </SettingGroup>
            <Col>
                <Button
                    mode="text"
                    contentStyle={{ height: 50 }}
                    labelStyle={{ fontFamily: "OpenSans", fontSize: 20 }}
                    color={Colors[colorScheme].tint}
                    onPress={signOut}>
                    SIGN OUT
                </Button>
            </Col>
        </ScrollView>
    );
};

export default SettingsView;
