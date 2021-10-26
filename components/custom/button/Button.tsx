import React from "react";
import { TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import { StyledText } from "../../StyledText";

/**
 * Custom button designed for basic usage. (unused I believe)
 *
 * @param props properties for this component.
 */
const Button = (props: {
    title: string;
    onPress: any;
    color?: string;
    style?: StyleProp<ViewStyle>;
}) => (
    <TouchableOpacity {...props.style} onPress={props.onPress}>
        <StyledText style={props.color ? { color: props.color, fontSize: 18 } : { fontSize: 18 }}>
            {props.title}
        </StyledText>
    </TouchableOpacity>
);

export default Button;
