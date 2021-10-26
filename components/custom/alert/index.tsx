import React from "react";
import { View } from "react-native";
import { Portal, Dialog } from "react-native-paper";
import { useDispatch } from "react-redux";

import useColorScheme from "../../../hooks/useColorScheme";
import Colors from "../../../constants/Colors";
import TextButton from "../button";
import { StyledText } from "../../StyledText";
import { clearAlerts } from "../../../redux/actions/alert";

/**
 * Alert build for displaying anywhere in the application.
 *
 * @param props properties for this component
 */
const Alert = (props: any) => {
    // Hooks
    const colorScheme = useColorScheme();
    const dispatch = useDispatch();

    return (
        <View>
            <Portal>
                <Dialog
                    style={{
                        borderRadius: 15,
                        backgroundColor: Colors[colorScheme].secondaryBackground,
                    }}
                    visible={props.visible}
                    onDismiss={props.hideAlert}>
                    <Dialog.Title>
                        <StyledText>{props.title}</StyledText>
                    </Dialog.Title>
                    <Dialog.Content>
                        <StyledText>{props.body}</StyledText>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <TextButton
                            onPress={() => {
                                props.hideAlert();
                                dispatch(clearAlerts());
                            }}>
                            Ok
                        </TextButton>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

export default Alert;
