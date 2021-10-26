import React from "react";
import { View } from "../../Themed";
import { StyleSheet, StyleProp, ViewStyle } from "react-native";
import useColorScheme from "../../../hooks/useColorScheme";
import Colors from "../../../constants/Colors";

/**
 * Custom Card used for UI design.
 *
 * @param props properties for this component
 */
const Card = (props: { children: any; style?: StyleProp<ViewStyle> }) => (
    <View {...props.style} style={styles().card}>
        {props.children}
    </View>
);

// Styles for this component
const styles = () => {
    const colorScheme = useColorScheme();
    return StyleSheet.create({
        card: {
            margin: 10,
            borderRadius: 15,
            // shadowColor: 'rgb(17, 16, 15)',
            shadowColor: "#000",
            elevation: 3,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.24,
            shadowRadius: 3,
            // boxShadow: '0 5px 10px rgba(154, 160, 185, .05), 0 15px 40px rgba(166, 173, 201, .2)',
            // boxShadow: 0 5px 10px rgba(32, 31, 30, .5), 0 15px 40px rgba(17, 16, 15, .2),
            padding: 10,
            backgroundColor: `${Colors[colorScheme].secondaryBackground}`,
        },
    });
};

export default Card;
