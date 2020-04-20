import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

export default () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' , backgroundColor:'#234a8f'}}>
      <ActivityIndicator />
      <Text style={{color:'white', fontSize:12, textAlign:'center'}}>Loading, please wait..</Text>
    </View>
  );
};
