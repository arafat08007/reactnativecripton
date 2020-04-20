import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '~/App';
import { RootState } from '~/redux/store';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Bootstrap'>;

interface BootstrapScreenProps {
  navigation: NavigationProp;
}

export default ({ navigation }: BootstrapScreenProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const persisted = useSelector((state: RootState) => state._persist);

  useEffect(() => {
    if (!persisted) return;
    if (user) {
      navigation.replace('Dashboard');
    } else {
      navigation.navigate('Login');
    }
  }, [persisted, user]);
  return null;
};
