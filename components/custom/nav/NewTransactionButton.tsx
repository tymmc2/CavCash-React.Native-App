import React from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SIZE = 80;

/**
 * Big button that goes in the middle of the bottom tab bar
 * when signed in.
 *
 * @param props properties for this component
 */
const NewTransactionButton = (props: any) => (
    <View
        {...props}
        style={{
            alignItems: "center",
            justifyContent: "center",
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
            backgroundColor: "#e05d4d",
        }}>
        <MaterialCommunityIcons name="send" size={30} color="white" />
    </View>
);

export default NewTransactionButton;
