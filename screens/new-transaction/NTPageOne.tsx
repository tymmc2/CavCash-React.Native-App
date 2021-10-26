import React, { useRef, useState } from 'react';
import InputScrollView from 'react-native-input-scroll-view';
import { useDispatch } from 'react-redux';
import { StyleSheet } from 'react-native';

import useColorScheme from '../../hooks/useColorScheme';
import Colors from '../../constants/Colors';
import { saveNewTransactionDetails } from '../../redux/actions/newTransaction';
import { addAlert, clearAlerts } from '../../redux/actions/alert';
import Col from '../../components/custom/col/Col';
import Row from '../../components/custom/row/Row';
import { StyledText } from '../../components/StyledText';
import Card from '../../components/custom/card/Card';
import TextButton from '../../components/custom/button';
import TextField from '../../components/custom/text-input';

/**
 * First screen for initializing a new transaction.
 * 
 * @param props properties for this view
 */
const NTPageOne = (props: { navigation: any }) => {
    // Hooks
    const colorScheme = useColorScheme();
    const dispatch = useDispatch();

    // Local state variables
    const [user, setUser] = useState('');

    // References
    const userRef = useRef();

    /**
     *  Checks to see if fields are empty and continues if they are not.
     */
    const onSubmit = () => {
        if (!user.replace(/ /g, '')) {
            const props = {
                title: "Hold up!",
                body: "You're missing a field!",
                hideAlert: () => dispatch(clearAlerts()),
                visible: true
            };
            dispatch(addAlert(props));
        } else {
            // Saves transaction details in state and proceeds to next
            // page when done.
            dispatch(saveNewTransactionDetails({
                name: 'toID',
                value: user
            }));
            props.navigation.navigate('NTPageTwo');
        }
    }

    return (
        <InputScrollView style={{ backgroundColor: Colors[colorScheme].background }}>
            <Row>
                <Col>
                    <Card style={{ backgroundColor: Colors[colorScheme].tint }}>
                        <Col style={{ alignItems: 'center' }}>
                            <Card style={NT_STYLES.icon}><StyledText style={NT_STYLES.iconText}>{'$'}</StyledText></Card>
                        </Col>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <TextField style={{ marginBottom: 10 }} label='Who are you sending to?' onChangeText={text => setUser(text)} onSubmitEditing={onSubmit} returnKeyType={'next'} ref={userRef} />
                    <TextButton onPress={onSubmit} color={'rgb(0, 123, 255)'} contentStyle={{ borderRadius: 15, padding: 10 }}>Next</TextButton>
                </Col>
            </Row>
        </InputScrollView>
    )
}

// Styles for all NewTransaction pages
export const NT_STYLES = StyleSheet.create({
    icon: {
        borderRadius: 50,
        height: 100,
        width: 100,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        borderColor: 'white',
        borderWidth: 1,
        justifyContent: 'center',
        backgroundColor: '#e05d4d'
    },
    iconText: {
        fontSize: 50,
        color: 'white',
    },
});

export default NTPageOne;