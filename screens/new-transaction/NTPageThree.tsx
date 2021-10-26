import React, { useRef, useState, useEffect } from "react";
import { AsyncStorage } from "react-native";
import InputScrollView from "react-native-input-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import { APP_ID, PROCESSING_TERMINAL_ID } from "@env";

import useColorScheme from "../../hooks/useColorScheme";
import Colors from "../../constants/Colors";
import { fetchTransactions } from "../../redux/reducers/transactionsReducer";
import { fetchUserInfo } from "../../redux/reducers/userInfoReducer";
import { loggedOut } from "../../redux/actions/userInfo";
import { addAlert, clearAlerts, addLoader, clearLoader } from "../../redux/actions/alert";
import Col from "../../components/custom/col/Col";
import Row from "../../components/custom/row/Row";
import { StyledText } from "../../components/StyledText";
import Card from "../../components/custom/card/Card";
import TextButton from "../../components/custom/button";
import TextField from "../../components/custom/text-input";
import SettingGroup from "../../components/settings/setting-group/SettingGroup";
import TextCell from "../../components/settings/text-cell/TextCell";
import { NT_STYLES } from "./NTPageOne";
import { GET_FEE, SEND_MONEY } from "../../constants/Endpoints";

/**
 * Final page for making a new transaction, involves password and
 * double checking all details of the transaction. This includes
 * all info from prior pages and fees.
 * 
 * @param props properties for this view
 */
