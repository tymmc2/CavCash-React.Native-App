import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { APP_ID } from "@env";
import { StyleSheet, ScrollView, AsyncStorage } from "react-native";

import { Text, View } from "../../components/Themed";
import AccountDetail from "../../components/dashboard/account-detail/account-detail";
import SmallTransactionGroup from "../../components/dashboard/transactions/transaction-groups/small-group/small-transaction-group";
import useColorScheme from "../../hooks/useColorScheme";
import Colors from "../../constants/Colors";
import { fetchTransactionsFailure } from "../../redux/actions/transactions";
import { fetchTransactions } from "../../redux/reducers/transactionsReducer";
import { fetchUserInfo } from "../../redux/reducers/userInfoReducer";
import { saveReport } from "../../redux/actions/userInfo";
import { MONTHLY_REPORT } from '../../constants/Endpoints';

/**
 * AccountView is the home page for the application. This is where all information
 * for the user's account is shown and is the first page they see after login.
 * 
 * @param props properties for this view
 */
const AccountView = (props: { navigation: any }) => {
    // Hooks
    const colorScheme = useColorScheme();
    const dispatch = useDispatch();

    // Redux state variables
    const USER_INFO = useSelector(state => state.userInfo.userInfo);
    const SESSION_ID = useSelector(state => state.userInfo.sessionId);
    const AMOUNT_RECEIVED = useSelector(state => state.userInfo.amountReceived);
    const AMOUNT_SENT = useSelector(state => state.userInfo.amountSent);
    const IS_LOADING = useSelector(state => state.transactions.loading);

    // Local state variables
    const [reportLoading, setReportLoading] = useState(true);

    /**
     * Fetches 30 day report for money spent and received.
     */
    const getMonthlyReport = async () => {
        setReportLoading(true);

        const today = new Date();
        const todayDay = today.getDate();
        const DD = String(todayDay).padStart(2, "0");
        const MM = String(today.getMonth() + 1).padStart(2, "0");
        const YYYY = today.getFullYear();
        const startDate = `${YYYY}-${MM}-${DD}`;

        await fetchGraphData(startDate);
    };

    /**
     * Actual function that fetches the data from the server to feed into the client.
     *
     * @param startDate date to start 30 days from (usually current date)
     */
    const fetchGraphData = async (startDate: String) => {
        const AUTH_TOKEN = await AsyncStorage.getItem("browserid");

        const HEADERS = { Authorization: AUTH_TOKEN, "Application-Identifier": APP_ID };
        const REQUEST_OPTIONS = {
            headers: HEADERS,
        };

        const URL = `${MONTHLY_REPORT}/${USER_INFO.accountID}/${SESSION_ID}?startDate=${startDate}&days=31`;

        fetch(URL, REQUEST_OPTIONS)
            .then(handleSuccess)
            .catch(handleError);
    };

    /**
     * Handles success on loading monthly report.
     * 
     * @param response response from server
     */
    const handleSuccess = async (response: any) => {
        const REPORT = await response.json();
        // const report = [{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":5.0,"amountRecieved":10.0,"netAmount":5.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0},{"amountSent":0.0,"amountRecieved":0.0,"netAmount":0.0}];
        var amountSent = 0.0;
        var amountReceived = 0.0;

        REPORT.map((item: { amountSent: number; amountRecieved: number }) => {
            amountSent += item.amountSent;
            amountReceived += item.amountRecieved;
        });

        dispatch(
            saveReport({
                report: REPORT,
                amountSent: amountSent,
                amountReceived: amountReceived,
            })
        );
        setReportLoading(false);
    }

    /**
     * Handles error on loading monthly report.
     */
    const handleError = () => {
        dispatch(
            saveReport({
                report: null,
                amountSent: 0.0,
                amountReceived: 0.0,
            })
        );
        setReportLoading(false);
    }

    /**
     * Fetches data for this view when opened.
     */
    useEffect(() => {
        getMonthlyReport();
        dispatch(fetchTransactions(USER_INFO.accountID, SESSION_ID, 3, IS_LOADING));
    }, []);

    /**
     * Attempts to update this view whenever USER_INFO is modified.
     * Ex. when balance changes after making a transaction
     */
    useEffect(() => { }, [USER_INFO]);

    return (
        <ScrollView
            style={{ flex: 1, padding: 15, backgroundColor: Colors[colorScheme].background }}>
            <Text style={styles.welcome}>Welcome back, {USER_INFO.firstName}</Text>
            <AccountDetail
                color="rgb(0, 123, 255)"
                title="Account balance"
                icon="cash-usd"
                detail={`$${Number(
                    USER_INFO && USER_INFO.balance ? USER_INFO.balance : 0.0
                ).toLocaleString("en-us", { minimumFractionDigits: 2 })}`}
            />
            <AccountDetail
                color="rgb(255, 69, 58)"
                loading={reportLoading}
                title="Sent this month"
                icon="trending-down"
                detail={`$${Number(AMOUNT_SENT ? AMOUNT_SENT : 0.0).toLocaleString("en-us", {
                    minimumFractionDigits: 2,
                })}`}
            />
            <AccountDetail
                color="rgb(48, 209, 88)"
                loading={reportLoading}
                title="Received this month"
                icon="trending-up"
                detail={`$${Number(AMOUNT_RECEIVED ? AMOUNT_RECEIVED : 0.0).toLocaleString(
                    "en-us",
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                )}`}
            />
            <SmallTransactionGroup navigation={props.navigation} />
        </ScrollView>
    );
};

// Styles for AccountView
const styles = StyleSheet.create({
    text: {
        color: "red",
    },
    welcome: {
        fontFamily: "OpenSans",
        fontSize: 25,
        textAlign: "center",
        marginTop: 10,
        marginBottom: 10,
    },
});

export default AccountView;
