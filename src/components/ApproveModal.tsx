import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import Modal from 'react-native-modal';

export default ({
  isVisible,
  close,
  approve,
}: {
  isVisible: boolean;
  close: () => void;
  approve: () => void;
}) => {
  return (
    <Modal onBackButtonPress={close} onDismiss={close} isVisible={isVisible}>
      <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 5 }}>
        <Text style={{ fontSize: 24 }}>Are you sure?</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button onPress={close} containerStyle={{ margin: 10 }} title="No" />
          <Button
            onPress={approve}
            containerStyle={{ margin: 10 }}
            title="Yes"
          />
        </View>
      </View>
    </Modal>
  );
};
