import React, { useState } from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { Input, Text, Button } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '~/redux/store';
import { setShowModal, submitAttendance } from '~/redux/attendance';

export default () => {
  const showModal = useSelector(
    (state: RootState) => state.attendance.showModal,
  );
  const dispatch = useDispatch();
  const close = () => dispatch(setShowModal(false));

  const [reason, setReason] = useState('');
  return (
    <Modal
      isVisible={showModal}
      onBackButtonPress={close}
      onBackdropPress={close}>
      <View style={{ padding: 24, borderRadius: 5, backgroundColor: 'white' }}>
        <Text style={{ fontSize: 20 }}>Why?</Text>
        <Text>Please explain your reason to give attendance using app</Text>
        <Input onChangeText={text => setReason(text)} autoFocus />
        <Button
          containerStyle={{ marginTop: 15 }}
          title="SUBMIT"
          type="clear"
          disabled={!Boolean(reason)}
          onPress={() => dispatch(submitAttendance(reason))}
        />
      </View>
    </Modal>
  );
};
