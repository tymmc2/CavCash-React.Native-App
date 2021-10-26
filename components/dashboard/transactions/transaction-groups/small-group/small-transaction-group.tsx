import React, { useEffect } from "react";
import Card from "../../../../custom/card/Card";
import { StyledText } from "../../../../StyledText";
import TransactionCell from "../../transaction-cell/transaction-cell";
import { StyleSheet, View } from "react-native";
import Colors from "../../../../../constants/Colors";
import useColorScheme from "../../../../../hooks/useColorScheme";
import Col from "../../../../custom/col/Col";
import { useSelector } from "react-redux";
import TextButton from "../../../../custom/button";

/**
 * SmallTransactionGroup is designed to hold TransactionCells in a
 * small amount on the home page.
 * 
 * @param props properties for this component.
 */
const SmallTransactionGroup = (props: { navigation: any }) => {
    // Redux state variables
    const transactionList = useSelector(state => state.transactions.transactionList);

    return (
        <Card style={{ padding: 20, paddingTop: 15, paddingBottom: 15, marginBottom: 40 }}>
            <StyledText style={styles().title}>Recent transactions</StyledText>
            <View style={styles().line} />
            {transactionList ? (
                transactionList
                    .slice(0, 3)
                    .map(item => (
                        <TransactionCell navigation={props.navigation} transaction={item} />
                    ))
            ) : (
                <>
                    <TransactionCell />
                    <TransactionCell />
                    <TransactionCell />
                </>
            )}
            <View style={styles().line} />
            <Col>
                <TextButton
                    color={"rgb(0, 123, 255)"}
                    onPress={() => props.navigation.navigate("TransactionsView")}>
                    VIEW MORE
                </TextButton>
            </Col>
        </Card>
    );
};

// Styles for this component
const styles = () => {
    const colorScheme = useColorScheme();
    return StyleSheet.create({
        title: {
            fontSize: 20,
        },
        line: {
            backgroundColor: `${Colors[colorScheme].separatorColor}`,
            height: 1,
            width: "100%",
            marginTop: 10,
            marginBottom: 10,
        },
    });
};

export default SmallTransactionGroup;
