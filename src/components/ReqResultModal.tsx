import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import Modal from 'react-native-modal';

export default ({
  close,
  message
}: {
  close: () => void;
  message: string;
}) => {
  return (
    <Modal onBackButtonPress={close} onDismiss={close} isVisible={true}>
      <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 5 }}>
        <Text style={{ fontSize: 24 }}>{message}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button onPress={close} containerStyle={{ margin: 10 }} title="OK" />
        </View>
      </View>
    </Modal>
  );
};
