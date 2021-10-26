import React, { useState, useEffect, useCallback } from "react";
import { ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { APP_ID } from "@env";
import { PlaidLink, LinkSuccess, LinkExit } from "react-native-plaid-link-sdk";
import { AsyncStorage } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import SettingGroup from "../../components/settings/setting-group/SettingGroup";
import InteractCell from "../../components/settings/interact-cell/InteractCell";
import useColorScheme from "../../hooks/useColorScheme";
import Colors from "../../constants/Colors";
import TextCell from "../../components/settings/text-cell/TextCell";
import { addLoader, clearLoader, addAlert, clearAlerts } from "../../redux/actions/alert";
import { updateBankInfo, loggedOut } from "../../redux/actions/userInfo";
import {
    WEBSITE_URL,
    GET_PLAID_TOKEN,
    SEND_BANK_DETAILS_END,
    SEND_BANK_DETAILS_FRONT,
} from "../../constants/Endpoints";

/**
 * CavCash Account settings page.
 * 
 * @param props properties for this view
 */
const AccountSettings = (props: { navigation: any }) => {
    // Hooks
    const colorScheme = useColorScheme();
    const dispatch = useDispatch();

    // Redux state variables
    const USER_INFO = useSelector((state: any) => state.userInfo.userInfo);
    const SESSION_ID = useSelector((state: any) => state.userInfo.sessionId);

    // Local state variables
    const [linkToken, setLinkToken] = useState("");

    // Fetches link token if there is not already a linked bank
    useEffect(() => {
        if (!USER_INFO.linkedBank) {
            fetchLinkToken();
        }
    }, []);

    /**
     * Runs when a user successfully attempts to connect their bank account.
     * This then sends the bank details to the CavCash server for usage in the
     * back-end with Dwolla.
     */
    const onPlaidSuccess = useCallback(async (success: LinkSuccess) => {
        const AUTH_TOKEN = await AsyncStorage.getItem("browserid");
        const METADATA = success.metadata;
        const TOKEN = success.publicToken;
        const BODY = {
            institution: METADATA.institution.name,
            type: METADATA.accounts[0].subtype,
            accountID: METADATA.accounts[0].id,
            publicToken: TOKEN,
        };

        const HEADERS = {
            Authorization: AUTH_TOKEN,
            "Application-Identifier": APP_ID,
            "Content-Type": "application/json",
        };
        const REQUEST_OPTIONS = {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify(BODY),
        };

        dispatch(addLoader());

        const URL = `${SEND_BANK_DETAILS_FRONT}/${encodeURIComponent(
            USER_INFO.accountID
        )}/${encodeURIComponent(SESSION_ID)}/${SEND_BANK_DETAILS_END}`;

        await fetch(URL, REQUEST_OPTIONS)
            .then(async response => await handleSendBankSuccess(response, METADATA))
            .catch(handleSendBankError);
    }, []);

    /**
     * Handle sending bank details to server on success.
     * 
     * @param response response from server
     * @param metadata metadata for plaid
     */
    const handleSendBankSuccess = async (response: any, metadata: any) => {
        const data = await response;

        if (!response.ok) throw response;

        const bankInfo = {
            institution: metadata.institution.name,
            type: metadata.accounts[0].subtype,
        };
        dispatch(clearLoader());
        const props = {
            title: "Successfully linked your bank to your CavCash Account!",
            hideAlert: () => dispatch(clearAlerts()),
            body: "",
            visible: true,
        };
        dispatch(addAlert(props));
        dispatch(updateBankInfo(bankInfo));
    };

    /**
     * Handle sending bank details to server on failure.
     * 
     * @param error error received from server
     */
    const handleSendBankError = (error: any) => {
        dispatch(clearLoader());
        try {
            error.text().then((text: any) => {
                const data = JSON.parse(text);
                const props = {
                    title: "Uh oh!",
                    hideAlert: () => dispatch(clearAlerts()),
                    body: data.ErrorMessage,
                    visible: true,
                };
                console.log(data);
                dispatch(addAlert(props));
            });
        } catch (e) {
            const props = {
                title: "Oops!",
                hideAlert: () => dispatch(clearAlerts()),
                body:
                    "An unknown error occurred. Please contact CavCash administrators immediately. This should not have happened.",
                visible: true,
            };
            dispatch(addAlert(props));
        }
    };

    /**
     * Fetches link token from server
     */
    const fetchLinkToken = async () => {
        const AUTH_TOKEN = await AsyncStorage.getItem("browserid");
        const REQUEST_OPTIONS = {
            method: "POST",
            headers: { Authorization: AUTH_TOKEN, "Application-Identifier": APP_ID },
        };

        const URL = `${GET_PLAID_TOKEN}/${USER_INFO.accountID}/${SESSION_ID}`;

        fetch(URL, REQUEST_OPTIONS)
            .then(handleLinkTokenSuccess)
            .catch(handleLinkTokenError);
    };

    /**
     * Handles link token response from server and saves it.
     * 
     * @param response response from server
     */
    const handleLinkTokenSuccess = async (response: any) => {
        if (!response.ok) throw response;

        const data = await response.json();
        setLinkToken(data.link_token);
    };

    /**
     * Handles link token response error from server.
     * 
     * @param error error from server
     */
    const handleLinkTokenError = (error: any) => {
        try {
            error.text().then(text => {
                try {
                    const data = JSON.parse(text);
                    console.log(data);
                    if (error && data.HttpCode === 401) {
                        dispatch(loggedOut());
                        props.navigation.reset({ index: 0, routes: [{ name: "Start" }] });
                    } else {
                        const props = {
                            title: "Uh oh!",
                            hideAlert: () => dispatch(clearAlerts()),
                            body: data.ErrorMessage,
                            visible: true,
                        };
                        dispatch(addAlert(props));
                    }
                } catch (e) {
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
        <ScrollView
            style={{ flex: 1, padding: 15, backgroundColor: Colors[colorScheme].background }}>
            <SettingGroup title="ACCOUNT DETAILS" editable>
                <TextCell
                    text="Full name"
                    detail={`${USER_INFO.firstName} ${USER_INFO.lastName}`}
                />
                <TextCell
                    text="Phone number"
                    detail={USER_INFO.phoneNumber ? USER_INFO.phoneNumber : "No phone attached"}
                />
                <TextCell
                    text="Home address"
                    detail={`${USER_INFO.homeAddress.streetAddress}, ${USER_INFO.homeAddress.state}`}
                />
                <TextCell text="Birthday" detail={new Date(USER_INFO.birthDate).toDateString()} />
            </SettingGroup>
            <SettingGroup title="BANK">
                {USER_INFO.linkedBank ? (
                    <>
                        <TextCell
                            text={USER_INFO.linkedBank.institution}
                            detail={USER_INFO.linkedBank.type}
                        />
                        <InteractCell
                            color="rgb(0, 123, 255)"
                            text="Deposit or withdraw funds"
                            onPress={() =>
                                props.navigation.push("ModifyFunds", {
                                    uri: `${WEBSITE_URL}/signin?accountId=${USER_INFO.accountID}&sessionId=${SESSION_ID}&funds=true`,
                                })
                            }
                        />
                    </>
                ) : linkToken ? (
                    <PlaidLink
                        tokenConfig={{
                            token: linkToken,
                        }}
                        onSuccess={(success: LinkSuccess) => {
                            onPlaidSuccess(success);
                        }}
                        onExit={(exit: LinkExit) => {
                            console.log(exit);
                        }}>
                        <InteractCell
                            onPress={() => console.log("launching plaid")}
                            color="rgb(0, 123, 255)"
                            text="Link your bank to CavCash"
                        />
                    </PlaidLink>
                ) : (
                    <SkeletonPlaceholder
                        backgroundColor={Colors[colorScheme].background}
                        highlightColor={Colors[colorScheme].tint}>
                        <SkeletonPlaceholder.Item width={250} height={20} borderRadius={15} />
                    </SkeletonPlaceholder>
                )}
            </SettingGroup>
        </ScrollView>
    );
};

export default AccountSettings;
