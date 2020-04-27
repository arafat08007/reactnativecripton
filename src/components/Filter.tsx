import React, { useState } from 'react';
import { View, Picker, Platform } from 'react-native';
import { Text, Icon, Button, Input } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '~/redux/store';
import DatePicker from 'react-native-modal-datetime-picker';
import { appColors } from '~/theme';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getApprovalSummary } from '~/redux/approvals';

function toString(d?: Date) {
  return d ? `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}` : '';
}

export default React.memo(() => {
  const user = useSelector((state: RootState) => state.auth.user);
  const locations = useSelector(
    (state: RootState) => state.approvals.locations,
  );
  const dispatch = useDispatch();
  const [sDate, setSDate] = useState('');
  const [eDate, setEDate] = useState('');
  const [showSPicker, setSPicker] = useState(false);
  const [showEPicker, setEPicker] = useState(false);

  const [LocId, setLocId] = useState(user?.LocId);
  const [status, setStatus] = useState('Pending');
  const [ReqNo, setReqNo] = useState('');
  return (
    <View style={{ backgroundColor: 'white', padding: 5 }}>
      {showSPicker && (
        <DatePicker
          isVisible={true}
          date={new Date()}
          mode="date"
          onConfirm={(date) => {
            setSPicker(false);
            setSDate(toString(date) || '');
          }}
          onCancel={() => setSPicker(false)}
        />
      )}
      {showEPicker && (
        <DatePicker
          isVisible={true}
          date={new Date()}
          mode="date"
          onConfirm={(date) => {
            setEPicker(false);
            setEDate(toString(date) || '');
          }}
          onCancel={() => setEPicker(false)}
        />
      )}
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Picker
            selectedValue={LocId}
            onValueChange={(v) => {
              setLocId(v);
            }}>
            {locations.map((l) => (
              <Picker.Item key={l.LocId} value={l.LocId} label={l.LocName} />
            ))}
          </Picker>
        </View>
        <View style={{ flex: 1 }}>
          <Picker
            selectedValue={status}
            onValueChange={(v) => {
              setStatus(v);
            }}>
            <Picker.Item value="Pending" label="Pending" />
            <Picker.Item value="Approved" label="Approved" />
            <Picker.Item value="Rejected" label="Rejected" />
            <Picker.Item value="NoAction" label="NoAction" />
            <Picker.Item value="Proxy" label="Proxy" />
            <Picker.Item value="Postponed" label="Postponed" />
          </Picker>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={() => setSPicker(true)}>
          <Icon
            name="calendar"
            color={appColors.grey0}
            type="material-community"
          />
          <Text>{sDate || 'From Date'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={() => setEPicker(true)}>
          <Icon
            name="calendar"
            color={appColors.grey0}
            type="material-community"
          />
          <Text>{eDate || 'To Date'}</Text>
        </TouchableOpacity>
        <Input
          containerStyle={{ width: 100 }}
          placeholder="#Req No"
          onChangeText={(text) => setReqNo(text)}
        />
        <Button
          type="clear"
          icon={<Icon name="search" />}
          onPress={() => {
            dispatch(
              getApprovalSummary({ LocId, sDate, eDate, status, ReqNo }),
            );
          }}
        />
      </View>
    </View>
  );
});
