import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import Col from "../../../custom/col/Col";
import Row from "../../../custom/row/Row";
import { StyledText } from "../../../StyledText";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Colors from "../../../../constants/Colors";
import useColorScheme from "../../../../hooks/useColorScheme";

/**
 * TransactionCell contains limited details about a given
 * transaction for display in a list view.
 * 
 * @param props properties for this component
 */
const TransactionCell = (props: { navigation?: any; transaction?: any }) => {
    // Hooks
    const colorScheme = useColorScheme();

    // Redux state variables
    const cache = useSelector(state => state.pictureCache.cache);
    const iconFromCache = useSelector(state => state.pictureCache.cache[username]);
    const accountId = useSelector(state => state.userInfo.userInfo.accountID);

    // Local state variables
    const [amount, setAmount] = useState("");
    const [username, setUsername] = useState("");
    const [userChar, setUserChar] = useState("");
    const [date, setDate] = useState("");
    const [image, setImage] = useState(iconFromCache ? iconFromCache : null);
    const [textColor, setTextColor] = useState("#e05d4d");

    // Updates information in this cell with some from cache
    // whenever props.transaction is updated.
    useEffect(() => {
        if (!props.transaction) {
            return;
        }

        setUsername(
            props.transaction.toID === accountId ? props.transaction.fromID : props.transaction.toID
        );
        setDate(props.transaction.description.substring(0, 26));
        var otherUser = "";

        // Determines the user that is not the current user in the transaction
        setImage(null);
        if (props.transaction.fromID === null) {
            otherUser = props.transaction.fromBank.institution;
        } else if (props.transaction.toID === null) {
            otherUser = props.transaction.toBank.institution;
        } else {
            otherUser =
                props.transaction.toID === accountId
                    ? props.transaction.fromID
                    : props.transaction.toID;
            if (cache[otherUser]) {
                setImage(iconFromCache);
            }
        }

        // Updates colors and formatting based on who's sending
        if (props.transaction.toID === accountId) {
            setTextColor("#007BFF");
            setAmount(
                `+$${Number(props.transaction.amount).toLocaleString("en-us", {
                    minimumFractionDigits: 2,
                })}`
            );
        } else {
            setTextColor("#e05d4d");
            setAmount(
                `-$${Number(
                    Number(props.transaction.amount) +
                    Number(props.transaction.feeAmount) +
                    Number(props.transaction.donation ? props.transaction.donation.amount : 0.0)
                ).toLocaleString("en-us", { minimumFractionDigits: 2 })}`
            );
        }

        // Overrides prior colors based on if this transaction is pending
        if (props.transaction.isPending) {
            setDate("PENDING");
            setTextColor("#BEBBB8");
        }

        // Updates view with other user details
        setUsername(otherUser);
        setUserChar(otherUser.substring(0, 1).toUpperCase());
    }, [props.transaction]);

    // Updates profile picture with one from cache.
    useEffect(() => {
        setImage(iconFromCache);
    }, [iconFromCache]);

    if (props.transaction) {
        return (
            <TouchableOpacity
                onPress={() =>
                    props.navigation.navigate("TransactionDetail", {
                        transaction: props.transaction,
                    })
                }>
                <Row style={{ alignItems: "center" }}>
                    <View>
                        {/* {image ? 
                        <img alt="" id="" className="circle alt-transaction-image" src={image} style={{backgroundColor: 'transparent'}} />
                        : */}
                        <View style={styles.icon}>
                            <StyledText style={styles.iconText}>{userChar}</StyledText>
                        </View>
                        {/* } */}
                    </View>
                    <Col style={{ flex: 1 }}>
                        <StyledText
                            ellipsizeMode="tail"
                            numberOfLines={1}
                            style={styles.usernameText}>
                            {username}
                        </StyledText>
                        <StyledText
                            ellipsizeMode="tail"
                            numberOfLines={1}
                            style={styles.detailText}>
                            {date}
                        </StyledText>
                    </Col>
                    <Col auto>
                        <Row>
                            <StyledText
                                numberOfLines={1}
                                style={{ color: textColor, ...styles.amountText }}>
                                {amount}
                            </StyledText>
                        </Row>
                    </Col>
                </Row>
            </TouchableOpacity>
        );
    } else {
        return (
            <Row style={{ alignItems: "center" }}>
                <SkeletonPlaceholder
                    backgroundColor={Colors[colorScheme].background}
                    highlightColor={Colors[colorScheme].tint}>
                    <SkeletonPlaceholder.Item flexDirection="row" flexGrow={1}>
                        <Col>
                            <SkeletonPlaceholder.Item height={40} borderRadius={20} width={40} />
                        </Col>
                        <Row style={{ flexGrow: 1, flexDirection: "row" }}>
                            <Col style={{ marginLeft: 10 }}>
                                <SkeletonPlaceholder.Item
                                    marginBottom={5}
                                    height={15}
                                    width={200}
                                    borderRadius={15}
                                />
                                <SkeletonPlaceholder.Item
                                    height={15}
                                    width={150}
                                    borderRadius={15}
                                />
                            </Col>
                        </Row>
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
            </Row>
        );
    }
};

// Styles for this component
const styles = StyleSheet.create({
    icon: {
        borderRadius: 20,
        height: 40,
        width: 40,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#e05d4d",
        justifyContent: "center",
    },
    iconText: {
        fontSize: 20,
        color: "white",
    },
    usernameText: {
        fontSize: 20,
        flex: 1,
    },
    amountText: {
        fontSize: 18,
    },
    detailText: {
        color: "#BEBBB8",
    },
});

export default TransactionCell;
