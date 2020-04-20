import React from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { Text, Button ,Icon} from 'react-native-elements';
import { appColors } from '~/theme';

interface Props {
  close: () => void,
  text: string;
}

export default ({ close, text }: Props) => {
  return (
    <Modal
      isVisible={true}
      onBackButtonPress={close}
      onBackdropPress={close}>
      <View style={{ padding: 24, borderRadius: 5, backgroundColor: 'white' , borderWidth:5, borderColor:appColors.lightBlue}}>
        <Text style={{ fontSize: 26, textAlign: 'center' }}>
          Success!
        </Text>
        {text && (
          <Text style={{ fontSize: 14, textAlign: 'center' }}>
           Requisition submitted successfully, Your Requisition Number is #{text}
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
