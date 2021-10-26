import React, { useRef, useState } from "react";
import InputScrollView from "react-native-input-scroll-view";
import { useDispatch, useSelector } from "react-redux";

import useColorScheme from "../../hooks/useColorScheme";
import Colors from "../../constants/Colors";
import { saveNewTransactionDetails } from "../../redux/actions/newTransaction";
import { addAlert, clearAlerts } from "../../redux/actions/alert";
import Col from "../../components/custom/col/Col";
import Row from "../../components/custom/row/Row";
import { StyledText } from "../../components/StyledText";
import Card from "../../components/custom/card/Card";
import TextButton from "../../components/custom/button";
import TextField from "../../components/custom/text-input";
import { NT_STYLES } from "./NTPageOne";

/**
 * Second page of new transaction process. Involves amount being
 * sent and a note for the transaction.
 * 
 * @param props properties for this view
 */
const NTPageTwo = (props: { navigation: any }) => {
    // Hooks
    const colorScheme = useColorScheme();
    const dispatch = useDispatch();

    // Redux state variables
    const NEW_TRANSACTION = useSelector(state => state.newTransaction);

    // Local state variables
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");

    // References
    const amountRef = useRef();
    const noteRef = useRef();

    /**
     * Checks to see if fields are empty and continues if they are not.
     */
    const onSubmit = () => {
        if (!amount.replace(/ /g, "") || !note.replace(/ /g, "")) {
            const props = {
                title: "Hold up!",
                body: "You're missing a field!",
                hideAlert: () => dispatch(clearAlerts()),
                visible: true,
            };
            dispatch(addAlert(props));
            return;
        }
        dispatch(
            saveNewTransactionDetails({
                name: "amount",
                value: amount,
            })
        );
        dispatch(
            saveNewTransactionDetails({
                name: "description",
                value: note,
            })
        );
        props.navigation.navigate("NTPageThree");
    };

    /**
     * Handles next button press from amount field.
     */
    const onNext = () => {
        noteRef.current.focus();
    };

    return (
        <InputScrollView style={{ backgroundColor: Colors[colorScheme].background }}>
            <Row>
                <Col>
                    <Card style={{ backgroundColor: Colors[colorScheme].tint }}>
                        <Col style={{ alignItems: "center" }}>
                            <Card style={NT_STYLES.icon}>
                                <StyledText style={NT_STYLES.iconText}>{"$"}</StyledText>
                            </Card>
                            <StyledText
                                style={{
                                    fontSize: 20,
                                    alignSelf: "center",
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                    color: "white",
                                }}>
                                Sending to {NEW_TRANSACTION.toID}
                            </StyledText>
                        </Col>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <TextField
                        label="Amount"
                        onChangeText={text => setAmount(text)}
                        onSubmitEditing={onNext}
                        keyboardType={"decimal-pad"}
                        returnKeyType={"next"}
                        ref={amountRef}
                    />
                    <TextField
                        style={{ marginBottom: 10 }}
                        label="Note"
                        onChangeText={text => setNote(text)}
                        onSubmitEditing={onSubmit}
                        returnKeyType={"send"}
                        ref={noteRef}
                    />
                    <TextButton
                        onPress={onSubmit}
                        color={"rgb(0, 123, 255)"}
                        contentStyle={{ borderRadius: 15, padding: 10 }}>
                        Finalize Transaction
                    </TextButton>
                </Col>
            </Row>
        </InputScrollView>
    );
};

export default NTPageTwo;
