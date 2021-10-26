import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import TransactionCell from "../../components/dashboard/transactions/transaction-cell/transaction-cell";
import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";
import Row from "../../components/custom/row/Row";
import Col from "../../components/custom/col/Col";
import { StyledText } from "../../components/StyledText";
import SettingGroup from "../../components/settings/setting-group/SettingGroup";
import TextCell from "../../components/settings/text-cell/TextCell";
import Card from "../../components/custom/card/Card";

/**
 * Detail view that pops up on interaction with a TransactionCell. This view
 * displays all information regarding a given transaction.
 * 
 * @param props properties for this view
 * @param navigation current navigation stack
 * @param route current route
 */
const TransactionDetail = (props: { navigation: any; route: any }) => {
    // Constants
    const TRANSACTION = props.route.params.transaction;

    // Hooks
    const colorScheme = useColorScheme();

    // Redux state variables
    const ACCOUNT_ID = useSelector(state => state.userInfo.userInfo.accountID);

    // Current instance variables
    var otherUser;
    var isTransactionSending;
    var transactionTitle = "";

    // Determines if this transaction was sent from the logged in user or not
    if (!TRANSACTION.fromID) {
        otherUser = TRANSACTION.fromBank.institution;
        isTransactionSending = false;
    } else if (!TRANSACTION.toID) {
        otherUser = TRANSACTION.toBank.institution;
        isTransactionSending = true;
    } else {
        isTransactionSending = TRANSACTION.fromID === ACCOUNT_ID;
        otherUser = isTransactionSending ? TRANSACTION.toID : TRANSACTION.fromID;
    }

    // Updates title based on prior results
    transactionTitle = isTransactionSending
        ? `Sent money to ${otherUser}`
        : `Received money from ${otherUser}`;

    return (
        <ScrollView style={{ backgroundColor: Colors[colorScheme].background }}>
            <Col>
                <View>
                    <Card>
                        <Col style={{ alignItems: "center" }}>
                            <Card style={styles.icon}>
                                <StyledText style={styles.iconText}>
                                    {otherUser.substring(0, 1).toUpperCase()}
                                </StyledText>
                            </Card>
                        </Col>
                        <Row>
                            <Col style={{ alignItems: "center" }}>
                                <StyledText
                                    style={{
                                        fontSize: 22,
                                        marginBottom: 10,
                                    }}>
                                    {transactionTitle}
                                </StyledText>
                                <StyledText
                                    style={{
                                        fontSize: 22,
                                        color: isTransactionSending ? "#e05d4d" : "#007BFF",
                                    }}>
                                    {`${isTransactionSending ? "-" : "+"}$${Number(
                                        Number(TRANSACTION.amount) +
                                        Number(
                                            isTransactionSending ? TRANSACTION.feeAmount : 0.0
                                        ) +
                                        Number(
                                            isTransactionSending && TRANSACTION.donation
                                                ? TRANSACTION.donation.amount
                                                : 0.0
                                        )
                                    ).toLocaleString("en-us", { minimumFractionDigits: 2 })}`}
                                </StyledText>
                            </Col>
                        </Row>
                    </Card>
                </View>
                <SettingGroup title="TRANSACTION DETAILS">
                    <TextCell
                        text={isTransactionSending ? "Amount sent" : "Amount received"}
                        detail={`$${Number(TRANSACTION.amount).toLocaleString("en-us", {
                            minimumFractionDigits: 2,
                        })}`}
                    />
                    {isTransactionSending ? (
                        <TextCell
                            text="Fee"
                            detail={`$${Number(TRANSACTION.feeAmount).toLocaleString("en-us", {
                                minimumFractionDigits: 2,
                            })}`}
                        />
                    ) : null}
                    {isTransactionSending ? (
                        <TextCell
                            text="Charity donation"
                            detail={`$${Number(
                                TRANSACTION.donation ? TRANSACTION.donation.amount : 0.0
                            ).toLocaleString("en-us", { minimumFractionDigits: 2 })}`}
                        />
                    ) : null}
                </SettingGroup>
                <SettingGroup title="DATE">
                    <TextCell
                        text={`${new Date(TRANSACTION.dateOccurred).toLocaleString("en-us")}`}
                    />
                </SettingGroup>
                <SettingGroup title="LOCATION">
                    <TextCell text={TRANSACTION.locationOccurred} />
                </SettingGroup>
                <SettingGroup title="NOTE">
                    <TextCell multiline={true} text={TRANSACTION.description} />
                </SettingGroup>
            </Col>
        </ScrollView>
    );
};

// Styles for this view
const styles = StyleSheet.create({
    icon: {
        borderRadius: 50,
        height: 100,
        width: 100,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#e05d4d",
        justifyContent: "center",
    },
    iconText: {
        fontSize: 50,
        color: "white",
    },
});

export default TransactionDetail;
