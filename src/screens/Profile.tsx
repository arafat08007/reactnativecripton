import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { RootState } from '~/redux/store';
import { appColors } from '~/theme';

export default () => {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <View style={{backgroundColor: 'white', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 22, textAlign: 'center'}}>{user?.Name}</Text>
      <Text style={{fontSize: 18, color: appColors.lightBlue}}>{user?.Designation}</Text>
      <Text>{user?.Department}</Text>
    </View>
  );
};
