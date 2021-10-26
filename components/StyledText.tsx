import * as React from 'react';

import { Text, TextProps } from './Themed';

export const StyledText = (props: TextProps) => {
    return <Text {...props} style={[props.style, { fontWeight: '300' }]} />;
}