const NTPageThree = (props: { navigation: any }) => {
    // Hooks
    const dispatch = useDispatch();
    const colorScheme = useColorScheme();

    // Redux state variables
    const ACCOUNT_ID = useSelector(state => state.userInfo.userInfo.accountID);
    const SESSION_ID = useSelector(state => state.userInfo.sessionId);
    const IS_LOADING = useSelector(state => state.transactions.loading);
    const NEW_TRANSACTION = useSelector(state => state.newTransaction);

    // Local state variables
    const [password, setPassword] = useState("");
    const [cavCashFee, setCavCashFee] = useState(0.0);
    const [charityFee, setCharityFee] = useState(0.0);
    const [fee, setFee] = useState(0.0);

    // References
    const passwordRef = useRef();

    /**
     * Gets fee for the amount given on page two.
     */
    const getFee = async () => {
        const AUTH_TOKEN = await AsyncStorage.getItem("browserid");
        dispatch(addLoader());
        const headers = {
            Authorization: AUTH_TOKEN,
            "Application-Identifier": APP_ID,
            "Content-Type": "application/json",
        };
        const REQUEST_OPTIONS = {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                amount: Number(NEW_TRANSACTION.amount),
                fromID: ACCOUNT_ID,
                toID: NEW_TRANSACTION.toID,
                description: NEW_TRANSACTION.description,
                deviceUsedID: null,
                processingTerminalID: PROCESSING_TERMINAL_ID,
            }),
        };
        const URL = `${GET_FEE}/${encodeURIComponent(ACCOUNT_ID)}/${encodeURIComponent(SESSION_ID)}?isBank=true`;

        fetch(URL, REQUEST_OPTIONS)
            .then(handleFeeSuccess)
            .catch(handleFeeError);
    };

    /**
     * Handles get fee success from server.
     * 
     * @param response response from server
     */
    const handleFeeSuccess = async (response: any) => {
        try {
            const data = await response.json();
            if (!response.ok) {
                throw response;
            }

            const cavCashFee = data.cavCashFee;
            const charityFee = data.charityFee ? data.charityFee.amount : 0.0;
            setCavCashFee(cavCashFee);
            setCharityFee(charityFee);
            setFee(cavCashFee + charityFee);
            dispatch(clearLoader());
        } catch (e) {
            return Promise.reject(response);
        }
    }

    /**
     * Handles get fee error from server.
     * 
     * @param error error from server
     */
    const handleFeeError = (error: any) => {
        if (error.statusCode === 401) {
            dispatch(loggedOut());
            props.navigation.reset({ index: 0, routes: [{ name: "Main" }] });
        }
        dispatch(clearLoader());
        setFee(0.0);
    }

    useEffect(() => {
        getFee();
    }, [props.navigation]);

    /**
     * Handles send money button and executes send money on success.
     */
    const onSubmit = () => {
        if (!password.replace(/ /g, "")) {
            const props = {
                title: "Hold up!",
                body: "You're missing a field!",
                hideAlert: () => dispatch(clearAlerts()),
                visible: true,
            };
            dispatch(addAlert(props));
        } else {
            sendMoney();
        }
    };

    /**
     * Sends money to given user through the back-end.
     */
    const sendMoney = () => {
        const URL = `${SEND_MONEY}/${ACCOUNT_ID}/${password}`;
        const BODY = {
            fromID: ACCOUNT_ID,
            toID: NEW_TRANSACTION.toID,
            amount: NEW_TRANSACTION.amount,
            description: NEW_TRANSACTION.description,
            deviceUsedID: null,
            processingTerminalID: PROCESSING_TERMINAL_ID,
            locationOccurred: "Online",
        };
        sendRequest(URL, BODY, props.navigation);
    };

    /**
     * Sends the request to the back-end.
     * 
     * @param url url to call
     * @param body request body
     * @param navigation this navigation stack
     */
    const sendRequest = async (url: any, body: any, navigation: any) => {
        dispatch(addLoader());
        const AUTH_TOKEN = await AsyncStorage.getItem("browserid");
        const HEADERS = {
            Authorization: AUTH_TOKEN,
            "Application-Identifier": APP_ID,
            "Content-Type": "application/json",
        };
        const REQUEST_OPTIONS = {
            method: "POST",
            body: JSON.stringify(body),
            headers: HEADERS,
        };

        fetch(url, REQUEST_OPTIONS)
            .then(async response => await handleSendMoneySuccess(response, navigation))
            .catch(handleSendMoneyError);
    };

    /**
     * Handles send money response from server.
     * 
     * @param response response from server
     * @param navigation this navigation stack
     */
    const handleSendMoneySuccess = async (response: any, navigation: any) => {
        if (!response.ok) {
            throw response;
        }

        const successMessage = `Sent $${Number(NEW_TRANSACTION.amount).toLocaleString("en-us", {
            minimumFractionDigits: 2,
        })} to ${NEW_TRANSACTION.toID}!`;
        dispatch(clearLoader());

        const alertProps = {
            title: "Success!",
            body: successMessage,
            hideAlert: () => {
                dispatch(clearAlerts());
                navigation.popToTop();
            },
            visible: true,
        };

        // Fetch new transactions and updated user info
        dispatch(fetchTransactions(ACCOUNT_ID, SESSION_ID, 5, IS_LOADING));
        dispatch(fetchUserInfo(ACCOUNT_ID, SESSION_ID));
        dispatch(addAlert(alertProps));
    };

    /**
     * Handles send money error from server.
     * 
     * @param error error from server
     */
    const handleSendMoneyError = (error: any) => {
        dispatch(clearLoader());
        try {
            error.text().then((text: any) => {
                try {
                    const data = JSON.parse(text);
                    console.log(data);
                    if (error && data.HttpCode === 401) {
                        dispatch(loggedOut());
                        props.navigation.reset({ index: 0, routes: [{ name: "Main" }] });
                    } else {
                        const props = {
                            title: "Uh oh!",
                            hideAlert: () => dispatch(clearAlerts()),
                            body: data.ErrorMessage,
                            visible: true,
                        };
                        dispatch(addAlert(props));
                    }
                } catch {
                    dispatch(
                        addAlert({
                            title: "Oops!",
                            hideAlert: () => dispatch(clearAlerts()),
                            body:
                                "An unknown error has occurred, please contact CavCash administrators for assistance.",
                            visible: true,
                        })
                    );
                }
            });
        } catch {
            dispatch(
                addAlert({
                    title: "Oops!",
                    hideAlert: () => dispatch(clearAlerts()),
                    body:
                        "An unknown error has occurred, please contact CavCash administrators for assistance.",
                    visible: true,
                })
            );
        }
    };

    return (
        <InputScrollView style={{ backgroundColor: Colors[colorScheme].background }}>
            <Row>
                <Col>
                    <Card style={{ backgroundColor: Colors[colorScheme].tint }}>
                        <Col style={{ alignItems: "center" }}>
                            <Card style={NT_STYLES.icon}>
                                <StyledText style={NT_STYLES.iconText}>{"$"}</StyledText>
                            </Card>
                            <StyledText
                                style={{
                                    fontSize: 20,
                                    alignSelf: "center",
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                    color: "white",
                                }}>
                                Sending to {NEW_TRANSACTION.toID}
                            </StyledText>
                        </Col>
                    </Card>
                </Col>
            </Row>
            <Col>
                <SettingGroup title={"TRANSACTION INFORMATION"}>
                    <TextCell
                        text="Amount sending"
                        detail={`$${Number(NEW_TRANSACTION.amount).toLocaleString("en-us", {
                            minimumFractionDigits: 2,
                        })}`}
                    />
                    <TextCell
                        text="Your fee"
                        detail={`$${Number(cavCashFee).toLocaleString("en-us", {
                            minimumFractionDigits: 2,
                        })}`}
                    />
                    {charityFee && Number(charityFee) !== 0.0 ? (
                        <TextCell
                            text="Charity donation"
                            detail={`$${Number(charityFee).toLocaleString("en-us", {
                                minimumFractionDigits: 2,
                            })}`}
                        />
                    ) : null}
                    <TextCell
                        text="Total"
                        detail={`$${Number(
                            Number(fee) + Number(NEW_TRANSACTION.amount)
                        ).toLocaleString("en-us", { minimumFractionDigits: 2 })}`}
                    />
                </SettingGroup>
                <SettingGroup title={"NOTE"}>
                    <TextCell text={NEW_TRANSACTION.description} />
                </SettingGroup>
                <SettingGroup title={"CONFIRM TRANSACTION"}>
                    <TextField
                        style={{ marginBottom: 20 }}
                        secureTextEntry={true}
                        autoCompleteType={"password"}
                        value={password}
                        onChangeText={(text: any) => setPassword(text)}
                        label="Enter password"
                        onSubmitEditing={onSubmit}
                        returnKeyType={"send"}
                        ref={passwordRef}
                    />
                    <TextButton
                        onPress={onSubmit}
                        color={"rgb(0, 123, 255)"}
                        contentStyle={{ borderRadius: 15, padding: 10 }}>
                        Send money
                    </TextButton>
                </SettingGroup>
            </Col>
        </InputScrollView>
    );
};

export default NTPageThree;
