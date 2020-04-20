import React, { useEffect, useState } from 'react';
import {
  View,
  Picker,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import { Input, Text, Icon, Button } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker from '@react-native-community/datetimepicker';
import { useForm, Control, Controller } from 'react-hook-form';

import { fetchData, submitRequest } from '~/redux/leave';
import { RootState } from '~/redux/store';
import Spinner from '~/components/Spinner';
import NoData from '~/components/NoData';
import LeaveBalanceTable from '~/components/LeaveBalanceTable';
import Modal from '~/components/LeaveResultModal';
import { appColors } from '~/theme';
import { toString, dayDiff } from '~/helpers';

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

export default () => {
  const { status, types } = useSelector((state: RootState) => state.leave);
  const balanceMap = useSelector((state: RootState) => {
    const ret: Record<string, number> = {};
    state.leave.balance.forEach((x) => (ret[x.LvID] = Number(x.LvBalance)));
    return ret;
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchData());
  }, []);
  const [showSPicker, setShowSPicker] = useState(false);
  const [showEPicker, setShowEPicker] = useState(false);

  const {
    errors,
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    control,
  } = useForm<{
    Type: string;
    sDate: Date;
    eDate: Date;
    Purpose: string;
    Address: string;
    Contact: string;
  }>({
    defaultValues: {
      sDate: today,
      eDate: tomorrow,
    },
  });

  const sDate = watch('sDate');
  const eDate = watch('eDate');
  const curType = watch('Type');

  useEffect(() => {
    register({ name: 'sDate' }, { required: 'Start date is required' });
  }, []);
  useEffect(() => {
    register(
      { name: 'eDate' },
      {
        required: 'End date is required',
        validate: (val) => {
          const diff = dayDiff(sDate, val);
          if (diff > balanceMap[curType] || diff <= 0) {
            return 'Invalid date range';
          }
          return true;
        },
      },
    );
  }, [sDate, curType]);

  const maxToDate = new Date();
  maxToDate.setDate(sDate.getDate() + 1);

  function onSubmit(data: any) {
    dispatch(submitRequest(data));
  }
  return (
    <View style={styles.leavecontainer}>
      <Modal />
      {showSPicker && (
        <DatePicker
          value={sDate}
          minimumDate={today}
          onChange={(_e, date) => {
            setShowSPicker(Platform.OS === 'ios');
            date && setValue('sDate', date, true);
          }}
        />
      )}
      {showEPicker && (
        <DatePicker
          value={eDate}
          minimumDate={maxToDate}
          onChange={(_e, date) => {
            setShowEPicker(Platform.OS === 'ios');
            date && setValue('eDate', date, true);
          }}
        />
      )}
      {status === 'pending' ? (
        <Spinner />
      ) : status === 'rejected' ? (
        <NoData reason="Failed to get leave info" />
      ) : (
        <>
          <LeaveBalanceTable />

          <Text
            style={{
              textAlign: 'center',
              padding: 10,
              fontSize: 18,
              fontWeight: 'bold',
            }}>
            Leave Application
          </Text>
          <Text style={styles.labelText}>Select leave type:</Text>
          <Controller
            name="Type"
            control={control}
            onChangeName="onValueChange"
            valueName="selectedValue"
            defaultValue={types[0]?.Value}
            as={
              <Picker>
                {types.map((t) => (
                  <Picker.Item key={t.Value} value={t.Value} label={t.Text} />
                ))}
              </Picker>
            }
          />

          <Text style={styles.labelText}>Leave range:</Text>
          {errors.eDate && (
            <Text style={{ color: appColors.red, textAlign: 'center' }}>
              Invalid leave range
            </Text>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => setShowSPicker(true)}>
              <Icon
                name="calendar"
                color={appColors.grey0}
                type="material-community"
              />
              <Text>{toString(sDate) || 'From Date'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => setShowEPicker(true)}>
              <Icon
                name="calendar"
                color={appColors.grey0}
                type="material-community"
              />
              <Text>{toString(eDate) || 'To Date'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.additionalInfo}>
            <Controller
              name="Purpose"
              control={control}
              style={styles.labelText}
              onChangeName="onChangeText"
              rules={{ required: 'Please mention leave reason.' }}
              as={
                <Input
                  label="Purpose *"
                  errorMessage={errors.Purpose?.message as string}
                />
              }
            />
            <View style={styles.gap}></View>
            <Controller
              name="Address"
              control={control}
              style={styles.labelText}
              onChangeName="onChangeText"
              rules={{ required: 'Please provide leave address.' }}
              as={
                <Input
                  label="Address *"
                  errorMessage={errors.Address?.message as string}
                />
              }
            />
            <View style={styles.gap}></View>
            <Controller
              name="Contact"
              control={control}
              onChangeName="onChangeText"
              rules={{ required: 'Please provide your contact number.' }}
              as={
                <Input
                  placeholder=""
                  label="Phone Number *"
                  errorMessage={errors.Contact?.message as string}
                />
              }
            />
            <Button
              containerStyle={{
                marginTop: 20,
                marginLeft: 24,
                marginRight: 24,
              }}
              title="Apply"
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  leavecontainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F5F5F5',
    margin: 3,
    padding: 5,
    elevation: 2,
    borderRadius: 5,
  },
  labelText: {
    padding: 5,
    marginBottom: 3,
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'bold',
  },
  additionalInfo: {
    margin: 10,
  },
  gap: {
    height: 8,
  },
});
