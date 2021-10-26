import React from "react";

import Row from "../../custom/row/Row";
import Col from "../../custom/col/Col";
import { StyledText } from "../../StyledText";

/**
 * Generic cell that only display text and optional detail text.
 * 
 * @param props properties for this component.
 */
const TextCell = (props: { text: string; detail?: string; multiline?: boolean }) => (
    <Row style={{ alignItems: "center" }}>
        <Col auto style={{ paddingLeft: 0 }}>
            <StyledText numberOfLines={props.multiline ? 5 : 1} style={{ fontSize: 20 }}>
                {props.text}
            </StyledText>
        </Col>
        {props.detail ? (
            <Col style={{ flex: 1, paddingRight: 0, alignItems: "auto", flexWrap: "wrap" }}>
                <StyledText style={{ fontSize: 20, color: "#BEBBB8", textAlign: "right" }}>
                    {props.detail}
                </StyledText>
            </Col>
        ) : null}
    </Row>
);

export default TextCell;
