import React from "react";
import { View } from "../../Themed";
import { StyleSheet, StyleProp, ViewStyle } from "react-native";

/**
 * Custom Column component used for UI design.
 *
 * @param props properties for this component
 */
const Col = (props: { children: any; auto?: boolean; style?: StyleProp<any> }) => (
    <View {...props.style} style={props.auto ? styles.colAuto : styles.col}>
        {props.children}
    </View>
);

// Styles for this component
const styles = StyleSheet.create({
    col: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: "transparent",
    },
    colAuto: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 0,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: "transparent",
    },
});

export default Col;
