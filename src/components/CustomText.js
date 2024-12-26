import React from 'react';
import { Text } from 'react-native';

const CustomText = (props) => {
  return <Text {...props} style={[{ fontFamily: 'Gabarito-Regular' }, props.style]} />;
};

export default CustomText;
