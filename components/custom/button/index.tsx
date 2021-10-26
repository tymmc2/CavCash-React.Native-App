import React from "react";
import { Button } from "react-native-paper";
import useColorScheme from "../../../hooks/useColorScheme";
import Colors from "../../../constants/Colors";

/**
 * TextButton wrapper that wraps around the react-native-paper
 * Button component for custom themeing.
 *
 * @param props properties for this component
 */
const TextButton = (props: any) => {
    const colorScheme = useColorScheme();

    return (
        <Button
            labelStyle={{ fontSize: 18 }}
            theme={{
                colors: {
                    primary: Colors[colorScheme].tint,
                    placeholder: Colors[colorScheme].text,
                    text: Colors[colorScheme].text,
                    background: "transparent",
                },
            }}
            {...props}
        />
    );
};

export default TextButton;
