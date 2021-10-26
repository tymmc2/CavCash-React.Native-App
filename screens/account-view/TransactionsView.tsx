import React, { useEffect, useState } from "react";
import { SectionList, StyleSheet, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { fetchTransactions } from "../../redux/reducers/transactionsReducer";
import TransactionCell from "../../components/dashboard/transactions/transaction-cell/transaction-cell";
import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";
import Row from "../../components/custom/row/Row";
import Col from "../../components/custom/col/Col";
import { StyledText } from "../../components/StyledText";

/**
 * TransactionsView shows all and only transactions on one page for the user.
 * 
 * @param props properties for this view
 */
const TransactionsView = (props: { navigation: any }) => {
    // Constants
    const MAX_TRANSACTION_LENGTH = 10;
    const GET_TRANSACTIONS_AMT = 15;
    const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const MONTHS = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    // Hooks
    const dispatch = useDispatch();
    const colorScheme = useColorScheme();
    const st = styles();

    // Redux state variables
    const ACCOUNT_ID = useSelector(state => state.userInfo.userInfo.accountID);
    const SESSION_ID = useSelector(state => state.userInfo.sessionId);
    const TRANSACTIONS = useSelector(state => state.transactions.transactionList);
    const IS_LOADING = useSelector(state => state.transactions.loading);
    const ERROR = useSelector(state => state.transactions.error);
    const DONE_LOADING = useSelector(state => state.transactions.loadedAllContent);

    // Local state variables
    const [loading, setLoading] = useState(false);
    const [styledTransactions, setStyledTransactions] = useState(new Array());

    /**
     * Gets the GET_TRANSACTIONS_AMT most recent transactions.
     */
    const getTransactions = () => {
        if (!IS_LOADING) {
            dispatch(fetchTransactions(ACCOUNT_ID, SESSION_ID, GET_TRANSACTIONS_AMT, IS_LOADING));
        }
    };

    /**
     * Runs the getTransactions() function everytime this page loads
     * for up to date information.
     */
    useEffect(() => {
        getTransactions();
    }, []);

    /**
     * Sorts the transactions everytime it is updated to ensure proper
     * order.
     */
    useEffect(() => {
        if (TRANSACTIONS) {
            styleTransactions(TRANSACTIONS);
        }
    }, [TRANSACTIONS]);

    /**
     * Fetches GET_TRANSACTIONS_AMT more transactions and adds them
     * to the view
     */
    const fetchMoreTransactions = async () => {
        if (!DONE_LOADING && !IS_LOADING && !loading
            && TRANSACTIONS.length >= MAX_TRANSACTION_LENGTH) {
            setLoading(true);
            await dispatch(
                fetchTransactions(
                    ACCOUNT_ID,
                    SESSION_ID,
                    GET_TRANSACTIONS_AMT,
                    IS_LOADING,
                    TRANSACTIONS[TRANSACTIONS.length - 1].transactionID
                )
            );
            setLoading(false);
        }
    };

    /**
     * Styles/orders transactions so that the content is understandable for the end user.
     * Mainly the date becomes readable and also orders the transactions into groups
     * based on the date.
     * 
     * @param transactions transactions to style/order
     */
    const styleTransactions = (transactions: any) => {
        var items = new Array();

        transactions.map((transaction: any) => {
            const DATE = new Date(transaction.dateOccurred);
            const STYLED_DATE = `${WEEKDAYS[DATE.getDay()]}, ${MONTHS[DATE.getMonth()]} ${DATE.getDate()}, ${DATE.getFullYear()}`.toUpperCase();
            var found = false;

            items.map(item => {
                // TODO: check this
                // Checks in items and styledTransactions to prevent duplicates
                if (!items.includes(transaction) && !styledTransactions.includes(transaction)
                    && item.title == STYLED_DATE) {
                    item.data.push(transaction);
                    found = true;
                }
            });

            if (!found) items.push({ title: STYLED_DATE, data: [transaction] });
        });

        setStyledTransactions(items);
    };

    return styledTransactions.length > 0 ? (
        <SectionList
            contentContainerStyle={{
                backgroundColor: Colors[colorScheme].background
            }}
            sections={styledTransactions}
            onEndReachedThreshold={0.9}
            keyExtractor={(item, index) => item + index}
            onEndReached={fetchMoreTransactions}
            renderSectionHeader={({ section: { title } }) => (
                <View style={st.section}>
                    <Row>
                        <Col style={{ alignItems: "center" }}>
                            <StyledText>{title}</StyledText>
                        </Col>
                    </Row>
                </View>
            )}
            renderItem={({ item }) => (
                <TransactionCell navigation={props.navigation} transaction={item} />
            )}
        />
    ) : ERROR ? (
        <StyledText style={{ fontSize: 20, textAlign: "center", marginTop: 40 }}>
            Failed to load transactions
        </StyledText>
    ) : (
        <StyledText style={{ fontSize: 20, textAlign: "center", marginTop: 40 }}>
            No transactions found
        </StyledText>
    );
};

// Styles for the view
const styles = () => {
    const colorScheme = useColorScheme();

    return StyleSheet.create({
        section: {
            backgroundColor: Colors[colorScheme].tertiaryBackground,
            padding: 10
        }
    });
};

export default TransactionsView;
