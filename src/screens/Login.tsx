import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Input, Button, Text, Icon } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';

import { RootStackParamList } from '../App';
import theme from '~/theme';
import { RootState } from '~/redux/store';
import { login, loginFailed } from '~/redux/auth';

export type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: NavigationProp;
}

export default ({ navigation }: LoginScreenProps) => {
  const { message, loading } = useSelector((state: RootState) => state.auth);
  const [userId, setUserID] = useState('');
  const [pass, setPass] = useState('');

  const dispatch = useDispatch();

  function submit() {
    if (!userId || !pass) {
      dispatch(loginFailed('Enter User ID and Password'));
      return;
    }

    dispatch(login(userId, pass, navigation));
  }

  return (
    <View style={styles.root}>
      <View style={{ alignItems: 'center' }}>
        <Image
          style={{ width: 50, height: 50 }}
          source={require('~/assets/pvtl.png')}
        />
        <Text style={{ fontSize: 24, textAlign: 'center' }}>CRIPTON</Text>
      </View>
      <View style={{ width: '100%', alignItems: 'center' }}>
        <Input
          onChangeText={text => {
            setUserID(text);
          }}
          label="You User ID"
          placeholder="You User ID"
          inputStyle={styles.input}
          containerStyle={styles.inputContainer}
        />
        <Input
          onChangeText={text => {
            setPass(text);
          }}
          textContentType="password"
          secureTextEntry
          label="Your Password"
          placeholder="Your Password"
          containerStyle={styles.inputContainer}
          errorMessage={message}
          inputStyle={styles.input}
        />
        <Button
          raised
          type="outline"
          containerStyle={{ width: '90%', backgroundColor: 'white' }}
          loading={loading}
          onPress={submit}
          title="LOGIN"
        />
      </View>
      <View>
        <Icon name="settings" color="green" />
        <Text>Not connecting? setup now</Text>
      </View>
      <View>
        <Text
          style={{
            fontSize: 10,
            color: theme.colors?.grey3,
            marginBottom: 20,
            textAlign: 'center',
          }}>
          Powered by
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Image
            style={{ width: 40, height: 40, marginRight: 5 }}
            source={require('~/assets/pvtl.png')}
          />
          <Text style={{ color: theme.colors?.grey1, fontSize: 10 }}>
            Pakiza{'\n'}Technovation{'\n'}Limited
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 10,
  },
  input: {
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 10,
  },
});
