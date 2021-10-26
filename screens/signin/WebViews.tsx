import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

import Card from "../../components/custom/card/Card";
import Col from "../../components/custom/col/Col";
import Row from "../../components/custom/row/Row";
import InteractCell from "../../components/settings/interact-cell/InteractCell";
import SettingGroup from "../../components/settings/setting-group/SettingGroup";
import Colors from "../../constants/Colors";
import { WEBSITE_URL } from "../../constants/Endpoints";
import useColorScheme from "../../hooks/useColorScheme";

export const SignUpView = () => {
    return <WebView source={{ uri: `${WEBSITE_URL}/signup` }} />;
};

export const ResetPassword = () => {
    return <WebView source={{ uri: `${WEBSITE_URL}/reset` }} />;
};

export const LegalView = (props: { navigation: any }) => {
    const colorScheme = useColorScheme();
    return (
        <View style={{ backgroundColor: Colors[colorScheme].background, height: "100%" }}>
            <Row style={{ height: "80%" }}>
                <View style={{ alignSelf: "center", flexGrow: 1 }}>
                    <Col style={{ flexGrow: 0 }}>
                        <Card style={{ flexGrow: 1, paddingBottom: 0 }}>
                            <Col>
                                <SettingGroup title="LEGAL">
                                    <InteractCell
                                        text="Privacy Policy"
                                        onPress={() => props.navigation.push("Privacy")}
                                    />
                                    <InteractCell
                                        text="Terms of service"
                                        onPress={() => props.navigation.push("Terms")}
                                    />
                                </SettingGroup>
                            </Col>
                        </Card>
                    </Col>
                </View>
            </Row>
        </View>
    );
};

export const PrivacyView = () => {
    return <WebView source={{ uri: `${WEBSITE_URL}/privacy` }} />;
};

export const TermsView = () => {
    return <WebView source={{ uri: `${WEBSITE_URL}/terms` }} />;
};

export const ModifyFunds = (props: { navigation: any; route: any }) => {
    console.log(props.route.params.uri);
    return <WebView source={{ uri: props.route.params.uri }} />;
};
