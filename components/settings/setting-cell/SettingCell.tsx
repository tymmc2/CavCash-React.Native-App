import React from "react";
import { Switch } from "react-native";

import Row from "../../custom/row/Row";
import Col from "../../custom/col/Col";
import { StyledText } from "../../StyledText";

/**
 * Switch cell for settings with only two options.
 * 
 * @param props properties for this component
 */
const SettingCell = (props: { name: string; state: boolean; onChange: any }) => (
    <Row style={{ alignItems: "center" }}>
        <Col style={{ flex: 1, paddingLeft: 0 }}>
            <StyledText numberOfLines={1} style={{ fontSize: 20 }}>
                {props.name}
            </StyledText>
        </Col>
        <Col auto style={{ paddingRight: 0 }}>
            <Switch
                onValueChange={() => props.onChange(previousState => !previousState)}
                value={props.state}
            />
        </Col>
    </Row>
);

export default SettingCell;
