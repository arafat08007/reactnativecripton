import React, { useEffect, useCallback } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-elements';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '~/redux/store';
import { getApprovalSummary, ApprovalInfo } from '~/redux/approvals';
import { appColors } from '~/theme';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Filter from '~/components/Filter';

const ApprovalCard = ({ data }: { data: ApprovalInfo }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Requisition', { approvalInfo: data })}
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 15,
        elevation: 5,
        margin: 5,
      }}>
      <View>
        <View
          style={{
            backgroundColor: appColors.grey5,
            height: 30,
            width: 30,
            borderRadius: 15,
            padding: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>{data.SL}</Text>
        </View>
        <Text style={{ fontSize: 18 }}>{data.RequesterName}</Text>
        <Text style={{ color: appColors.lightBlue }}>{data.RequesterDesi}</Text>
      </View>
      <View>
        <Text style={{ fontSize: 18, color: appColors.green }}>
          {data.ReqNum}
        </Text>
        <Text>{data.ReqDate}</Text>
        <Text style={{ color: appColors.red }}>{data.DocName}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const summary = useSelector((state: RootState) => state.approvals.summary);
  const loading = useSelector((state: RootState) => state.approvals.loading);
  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      dispatch(getApprovalSummary());
    }, [])
  )
  // useEffect(() => {
  //   dispatch(getApprovalSummary());
  // }, []);
  return (
    <View style={{ flex: 1 }}>
      <Filter />
      {loading && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator />
        </View>
      )}
      {summary.length === 0 && !loading && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>No Data</Text>
        </View>
      )}
      <ScrollView>
        {summary.map((x) => (
          <ApprovalCard key={x.SL} data={x} />
        ))}
      </ScrollView>
    </View>
  );
};
