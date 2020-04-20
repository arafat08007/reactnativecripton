import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';

export default ({ reason }: { reason?: string }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{reason || 'No data'}</Text>
    </View>
  );
};
