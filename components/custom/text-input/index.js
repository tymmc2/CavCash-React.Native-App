import React, { forwardRef } from "react";
import { TextInput } from "react-native-paper";
import useColorScheme from "../../../hooks/useColorScheme";
import Colors from "../../../constants/Colors";

// Gets colorScheme from hook
const getColors = () => {
    const colorScheme = useColorScheme();
    return colorScheme;
};

/**
 * Custom TextField wrapper that wraps around the react-native-paper
 * TextInput component for custom theming.
 */
const TextField = forwardRef((props, ref) => (
    <TextInput
        ref={ref}
        underlineColor={Colors[getColors()].tint}
        theme={{
            colors: {
                primary: Colors[getColors()].tint,
                placeholder: Colors[getColors()].text,
                text: Colors[getColors()].text,
                background: "transparent",
            },
        }}
        {...props}
    />
));

export default TextField;
