import React, { useEffect, useRef, useState } from "react";
import { View, Image, StatusBar } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { APP_ID } from "@env";
import { AsyncStorage } from "react-native";
import messaging from "@react-native-firebase/messaging";

import Card from "../../components/custom/card/Card";
import Alert from "../../components/custom/alert";
import useColorScheme from "../../hooks/useColorScheme";
import Colors from "../../constants/Colors";
import Col from "../../components/custom/col/Col";
import Row from "../../components/custom/row/Row";
import { loggedIn } from "../../redux/actions/userInfo";
import { clearLoader } from "../../redux/actions/alert";
import { fetchUserInfo } from "../../redux/reducers/userInfoReducer";
import { StyledText } from "../../components/StyledText";
import TextField from "../../components/custom/text-input";
import TextButton from "../../components/custom/button";
import { ADD_DEVICE, AUTH_USER } from "../../constants/Endpoints";

/**
 * Sign in page with other items that do not require an
 * active session.
 * 
 * @param props properties for this view
 */
const SigninView = (props: { navigation: any }) => {
    // Hooks
    const dispatch = useDispatch();
    const colorScheme = useColorScheme();

    // Redux state variables
    const userInfo = useSelector(state => state.userInfo);
    const saveLogin = useSelector(state => state.settings.saveLogin);

    // Local state variables
    const [visible, setVisible] = useState(false);
    const [alertTitle, setTitle] = useState("");
    const [alertBody, setBody] = useState("");
    const [accountId, setAccountId] = useState("");
    const [accountPassword, setAccountPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // References
    const idRef = useRef();
    const passwordRef = useRef();

    /**
     * Signs the user into their account.
     */
    const signIn = async () => {
        setLoading(true);
        const AUTH_TOKEN = await AsyncStorage.getItem("browserid");
        const headers = {
            Authorization: AUTH_TOKEN,
            "Application-Identifier": APP_ID,
            "Content-Type": "application/json",
        };
        const body = {
            accountID: accountId,
            accountPassword: accountPassword,
        };
        const AUTH_REQUEST_OPTIONS = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body),
        };

        fetch(AUTH_USER, AUTH_REQUEST_OPTIONS)
            .then(handleAuthSuccess)
            .catch(handleAuthError);
    };

    /**
     * Handles auth success from server.
     * 
     * @param response response from server.
     */
    const handleAuthSuccess = async (response: any) => {
        const SESSION_DATA = await response.json();

        if (!response.ok) {
            return Promise.reject(response);
        }

        const ACCOUNT_DATA = {
            accountId: accountId,
            sessionId: SESSION_DATA.id,
        };
        await messaging().registerDeviceForRemoteMessages();
        const FCM_TOKEN = await messaging().getToken();
        const AUTH_TOKEN = await AsyncStorage.getItem("browserid");

        const BODY = {
            FriendlyName: "",
            Serial: FCM_TOKEN,
            IsPhone: true,
        };
        const HEADERS = {
            Authorization: AUTH_TOKEN,
            "Application-Identifier": APP_ID,
            "Content-Type": "application/json",
        };
        const DEVICES_REQUEST_OPTIONS = {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify(BODY),
        };

        const URL = `${ADD_DEVICE}/${accountId}/${SESSION_DATA.id}`;

        fetch(URL, DEVICES_REQUEST_OPTIONS).then(response => {
            if (!response.ok) return null;
        });
        setLoading(false);
        dispatch(loggedIn(ACCOUNT_DATA));
        dispatch(fetchUserInfo(ACCOUNT_DATA.accountId, ACCOUNT_DATA.sessionId, props.navigation));
    };

    /**
     * Handles auth error from server.
     * 
     * @param error error received from server.
     */
    const handleAuthError = (error: any) => {
        setLoading(false);
        if (error.status === 401) {
            setTitle("Failed to log you in");
            setBody("It appears you have entered an incorrect password.");
            setVisible(true);
        } else if (error.status === 500) {
            setTitle("Server error");
            setBody(
                "We ask for your patience as we work on a fix. If the issue persists, please contact support."
            );
            setVisible(true);
        } else if (error.status === 404) {
            setTitle("Failed to log you in");
            setBody("This account does not exist. Please check the sign in fields.");
            setVisible(true);
        }
    };

    /**
     * Updates local account id when navigation page changes.
     */
    useEffect(() => {
        if (saveLogin === true) {
            setAccountId(userInfo.accountId);
        }
    }, [props.navigation]);

    /**
     * Clears loaders once this page shows up.
     */
    useEffect(() => {
        dispatch(clearLoader());
    });

    /**
     * Goes to password field from user id field.
     */
    const nextField = () => {
        passwordRef.current.focus();
    };

    return (
        <View style={{ backgroundColor: Colors[colorScheme].background, height: "100%" }}>
            <StatusBar barStyle={"light-content"} />
            <Row style={{ height: "80%" }}>
                <View style={{ alignSelf: "center", flexGrow: 1 }}>
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            display: "flex",
                            flexGrow: 0,
                        }}>
                        <Image
                            style={{ maxWidth: "80%", resizeMode: "contain" }}
                            source={require("../../assets/images/smallLogo-min.png")}
                        />
                    </View>
                    <Col style={{ flexGrow: 0 }}>
                        <Card style={{ flexGrow: 1, paddingBottom: 0 }}>
                            <TextField
                                value={accountId}
                                onChangeText={text => setAccountId(text)}
                                autoCompleteType={"username"}
                                ref={idRef}
                                onSubmitEditing={nextField}
                                returnKeyType={"next"}
                                label="Account ID"
                            />
                            <TextField
                                value={accountPassword}
                                onChangeText={text => setAccountPassword(text)}
                                secureTextEntry={true}
                                autoCompleteType={"password"}
                                ref={passwordRef}
                                label="Account Password"
                                returnKeyType={"go"}
                            />
                            <TextButton
                                loading={loading}
                                mode="contained"
                                onPress={signIn}
                                style={{
                                    borderRadius: 15,
                                    marginTop: 10,
                                    marginBottom: 10,
                                    height: 50,
                                    backgroundColor: Colors[colorScheme].tint,
                                }}
                                labelStyle={{ color: "white", fontSize: 20 }}
                                contentStyle={{ height: 50 }}>
                                Sign in
                            </TextButton>
                        </Card>
                        <Row
                            style={{
                                flexWrap: "wrap",
                                alignSelf: "center",
                                padding: 0,
                                alignItems: "center",
                            }}>
                            <TextButton
                                labelStyle={{ textOverflow: "none", fontSize: 18 }}
                                onPress={() => props.navigation.push("Legal")}
                                style={{ borderRadius: 15 }}>
                                Legal
                            </TextButton>
                            <StyledText style={{ color: Colors[colorScheme].tint }}>|</StyledText>
                            <TextButton
                                labelStyle={{ textOverflow: "none", fontSize: 18 }}
                                onPress={() => props.navigation.push("SignUp")}
                                style={{ borderRadius: 15, marginTop: 0 }}>
                                Sign up
                            </TextButton>
                        </Row>
                        <Row style={{ alignSelf: "center", padding: 0, marginTop: -15 }}>
                            <TextButton
                                labelStyle={{ textOverflow: "none", fontSize: 18 }}
                                onPress={() => props.navigation.push("Reset")}
                                style={{ borderRadius: 15, width: "100%" }}>
                                Forgot password?
                            </TextButton>
                        </Row>
                    </Col>
                </View>
            </Row>
            <Alert
                visible={visible}
                hideAlert={() => setVisible(false)}
                title={alertTitle}
                body={alertBody}
            />
        </View>
    );
};

export default SigninView;
