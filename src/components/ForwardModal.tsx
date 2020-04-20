import React, { useState, forwardRef } from 'react';
import { View, Picker } from 'react-native';
import { Button, Text } from 'react-native-elements';
import Modal from 'react-native-modal';

export default ({
  isVisible,
  close,
  forward,
  data,
}: {
  isVisible: boolean;
  close: () => void;
  forward: (id: string) => void;
  data: { Text: string; Value: string }[];
}) => {
  const [selected, setSelected] = useState(data[0].Value);
  return (
    <Modal onBackButtonPress={close} onDismiss={close} isVisible={isVisible}>
      <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 5 }}>
        <Text style={{ fontSize: 24 }}>Forward</Text>
        <Picker
          selectedValue={selected}
          onValueChange={val => setSelected(val)}>
          {data.map(x => (
            <Picker.Item key={x.Value} value={x.Value} label={x.Text} />
          ))}
        </Picker>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button
            onPress={close}
            containerStyle={{ margin: 10 }}
            title="Cancel"
          />
          <Button
            onPress={async () => {
              forward(selected);
            }}
            containerStyle={{ margin: 10 }}
            title="Forward"
          />
        </View>
      </View>
    </Modal>
  );
};
