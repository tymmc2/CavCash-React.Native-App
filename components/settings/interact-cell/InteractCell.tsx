import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

import Row from "../../custom/row/Row";
import Col from "../../custom/col/Col";
import { StyledText } from "../../StyledText";

/**
 * Setting cell that allows touch input for actions.
 * 
 * @param props properties for this component
 */
const InteractCell = (props: { onPress: any; text: string; color?: any }) => (
    <TouchableOpacity onPress={props.onPress}>
        <Row style={{ alignItems: "center" }}>
            <Col style={{ flex: 1, paddingLeft: 0 }}>
                <StyledText
                    numberOfLines={1}
                    style={props.color ? { fontSize: 20, color: props.color } : { fontSize: 20 }}>
                    {props.text}
                </StyledText>
            </Col>
            <Col auto style={{ paddingRight: 0 }}>
                <AntDesign name="right" size={22} color={"#BEBBB8"} />
            </Col>
        </Row>
    </TouchableOpacity>
);

export default InteractCell;
