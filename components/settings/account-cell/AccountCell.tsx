import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";

import Row from "../../custom/row/Row";
import Col from "../../custom/col/Col";
import { StyledText } from "../../StyledText";

/**
 * Settings view account info cell. Displays the profile picture of
 * the user in addition to the Account ID.
 * 
 * @param props properties for this component
 */
const AccountCell = (props: { navigation: any }) => {
    // Local state variables
    const accountId = useSelector(state => state.userInfo.userInfo.accountID);

    return (
        <TouchableOpacity onPress={() => props.navigation.navigate("AccountSettings")}>
            <Row style={{ alignItems: "center" }}>
                <Col auto style={{ paddingRight: 0, paddingLeft: 0 }}>
                    <View style={styles.icon}>
                        <StyledText style={styles.iconText}>
                            {accountId ? accountId.substring(0, 1).toUpperCase() : null}
                        </StyledText>
                    </View>
                </Col>
                <Col style={{ flex: 1 }}>
                    <StyledText numberOfLines={1} style={styles.lead}>
                        {accountId}
                    </StyledText>
                    <StyledText numberOfLines={1} style={styles.subtitle}>
                        CavCash User
                    </StyledText>
                </Col>
                <Col auto style={{ paddingRight: 0 }}>
                    <AntDesign name="right" size={24} color={"#BEBBB8"} />
                </Col>
            </Row>
        </TouchableOpacity>
    );
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
    lead: {
        fontSize: 20,
    },
    subtitle: {
        color: "#BEBBB8",
    },
});

export default AccountCell;
