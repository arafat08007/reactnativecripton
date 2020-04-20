import React, { useState } from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { Input, Text, Button } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '~/redux/store';
import { clearMessage } from '~/redux/leave';
import { appColors } from '~/theme';

export default () => {
  const message = useSelector((state: RootState) => state.leave.message);
  const dispatch = useDispatch();
  const close = () => dispatch(clearMessage());
  return (
    <Modal
      isVisible={Boolean(message)}
      onBackButtonPress={close}
      onBackdropPress={close}>
      <View style={{ padding: 24, borderRadius: 5, backgroundColor: 'white', borderColor:appColors.lightBlue, borderWidth:5, }}>
      <Text style={{ fontSize: 26, textAlign: 'center' }}>
          Success!
        </Text>
        
        <Text style={{ fontSize: 14, textAlign: 'center' }}>
        Requisition submitted successfully, Your Requisition Number is 
        </Text>
        {message?.Text && (
          <Text style={{ fontSize: 20, textAlign: 'center' }}>
            #{message?.Value}
          </Text>
        )}

<Text style={{padding:5,fontSize:12, textAlign:'center'}} >Please save this number for further query.</Text>

        <Button
          containerStyle={{ marginTop: 15 }}
          title="OK"
          type="clear"
          onPress={close}
        />
      </View>
    </Modal>
  );
};
