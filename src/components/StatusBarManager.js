import React from 'react';
import { StatusBar, Platform, View } from 'react-native';

const StatusBarManager = ({ barStyle = 'dark-content', backgroundColor = 'transparent' }) => {
  return (
    <>
      <StatusBar
        translucent={true}
        backgroundColor={backgroundColor}
        barStyle={barStyle}
      />
      <View style={{ 
        height: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
        backgroundColor: backgroundColor 
      }} />
    </>
  );
};

export default StatusBarManager; 