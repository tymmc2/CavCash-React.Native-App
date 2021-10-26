import React from "react";
import { View, StyleSheet } from "react-native";

import { StyledText } from "../../StyledText";
import Row from "../../custom/row/Row";
import Col from "../../custom/col/Col";
import TextButton from "../../custom/button";

/**
 * SettingGroup contains various types of cells with a header.
 * 
 * @param props properties of this component
 */
const SettingGroup = (props: { children: any; title: string; editable?: boolean }) => (
    <View style={styles.group}>
        <Row style={{ paddingTop: 10, paddingBottom: 5, alignItems: "center" }}>
            <Col style={{ paddingLeft: 0 }}>
                <StyledText style={styles.sectionText}>{props.title}</StyledText>
            </Col>
            {props.editable ? (
                <Col auto style={{ paddingRight: 0 }}>
                    <TextButton titleColor='rgb(0, 123, 255)' style={{ paddingRight: 0 }} titleStyle={{ fontSize: 20, fontFamily: 'OpenSans' }} title='EDIT' onPress={() => console.log('edit')} />
                </Col>
            ) : null}
        </Row>
        {props.children}
    </View>
);

// Styles for this component
const styles = StyleSheet.create({
    sectionText: {
        color: "#e05d4d",
        fontSize: 20,
    },
    group: {
        marginBottom: 20,
    },
});

export default SettingGroup;
