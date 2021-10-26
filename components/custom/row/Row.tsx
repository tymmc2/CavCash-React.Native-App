import React from "react";
import { View } from "../../Themed";
import { StyleSheet, StyleProp, ViewStyle } from "react-native";

/**
 * Custom Row component for UI design.
 *
 * @param props properties for this component.
 */
const Row = (props: { children: any; style?: StyleProp<ViewStyle> }) => (
    <View {...props.style} style={styles.row}>
        {props.children}
    </View>
);

// Styles for this component
const styles = StyleSheet.create({
    row: {
        display: "flex",
        flexDirection: "row",
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "transparent",
    },
});

export default Row;
