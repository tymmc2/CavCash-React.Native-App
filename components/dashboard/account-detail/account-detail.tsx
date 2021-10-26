import React from "react";
import { StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import Card from "../../custom/card/Card";
import Row from "../../custom/row/Row";
import Col from "../../custom/col/Col";
import { StyledText } from "../../StyledText";
import Colors from "../../../constants/Colors";
import useColorScheme from "../../../hooks/useColorScheme";

/**
 * AccountDetail displays a specific account detail such as current
 * balance in a small card with an icon for usage on the AccountView
 * page.
 * 
 * @param props properties for this component
 */
const AccountDetail = (props: {
    color: any;
    title: string;
    detail: string;
    icon: string;
    loading?: boolean;
}) => {
    // Hooks
    const colorScheme = useColorScheme();

    return (
        <Card>
            <Row style={{ alignItems: "center" }}>
                <Col style={{ paddingLeft: 10 }}>
                    <StyledText style={{ marginBottom: 15, color: props.color }}>
                        {props.title}
                    </StyledText>
                    {props.loading ? (
                        <SkeletonPlaceholder
                            backgroundColor={Colors[colorScheme].background}
                            highlightColor={Colors[colorScheme].tint}>
                            <SkeletonPlaceholder.Item
                                borderRadius={15}
                                height={24}
                                width={100}
                                maxWidth={100}
                            />
                        </SkeletonPlaceholder>
                    ) : (
                        <StyledText style={styles.detailText}>{props.detail}</StyledText>
                    )}
                </Col>
                <MaterialCommunityIcons
                    name={props.icon}
                    style={{ paddingRight: 10, position: "absolute", right: 0 }}
                    size={54}
                    color={props.color}
                />
            </Row>
        </Card>
    );
};

// Styles for this component
const styles = StyleSheet.create({
    detailText: {
        fontSize: 20,
    },
});

export default AccountDetail;
